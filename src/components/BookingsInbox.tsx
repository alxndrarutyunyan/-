import React from "react";
import { BookingRequest } from "../types";
import { Users, CheckCircle2, Clock, AlertCircle, Phone, MessageSquare, Plus } from "lucide-react";

interface BookingsInboxProps {
  bookings: BookingRequest[];
  onUpdateStatus: (id: string, status: BookingRequest["status"]) => void;
  onOpenNewModal: () => void;
}

export const BookingsInbox: React.FC<BookingsInboxProps> = ({
  bookings,
  onUpdateStatus,
  onOpenNewModal,
}) => {
  const getStatusBadge = (status: BookingRequest["status"]) => {
    switch (status) {
      case "new":
        return (
          <span className="bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs px-2.5 py-0.5 rounded-full font-medium inline-flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Новая заявка</span>
          </span>
        );
      case "payment_pending":
        return (
          <span className="bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs px-2.5 py-0.5 rounded-full font-medium inline-flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            <span>Ожидает оплаты</span>
          </span>
        );
      case "confirmed":
        return (
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2.5 py-0.5 rounded-full font-medium inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Оплачено / Подтверждено</span>
          </span>
        );
      case "completed":
        return (
          <span className="bg-slate-800 text-slate-400 text-xs px-2.5 py-0.5 rounded-full font-medium">
            Завершено
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Панель управления учениками</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Заявки на обучение</h2>
          <p className="text-xs text-slate-400 mt-1">
            Всего заявок: {bookings.length}
          </p>
        </div>

        <button
          onClick={onOpenNewModal}
          className="bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 self-start sm:self-auto shadow-lg shadow-sky-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Добавить новую заявку</span>
        </button>
      </div>

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-3">
          <Users className="w-12 h-12 text-slate-600 mx-auto" />
          <p className="font-semibold text-slate-300">Заявок пока нет</p>
          <p className="text-xs">
            Как только ученики начнут записываться через бота или сайт, их заявки появятся здесь.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-xl transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sky-400 text-base">
                    {booking.userName[0] || "У"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-base">{booking.userName}</h3>
                      {getStatusBadge(booking.status)}
                    </div>
                    <p className="text-xs text-slate-400">
                      Telegram: <a href={`https://t.me/${booking.telegramUsername.replace("@", "")}`} target="_blank" rel="noreferrer" className="text-sky-400 hover:underline">{booking.telegramUsername}</a>
                      {booking.phone && ` • Тел: ${booking.phone}`}
                    </p>
                  </div>
                </div>

                <div className="text-right self-start sm:self-auto">
                  <div className="font-extrabold text-white text-lg">
                    {booking.totalPrice.toLocaleString("ru-RU")} ₽
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {new Date(booking.createdAt).toLocaleString("ru-RU", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 uppercase tracking-wider text-[10px] block font-semibold">
                    Пакет / Абонемент
                  </span>
                  <p className="font-semibold text-slate-200 mt-0.5">{booking.packageDetails}</p>
                </div>
                <div>
                  <span className="text-slate-500 uppercase tracking-wider text-[10px] block font-semibold">
                    Заметки и время
                  </span>
                  <p className="text-slate-300 mt-0.5">{booking.notes || "Не указано"}</p>
                </div>
              </div>

              {/* Status Change Controls */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Сменить статус:</span>
                  <select
                    value={booking.status}
                    onChange={(e) =>
                      onUpdateStatus(booking.id, e.target.value as BookingRequest["status"])
                    }
                    className="bg-slate-950 text-slate-200 text-xs px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-sky-500"
                  >
                    <option value="new">Новая заявка</option>
                    <option value="payment_pending">Ожидает оплаты СБП</option>
                    <option value="confirmed">Оплата подтверждена</option>
                    <option value="completed">Завершено</option>
                  </select>
                </div>

                <a
                  href={`https://t.me/${booking.telegramUsername.replace("@", "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Написать в Telegram</span>
                </a>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
