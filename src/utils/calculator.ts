import { TEACHING_DATA } from "../data/teachingInfo";
import { CalculatePriceParams, CalculatedPriceResult } from "../types";

export function calculatePrice({
  lessonsPerWeek,
  durationMinutes,
  months,
}: CalculatePriceParams): CalculatedPriceResult {
  const pkg = TEACHING_DATA.monthlyPackages.find(
    (p) => p.count === lessonsPerWeek * 4
  ) || TEACHING_DATA.monthlyPackages[0];

  let baseMonthlyPrice = pkg.p60;
  if (durationMinutes === 90) baseMonthlyPrice = pkg.p90;
  if (durationMinutes === 120) baseMonthlyPrice = pkg.p120;

  const baseTotalPrice = baseMonthlyPrice * months;

  const discountObj = TEACHING_DATA.discounts.find((d) => d.months === months) || {
    discountPercent: 0,
  };
  const discountPercent = discountObj.discountPercent;

  const discountAmount = Math.round((baseTotalPrice * discountPercent) / 100);
  const finalTotalPrice = baseTotalPrice - discountAmount;
  const monthlyAveragePrice = Math.round(finalTotalPrice / months);
  const totalLessons = pkg.count * months;
  const singleLessonPrice = Math.round(finalTotalPrice / totalLessons);

  return {
    lessonsCountPerMonth: pkg.count,
    totalLessons,
    baseMonthlyPrice,
    baseTotalPrice,
    discountPercent,
    discountAmount,
    finalTotalPrice,
    monthlyAveragePrice,
    singleLessonPrice,
  };
}
