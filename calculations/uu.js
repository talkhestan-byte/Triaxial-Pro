
/*
 * Triaxial Pro — UU Calculation Engine
 * Units:
 *   Diameter, height, displacement: mm
 *   Confining pressure: kPa
 *   Axial load: kN
 *   Corrected stresses: kPa
 *
 * Positive displacement means axial shortening.
 * Constant-volume area correction is an assumption for undrained,
 * saturated specimens. Verify its suitability for each test.
 */

'use strict';

const UU = (() => {
  const PI = Math.PI;

  function number(value, name) {
    const n = Number(value);
    if (!Number.isFinite(n)) {
      throw new Error(`${name}: مقدار واردشده معتبر نیست.`);
    }
    return n;
  }

  function positive(value, name) {
    const n = number(value, name);
    if (n <= 0) {
      throw new Error(`${name}: مقدار باید بزرگ‌تر از صفر باشد.`);
    }
    return n;
  }

  function calculate(input) {
    const diameter = positive(input.diameter, 'قطر نمونه');
    const height = positive(input.height, 'ارتفاع نمونه');
    const confiningPressure = number(
      input.confiningPressure,
      'فشار محصورکننده'
    );

    if (confiningPressure < 0) {
      throw new Error('فشار محصورکننده نمی‌تواند منفی باشد.');
    }

    const readings = input.readings;

    if (!Array.isArray(readings) || readings.length < 2) {
      throw new Error('حداقل دو قرائت بار و تغییر طول لازم است.');
    }

    const initialArea = PI * diameter * diameter / 4;

    const areaCorrection = input.areaCorrection !== false;
    const loadCorrectionN = number(
      input.loadCorrectionN ?? 0,
      'تصحیح بار'
    );

    const maxStrain = input.maxStrain == null
      ? 0.15
      : positive(input.maxStrain, 'حداکثر کرنش');

    if (maxStrain > 0.30) {
      throw new Error('حداکثر کرنش واردشده غیرعادی است.');
    }

    const rows = readings.map((reading, index) => {
      const displacement = number(
        reading.displacement,
        `تغییر طول ردیف ${index + 1}`
      );

      const loadKN = number(
        reading.load,
        `بار ردیف ${index + 1}`
      );

      const strain = displacement / height;

      if (strain < 0) {
        throw new Error(
          `تغییر طول ردیف ${index + 1} منفی است. قرارداد علامت را بررسی کنید.`
        );
      }

      if (strain >= 1) {
        throw new Error('کرنش محوری باید کمتر از 100 درصد باشد.');
      }

      const correctedLoadN = loadKN * 1000 - loadCorrectionN;

      if (correctedLoadN < 0) {
        throw new Error(
          `بار تصحیح‌شده ردیف ${index + 1} منفی شده است.`
        );
      }

      // Constant-volume area correction:
      // A = A0 / (1 - axial strain)
      const correctedArea = areaCorrection
        ? initialArea / (1 - strain)
        : initialArea;

      // N/mm² = MPa; multiply by 1000 to obtain kPa.
      const deviatorStress =
        correctedLoadN / correctedArea * 1000;

      const majorPrincipalStress =
        confiningPressure + deviatorStress;

      return {
        index: index + 1,
        displacement,
        loadKN,
        correctedLoadN,
        strain,
        strainPercent: strain * 100,
        initialArea,
        correctedArea,
        deviatorStress,
        confiningPressure,
        majorPrincipalStress
      };
    });

    // Determine the peak deviator stress.
    let peak = rows[0];

    for (const row of rows) {
      if (row.deviatorStress > peak.deviatorStress) {
        peak = row;
      }
    }

    // Find the first reading at or beyond the selected strain limit.
    const strainLimitRow = rows.find(
      row => row.strain >= maxStrain
    );

    // Failure criterion:
    // Use the earlier of the observed peak and the strain limit.
    // If the peak occurs after the limit, use the limit reading.
    let failure = peak;
    let failureCriterion = 'peak_deviator_stress';

    if (
      strainLimitRow &&
      strainLimitRow.index < peak.index
    ) {
      failure = strainLimitRow;
      failureCriterion = 'axial_strain_limit';
    }

    const undrainedShearStrength =
      failure.deviatorStress / 2;

    return {
      method: 'UU',
      initialArea,
      confiningPressure,
      areaCorrection,
      maxStrain,
      readings: rows,
      peak,
      failure,
      failureCriterion,
      results: {
        failureStrainPercent: failure.strainPercent,
        failureLoadKN: failure.loadKN,
        failureArea: failure.correctedArea,
        failureDeviatorStress: failure.deviatorStress,
        majorPrincipalStress: failure.majorPrincipalStress,
        minorPrincipalStress: confiningPressure,
        undrainedShearStrength
      },
      warnings: [
        'تصحیح سطح بر اساس فرض حجم ثابت انجام شده است.',
        'مقاومت برشی su=qf/2 فقط با فرض تحلیل تنش کل و φu=0 قابل استفاده است.',
        'تصحیحات غشاء، اصطکاک پیستون و کالیبراسیون دستگاه باید جداگانه بررسی شوند.',
        'برای تعیین پارامترهای مقاومت، نتایج چند نمونه با فشارهای محصورکننده متفاوت لازم است.'
      ]
    };
  }

  return { calculate };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = UU;
}

if (typeof window !== 'undefined') {
  window.TriaxialUU = UU;
}
