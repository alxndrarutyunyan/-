export interface TelegramMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  inlineKeyboard?: Array<Array<{ text: string; callbackData: string; url?: string }>>;
  mediaUrl?: string;
}

export interface BookingRequest {
  id: string;
  createdAt: string;
  userName: string;
  telegramUsername: string;
  phone?: string;
  packageDetails: string;
  duration: string;
  totalPrice: number;
  status: "new" | "payment_pending" | "confirmed" | "completed";
  notes?: string;
}

export interface BotStatusInfo {
  tokenConfigured: boolean;
  botUsername?: string;
  botFirstName?: string;
  isPollingActive?: boolean;
  webhookUrl?: string;
}

export interface CalculatePriceParams {
  lessonsPerWeek: number; // 1, 2, 3, 4, 5
  durationMinutes: 60 | 90 | 120;
  months: 1 | 3 | 6 | 12;
}

export interface CalculatedPriceResult {
  lessonsCountPerMonth: number;
  totalLessons: number;
  baseMonthlyPrice: number;
  baseTotalPrice: number;
  discountPercent: number;
  discountAmount: number;
  finalTotalPrice: number;
  monthlyAveragePrice: number;
  singleLessonPrice: number;
}
