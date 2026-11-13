
'use strict';

const $ = id => document.getElementById(id);

const pages = [
  'homePage',
  'soilPage',
  'rockPage',
  'comingPage'
];

let currentLanguage = 'fa';

const translations = {
  fa: {
    subtitle: 'نرم‌افزار تخصصی آزمایش سه‌محوری',
    welcome: 'نرم‌افزار آزمایشگاهی',
    mainTitle: 'آزمایش سه‌محوری خاک و سنگ',
    mainDesc: 'محیط تخصصی انجام محاسبات، تحلیل نتایج و تهیه گزارش آزمایش‌های سه‌محوری',
    selectMaterial: 'انتخاب نوع مصالح',
    soil: 'آزمایش سه‌محوری خاک',
    soilDesc: 'بررسی رفتار مقاومتی خاک در شرایط مختلف زهکشی',
    rock: 'آزمایش سه‌محوری سنگ',
    rockDesc: 'بررسی مقاومت فشاری و پارامترهای مقاومتی سنگ',
    featuresTitle: 'امکانات نرم‌افزار',
    feature1: 'محاسبات مهندسی',
    feature2: 'نمودارهای تخصصی',
    feature3: 'گزارش آزمایش',
    feature4: 'ذخیره اطلاعات',
    back: 'بازگشت',
    soilMethods: 'انتخاب روش آزمایش خاک',
    methodDesc: 'روش موردنظر را انتخاب کنید.',
    uuDesc: 'تحکیم‌نیافته و زهکشی‌نشده',
    cuDesc: 'تحکیم‌یافته و زهکشی‌نشده',
    cdDesc: 'تحکیم‌یافته و زهکشی‌شده',
    rockTitle: 'آزمایش سه‌محوری سنگ',
    rockMethodDesc: 'انتخاب استاندارد و روش آزمایش',
    rockTestDesc: 'آزمایش فشاری تک‌محوری و سه‌محوری مغزه سنگ',
    development: 'بخش آزمایش در حال توسعه است',
    developmentDesc: 'فرم ورود اطلاعات و موتور محاسبات این بخش در مرحله بعد پیاده‌سازی خواهد شد.',
    footer: 'نرم‌افزار تخصصی مهندسی ژئوتکنیک'
  },

  en: {
    subtitle: 'Professional Triaxial Testing Software',
    welcome: 'LABORATORY SOFTWARE',
    mainTitle: 'Soil and Rock Triaxial Testing',
    mainDesc: 'A professional environment for calculations, result analysis and laboratory reporting.',
    selectMaterial: 'Select Material',
    soil: 'Soil Triaxial Test',
    soilDesc: 'Evaluation of soil strength under different drainage conditions.',
    rock: 'Rock Triaxial Test',
    rockDesc: 'Evaluation of compressive strength and rock strength parameters.',
    featuresTitle: 'Software Features',
    feature1: 'Engineering Calculations',
    feature2: 'Technical Charts',
    feature3: 'Test Reports',
    feature4: 'Data Storage',
    back: 'Back',
    soilMethods: 'Select Soil Test Method',
    methodDesc: 'Select your desired test method.',
    uuDesc: 'Unconsolidated Undrained',
    cuDesc: 'Consolidated Undrained',
    cdDesc: 'Consolidated Drained',
    rockTitle: 'Rock Triaxial Test',
    rockMethodDesc: 'Select test standard and method',
    rockTestDesc: 'Uniaxial and triaxial compression testing of rock cores',
    development: 'Test Module Under Development',
    developmentDesc: 'The data entry form and calculation engine will be implemented in the next stage.',
    footer: 'Professional Geotechnical Engineering Software'
  }
};

function showPage(pageId) {
  pages.forEach(id => $(id).classList.add('hidden'));
  $(pageId).classList.remove('hidden');
  window.scrollTo(0, 0);
}

function setLanguage(language) {
  currentLanguage = language;

  document.documentElement.lang = language;
  document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';

  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.dataset.i18n;
    if (translations[language][key]) {
      element.textContent = translations[language][key];
    }
  });

  $('languageBtn').textContent = language === 'fa' ? 'EN' : 'FA';
}

$('languageBtn').addEventListener('click', () => {
  setLanguage(currentLanguage === 'fa' ? 'en' : 'fa');
});

$('soilBtn').addEventListener('click', () => {
  showPage('soilPage');
});

$('rockBtn').addEventListener('click', () => {
  showPage('rockPage');
});

$('soilBack').addEventListener('click', () => {
  showPage('homePage');
});

$('rockBack').addEventListener('click', () => {
  showPage('homePage');
});

$('comingBack').addEventListener('click', () => {
  showPage('soilPage');
});

document.querySelectorAll('[data-method]').forEach(button => {
  button.addEventListener('click', () => {
    const method = button.dataset.method;
    $('selectedMethod').textContent = method;
    showPage('comingPage');
  });
});

setLanguage('fa');
