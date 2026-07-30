import { TEACHING_DATA } from "../src/data/teachingInfo";
import { calculatePrice } from "../src/utils/calculator";

export interface BotActionResponse {
  text: string;
  inlineKeyboard?: Array<Array<{ text: string; callbackData: string; url?: string }>>;
}

export function handleBotCommand(commandOrCallback: string): BotActionResponse {
  const code = commandOrCallback.trim();

  // /start or main menu
  if (code === "/start" || code === "menu_main") {
    return {
      text: `🚀 *Обучение с Александром*
⭐ 13 лет опыта • 120+ отзывов на Профи.ру

Приветствую! Я официальный бот-помощник репетитора Александра по **английскому** и **французскому** языкам.

Здесь вы можете:
• Ознакомиться с ценами и абонементами
• Рассчитать стоимость со скидкой до -40%
• Узнать правила и формат уроков (Яндекс Телемост)
• Оплатить пробное занятие или абонемент по СБП
• Записаться на удобное время

Выберите нужный раздел ниже 👇`,
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
    };
  }

  // Prices menu
  if (code === "menu_prices" || code === "/prices") {
    let pricesText = `📊 *Стоимость абонементов на 1 месяц:*
Английский и Французский языки (от A2+ до B1+)\n\n`;

    TEACHING_DATA.monthlyPackages.forEach((p) => {
      pricesText += `📌 *${p.count} занятий (${p.perWeek}):*\n`;
      pricesText += `  • ⏱️ 60 мин: **${p.p60.toLocaleString("ru-RU")} ₽**\n`;
      pricesText += `  • ⏱️ 90 мин: **${p.p90.toLocaleString("ru-RU")} ₽**\n`;
      pricesText += `  • ⏱️ 120 мин: **${p.p120.toLocaleString("ru-RU")} ₽**\n\n`;
    });

    pricesText += `🎁 *Скидки при долгосрочной оплате:*\n`;
    pricesText += `• 3 месяца: **-15%**\n`;
    pricesText += `• 6 месяцев: **-25%**\n`;
    pricesText += `• 12 месяцев: **-40%**\n\n`;
    pricesText += `💡 *Первый шаг:* Можно оплатить 1 разовое/пробное занятие — **2 300 ₽**, а затем выбрать абонемент!`;

    return {
      text: pricesText,
      inlineKeyboard: [
        [
          { text: "🧮 Рассчитать индивидуальную скидку", callbackData: "menu_calc" },
        ],
        [
          { text: "💳 Перейти к оплате", callbackData: "menu_pay" },
          { text: "🏠 В главное меню", callbackData: "menu_main" },
        ],
      ],
    };
  }

  // Trial lesson
  if (code === "menu_trial" || code === "/trial") {
    return {
      text: `🎯 *Пробное / Разовое занятие*

При желании вы можете оплатить первое занятие отдельно — **2 300 ₽**, оценить подход и формат, и только потом принять решение о покупке абонемента.

📍 *Как проходит занятие:*
• Сервис: **Яндекс Телемост** (с демонстрацией экрана)
• Длительность: **60 минут**
• Включать камеру не обязательно
• Определение вашего текущего уровня и разбор целей

💳 *Оплата по СБП:*
• Номер: **+7 (910) 040-35-35** (Александр А., Банк ВТБ)
• Сумма: **2 300 ₽**

После перевода отправьте чек Александру в Telegram: @alxndr_artnn`,
      inlineKeyboard: [
        [
          { text: "✅ Отправить чек в Telegram", callbackData: "contact_alex", url: "https://t.me/alxndr_artnn" },
        ],
        [
          { text: "💰 Посмотреть варианты абонементов", callbackData: "menu_prices" },
          { text: "🏠 Главное меню", callbackData: "menu_main" },
        ],
      ],
    };
  }

  // Format & Rules
  if (code === "menu_rules" || code === "/rules") {
    const r = TEACHING_DATA.formatRules;
    return {
      text: `⚙️ *Формат и правила обучения:*

💻 *Где проходят занятия?*
Через удобный сервис **${r.platform}** с демонстрацией экрана. Установка программ не требуется. Включать камеру не обязательно — главное комфорт.

🧠 *Как строится учебный процесс?*
Формат ориентирован на вашу самостоятельность и максимум практики (70% успеха). Работа по проверенным материалам: вы выполняете задания, Александр разбирает сложные моменты и исправляет ошибки.

🗣️ *Уровень подготовки:*
Рассчитано на учеников с уровнем **от A2+ (Pre-Intermediate) до B1 (Intermediate)** и выше.

🗓️ *Что делать при пропуске урока?*
Если вы заранее предупреждаете о пропуске, подбирается альтернативное время на той же неделе.

⏸️ *Отпуск и паузы:*
Вы можете временно «заморозить» абонемент на время отпуска, занятия не сгорят!`,
      inlineKeyboard: [
        [
          { text: "🎯 Записаться на пробное", callbackData: "menu_trial" },
          { text: "💰 Узнать цены", callbackData: "menu_prices" },
        ],
        [
          { text: "🏠 Главное меню", callbackData: "menu_main" },
        ],
      ],
    };
  }

  // Payment details
  if (code === "menu_pay" || code === "/pay") {
    return {
      text: `💳 *Инструкция и реквизиты для оплаты:*

1️⃣ **Оплатите по СБП:**
   • Номер телефона: **+7 (910) 040-35-35**
   • Получатель: **Александр А.**
   • Банк: **Банк ВТБ**

2️⃣ **Подтверждение:**
   • Сделайте скриншот или сохраните чек оплаты.
   • Отправьте чек в личные сообщения: @alxndr_artnn

3️⃣ **Обсуждение времени:**
   • Укажите желаемые дни и время для занятий.
   • Александр вышлет вам постоянную ссылку на онлайн-класс.`,
      inlineKeyboard: [
        [
          { text: "📩 Отправить чек Александр (@alxndr_artnn)", callbackData: "contact_alex", url: "https://t.me/alxndr_artnn" },
        ],
        [
          { text: "🧮 Посчитать стоимость в калькуляторе", callbackData: "menu_calc" },
          { text: "🏠 Главное меню", callbackData: "menu_main" },
        ],
      ],
    };
  }

  // Calculator menu
  if (code === "menu_calc" || code === "/calc") {
    const calc3 = calculatePrice({ lessonsPerWeek: 2, durationMinutes: 60, months: 3 });
    const calc6 = calculatePrice({ lessonsPerWeek: 2, durationMinutes: 60, months: 6 });
    const calc12 = calculatePrice({ lessonsPerWeek: 2, durationMinutes: 60, months: 12 });

    return {
      text: `🧮 *Примеры расчета с учетом долгосрочных скидок:*
_(Пример для 8 занятий в месяц по 60 мин - базовый 15 000 ₽/мес)_

• **1 месяц (0% скидка):** 15 000 ₽
• **3 месяца (-15% скидка):** ~~45 000 ₽~~ ➔ **${calc3.finalTotalPrice.toLocaleString("ru-RU")} ₽** _(всего 24 урока по ${calc3.singleLessonPrice.toLocaleString("ru-RU")} ₽/урок)_
• **6 месяцев (-25% скидка):** ~~90 000 ₽~~ ➔ **${calc6.finalTotalPrice.toLocaleString("ru-RU")} ₽** _(всего 48 уроков по ${calc6.singleLessonPrice.toLocaleString("ru-RU")} ₽/урок)_
• **12 месяцев (-40% скидка):** ~~180 000 ₽~~ ➔ **${calc12.finalTotalPrice.toLocaleString("ru-RU")} ₽** _(всего 96 уроков по ${calc12.singleLessonPrice.toLocaleString("ru-RU")} ₽/урок)_

Воспользуйтесь интерактивным калькулятором на нашем сайте или выберите готовый вариант для оплаты!`,
      inlineKeyboard: [
        [
          { text: "🎯 Оплатить 1 мес (8 уроков x 60мин)", callbackData: "pay_1m_8_60" },
          { text: "🔥 Оплатить 3 мес (-15%)", callbackData: "pay_3m_8_60" },
        ],
        [
          { text: "💳 Посмотреть все реквизиты СБП", callbackData: "menu_pay" },
          { text: "🏠 Главное меню", callbackData: "menu_main" },
        ],
      ],
    };
  }

  // Quick payment option presets
  if (code.startsWith("pay_")) {
    return {
      text: `📋 *Вы выбрали пакет для оплаты!*

Реквизиты СБП для оплаты:
• Номер: **+7 (910) 040-35-35**
• Получатель: **Александр А.**
• Банк: **ВТБ**

После перевода отправьте чек с указанием выбранного пакета Александру: @alxndr_artnn`,
      inlineKeyboard: [
        [
          { text: "📩 Перейти к Александру в Telegram", callbackData: "contact_alex", url: "https://t.me/alxndr_artnn" },
        ],
        [
          { text: "🏠 Главное меню", callbackData: "menu_main" },
        ],
      ],
    };
  }

  // Ask AI prompt
  if (code === "menu_ask") {
    return {
      text: `💬 *Задайте любой вопрос в чат!*

Напишите свой вопрос сообщением (например, _«Какие учебники используются?»_, _«Как заморозить абонемент?»_, _«Подходит ли мне язык с нуля?»_), и наш ИИ-ассистент ответит вам прямо здесь!`,
      inlineKeyboard: [
        [
          { text: "🏠 Главное меню", callbackData: "menu_main" },
        ],
      ],
    };
  }

  // Fallback to start menu
  return handleBotCommand("/start");
}
