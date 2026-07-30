import React, { useState } from "react";
import { CalculatePriceParams } from "../types";
import { calculatePrice } from "../utils/calculator";
import { TEACHING_DATA } from "../data/teachingInfo";
import { Calculator, Check, Copy, Sparkles, Send, Shield, Zap, ArrowRight } from "lucide-react";

interface PriceCalculatorProps {
  onSelectForBooking: (details: string, price: number) => void;
}

export const PriceCalculator: React.FC<PriceCalculatorProps> = ({ onSelectForBooking }) => {
  const [params, setParams] = useState<CalculatePriceParams>({
    lessonsPerWeek: 2,
    durationMinutes: 60,
    months: 1,
  });

  const [copied, setCopied] = useState(false);

  const result = calculatePrice(params);

  const handleCopyReceipt = () => {
    const text = `Заявка на обучение с Александром:
— Абонемент: ${result.totalLessons} уроков на ${params.months} мес. (${params.lessonsPerWeek} раза в нед.)
— Длительность урока: ${params.durationMinutes} минут
— Сумма к оплате по СБП: ${result.finalTotalPrice.toLocaleString("ru-RU")} ₽
— Реквизиты СБП: +7 (910) 040-35-35 (Александр А., ВТБ)
— Получатель чека: @alxndr_artnn`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const selectedPkgName = `${result.lessonsCountPerMonth} зан./мес (${params.lessonsPerWeek} раз в нед.), ${params.durationMinutes} мин, на ${params.months} мес.`;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8">
      
      {/* Title Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold mb-3">
          <Calculator className="w-3.5 h-3.5" />
          <span>Калькулятор стоимости и скидок</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Рассчитайте идеальный абонемент
        </h2>
        <p className="text-sm text-slate-400 mt-2">
          При покупке курса на 3, 6 или 12 месяцев действуют специальные скидки до **-40%**!
        </p>
      </div>

      {/* Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          
          {/* Step 1: Duration selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              1. Длительность одного урока
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[60, 90, 120].map((dur) => (
                <button
                  key={dur}
                  onClick={() => setParams({ ...params, durationMinutes: dur as 60 | 90 | 120 })}
                  className={`p-3.5 rounded-xl border font-semibold text-sm transition-all text-center flex flex-col items-center justify-center gap-1 ${
                    params.durationMinutes === dur
                      ? "bg-sky-500/20 text-sky-300 border-sky-500 shadow-lg shadow-sky-500/10"
                      : "bg-slate-800/60 text-slate-300 border-slate-700/60 hover:bg-slate-800"
                  }`}
                >
                  <span className="text-base font-bold">{dur} минут</span>
                  <span className="text-[11px] text-slate-400 font-normal">
                    {dur === 60 ? "Стандартный" : dur === 90 ? "Интенсив" : "Максимум"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Frequency per week */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              2. Частота занятий в неделю
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {TEACHING_DATA.monthlyPackages.map((pkg, idx) => {
                const freq = idx + 1; // 1 to 5 times
                return (
                  <button
                    key={pkg.count}
                    onClick={() => setParams({ ...params, lessonsPerWeek: freq })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      params.lessonsPerWeek === freq
                        ? "bg-sky-500/20 text-sky-300 border-sky-500 shadow-md"
                        : "bg-slate-800/60 text-slate-300 border-slate-700/60 hover:bg-slate-800"
                    }`}
                  >
                    <div className="font-bold text-sm">{pkg.perWeek}</div>
                    <div className="text-xs text-slate-400">{pkg.count} зан. в месяц</div>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-amber-400/90 mt-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Рекомендуем минимум 2 раза в неделю для стабильного результата.</span>
            </p>
          </div>

          {/* Step 3: Subscription Period */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              3. Срок действия абонемента
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {TEACHING_DATA.discounts.map((disc) => (
                <button
                  key={disc.months}
                  onClick={() => setParams({ ...params, months: disc.months as 1 | 3 | 6 | 12 })}
                  className={`p-3 rounded-xl border transition-all text-center relative overflow-hidden ${
                    params.months === disc.months
                      ? "bg-sky-500/20 text-sky-300 border-sky-500"
                      : "bg-slate-800/60 text-slate-300 border-slate-700/60 hover:bg-slate-800"
                  }`}
                >
                  {disc.discountPercent > 0 && (
                    <span className="absolute top-0 right-0 bg-emerald-500 text-slate-950 font-extrabold text-[10px] px-1.5 py-0.2 rounded-bl">
                      -{disc.discountPercent}%
                    </span>
                  )}
                  <div className="font-bold text-sm">{disc.months} {disc.months === 1 ? "месяц" : disc.months < 5 ? "месяца" : "месяцев"}</div>
                  <div className="text-[11px] text-slate-400">
                    {disc.discountPercent > 0 ? `Выгода ${disc.discountPercent}%` : "Обычный прайс"}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Trial lesson tip */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 flex items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-semibold text-slate-200">Хотите сначала попробовать?</span>
              <p className="text-slate-400">Первое разовое занятие можно оплатить отдельно — 2 300 ₽</p>
            </div>
            <button
              onClick={() => onSelectForBooking("Пробное / Разовое занятие (60 минут)", 2300)}
              className="bg-slate-700 hover:bg-slate-600 text-sky-300 font-semibold px-3 py-2 rounded-lg whitespace-nowrap transition-colors"
            >
              Записаться за 2 300 ₽
            </button>
          </div>
        </div>

        {/* Right Column: Price Summary Output Card */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-slate-950 border border-sky-500/30 rounded-2xl p-6 shadow-2xl space-y-6 relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h3 className="font-bold text-lg text-white">Итоговый расчет</h3>
            {result.discountPercent > 0 && (
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-extrabold px-2.5 py-1 rounded-full">
                Скидка -{result.discountPercent}%
              </span>
            )}
          </div>

          {/* Breakdown Items */}
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-slate-400">
              <span>Всего уроков:</span>
              <span className="font-semibold text-slate-200">{result.totalLessons} уроков ({result.lessonsCountPerMonth} зан./мес)</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Длительность:</span>
              <span className="font-semibold text-slate-200">{params.durationMinutes} минут</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Период обучения:</span>
              <span className="font-semibold text-slate-200">{params.months} {params.months === 1 ? "месяц" : "мес."}</span>
            </div>
            
            {result.discountPercent > 0 && (
              <>
                <div className="flex justify-between text-slate-400">
                  <span>Базовая стоимость:</span>
                  <span className="line-through text-slate-500">{result.baseTotalPrice.toLocaleString("ru-RU")} ₽</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>Ваша экономия:</span>
                  <span>-{result.discountAmount.toLocaleString("ru-RU")} ₽</span>
                </div>
              </>
            )}

            <div className="flex justify-between text-slate-400 pt-2 border-t border-slate-800">
              <span>Цена 1 урока:</span>
              <span className="font-semibold text-sky-400">{result.singleLessonPrice.toLocaleString("ru-RU")} ₽</span>
            </div>
          </div>

          {/* Big Price Display */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 text-center">
            <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">
              К оплате за весь период
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {result.finalTotalPrice.toLocaleString("ru-RU")} ₽
            </div>
            {params.months > 1 && (
              <p className="text-xs text-slate-400 mt-1">
                (~{result.monthlyAveragePrice.toLocaleString("ru-RU")} ₽ в месяц)
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={() => onSelectForBooking(selectedPkgName, result.finalTotalPrice)}
              className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-sky-500/20 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Оформить заявку</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={handleCopyReceipt}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors border border-slate-700 flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Реквизиты скопированы!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>Скопировать реквизиты СБП для оплаты</span>
                </>
              )}
            </button>
          </div>

          {/* Guarantee banner */}
          <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <Shield className="w-3.5 h-3.5 text-sky-400" />
            <span>Занятия проходят в Яндекс Телемост. Без потери уроков.</span>
          </div>

        </div>
      </div>
    </div>
  );
};
