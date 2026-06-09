// ═══════════════════════════════════════
// АВТО-ВИКОМ — Файл цен
// Меняйте цифры здесь — обновится на всех языках и всех страницах
// ═══════════════════════════════════════
var PRICES = {
  // АЛЮМИНИЙ
  aly_perv: 148,   // Первичный
  aly_prof: 133,   // Профиль
  aly_mix:  95,    // Микс
  aly_mot:  95,    // Моторный
  aly_rad:  60,    // Радиатор
  aly_bank: 83,    // Банка
  zam:      56,    // ЦАМ
  mag:      48,    // Магний

  // МЕДЬ
  med:       500,  // Медь (-0.5%)
  med_blesk: 510,  // Медь-блеск

  // ЛАТУНЬ
  latun: 275,      // Латунь и радиаторы (-2%)

  // НЕРЖАВЕЙКА
  nerj_10: 25,     // Ni 10%
  nerj_8:  20,     // Ni 8%

  // АКБ
  akb_w:    26,    // Белые
  akb_wz:   21,    // Белые залитые
  akb_gel:  17,    // Гелевые
  akb_eb:   17,    // Эбонитовые
  akb_tnz_b: 15,   // ТНЖ большие
  akb_tnz_m: 13,   // ТНЖ малые
  akb_tnz_k:  7,   // ТНЖ 4 клеммы

  // ПРОЧИЕ
  svinec: 65,      // Свинец
  titan:  77,      // Титан
};

// Вычисляемые цены (med_mix = med минус 0.5%)
PRICES.med_mix = Math.round(PRICES.med * 0.995);

document.addEventListener('DOMContentLoaded', function() {

  // 1. Обновляем все элементы с data-price
  document.querySelectorAll('[data-price]').forEach(function(el) {
    var key = el.getAttribute('data-price');
    if (PRICES[key] === undefined) return;
    var val = PRICES[key];
    var text = el.textContent;
    var unit = text.indexOf('UAH') !== -1 ? ' UAH/kg' : ' грн/кг';
    el.textContent = val + unit;
  });

  // 2. Обновляем элементы с data-price-range (диапазон "МИН–МАКС грн/кг")
  document.querySelectorAll('[data-price-range]').forEach(function(el) {
    var keys = el.getAttribute('data-price-range').split(',');
    if (keys.length < 2) return;
    var v1 = PRICES[keys[0].trim()];
    var v2 = PRICES[keys[1].trim()];
    if (v1 === undefined || v2 === undefined) return;
    var min = Math.min(v1, v2);
    var max = Math.max(v1, v2);
    var text = el.textContent;
    var unit = text.indexOf('UAH') !== -1 ? ' UAH/kg' : ' грн/кг';
    el.textContent = min + '–' + max + unit;
  });

  // 3. Обновляем data-price-mix (медь-микс со скидкой -0.5%)
  document.querySelectorAll('[data-price-mix]').forEach(function(el) {
    var key = el.getAttribute('data-price-mix');
    if (PRICES[key] === undefined) return;
    var val = Math.round(PRICES[key] * 0.995);
    var text = el.textContent;
    var unit = text.indexOf('UAH') !== -1 ? ' UAH/kg' : ' грн/кг';
    el.textContent = '-0.5% → ' + val + unit;
  });

  // 4. Обновляем meta description на страницах меди
  var metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    var content = metaDesc.getAttribute('content');
    // Заменяем паттерны типа "460–470 грн/кг" и "460–470 UAH/kg"
    content = content.replace(/\d+–\d+\s*грн\/кг/g, PRICES.med_mix + '–' + PRICES.med_blesk + ' грн/кг');
    content = content.replace(/\d+–\d+\s*UAH\/kg/g, PRICES.med_mix + '–' + PRICES.med_blesk + ' UAH/kg');
    metaDesc.setAttribute('content', content);
  }

});
