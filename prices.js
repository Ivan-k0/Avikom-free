// ═══════════════════════════════════════
// АВТО-ВИКОМ — Файл цен
// Меняйте цифры здесь — обновится на всех языках и всех страницах
// ═══════════════════════════════════════
var PRICES = {
  // АЛЮМИНИЙ
  aly_perv: 137,   // Первичный
  aly_prof: 125,   // Профиль
  aly_mix:  90,    // Микс
  aly_mot:  90,    // Моторный
  aly_rad:  55,    // Радиатор
  aly_bank: 80,    // Банка
  zam:      56,    // ЦАМ
  mag:      48,    // Магний

  // МЕДЬ
  med:       490,  // Медь (-0.5%)
  med_blesk: 500,  // Медь-блеск

  // ЛАТУНЬ
  latun: 273,      // Латунь и радиаторы (-2%)

  // НЕРЖАВЕЙКА
  nerj_10: 27,     // Ni 10%
  nerj_8:  23,     // Ni 8%

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

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('[data-price]').forEach(function(el) {
    var key = el.getAttribute('data-price');
    if (PRICES[key] === undefined) return;
    
    var val = PRICES[key];
    var text = el.textContent;
    
    // Detect currency unit from existing text
    var unit = text.indexOf('UAH') !== -1 ? ' UAH/kg' : ' грн/кг';
    
    el.textContent = val + unit;
  });
});
