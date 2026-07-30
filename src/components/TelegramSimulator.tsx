import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, RotateCcw, Sparkles, CheckCheck, Phone, Info, ShieldCheck, CornerDownLeft } from "lucide-react";
import { TelegramMessage } from "../types";

interface TelegramSimulatorProps {
  onOpenBookingModal: (preselectedPackage?: string) => void;
  botUsername?: string;
}

export const TelegramSimulator: React.FC<TelegramSimulatorProps> = ({
  onOpenBookingModal,
  botUsername,
}) => {
  const [messages, setMessages] = useState<TelegramMessage[]>([
    {
      id: "init-1",
      sender: "bot",
      text: `🚀 **Обучение с Александром**\n⭐ 13 лет опыта • 120+ отзывов на Профи.ру\n\nЗдравствуйте! Я официальный бот-ассистент репетитора Александра по **английскому** и **французскому** языкам.\n\nЗдесь вы можете узнать стоимость занятий, рассчитать скидки, изучить правила или задать мне любой вопрос!`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      inlineKeyboard: [
        [
          { text: "💰 Стоимость и абонементы", callbackData: "menu_prices" },
          { text: "🧮 Калькулятор скидок", callbackData: "menu_calc" },
        ],
        [
          { text: "🎯 Пробное занятие (2 300 ₽)", callbackData: "menu_trial" },
          { text: "⚙️ Формат и правила", callbackData: "menu_rules" },
        ],
        [
          { text: "💳 Реквизиты и оплата", callbackData: "menu_pay" },
          { text: "❓ Задать вопрос ИИ", callbackData: "menu_ask" },
        ],
        [
          { text: "📩 Написать Александру (@alxndr_artnn)", callbackData: "contact_alex", url: "https://t.me/alxndr_artnn" },
        ],
      ],
    },
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendSimulatedMessage = async (userInput: string, isCallback: boolean = false) => {
    if (!userInput.trim() && !isCallback) return;

    const userTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // Add user message to UI if not an internal inline button callback
    if (!isCallback) {
      const userMsg: TelegramMessage = {
        id: `user-${Date.now()}`,
        sender: "user",
        text: userInput,
        timestamp: userTime,
      };
      setMessages((prev) => [...prev, userMsg]);
    }

    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/bot/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: userInput, isCallback }),
      });

      const data = await response.json();

      setIsTyping(false);

      const botMsg: TelegramMessage = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: data.text || "Извините, не удалось обработать запрос.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        inlineKeyboard: data.inlineKeyboard,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Simulation error:", error);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: "bot",
          text: "Произошла ошибка при получении ответа. Попробуйте еще раз или напишите Александру напрямую: @alxndr_artnn",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  };

  const handleInlineClick = (btn: { text: string; callbackData: string; url?: string }) => {
    if (btn.url) {
      window.open(btn.url, "_blank");
      return;
    }
    sendSimulatedMessage(btn.callbackData, true);
  };

  const resetChat = () => {
    setMessages([
      {
        id: `reset-${Date.now()}`,
        sender: "bot",
        text: `🚀 *Обучение с Александром*\n⭐ 13 лет опыта • 120+ отзывов на Профи.ру\n\nЧат перезапущен. Чем я могу помочь вам прямо сейчас?`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        inlineKeyboard: [
          [
            { text: "💰 Стоимость и абонементы", callbackData: "menu_prices" },
            { text: "🧮 Калькулятор скидок", callbackData: "menu_calc" },
          ],
          [
            { text: "🎯 Пробное занятие (2 300 ₽)", callbackData: "menu_trial" },
            { text: "⚙️ Формат и правила", callbackData: "menu_rules" },
          ],
          [
            { text: "💳 Реквизиты и оплата", callbackData: "menu_pay" },
            { text: "💬 Написать Александру", callbackData: "contact_alex", url: "https://t.me/alxndr_artnn" },
          ],
        ],
      },
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Simulation Info Header */}
      <div className="mb-4 bg-slate-900 border border-slate-800 rounded-xl p-4 text-slate-300 text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-slate-100">Интерактивный Симулятор Telegram Бота</p>
            <p className="text-xs text-slate-400">
              Вы можете нажимать на кнопки, рассчитывать стоимость или задавать вопросы ИИ на базе информации Александра.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => onOpenBookingModal()}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs px-3 py-1.5 rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Оставить заявку</span>
          </button>
          <button
            onClick={resetChat}
            className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-1.5 rounded-lg transition-colors"
            title="Сбросить диалог"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Telegram App Container */}
      <div className="bg-[#17212b] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[640px]">
        
        {/* Telegram Header */}
        <div className="bg-[#242f3d] px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow">
                А
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#242f3d] rounded-full"></div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-white text-sm sm:text-base">
                  Обучение с Александром
                </span>
                <span className="text-xs text-sky-400 font-mono bg-sky-500/10 px-1.5 py-0.5 rounded">bot</span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                {isTyping ? (
                  <span className="text-sky-400 animate-pulse">печатает ответ...</span>
                ) : (
                  <span>бот онлайн • 13 лет опыта</span>
                )}
              </p>
            </div>
          </div>

          <div className="text-right">
            {botUsername ? (
              <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 font-mono">
                @{botUsername}
              </span>
            ) : (
              <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">
                Симулятор
              </span>
            )}
          </div>
        </div>

        {/* Telegram Chat Message Canvas */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0e1621] bg-opacity-95">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 shadow-md relative ${
                  msg.sender === "user"
                    ? "bg-[#2b5278] text-white rounded-br-none"
                    : "bg-[#182533] text-slate-100 rounded-bl-none border border-slate-800"
                }`}
              >
                {/* Formatting message body text */}
                <div className="whitespace-pre-wrap text-sm leading-relaxed font-sans">
                  {msg.text.split("\n").map((line, lIdx) => {
                    // Simple bold handling
                    const parts = line.split(/(\*\*.*?\*\*|\*.*?\*)/g);
                    return (
                      <p key={lIdx} className="mb-1 last:mb-0">
                        {parts.map((part, pIdx) => {
                          if (part.startsWith("**") && part.endsWith("**")) {
                            return <strong key={pIdx}>{part.slice(2, -2)}</strong>;
                          }
                          if (part.startsWith("*") && part.endsWith("*")) {
                            return <strong key={pIdx}>{part.slice(1, -1)}</strong>;
                          }
                          if (part.startsWith("~~") && part.endsWith("~~")) {
                            return <del key={pIdx} className="text-slate-400">{part.slice(2, -2)}</del>;
                          }
                          return part;
                        })}
                      </p>
                    );
                  })}
                </div>

                <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-400 font-mono">
                  <span>{msg.timestamp}</span>
                  {msg.sender === "user" && <CheckCheck className="w-3.5 h-3.5 text-sky-400" />}
                </div>

                {/* Inline Keyboard Buttons */}
                {msg.inlineKeyboard && msg.inlineKeyboard.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-700/50 flex flex-col gap-1.5">
                    {msg.inlineKeyboard.map((row, rIdx) => (
                      <div key={rIdx} className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {row.map((btn, bIdx) => (
                          <button
                            key={bIdx}
                            onClick={() => handleInlineClick(btn)}
                            className="bg-[#2b3a4c] hover:bg-[#384a60] text-sky-300 font-medium text-xs py-2 px-3 rounded-xl transition-all border border-sky-500/20 active:scale-[0.98] text-center"
                          >
                            {btn.text}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator Bubble */}
          {isTyping && (
            <div className="flex items-start">
              <div className="bg-[#182533] text-slate-400 px-4 py-2.5 rounded-2xl rounded-bl-none text-xs flex items-center gap-1.5 border border-slate-800">
                <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="bg-[#17212b] px-3 py-2 border-t border-slate-800 flex gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => sendSimulatedMessage("Сколько стоят абонементы на 1 месяц?")}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-sky-300 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors border border-slate-700/60"
          >
            💰 Стоимость абонементов
          </button>
          <button
            onClick={() => sendSimulatedMessage("Как проходит пробное занятие?")}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-sky-300 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors border border-slate-700/60"
          >
            🎯 Пробный урок за 2 300 ₽
          </button>
          <button
            onClick={() => sendSimulatedMessage("Какие скидки при покупке на 3, 6 или 12 месяцев?")}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-sky-300 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors border border-slate-700/60"
          >
            🎁 Скидки 15%, 25%, 40%
          </button>
          <button
            onClick={() => sendSimulatedMessage("Как оплатить по СБП?")}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-sky-300 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors border border-slate-700/60"
          >
            💳 Реквизиты СБП
          </button>
        </div>

        {/* Input Bar */}
        <div className="bg-[#17212b] p-3 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendSimulatedMessage(input);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Задайте вопрос или введите команду..."
              className="flex-1 bg-[#242f3d] text-white text-sm px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-sky-500 transition-colors placeholder-slate-400"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="bg-sky-500 hover:bg-sky-400 disabled:opacity-40 disabled:hover:bg-sky-500 text-white p-2.5 rounded-xl transition-all shadow"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
