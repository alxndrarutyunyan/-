export interface PricePackage {
  count: number;
  perWeek: string;
  p60: number;
  p90: number;
  p120: number;
}

export interface TeachingData {
  teacher: {
    name: string;
    experience: string;
    reviews: string;
    profiUrl: string;
    telegram: string;
    phone: string;
    bank: string;
    languages: string[];
    minLevel: string;
  };
  trialLesson: {
    price: number;
    description: string;
  };
  monthlyPackages: PricePackage[];
  discounts: {
    months: number;
    discountPercent: number;
    label: string;
  }[];
  formatRules: {
    platform: string;
    platformDetails: string;
    cameraRequired: boolean;
    methodology: string;
    teacherRole: string;
    targetLevels: string;
    missedLessonPolicy: string;
    vacationPolicy: string;
  };
  enrollmentSteps: {
    step: number;
    title: string;
    details: string;
  }[];
}

export const TEACHING_DATA: TeachingData = {
  teacher: {
    name: "Александр А.",
    experience: "13 лет опыта",
    reviews: "120+ отзывов на Профи.ру",
    profiUrl: "https://profi.ru",
    telegram: "@alxndr_artnn",
    phone: "+7 (910) 040-35-35",
    bank: "Банк ВТБ (СБП)",
    languages: ["Английский язык", "Французский язык"],
    minLevel: "от A2+ (Pre-Intermediate) до B1 (Intermediate) и выше",
  },
  trialLesson: {
    price: 2300,
    description: "Первый шаг: При желании вы можете оплатить первое занятие отдельно (2 300 ₽), и только потом принять решение об абонементе.",
  },
  monthlyPackages: [
    { count: 4, perWeek: "1 раз в неделю", p60: 9000, p90: 12000, p120: 15000 },
    { count: 8, perWeek: "2 раза в неделю", p60: 15000, p90: 18000, p120: 20000 },
    { count: 12, perWeek: "3 раза в неделю", p60: 20000, p90: 25000, p120: 28000 },
    { count: 16, perWeek: "4 раза в неделю", p60: 23000, p90: 31000, p120: 35000 },
    { count: 20, perWeek: "5 раз в неделю", p60: 27000, p90: 37000, p120: 41000 },
  ],
  discounts: [
    { months: 1, discountPercent: 0, label: "1 месяц (обычный прайс)" },
    { months: 3, discountPercent: 15, label: "3 месяца (-15%)" },
    { months: 6, discountPercent: 25, label: "6 месяцев (-25%)" },
    { months: 12, discountPercent: 40, label: "12 месяцев (-40%)" },
  ],
  formatRules: {
    platform: "Яндекс Телемост",
    platformDetails: "С демонстрацией экрана. Установка дополнительных программ не требуется.",
    cameraRequired: false,
    methodology: "Максимум практики и самостоятельности. Работа по проверенным учебным материалам: вы выполняете задания, я разбираю сложные моменты, исправляю ошибки и направляю.",
    teacherRole: "Дать системные знания, исправить ошибки и разговорить. 70% успеха — это самостоятельная работа ученика.",
    targetLevels: "Активное общение на английском или французском языке рассчитано на уровень от A2+ (Pre-Intermediate) - B1 (Intermediate) и выше.",
    missedLessonPolicy: "Если заранее предупреждаете о пропуске, мы подбираем альтернативное время на той же неделе (в рамках срока абонемента).",
    vacationPolicy: "Вы можете временно «заморозить» абонемент на время отпуска, занятия не сгорят.",
  },
  enrollmentSteps: [
    {
      step: 1,
      title: "Оплата по СБП",
      details: "Оплатите выбранный абонемент или разовое занятие по номеру +7 (910) 040-35-35 (Александр А., Банк ВТБ).",
    },
    {
      step: 2,
      title: "Подтверждение",
      details: "Отправьте чек об оплате в Telegram @alxndr_artnn",
    },
    {
      step: 3,
      title: "Согласование времени",
      details: "Укажите выбранный абонемент и желаемые дни/часы. Александр пришлет постоянную ссылку на онлайн-класс.",
    },
  ],
};
