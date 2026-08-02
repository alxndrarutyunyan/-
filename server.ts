import express from "express";
import path from "path";
import fs from "fs";
import JSZip from "jszip";
import { createServer as createViteServer } from "vite";
import { Bot } from "grammy";
import { handleBotCommand } from "./server/botLogic";
import { askGeminiAssistant } from "./server/geminiService";
import { BookingRequest } from "./src/types";

const app = express();
app.use(express.json());

const PORT = 3000;

// Dynamic Bot Instance State
let activeBot: Bot | null = null;
let currentBotToken = process.env.TELEGRAM_BOT_TOKEN || "";
let botInfo = {
  tokenConfigured: false,
  botUsername: "",
  botFirstName: "",
  isPollingActive: false,
};

// Mock In-Memory Store for Bookings
let bookingsStore: BookingRequest[] = [
  {
    id: "b-101",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    userName: "Екатерина В.",
    telegramUsername: "@ekaterina_lang",
    phone: "+7 (926) 123-45-67",
    packageDetails: "8 занятий в месяц (2 раза/нед)",
    duration: "60 минут",
    totalPrice: 15000,
    status: "payment_pending",
    notes: "Предпочитает Вт/Чт вечер",
  },
  {
    id: "b-102",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    userName: "Михаил С.",
    telegramUsername: "@mikhail_dev",
    packageDetails: "Пробное / Разовое занятие",
    duration: "60 минут",
    totalPrice: 2300,
    status: "confirmed",
    notes: "Оплатил СБП, Чек проверен. Уровень Intermediate.",
  },
];

// Safe reply helper that retries without parse_mode if Telegram fails to parse Markdown entities
async function sendSafeReply(ctx: any, text: string, options?: any) {
  try {
    return await ctx.reply(text, options);
  } catch (error: any) {
    if (options && options.parse_mode) {
      console.warn("Telegram Markdown parse error, retrying as plain text:", error?.message);
      const { parse_mode, ...plainOptions } = options;
      return await ctx.reply(text, plainOptions);
    }
    throw error;
  }
}

// Helper to launch Grammy bot instance
async function setupTelegramBot(token: string) {
  if (!token || token.trim() === "") {
    botInfo = { tokenConfigured: false, botUsername: "", botFirstName: "", isPollingActive: false };
    return false;
  }

  try {
    if (activeBot) {
      try {
        await activeBot.stop();
        activeBot = null;
        // Brief pause to allow pending getUpdates requests to resolve on Telegram side
        await new Promise((r) => setTimeout(r, 1000));
      } catch (e) {
        console.log("Stopping previous bot instance...");
      }
    }

    const bot = new Bot(token);
    
    // Register global bot error handler
    bot.catch((err) => {
      const ctx = err.ctx;
      console.error(`Error while handling Telegram update ${ctx.update.update_id}:`, err.error);
    });

    const me = await bot.api.getMe();

    botInfo = {
      tokenConfigured: true,
      botUsername: me.username,
      botFirstName: me.first_name,
      isPollingActive: true,
    };

    // Bot Commands Setup
    bot.command("start", async (ctx) => {
      const res = handleBotCommand("/start");
      await sendSafeReply(ctx, res.text, {
        parse_mode: "Markdown",
        reply_markup: res.inlineKeyboard
          ? {
              inline_keyboard: res.inlineKeyboard.map((row) =>
                row.map((btn) => ({
                  text: btn.text,
                  callback_data: btn.url ? undefined : btn.callbackData,
                  url: btn.url,
                }))
              ),
            }
          : undefined,
      });
    });

    bot.command("prices", async (ctx) => {
      const res = handleBotCommand("/prices");
      await sendSafeReply(ctx, res.text, {
        parse_mode: "Markdown",
        reply_markup: res.inlineKeyboard
          ? {
              inline_keyboard: res.inlineKeyboard.map((row) =>
                row.map((btn) => ({
                  text: btn.text,
                  callback_data: btn.url ? undefined : btn.callbackData,
                  url: btn.url,
                }))
              ),
            }
          : undefined,
      });
    });

    bot.command("rules", async (ctx) => {
      const res = handleBotCommand("/rules");
      await sendSafeReply(ctx, res.text, {
        parse_mode: "Markdown",
        reply_markup: res.inlineKeyboard
          ? {
              inline_keyboard: res.inlineKeyboard.map((row) =>
                row.map((btn) => ({
                  text: btn.text,
                  callback_data: btn.url ? undefined : btn.callbackData,
                  url: btn.url,
                }))
              ),
            }
          : undefined,
      });
    });

    // Callback queries from inline keyboard buttons
    bot.on("callback_query:data", async (ctx) => {
      const data = ctx.callbackQuery.data;
      const res = handleBotCommand(data);
      try {
        await ctx.answerCallbackQuery();
      } catch (err: any) {
        console.warn("Callback query expired or invalid:", err?.message);
      }
      await sendSafeReply(ctx, res.text, {
        parse_mode: "Markdown",
        reply_markup: res.inlineKeyboard
          ? {
              inline_keyboard: res.inlineKeyboard.map((row) =>
                row.map((btn) => ({
                  text: btn.text,
                  callback_data: btn.url ? undefined : btn.callbackData,
                  url: btn.url,
                }))
              ),
            }
          : undefined,
      });
    });

    // Text messages handler - Uses Gemini AI Assistant
    bot.on("message:text", async (ctx) => {
      const text = ctx.message.text;
      if (text.startsWith("/")) return; // Handled by command listeners

      const aiReply = await askGeminiAssistant(text);
      await sendSafeReply(ctx, aiReply, {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "💬 Написать Александру", url: "https://t.me/alxndr_artnn" }],
            [{ text: "🏠 Главное меню", callback_data: "menu_main" }],
          ],
        },
      });
    });

    // Start bot in background long polling mode
    bot.start({
      drop_pending_updates: true,
      onStart: (info) => {
        console.log(`Telegram Bot @${info.username} successfully started polling!`);
      },
    }).catch((err: any) => {
      const msg = err?.message || String(err);
      if (msg.includes("409") || msg.includes("Conflict")) {
        console.warn("Telegram bot polling conflict (409) - another instance is active or previous session closing.");
      } else {
        console.error("Telegram bot runtime polling error:", err);
      }
    });

    activeBot = bot;
    currentBotToken = token;
    return true;
  } catch (error) {
    console.error("Failed to initialize Telegram Bot with token:", error);
    botInfo = { tokenConfigured: false, botUsername: "", botFirstName: "", isPollingActive: false };
    return false;
  }
}

// Auto init if process.env.TELEGRAM_BOT_TOKEN is available
if (currentBotToken) {
  setupTelegramBot(currentBotToken);
}

// API Routes
app.get("/api/bot/info", (req, res) => {
  res.json({
    ...botInfo,
    hasEnvToken: Boolean(process.env.TELEGRAM_BOT_TOKEN),
  });
});

app.post("/api/bot/token", async (req, res) => {
  const { token } = req.body;
  const success = await setupTelegramBot(token || "");
  if (success) {
    res.json({ status: "ok", message: `Бот @${botInfo.botUsername} успешно подключен!`, botInfo });
  } else {
    res.status(400).json({ status: "error", message: "Не удалось подключить бота. Проверьте правильность токена." });
  }
});

app.post("/api/bot/simulate", async (req, res) => {
  const { input, isCallback } = req.body;

  if (isCallback || input.startsWith("/")) {
    const actionRes = handleBotCommand(input);
    return res.json(actionRes);
  }

  // Use Gemini AI for free-text user inquiries
  const aiText = await askGeminiAssistant(input);
  res.json({
    text: aiText,
    inlineKeyboard: [
      [
        { text: "💰 Стоимость", callbackData: "menu_prices" },
        { text: "💳 Оплатить СБП", callbackData: "menu_pay" },
      ],
      [
        { text: "📩 Написать Александру", callbackData: "contact_alex", url: "https://t.me/alxndr_artnn" },
        { text: "🏠 Меню", callbackData: "menu_main" },
      ],
    ],
  });
});

app.get("/api/bookings", (req, res) => {
  res.json(bookingsStore);
});

app.post("/api/bookings", (req, res) => {
  const newBooking: BookingRequest = {
    id: `b-${Date.now()}`,
    createdAt: new Date().toISOString(),
    userName: req.body.userName || "Новый ученик",
    telegramUsername: req.body.telegramUsername || "@student",
    phone: req.body.phone,
    packageDetails: req.body.packageDetails || "Абонемент",
    duration: req.body.duration || "60 минут",
    totalPrice: req.body.totalPrice || 0,
    status: "new",
    notes: req.body.notes || "Заявка через онлайн-симулятор бота",
  };
  bookingsStore.unshift(newBooking);
  res.json({ status: "ok", booking: newBooking });
});

app.patch("/api/bookings/:id", (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;
  const booking = bookingsStore.find((b) => b.id === id);
  if (booking) {
    if (status) booking.status = status;
    if (notes !== undefined) booking.notes = notes;
    res.json({ status: "ok", booking });
  } else {
    res.status(404).json({ error: "Booking not found" });
  }
});

// ZIP Export Endpoint
function addDirectoryToZip(zip: JSZip, dirPath: string, zipPath: string) {
  const items = fs.readdirSync(dirPath);
  for (const item of items) {
    if (["node_modules", ".git", "dist", ".cache"].includes(item)) continue;
    const fullPath = path.join(dirPath, item);
    const relZipPath = zipPath ? `${zipPath}/${item}` : item;
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      addDirectoryToZip(zip, fullPath, relZipPath);
    } else {
      const content = fs.readFileSync(fullPath);
      zip.file(relZipPath, content);
    }
  }
}

app.get("/api/export-zip", async (req, res) => {
  try {
    const zip = new JSZip();
    addDirectoryToZip(zip, process.cwd(), "");
    const content = await zip.generateAsync({ type: "nodebuffer" });
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", 'attachment; filename="telegram-bot-project.zip"');
    res.send(content);
  } catch (err: any) {
    console.error("Export zip error:", err);
    res.status(500).json({ error: "Failed to create ZIP archive" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
