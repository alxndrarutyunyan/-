import React from "react";
import { MessageSquare, Calculator, BookOpen, Users, Bot, CheckCircle2, AlertCircle, Key, ExternalLink, Download } from "lucide-react";
import { BotStatusInfo } from "../types";

interface HeaderProps {
  activeTab: "simulator" | "calculator" | "rules" | "bookings";
  setActiveTab: (tab: "simulator" | "calculator" | "rules" | "bookings") => void;
  botStatus: BotStatusInfo;
  onOpenBotSetup: () => void;
  bookingsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  botStatus,
  onOpenBotSetup,
  bookingsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo / Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base sm:text-lg tracking-tight text-white">
                  Обучение с Александром
                </h1>
                <span className="bg-sky-500/10 text-sky-400 text-xs px-2 py-0.5 rounded-full font-medium border border-sky-500/20 hidden sm:inline-block">
                  Telegram Bot
                </span>
              </div>
              <p className="text-xs text-slate-400">
                13 лет опыта • 120+ отзывов • Английский и Французский
              </p>
            </div>
          </div>

          {/* Right actions: Bot Status & Token Launcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenBotSetup}
              className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                botStatus.tokenConfigured
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                  : "bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20"
              }`}
            >
              {botStatus.tokenConfigured ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="hidden md:inline">
                    Бот <strong>@{botStatus.botUsername}</strong> подключен
                  </span>
                  <span className="md:hidden">Бот подключен</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span className="hidden md:inline">Подключить токен Telegram</span>
                  <span className="md:hidden">Подключить</span>
                  <Key className="w-3.5 h-3.5 ml-0.5 opacity-70" />
                </>
              )}
            </button>

            <a
              href="/api/export-zip"
              download="telegram-bot-project.zip"
              title="Скачать весь исходный код проекта в ZIP архиве"
              className="flex items-center gap-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg transition-colors border border-emerald-400/30 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Скачать ZIP</span>
            </a>

            <a
              href="https://t.me/alxndr_artnn"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium bg-sky-500 hover:bg-sky-400 text-white px-3 py-1.5 rounded-lg transition-colors"
            >
              <span>@alxndr_artnn</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 sm:gap-2 border-t border-slate-800/80 pt-2 pb-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("simulator")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === "simulator"
                ? "bg-sky-500/20 text-sky-400 border border-sky-500/30 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Симулятор Бота</span>
          </button>

          <button
            onClick={() => setActiveTab("calculator")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === "calculator"
                ? "bg-sky-500/20 text-sky-400 border border-sky-500/30 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Калькулятор абонементов</span>
          </button>

          <button
            onClick={() => setActiveTab("rules")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === "rules"
                ? "bg-sky-500/20 text-sky-400 border border-sky-500/30 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Правила и формат</span>
          </button>

          <button
            onClick={() => setActiveTab("bookings")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all relative ${
              activeTab === "bookings"
                ? "bg-sky-500/20 text-sky-400 border border-sky-500/30 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Заявки учеников</span>
            {bookingsCount > 0 && (
              <span className="bg-sky-500 text-slate-950 font-bold text-[10px] px-1.5 py-0.2 rounded-full ml-1">
                {bookingsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
