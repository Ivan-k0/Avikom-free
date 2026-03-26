// ═══════════════════════════════════════
// АВТО-ВИКОМ — Файл цен
// Меняйте цифры здесь — обновится на всех языках и всех страницах
// ═══════════════════════════════════════
var PRICES = {
  // АЛЮМИНИЙ
  aly_perv: 123,   // Первичный
  aly_prof: 106,   // Профиль
  aly_mix:  86,    // Микс
  aly_mot:  86,    // Моторный
  aly_rad:  55,    // Радиатор
  aly_bank: 72,    // Банка
  zam:      56,    // ЦАМ
  mag:      25,    // Магний

  // МЕДЬ
  med:       460,  // Медь (-0.5%)
  med_blesk: 470,  // Медь-блеск

  // ЛАТУНЬ
  latun: 260,      // Латунь и радиаторы (-2%)

  // НЕРЖАВЕЙКА
  nerj_10: 26,     // Ni 10%
  nerj_8:  22,     // Ni 8%

  // АКБ
  akb_w:    24,    // Белые
  akb_wz:   20,    // Белые залитые
  akb_gel:  17,    // Гелевые
  akb_eb:   14,    // Эбонитовые
  akb_tnz_b: 15,   // ТНЖ большие
  akb_tnz_m: 13,   // ТНЖ малые
  akb_tnz_k:  7,   // ТНЖ 4 клеммы

  // ПРОЧИЕ
  svinec: 63,      // Свинец
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
