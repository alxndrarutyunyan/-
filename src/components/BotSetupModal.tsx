import React, { useState } from "react";
import { X, Key, Check, AlertCircle, Bot, ExternalLink, Sparkles } from "lucide-react";
import { BotStatusInfo } from "../types";

interface BotSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  botStatus: BotStatusInfo;
  onUpdateStatus: (info: BotStatusInfo) => void;
}

export const BotSetupModal: React.FC<BotSetupModalProps> = ({
  isOpen,
  onClose,
  botStatus,
  onUpdateStatus,
}) => {
  const [tokenInput, setTokenInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  const handleSaveToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/bot/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenInput }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok && data.status === "ok") {
        setSuccessMsg(data.message);
        onUpdateStatus(data.botInfo);
        setTokenInput("");
      } else {
        setErrorMsg(data.message || "Не удалось подключить токен.");
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg("Ошибка связи с сервером.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-slate-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-xl text-white">Подключение Telegram Бота</h3>
            <p className="text-xs text-slate-400">
              Подключите реального бота к мессенджеру Telegram
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div
          className={`p-4 rounded-2xl border mb-6 flex items-center justify-between ${
            botStatus.tokenConfigured
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-amber-500/10 border-amber-500/30 text-amber-300"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {botStatus.tokenConfigured ? (
              <Check className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            )}
            <div className="text-xs">
              <p className="font-semibold text-sm">
                {botStatus.tokenConfigured
                  ? `Бот активен: @${botStatus.botUsername}`
                  : "Токен не подключен"}
              </p>
              <p className="text-slate-400 mt-0.5">
                {botStatus.tokenConfigured
                  ? "Бот принимает команды и отвечает пользователям в Telegram!"
                  : "Используется встроенный симулятор. Подключите токен для запуска в Telegram."}
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4 text-xs space-y-2 mb-6">
          <div className="font-semibold text-sky-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>Как получить токен за 1 минуту:</span>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-slate-300 pl-1">
            <li>
              Откройте в Telegram бота{" "}
              <a
                href="https://t.me/BotFather"
                target="_blank"
                rel="noreferrer"
                className="text-sky-400 font-mono underline inline-flex items-center gap-0.5"
              >
                @BotFather <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>Отправьте команду <code className="bg-slate-900 px-1 py-0.5 rounded text-sky-300">/newbot</code> и придумайте имя</li>
            <li>Скопируйте полученный API токен (вид: <code className="bg-slate-900 px-1 py-0.5 rounded text-slate-400">123456789:ABC...</code>)</li>
            <li>Вставьте токен в поле ниже и нажмите «Подключить»</li>
          </ol>
        </div>

        {/* Token Input Form */}
        <form onSubmit={handleSaveToken} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              API Token от BotFather:
            </label>
            <div className="relative">
              <input
                type="password"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="123456789:AAH..."
                required
                className="w-full bg-slate-950 text-white text-sm px-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-sky-500 font-mono placeholder-slate-600"
              />
              <Key className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Закрыть
            </button>
            <button
              type="submit"
              disabled={loading || !tokenInput.trim()}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-sky-500 hover:bg-sky-400 disabled:opacity-50 transition-colors shadow-lg shadow-sky-500/20"
            >
              {loading ? "Подключение..." : "Подключить бота"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
