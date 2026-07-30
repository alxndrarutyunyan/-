import React from "react";
import { TEACHING_DATA } from "../data/teachingInfo";
import { BookOpen, Video, Target, PauseCircle, CalendarCheck, PhoneCall, ExternalLink, Award, CheckCircle2 } from "lucide-react";

interface RulesAndFaqProps {
  onOpenBookingModal: () => void;
}

export const RulesAndFaq: React.FC<RulesAndFaqProps> = ({ onOpenBookingModal }) => {
  const r = TEACHING_DATA.formatRules;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-10">
      
      {/* Teacher Profile Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          <div className="relative">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 p-1 shadow-xl">
              <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center font-bold text-3xl sm:text-4xl text-white">
                А
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 font-extrabold text-[10px] px-2 py-0.5 rounded-full border-2 border-slate-900">
              13+ лет
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
              <span className="bg-sky-500/10 text-sky-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-sky-500/20">
                Преподаватель высшей категории
              </span>
              <span className="bg-amber-500/10 text-amber-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-amber-500/20">
                ⭐ 120+ отзывов на Профи.ру
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Обучение с Александром
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Английский и Французский языки для взрослых и студентов. Помогу преодолеть языковой барьер, систематизировать знания и уверенно заговорить.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <a
                href="https://t.me/alxndr_artnn"
                target="_blank"
                rel="noreferrer"
                className="bg-sky-500 hover:bg-sky-400 text-white font-medium text-xs px-4 py-2 rounded-xl transition-colors inline-flex items-center gap-1.5"
              >
                <span>Telegram: @alxndr_artnn</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={onOpenBookingModal}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs px-4 py-2 rounded-xl transition-colors border border-slate-700"
              >
                Записаться на занятие
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Platform */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
            <Video className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg text-white">Где проходят занятия?</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Уроки проходят через сервис <strong>{r.platform}</strong> с демонстрацией экрана. Установка сторонних программ не требуется — достаточно просто зайти по ссылке.
          </p>
          <div className="text-xs text-sky-400/90 bg-sky-500/10 p-3 rounded-xl border border-sky-500/20">
            💡 Включать камеру не обязательно — главное, чтобы вам было комфортно во время уроков.
          </div>
        </div>

        {/* Card 2: Approach */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg text-white">Как строится учебный процесс?</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            {r.methodology}
          </p>
          <p className="text-xs text-slate-400 italic pt-1">
            «Моя задача — дать систему, исправить ошибки и разговорить. 70% успеха — это ваша самостоятельная работа.»
          </p>
        </div>

        {/* Card 3: Target Levels */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg text-white">Уровень подготовки</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Активное общение на английском или французском языке рассчитано на учеников с уровнем <strong>{r.targetLevels}</strong>.
          </p>
          <ul className="text-xs text-slate-400 space-y-1.5 pt-1">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Развитие разговорных навыков и правильного произношения</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Устранение пробелов в грамматике и расширение словарного запаса</span>
            </li>
          </ul>
        </div>

        {/* Card 4: Rescheduling & Vacation */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <PauseCircle className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg text-white">Пропуски и заморозка</h3>
          <div className="space-y-2 text-sm text-slate-300">
            <p>
              <strong>Пропуск урока:</strong> Если предупреждаете о пропуске заранее, подбирается альтернативное время на той же неделе.
            </p>
            <p>
              <strong>Отпуск:</strong> Вы можете заморозить абонемент на время отпуска — уроки не сгорят!
            </p>
          </div>
        </div>

      </div>

      {/* Step by Step Enrollment Process */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h3 className="text-xl sm:text-2xl font-bold text-white">Как записаться и начать занятия?</h3>
          <p className="text-xs text-slate-400 mt-1">Процесс записи максимально простой и понятный</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TEACHING_DATA.enrollmentSteps.map((s) => (
            <div key={s.step} className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5 relative space-y-2">
              <div className="w-8 h-8 rounded-xl bg-sky-500 text-slate-950 font-extrabold text-sm flex items-center justify-center">
                {s.step}
              </div>
              <h4 className="font-bold text-white text-base pt-1">{s.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{s.details}</p>
            </div>
          ))}
        </div>

        {/* Payment Contacts Banner */}
        <div className="bg-sky-500/10 border border-sky-500/20 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider block">
              Реквизиты для оплаты (СБП)
            </span>
            <p className="font-bold text-white text-lg mt-0.5">
              +7 (910) 040-35-35 <span className="text-slate-400 font-normal text-sm">(Александр А., ВТБ)</span>
            </p>
          </div>
          <a
            href="https://t.me/alxndr_artnn"
            target="_blank"
            rel="noreferrer"
            className="bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs px-5 py-3 rounded-xl transition-colors shadow-md whitespace-nowrap"
          >
            Отправить чек в Telegram (@alxndr_artnn)
          </a>
        </div>
      </div>

    </div>
  );
};
