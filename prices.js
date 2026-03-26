// ═══════════════════════════════════════
// АВТО-ВИКОМ — Файл цен
// Меняйте цифры здесь — обновится на всех языках
// ═══════════════════════════════════════
var PRICES = {
  aly_perv: 123, aly_prof: 106, aly_mix: 86, aly_mot: 86,
  aly_rad: 55, aly_bank: 72, zam: 56, mag: 25,
  med: 460, med_blesk: 470,
  latun: 260,
  nerj_10: 26, nerj_8: 22,
  akb_w: 24, akb_wz: 20, akb_gel: 17, akb_eb: 14,
  akb_tnz_b: 15, akb_tnz_m: 13, akb_tnz_k: 7,
  svinec: 63, titan: 76
};

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('[data-price]').forEach(function(el) {
    var key = el.getAttribute('data-price');
    if (PRICES[key] !== undefined) {
      var unit = el.textContent.indexOf('UAH') !== -1 ? ' UAH/kg' : ' грн/кг';
      el.textContent = PRICES[key] + unit;
    }
  });
});
