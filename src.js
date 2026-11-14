
'use strict';

const $ = id => document.getElementById(id);

const pages = ['homePage', 'soilPage', 'rockPage', 'uuPage'];

let currentLanguage = 'fa';
let lastCalculatedData = null;

const translations = {
  fa: {
    subtitle:'نرم‌افزار تخصصی آزمایش سه‌محوری',
    mainTitle:'آزمایش سه‌محوری خاک و سنگ',
    mainDesc:'محیط تخصصی انجام محاسبات و تحلیل نتایج آزمایشگاهی',
    selectMaterial:'انتخاب نوع مصالح',
    soil:'آزمایش سه‌محوری خاک',
    soilDesc:'بررسی رفتار مقاومتی خاک',
    rock:'آزمایش سه‌محوری سنگ',
    rockDesc:'بررسی مقاومت فشاری سنگ',
    featuresTitle:'امکانات نرم‌افزار',
    feature1:'محاسبات مهندسی',
    feature2:'نمودارهای تخصصی',
    feature3:'گزارش آزمایش',
    feature4:'ذخیره اطلاعات',
    back:'بازگشت',
    soilMethods:'انتخاب روش آزمایش خاک',
    uuDesc:'تحکیم‌نیافته و زهکشی‌نشده',
    cuDesc:'تحکیم‌یافته و زهکشی‌نشده',
    cdDesc:'تحکیم‌یافته و زهکشی‌شده',
    rockTitle:'آزمایش سه‌محوری سنگ',
    rockMethodDesc:'استاندارد ASTM D7012',
    rockComing:'بخش آزمایش سنگ در مرحله توسعه قرار دارد.',
    uuTitle:'آزمایش سه‌محوری UU',
    uuSubtitle:'تحکیم‌نیافته و زهکشی‌نشده',
    calculationBasis:'مبنای محاسبات',
    basisText:'اصلاح سطح مقطع با فرض حجم ثابت در مرحله برش انجام می‌شود.',
    commonInfo:'۱. مشخصات مشترک نمونه‌ها',
    commonHint:'ابعاد اولیه برای هر سه نمونه یکسان در نظر گرفته شده است.',
    specimenInfo:'۲. مشخصات سه نمونه آزمایش',
    specimen1:'نمونه اول',
    specimen2:'نمونه دوم',
    specimen3:'نمونه سوم',
    sampleName:'شناسه نمونه',
    diameter:'قطر اولیه (mm)',
    height:'ارتفاع اولیه (mm)',
    confining:'فشار محصورکننده (kPa)',
    readings:'۳. قرائت‌های آزمایش',
    readingHint:'نیروی محوری هر سه نمونه را در ردیف تغییر طول مربوط وارد کنید.',
    deformation:'تغییر طول (mm)',
    load1:'نیروی نمونه اول (kN)',
    load2:'نیروی نمونه دوم (kN)',
    load3:'نیروی نمونه سوم (kN)',
    calculate:'محاسبه نتایج',
    resultsTitle:'۴. نتایج محاسبات',
    calculatedTable:'جدول نتایج محاسباتی',
    strain:'کرنش (%)',
    area:'سطح مقطع (mm²)',
    q1:'تنش انحرافی ۱ (kPa)',
    q2:'تنش انحرافی ۲ (kPa)',
    q3:'تنش انحرافی ۳ (kPa)',
    stressStrainChartTitle:'نمودار تنش انحرافی–کرنش محوری',
    mohrChartTitle:'سه دایره موهر در لحظه گسیختگی',
    strengthParameters:'پارامترهای مقاومت برشی',
    peakDeviator:'تنش انحرافی اوج',
    undrainedStrength:'مقاومت برشی زهکشی‌نشده',
    peakStrain:'کرنش در نقطه اوج',
    majorStress:'تنش اصلی بزرگ در اوج',
    cohesion:'چسبندگی ظاهری c',
    frictionAngle:'زاویه اصطکاک داخلی φ',
    print:'چاپ نتایج',
    footer:'نرم‌افزار تخصصی مهندسی ژئوتکنیک',
    invalidGeometry:'قطر و ارتفاع باید مقادیر مثبت باشند.',
    invalidPressure:'فشار محصورکننده باید عددی و غیرمنفی باشد.',
    invalidLoads:'لطفاً تمام نیروهای محوری سه نمونه را کامل و صحیح وارد کنید.',
    invalidNames:'شناسه هر سه نمونه باید مشخص باشد.',
    noRows:'قرائت معتبری برای محاسبه وجود ندارد.',
    readingLimit:'حداکثر تغییر طول مجاز: ',
    readingLimitEnd:' میلی‌متر (۱۳٪ ارتفاع نمونه)',
    resultNote:'پارامترهای c و φ از برازش خط پوش گسیختگی بر اساس سه نمونه محاسبه شده‌اند. تفسیر نتایج باید با توجه به شرایط آزمایش و فرضیات مکانیک خاک انجام شود.',
    specimen:'نمونه',
    peakQ:'تنش انحرافی اوج',
    su:'مقاومت برشی زهکشی‌نشده',
    peakStrainLabel:'کرنش اوج',
    sigma1:'تنش اصلی بزرگ',
    noRegression:'برای برازش خط گسیختگی، داده‌های سه نمونه باید فشار محصورکننده متفاوت داشته باشند.'
  },

  en: {
    subtitle:'Professional Triaxial Testing Software',
    mainTitle:'Soil and Rock Triaxial Testing',
    mainDesc:'Professional environment for laboratory calculations and analysis.',
    selectMaterial:'Select Material',
    soil:'Soil Triaxial Test',
    soilDesc:'Evaluation of soil strength',
    rock:'Rock Triaxial Test',
    rockDesc:'Evaluation of rock compressive strength',
    featuresTitle:'Software Features',
    feature1:'Engineering Calculations',
    feature2:'Technical Charts',
    feature3:'Test Reports',
    feature4:'Data Storage',
    back:'Back',
    soilMethods:'Select Soil Test Method',
    uuDesc:'Unconsolidated Undrained',
    cuDesc:'Consolidated Undrained',
    cdDesc:'Consolidated Drained',
    rockTitle:'Rock Triaxial Test',
    rockMethodDesc:'ASTM D7012 Standard',
    rockComing:'The rock testing module is under development.',
    uuTitle:'UU Triaxial Test',
    uuSubtitle:'Unconsolidated Undrained',
    calculationBasis:'Calculation Basis',
    basisText:'Cross-sectional area correction is based on the constant-volume assumption during shearing.',
    commonInfo:'1. Common Specimen Dimensions',
    commonHint:'The same initial dimensions are used for all three specimens.',
    specimenInfo:'2. Three Test Specimens',
    specimen1:'Specimen 1',
    specimen2:'Specimen 2',
    specimen3:'Specimen 3',
    sampleName:'Specimen ID',
    diameter:'Initial Diameter (mm)',
    height:'Initial Height (mm)',
    confining:'Confining Pressure (kPa)',
    readings:'3. Test Readings',
    readingHint:'Enter the axial load for all three specimens at each displacement.',
    deformation:'Displacement (mm)',
    load1:'Specimen 1 Load (kN)',
    load2:'Specimen 2 Load (kN)',
    load3:'Specimen 3 Load (kN)',
    calculate:'Calculate Results',
    resultsTitle:'4. Calculation Results',
    calculatedTable:'Calculated Results Table',
    strain:'Strain (%)',
    area:'Corrected Area (mm²)',
    q1:'Deviator Stress 1 (kPa)',
    q2:'Deviator Stress 2 (kPa)',
    q3:'Deviator Stress 3 (kPa)',
    stressStrainChartTitle:'Deviator Stress–Axial Strain',
    mohrChartTitle:'Three Mohr Circles at Failure',
    strengthParameters:'Shear Strength Parameters',
    peakDeviator:'Peak Deviator Stress',
    undrainedStrength:'Undrained Shear Strength',
    peakStrain:'Peak Strain',
    majorStress:'Peak Major Principal Stress',
    cohesion:'Apparent Cohesion c',
    frictionAngle:'Friction Angle φ',
    print:'Print Results',
    footer:'Professional Geotechnical Engineering Software',
    invalidGeometry:'Diameter and height must be positive.',
    invalidPressure:'Confining pressure must be a valid non-negative number.',
    invalidLoads:'Please enter all three axial load columns correctly.',
    invalidNames:'All three specimen IDs are required.',
    noRows:'No valid readings are available.',
    readingLimit:'Maximum displacement: ',
    readingLimitEnd:' mm (13% of specimen height)',
    resultNote:'Parameters c and φ are obtained by fitting a failure envelope to the three specimens. Interpret results with regard to test conditions and soil mechanics assumptions.',
    specimen:'Specimen',
    peakQ:'Peak Deviator Stress',
    su:'Undrained Shear Strength',
    peakStrainLabel:'Peak Strain',
    sigma1:'Major Principal Stress',
    noRegression:'The three specimens must have different confining pressures for failure-envelope regression.'
  }
};

function t(key) {
  return translations[currentLanguage][key] ?? key;
}

function englishNumber(value, digits = 6) {
  if (!Number.isFinite(Number(value))) return '—';
  return Number(value).toFixed(digits).replace(/\.?0+$/, '');
}

function normalizeNumber(value) {
  return String(value)
    .replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
    .replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
    .replace(/٫/g, '.')
    .replace(/٬/g, '')
    .replace(/,/g, '.')
    .trim();
}

function readNumber(id) {
  const value = normalizeNumber($(id).value);
  if (value === '') return NaN;
  return Number(value);
}

function showPage(id) {
  pages.forEach(page => $(page).classList.add('hidden'));
  $(id).classList.remove('hidden');
  window.scrollTo(0, 0);
}

function setLanguage(language) {
  currentLanguage = language;

  document.documentElement.lang = language;
  document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';

  document.querySelectorAll('[data-i18n]').forEach(element => {
    element.textContent = t(element.dataset.i18n);
  });

  $('languageBtn').textContent = language === 'fa' ? 'EN' : 'FA';

  if (lastCalculatedData) {
    renderResults(lastCalculatedData);
  }
}

function invalidateResults() {
  $('results').classList.add('hidden');
  lastCalculatedData = null;
}

function makeDisplacements(height) {
  const limit = height * 0.13;
  const values = [0.1, 0.2, 0.3, 0.4, 0.5];

  for (let value = 1; value <= limit + 1e-9; value += 0.5) {
    values.push(value);
  }

  const filtered = values
    .filter(value => value <= limit + 1e-9)
    .map(value => Number(value.toFixed(6)));

  if (!filtered.length || Math.abs(filtered[filtered.length - 1] - limit) > 1e-6) {
    filtered.push(Number(limit.toFixed(6)));
  }

  return [...new Set(filtered)].sort((a, b) => a - b);
}

function buildReadingTable() {
  const height = readNumber('height');

  if (!Number.isFinite(height) || height <= 0) {
    $('readingsBody').innerHTML = '';
    $('readingInfo').textContent = '';
    return;
  }

  const displacements = makeDisplacements(height);
  const fragment = document.createDocumentFragment();

  displacements.forEach((displacement, index) => {
    const row = document.createElement('tr');

    const fixedCell = document.createElement('td');
    fixedCell.className = 'fixed-column';
    fixedCell.textContent = englishNumber(displacement);
    fixedCell.dataset.displacement = String(displacement);
    row.appendChild(fixedCell);

    for (let specimen = 1; specimen <= 3; specimen++) {
      const cell = document.createElement('td');
      const input = document.createElement('input');

      input.type = 'text';
      input.inputMode = 'decimal';
      input.autocomplete = 'off';
      input.className = `axial-load load-${specimen}`;
      input.dir = 'ltr';
      input.placeholder = '0.000000';
      input.dataset.specimen = String(specimen);
      input.dataset.row = String(index);

      input.addEventListener('input', () => {
        input.value = normalizeNumber(input.value);
        invalidateResults();
      });

      cell.appendChild(input);
      row.appendChild(cell);
    }

    fragment.appendChild(row);
  });

  $('readingsBody').replaceChildren(fragment);

  $('readingInfo').textContent =
    t('readingLimit') + englishNumber(height * 0.13) + t('readingLimitEnd');
}

function calculateRegression(specimens) {
  const points = specimens.map(specimen => ({
    x: specimen.confiningPressure,
    y: specimen.peak.sigma1
  }));

  const meanX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
  const meanY = points.reduce((sum, p) => sum + p.y, 0) / points.length;

  const denominator = points.reduce(
    (sum, p) => sum + Math.pow(p.x - meanX, 2), 0
  );

  if (denominator < 1e-12) return null;

  const slope = points.reduce(
    (sum, p) => sum + (p.x - meanX) * (p.y - meanY), 0
  ) / denominator;

  const intercept = meanY - slope * meanX;

  const sinPhi = (slope - 1) / (slope + 1);

  if (!Number.isFinite(sinPhi) || Math.abs(sinPhi) > 1) {
    return null;
  }

  const phi = Math.asin(sinPhi);
  const cohesion = intercept * (1 - sinPhi) / (2 * Math.cos(phi));

  const total = points.reduce(
    (sum, p) => sum + Math.pow(p.y - meanY, 2), 0
  );

  const residual = points.reduce(
    (sum, p) => sum + Math.pow(p.y - (slope * p.x + intercept), 2), 0
  );

  return {
    slope,
    intercept,
    phiDeg: phi * 180 / Math.PI,
    cohesion,
    r2: total > 1e-12 ? 1 - residual / total : 1
  };
}

function calculateUU() {
  const diameter = readNumber('diameter');
  const height = readNumber('height');

  if (!Number.isFinite(diameter) ||
      !Number.isFinite(height) ||
      diameter <= 0 ||
      height <= 0) {
    alert(t('invalidGeometry'));
    return;
  }

  const specimens = [];

  for (let i = 1; i <= 3; i++) {
    const name = $('sampleName' + i).value.trim();
    const confining = readNumber('confining' + i);

    if (!name) {
      alert(t('invalidNames'));
      return;
    }

    if (!Number.isFinite(confining) || confining < 0) {
      alert(t('invalidPressure'));
      return;
    }

    specimens.push({
      index: i,
      name,
      confiningPressure: confining,
      loads: []
    });
  }

  const rows = [...document.querySelectorAll('#readingsBody tr')];

  if (!rows.length) {
    alert(t('noRows'));
    return;
  }

  const initialArea = Math.PI * diameter * diameter / 4;
  const readings = [];

  for (const row of rows) {
    const displacement = Number(row.cells[0].dataset.displacement);
    const strain = displacement / height;

    if (strain > 0.1300001) continue;

    const correctedArea = initialArea / (1 - strain);
    const specimenLoads = [];

    for (let i = 1; i <= 3; i++) {
      const input = row.querySelector(`.load-${i}`);
      const loadText = normalizeNumber(input.value);

      if (loadText === '') {
        alert(t('invalidLoads'));
        input.focus();
        return;
      }

      const load = Number(loadText);

      if (!Number.isFinite(load) || load < 0) {
        alert(t('invalidLoads'));
        input.focus();
        return;
      }

      const deviatorStress = load * 1000000 / correctedArea;
      const sigma1 = specimens[i - 1].confiningPressure + deviatorStress;

      const item = {
        displacement,
        strain,
        correctedArea,
        load,
        deviatorStress,
        sigma1
      };

      specimens[i - 1].loads.push(item);
      specimenLoads.push(item);
    }

    readings.push({
      displacement,
      strain,
      correctedArea,
      specimens: specimenLoads
    });
  }

  if (!readings.length) {
    alert(t('noRows'));
    return;
  }

  specimens.forEach(specimen => {
    specimen.peak = specimen.loads.reduce((max, item) =>
      item.deviatorStress > max.deviatorStress ? item : max
    );

    specimen.su = specimen.peak.deviatorStress / 2;
  });

  const regression = calculateRegression(specimens);

  lastCalculatedData = {
    diameter,
    height,
    initialArea,
    readings,
    specimens,
    regression
  };

  renderResults(lastCalculatedData);

  $('results').classList.remove('hidden');
  $('results').scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}

function renderResults(data) {
  const { readings, specimens, regression } = data;

  $('specimenResults').innerHTML = specimens.map(specimen => `
    <div class="specimen-result-card">
      <h4>${escapeHTML(specimen.name)}</h4>
      <div class="result-line">
        <span>${t('peakQ')}</span>
        <strong>${englishNumber(specimen.peak.deviatorStress)}</strong>
      </div>
      <div class="result-line">
        <span>${t('su')}</span>
        <strong>${englishNumber(specimen.su)}</strong>
      </div>
      <div class="result-line">
        <span>${t('peakStrain')}</span>
        <strong>${englishNumber(specimen.peak.strain * 100)}%</strong>
      </div>
      <div class="result-line">
        <span>${t('sigma1')}</span>
        <strong>${englishNumber(specimen.peak.sigma1)}</strong>
      </div>
    </div>
  `).join('');

  $('resultsBody').innerHTML = readings.map(item => `
    <tr>
      <td>${englishNumber(item.displacement)}</td>
      <td>${englishNumber(item.strain * 100)}</td>
      <td>${englishNumber(item.correctedArea)}</td>
      <td>${englishNumber(item.specimens[0].deviatorStress)}</td>
      <td>${englishNumber(item.specimens[1].deviatorStress)}</td>
      <td>${englishNumber(item.specimens[2].deviatorStress)}</td>
    </tr>
  `).join('');

  if (regression) {
    $('strengthParameters').innerHTML = `
      <div class="parameter">
        <span>${t('cohesion')}</span>
        <strong>${englishNumber(regression.cohesion)} kPa</strong>
      </div>
      <div class="parameter">
        <span>${t('frictionAngle')}</span>
        <strong>${englishNumber(regression.phiDeg)}°</strong>
      </div>
      <div class="parameter">
        <span>R²</span>
        <strong>${englishNumber(regression.r2)}</strong>
      </div>
    `;
  } else {
    $('strengthParameters').innerHTML =
      `<p class="hint">${t('noRegression')}</p>`;
  }

  $('resultNote').textContent = t('resultNote');

  renderStressStrainChart(specimens);
  renderMohrChart(specimens, regression);
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    '&':'&amp;',
    '<':'&lt;',
    '>':'&gt;',
    '"':'&quot;',
    "'":'&#39;'
  })[char]);
}

function svgElement(width, height, content) {
  return `
    <svg xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 ${width} ${height}"
      role="img" aria-label="Engineering chart">
      <rect width="${width}" height="${height}" fill="#ffffff"/>
      ${content}
    </svg>
  `;
}

function renderStressStrainChart(specimens) {
  const width = 760;
  const height = 390;
  const left = 75;
  const right = 25;
  const top = 30;
  const bottom = 65;
  const plotW = width - left - right;
  const plotH = height - top - bottom;

  const maxX = Math.max(
    ...specimens.flatMap(s => s.loads.map(p => p.strain * 100))
  ) * 1.08 || 1;

  const maxY = Math.max(
    ...specimens.flatMap(s => s.loads.map(p => p.deviatorStress))
  ) * 1.12 || 1;

  const x = value => left + (value / maxX) * plotW;
  const y = value => top + plotH - (value / maxY) * plotH;

  let content = '';

  for (let i = 0; i <= 5; i++) {
    const gx = left + plotW * i / 5;
    const gy = top + plotH * i / 5;

    content += `
      <line x1="${gx}" y1="${top}" x2="${gx}" y2="${top + plotH}"
        stroke="#e5e7eb" stroke-width="1"/>
      <line x1="${left}" y1="${gy}" x2="${left + plotW}" y2="${gy}"
        stroke="#e5e7eb" stroke-width="1"/>
      <text x="${gx}" y="${top + plotH + 23}" text-anchor="middle"
        font-size="11" fill="#333">${englishNumber(maxX * i / 5, 2)}</text>
      <text x="${left - 10}" y="${gy + 4}" text-anchor="end"
        font-size="11" fill="#333">${englishNumber(maxY * (5 - i) / 5, 1)}</text>
    `;
  }

  content += `
    <line x1="${left}" y1="${top}" x2="${left}" y2="${top + plotH}"
      stroke="#333" stroke-width="1.5"/>
    <line x1="${left}" y1="${top + plotH}" x2="${left + plotW}"
      y2="${top + plotH}" stroke="#333" stroke-width="1.5"/>
    <text x="${left + plotW / 2}" y="${height - 12}"
      text-anchor="middle" font-size="13" fill="#111">
      ${currentLanguage === 'fa' ? 'Axial strain (%) / کرنش محوری' : 'Axial strain (%)'}
    </text>
    <text x="17" y="${top + plotH / 2}"
      transform="rotate(-90 17 ${top + plotH / 2})"
      text-anchor="middle" font-size="13" fill="#111">
      ${currentLanguage === 'fa' ? 'Deviator stress (kPa) / تنش انحرافی' : 'Deviator stress (kPa)'}
    </text>
  `;

  const colors = ['#1677c8', '#e07825', '#23945d'];

  specimens.forEach((specimen, index) => {
    const points = specimen.loads.map(p =>
      `${x(p.strain * 100)},${y(p.deviatorStress)}`
    ).join(' ');

    content += `
      <polyline points="${points}" fill="none"
        stroke="${colors[index]}" stroke-width="2.5"
        stroke-linejoin="round" stroke-linecap="round"/>
    `;

    specimen.loads.forEach(p => {
      content += `
        <circle cx="${x(p.strain * 100)}" cy="${y(p.deviatorStress)}"
          r="3" fill="${colors[index]}"/>
      `;
    });

    content += `
      <line x1="${width - 220}" y1="${25 + index * 20}"
        x2="${width - 195}" y2="${25 + index * 20}"
        stroke="${colors[index]}" stroke-width="3"/>
      <text x="${width - 188}" y="${29 + index * 20}"
        font-size="11" fill="#222">${escapeHTML(specimen.name)}</text>
    `;
  });

  $('uuStressStrainChart').innerHTML = svgElement(width, height, content);
}

function renderMohrChart(specimens, regression) {
  const width = 760;
  const height = 430;
  const left = 75;
  const right = 30;
  const top = 30;
  const bottom = 65;
  const plotW = width - left - right;
  const plotH = height - top - bottom;

  const circles = specimens.map(specimen => {
    const sigma3 = specimen.confiningPressure;
    const sigma1 = specimen.peak.sigma1;
    return {
      name: specimen.name,
      center: (sigma1 + sigma3) / 2,
      radius: (sigma1 - sigma3) / 2
    };
  });

  const maxX = Math.max(...circles.map(c => c.center + c.radius)) * 1.12 || 1;
  const maxY = Math.max(...circles.map(c => c.radius)) * 1.25 || 1;
  const scale = Math.min(plotW / maxX, plotH / maxY);

  const usedW = maxX * scale;
  const usedH = maxY * scale;
  const originX = left;
  const originY = top + plotH;

  const x = value => originX + value * scale;
  const y = value => originY - value * scale;

  let content = '';

  for (let i = 0; i <= 5; i++) {
    const gx = originX + usedW * i / 5;
    const gy = originY - usedH * i / 5;

    content += `
      <line x1="${gx}" y1="${top}" x2="${gx}" y2="${originY}"
        stroke="#e5e7eb"/>
      <line x1="${originX}" y1="${gy}" x2="${originX + usedW}" y2="${gy}"
        stroke="#e5e7eb"/>
      <text x="${gx}" y="${originY + 22}" text-anchor="middle"
        font-size="10" fill="#333">${englishNumber(maxX * i / 5, 0)}</text>
      <text x="${originX - 9}" y="${gy + 4}" text-anchor="end"
        font-size="10" fill="#333">${englishNumber(maxY * i / 5, 0)}</text>
    `;
  }

  content += `
    <line x1="${originX}" y1="${top}" x2="${originX}" y2="${originY}"
      stroke="#333" stroke-width="1.5"/>
    <line x1="${originX}" y1="${originY}" x2="${originX + usedW}"
      y2="${originY}" stroke="#333" stroke-width="1.5"/>
    <text x="${originX + usedW / 2}" y="${height - 12}"
      text-anchor="middle" font-size="13" fill="#111">
      Normal stress (kPa) / تنش نرمال
    </text>
    <text x="17" y="${top + plotH / 2}"
      transform="rotate(-90 17 ${top + plotH / 2})"
      text-anchor="middle" font-size="13" fill="#111">
      Shear stress (kPa) / تنش برشی
    </text>
  `;

  const colors = ['#1677c8', '#e07825', '#23945d'];

  circles.forEach((circle, index) => {
    const cx = x(circle.center);
    const cy = y(0);
    const r = circle.radius * scale;

    content += `
      <circle cx="${cx}" cy="${cy}" r="${r}"
        fill="${colors[index]}" fill-opacity="0.08"
        stroke="${colors[index]}" stroke-width="2.5"/>
      <text x="${cx}" y="${Math.max(top + 14, cy - r - 7)}"
        text-anchor="middle" font-size="11" fill="${colors[index]}">
        ${escapeHTML(circle.name)}
      </text>
    `;
  });

  if (regression) {
    const phi = regression.phiDeg * Math.PI / 180;
    const intercept = regression.cohesion * Math.cos(phi);
    const endX = maxX;
    const endY = Math.max(0, intercept + endX * Math.tan(phi));

    content += `
      <line x1="${x(0)}" y1="${y(intercept)}"
        x2="${x(endX)}" y2="${y(endY)}"
        stroke="#a12c36" stroke-width="2.5" stroke-dasharray="8 5"/>
      <text x="${x(endX) - 8}" y="${y(endY) - 10}"
        text-anchor="end" font-size="11" fill="#a12c36">
        Failure envelope
      </text>
    `;
  }

  $('uuMohrChart').innerHTML = svgElement(width, height, content);
}

// Navigation
$('soilBtn').addEventListener('click', () => showPage('soilPage'));
$('rockBtn').addEventListener('click', () => showPage('rockPage'));
$('soilBack').addEventListener('click', () => showPage('homePage'));
$('rockBack').addEventListener('click', () => showPage('homePage'));
$('uuBack').addEventListener('click', () => showPage('soilPage'));

document.querySelectorAll('[data-method]').forEach(button => {
  button.addEventListener('click', () => {
    if (button.dataset.method === 'UU') {
      showPage('uuPage');
    } else {
      alert(currentLanguage === 'fa'
        ? 'این روش در مرحله بعد توسعه داده می‌شود.'
        : 'This method will be developed in a later stage.');
    }
  });
});

// Rebuild the fixed displacement schedule when specimen height changes.
$('height').addEventListener('input', () => {
  $('height').value = normalizeNumber($('height').value);
  buildReadingTable();
  invalidateResults();
});

$('diameter').addEventListener('input', () => {
  $('diameter').value = normalizeNumber($('diameter').value);
  invalidateResults();
});

['confining1', 'confining2', 'confining3',
 'sampleName1', 'sampleName2', 'sampleName3'].forEach(id => {
  $(id).addEventListener('input', invalidateResults);
});

document.querySelectorAll('.numeric-input').forEach(input => {
  input.addEventListener('input', () => {
    input.value = normalizeNumber(input.value);
  });
});

$('calculate').addEventListener('click', calculateUU);

$('printResults').addEventListener('click', () => {
  if (!lastCalculatedData) {
    alert(t('noRows'));
    return;
  }
  window.print();
});

$('languageBtn').addEventListener('click', () => {
  setLanguage(currentLanguage === 'fa' ? 'en' : 'fa');
});

buildReadingTable();
setLanguage('fa');
