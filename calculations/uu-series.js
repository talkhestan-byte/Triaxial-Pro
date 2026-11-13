
/*
 * Triaxial Pro — UU Series Analysis
 * Total-stress Mohr-Coulomb regression
 *
 * Requires calculations/uu.js to be loaded.
 */

'use strict';

const UUSeries = (() => {

  function analyze(specimens, options = {}) {
    if (!Array.isArray(specimens) || specimens.length < 3) {
      throw new Error(
        'برای تحلیل پوش گسیختگی حداقل سه نمونه لازم است.'
      );
    }

    if (!window.TriaxialUU) {
      throw new Error('موتور محاسبات UU بارگذاری نشده است.');
    }

    const tests = specimens.map((specimen, index) => {
      const result = window.TriaxialUU.calculate(specimen);

      return {
        specimen: index + 1,
        confiningPressure: result.results.minorPrincipalStress,
        majorPrincipalStress: result.results.majorPrincipalStress,
        deviatorStress: result.results.failureDeviatorStress,
        shearStrength: result.results.undrainedShearStrength,
        failureStrain: result.results.failureStrainPercent,
        result
      };
    });

    const x = tests.map(t => t.confiningPressure);
    const y = tests.map(t => t.majorPrincipalStress);

    const meanX = x.reduce((a, b) => a + b, 0) / x.length;
    const meanY = y.reduce((a, b) => a + b, 0) / y.length;

    const numerator = x.reduce(
      (sum, value, i) =>
        sum + (value - meanX) * (y[i] - meanY),
      0
    );

    const denominator = x.reduce(
      (sum, value) => sum + (value - meanX) ** 2,
      0
    );

    if (denominator === 0) {
      throw new Error(
        'فشارهای محصورکننده نمونه‌ها باید متفاوت باشند.'
      );
    }

    const slope = numerator / denominator;
    const intercept = meanY - slope * meanX;

    if (slope <= 0) {
      throw new Error('شیب خط برازش معتبر نیست.');
    }

    const sinPhi = (slope - 1) / (slope + 1);

    if (sinPhi < -1 || sinPhi > 1) {
      throw new Error('پارامتر زاویه اصطکاک قابل محاسبه نیست.');
    }

    const phiRadians = Math.asin(sinPhi);
    const phiDegrees = phiRadians * 180 / Math.PI;

    const cohesion =
      intercept * (1 - sinPhi) /
      (2 * Math.cos(phiRadians));

    const predicted = x.map(value => slope * value + intercept);

    const ssResidual = y.reduce(
      (sum, value, i) =>
        sum + (value - predicted[i]) ** 2,
      0
    );

    const ssTotal = y.reduce(
      (sum, value) => sum + (value - meanY) ** 2,
      0
    );

    const rSquared = ssTotal === 0
      ? 1
      : 1 - ssResidual / ssTotal;

    const undrainedStrengths = tests.map(
      t => t.shearStrength
    );

    const averageSu = undrainedStrengths.reduce(
      (a, b) => a + b,
      0
    ) / undrainedStrengths.length;

    const variance = undrainedStrengths.reduce(
      (sum, value) => sum + (value - averageSu) ** 2,
      0
    ) / undrainedStrengths.length;

    const standardDeviation = Math.sqrt(variance);

    const zeroPhi = options.assumePhiZero === true;

    return {
      method: 'UU_SERIES',
      numberOfSpecimens: tests.length,
      specimens: tests,

      mohrCoulomb: {
        slope,
        intercept,
        cohesion,
        frictionAngleDegrees: phiDegrees,
        rSquared
      },

      zeroPhiAnalysis: {
        enabled: zeroPhi,
        frictionAngleDegrees: zeroPhi ? 0 : null,
        undrainedShearStrength: zeroPhi ? averageSu : null,
        standardDeviation: zeroPhi
          ? standardDeviation
          : null
      },

      warnings: [
        'برازش خطی بر اساس تنش‌های اصلی کل انجام شده است.',
        'پارامترهای برازش‌شده به تعداد نمونه‌ها و گستره فشار محصورکننده وابسته‌اند.',
        'فرض φu=0 باید با توجه به اشباع، شرایط آزمایش و مبانی تحلیل انتخاب شود.',
        'ضریب تعیین بالا به‌تنهایی تضمین‌کننده اعتبار مهندسی مدل نیست.'
      ]
    };
  }

  return { analyze };

})();

if (typeof window !== 'undefined') {
  window.TriaxialUUSeries = UUSeries;
}
