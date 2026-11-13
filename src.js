
'use strict';

const $ = id => document.getElementById(id);

const pages = ['homePage', 'soilPage', 'rockPage', 'uuPage'];

let currentLanguage = 'fa';
let readingCount = 0;

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
    basisText:'فرض حجم ثابت در برش و نمونه اشباع؛ اصلاح سطح مقطع بر این مبنا انجام می‌شود.',
    sampleInfo:'۱. مشخصات نمونه',
    sampleName:'شناسه نمونه',
    diameter:'قطر اولیه (mm)',
    height:'ارتفاع اولیه (mm)',
    confining:'فشار محصورکننده σ₃ (kPa)',
    readings:'۲. قرائت‌های آزمایش',
    readingHint:'تغییر طول و نیروی محوری هر قرائت را وارد کنید.',
    row:'ردیف',
    deformation:'تغییر طول (mm)',
    load:'نیروی محوری (kN)',
    delete:'حذف',
    addReading:'افزودن قرائت',
    calculate:'محاسبه نتایج',
    resultsTitle:'۳. نتایج محاسبات',
    peakDeviator:'بیشینه تنش انحرافی',
    undrainedStrength:'مقاومت برشی زهکشی‌نشده',
    peakStrain:'کرنش در نقطه اوج',
    majorStress:'تنش اصلی بزرگ در اوج',
    calculatedTable:'جدول نتایج قرائت‌ها',
    strain:'کرنش (%)',
    area:'سطح مقطع (mm²)',
    deviator:'تنش انحرافی (kPa)',
    major:'تنش اصلی بزرگ (kPa)',
    print:'چاپ نتایج',
    footer:'نرم‌افزار تخصصی مهندسی ژئوتکنیک',
    invalid:'لطفاً تمام اطلاعات را به‌درستی وارد کنید.',
    invalidGeometry:'قطر و ارتفاع باید مثبت باشند و تغییر طول نباید به ارتفاع اولیه برسد.',
    invalidPressure:'فشار محصورکننده نمی‌تواند منفی باشد.',
    noRows:'حداقل یک قرائت معتبر لازم است.',
    resultNote:'مقاومت برشی بر اساس نصف تنش انحرافی اوج و با فرض φu=0 محاسبه شده است.'
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
    basisText:'Constant-volume assumption during shearing for a saturated specimen.',
    sampleInfo:'1. Specimen Information',
    sampleName:'Specimen ID',
    diameter:'Initial Diameter (mm)',
    height:'Initial Height (mm)',
    confining:'Confining Pressure σ₃ (kPa)',
    readings:'2. Test Readings',
    readingHint:'Enter axial displacement and axial load for each reading.',
    row:'Row',
    deformation:'Displacement (mm)',
    load:'Axial Load (kN)',
    delete:'Delete',
    addReading:'Add Reading',
    calculate:'Calculate Results',
    resultsTitle:'3. Calculation Results',
    peakDeviator:'Peak Deviator Stress',
    undrainedStrength:'Undrained Shear Strength',
    peakStrain:'Peak Axial Strain',
    majorStress:'Peak Major Principal Stress',
    calculatedTable:'Calculated Readings',
    strain:'Strain (%)',
    area:'Corrected Area (mm²)',
    deviator:'Deviator Stress (kPa)',
    major:'Major Principal Stress (kPa)',
    print:'Print Results',
    footer:'Professional Geotechnical Engineering Software',
    invalid:'Please enter all data correctly.',
    invalidGeometry:'Diameter and height must be positive; displacement must be less than initial height.',
    invalidPressure:'Confining pressure cannot be negative.',
    noRows:'At least one valid reading is required.',
    resultNote:'Undrained shear strength is calculated as half the peak deviator stress, assuming φu=0.'
  }
};

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
    const key = element.dataset.i18n;
    const value = translations[language][key];

    if (value !== undefined) {
      element.textContent = value;
    }
  });

  $('languageBtn').textContent = language === 'fa' ? 'EN' : 'FA';
}

function addReading(displacement = '', load = '') {
  readingCount++;

  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${readingCount}</td>
    <td>
      <input type="number" class="displacement"
        min="0" step="any" placeholder="0.00"
        value="${displacement}" aria-label="Displacement">
    </td>
    <td>
      <input type="number" class="axial-load"
        min="0" step="any" placeholder="0.00"
        value="${load}" aria-label="Axial load">
    </td>
    <td>
      <button class="delete-btn" type="button"
        aria-label="Delete reading">×</button>
    </td>
  `;

  row.querySelector('.delete-btn').addEventListener('click', () => {
    row.remove();
    renumberRows();
    $('results').classList.add('hidden');
  });

  row.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => {
      $('results').classList.add('hidden');
    });
  });

  $('readingsBody').appendChild(row);
  return row;
}

function renumberRows() {
  document.querySelectorAll('#readingsBody tr').forEach((row, index) => {
    row.cells[0].textContent = index + 1;
  });
}

function getInput(id) {
  return Number($(id).value);
}

function calculateUU() {
  const diameter = getInput('diameter');
  const height = getInput('height');
  const confining = getInput('confining');

  if (!Number.isFinite(diameter) || !Number.isFinite(height) ||
      diameter <= 0 || height <= 0) {
    alert(translations[currentLanguage].invalidGeometry);
    return;
  }

  if (!Number.isFinite(confining) || confining < 0) {
    alert(translations[currentLanguage].invalidPressure);
    return;
  }

  const rows = [...document.querySelectorAll('#readingsBody tr')];

  if (!rows.length) {
    alert(translations[currentLanguage].noRows);
    return;
  }

  const initialArea = Math.PI * diameter * diameter / 4;

  const results = [];

  for (const row of rows) {
    const displacement = Number(row.querySelector('.displacement').value);
    const load = Number(row.querySelector('.axial-load').value);

    if (!Number.isFinite(displacement) ||
        !Number.isFinite(load) ||
        displacement < 0 ||
        load < 0 ||
        displacement >= height) {
      alert(translations[currentLanguage].invalid);
      return;
    }

    // Axial strain
    const strain = displacement / height;

    // Constant-volume corrected area
    const correctedArea = initialArea / (1 - strain);

    // kN to N; N/mm² to kPa
    const deviatorStress = (load * 1000 / correctedArea) * 1000;

    // Major principal total stress
    const sigma1 = confining + deviatorStress;

    results.push({
      displacement,
      load,
      strain,
      correctedArea,
      deviatorStress,
      sigma1
    });
  }

  // Maximum deviator stress
  const peak = results.reduce((max, item) =>
    item.deviatorStress > max.deviatorStress ? item : max
  );

  // Undrained shear strength under φu = 0 assumption
  const su = peak.deviatorStress / 2;

  $('peakQ').textContent = peak.deviatorStress.toFixed(2);
  $('su').textContent = su.toFixed(2);
  $('peakStrain').textContent = (peak.strain * 100).toFixed(3);
  $('sigma1').textContent = peak.sigma1.toFixed(2);

  $('resultsBody').innerHTML = results.map((item, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${(item.strain * 100).toFixed(3)}</td>
      <td>${item.correctedArea.toFixed(2)}</td>
      <td>${item.deviatorStress.toFixed(2)}</td>
      <td>${item.sigma1.toFixed(2)}</td>
    </tr>
  `).join('');

  $('resultNote').textContent = translations[currentLanguage].resultNote;

  $('results').classList.remove('hidden');
  $('results').scrollIntoView({behavior:'smooth', block:'start'});
}

// Navigation
$('soilBtn').addEventListener('click', () => showPage('soilPage'));
$('rockBtn').addEventListener('click', () => showPage('rockPage'));
$('soilBack').addEventListener('click', () => showPage('homePage'));
$('rockBack').addEventListener('click', () => showPage('homePage'));
$('uuBack').addEventListener('click', () => showPage('soilPage'));

// Test method selection
document.querySelectorAll('[data-method]').forEach(button => {
  button.addEventListener('click', () => {
    const method = button.dataset.method;

    if (method === 'UU') {
      showPage('uuPage');
    } else {
      alert(
        currentLanguage === 'fa'
          ? 'بخش این آزمایش در مرحله بعد توسعه داده می‌شود.'
          : 'This test module will be developed in the next stage.'
      );
    }
  });
});

// UU controls
$('addReading').addEventListener('click', () => addReading());
$('calculate').addEventListener('click', calculateUU);
$('printResults').addEventListener('click', () => window.print());

$('languageBtn').addEventListener('click', () => {
  setLanguage(currentLanguage === 'fa' ? 'en' : 'fa');
});

// Hide previous results after changing specimen data
['diameter', 'height', 'confining'].forEach(id => {
  $(id).addEventListener('input', () => {
    $('results').classList.add('hidden');
  });
});

// Initial reading rows
addReading(0, 0);
addReading(0.5, 0.2);
addReading(1, 0.4);

setLanguage('fa');
