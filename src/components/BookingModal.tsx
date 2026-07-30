import React, { useState } from "react";
import { X, Check, Phone, Send, Sparkles } from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedPackage?: string;
  preselectedPrice?: number;
  onBookingCreated: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  preselectedPackage = "8 занятий в месяц (2 раз/нед), 60 мин",
  preselectedPrice = 15000,
  onBookingCreated,
}) => {
  const [userName, setUserName] = useState("");
  const [telegramUsername, setTelegramUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName,
          telegramUsername: telegramUsername.startsWith("@") ? telegramUsername : `@${telegramUsername}`,
          phone,
          packageDetails: preselectedPackage,
          duration: "60 мин",
          totalPrice: preselectedPrice,
          notes,
        }),
      });

      if (res.ok) {
        setDone(true);
        onBookingCreated();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-slate-200">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!done ? (
          <>
            <div className="mb-6">
              <span className="bg-sky-500/10 text-sky-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-sky-500/20">
                Запись на обучение
              </span>
              <h3 className="font-bold text-xl text-white mt-2">Оформить заявку</h3>
              <p className="text-xs text-slate-400 mt-1">
                Выбранный абонемент: <strong className="text-slate-200">{preselectedPackage}</strong> ({preselectedPrice.toLocaleString("ru-RU")} ₽)
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Ваше имя: *
                </label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Например, Анна"
                  className="w-full bg-slate-950 text-white text-sm px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Telegram Username: *
                </label>
                <input
                  type="text"
                  required
                  value={telegramUsername}
                  onChange={(e) => setTelegramUsername(e.target.value)}
                  placeholder="@username"
                  className="w-full bg-slate-950 text-white text-sm px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Номер телефона / СБП (опционально):
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+7 (9xx) xxx-xx-xx"
                  className="w-full bg-slate-950 text-white text-sm px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Желаемое время или пожелания:
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Например, удобны вечера Вт и Чт"
                  className="w-full bg-slate-950 text-white text-sm px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700 text-[11px] text-slate-300 space-y-1">
                <p className="font-semibold text-sky-400">Реквизиты для оплаты СБП:</p>
                <p>+7 (910) 040-35-35 (Александр А., Банк ВТБ)</p>
                <p className="text-slate-400">Чек перевода можно также отправить в Telegram @alxndr_artnn</p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl font-bold text-white bg-sky-500 hover:bg-sky-400 transition-colors shadow-lg shadow-sky-500/20"
                >
                  {submitting ? "Отправка..." : "Отправить заявку"}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-2xl text-white">Заявка принята!</h3>
            <p className="text-sm text-slate-300 max-w-xs mx-auto">
              Заявка сохранена. Оплатите абонемент по СБП и отправьте чек Александру в Telegram:
            </p>
            <a
              href="https://t.me/alxndr_artnn"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors shadow-lg"
            >
              <span>Написать @alxndr_artnn</span>
              <Send className="w-4 h-4" />
            </a>
          </div>
        )}

      </div>
    </div>
  );
};
