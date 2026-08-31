// ═══════════════════════════════════════
// АВТО-ВИКОМ — Файл цен
// Меняйте цифры здесь — обновится на всех языках и всех страницах
// ═══════════════════════════════════════
var PRICES = {
  // АЛЮМИНИЙ
  aly_perv: 139,   // Первичный
  aly_prof: 115,   // Профиль
  aly_mix:  84,    // Микс
  aly_mot:  84,    // Моторный
  aly_rad:  55,    // Радиатор
  aly_bank: 72,    // Банка
  zam:      75,    // ЦАМ
  mag:      40,    // Магний

  // МЕДЬ
  med:       510,  // Медь (-0.5%)
  med_blesk: 520,  // Медь-блеск

  // ЛАТУНЬ
  latun: 290,      // Латунь и радиаторы (-2%)

  // НЕРЖАВЕЙКА
  nerj_10: 26,     // Ni 10%
  nerj_8:  19,     // Ni 8%

  // АКБ
  akb_w:    26,    // Белые
  akb_wz:   22,    // Белые залитые
  akb_gel:  17,    // Гелевые
  akb_eb:   17,    // Эбонитовые
  akb_tnz_b: 15,   // ТНЖ большие
  akb_tnz_m: 13,   // ТНЖ малые
  akb_tnz_k:  7,   // ТНЖ 4 клеммы

  // ПРОЧИЕ
  svinec: 65,      // Свинец
  titan:  77,      // Титан
  chern_lom: 2,    // Чёрный лом
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

  // 5. Обновляем цену в structured data (JSON-LD Service → offers), синхронизировано с price-badge
  var badge = document.querySelector('.price-badge');
  if (badge) {
    var lowVal, highVal;
    if (badge.hasAttribute('data-price')) {
      var k = badge.getAttribute('data-price');
      if (PRICES[k] !== undefined) { lowVal = highVal = PRICES[k]; }
    } else if (badge.hasAttribute('data-price-range')) {
      var ks = badge.getAttribute('data-price-range').split(',');
      var a = PRICES[ks[0].trim()], b = PRICES[ks[1].trim()];
      if (a !== undefined && b !== undefined) { lowVal = Math.min(a, b); highVal = Math.max(a, b); }
    }
    if (lowVal !== undefined) {
      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      var validUntil = tomorrow.toISOString().slice(0, 10);

      document.querySelectorAll('script[type="application/ld+json"]').forEach(function(script) {
        try {
          var data = JSON.parse(script.textContent);
          if (data['@type'] === 'Service') {
            data.offers = (lowVal === highVal)
              ? { '@type': 'Offer', price: String(lowVal), priceCurrency: 'UAH', priceValidUntil: validUntil, availability: 'https://schema.org/InStock' }
              : { '@type': 'AggregateOffer', lowPrice: String(lowVal), highPrice: String(highVal), priceCurrency: 'UAH', priceValidUntil: validUntil, offerCount: '1' };
            script.textContent = JSON.stringify(data);
          }
        } catch (e) {}
      });
    }
  }

});
