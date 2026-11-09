/* Juicy Bouncy cart: localStorage cart, pay-first checkout with Edgar's PayPal payment links. */
(function () {
  var CATALOG = {"mosaico": {"en": "Mosaic", "es": "Mosaico"}, "vainilla-espumosa": {"en": "Foamy Vanilla", "es": "Espumosa de Vainilla"}, "pina-cremosa": {"en": "Creamy Pineapple", "es": "Piña Cremosa"}, "fresas-crema": {"en": "Strawberries and Cream", "es": "Fresas con Crema"}, "tresleches-platano": {"en": "Tres Leches with Banana", "es": "Tres Leches con Plátano"}, "tresleches-manzana": {"en": "Tres Leches with Apple", "es": "Tres Leches con Manzana"}, "durazno-queso": {"en": "Peach and Cheese", "es": "Durazno con Queso"}, "limon-lechera": {"en": "Lime and Condensed Milk", "es": "Limón y Lechera"}, "queso-crema": {"en": "Cream Cheese", "es": "Queso Crema"}, "mosaico-naranja": {"en": "Orange Mosaic", "es": "Mosaico de Naranja"}, "mosaico-limonada": {"en": "Lemonade Mosaic", "es": "Mosaico de Limonada"}, "calabaza-tresleches": {"en": "Pumpkin Tres Leches", "es": "Calabaza Tres Leches"}, "pay-limon": {"en": "Lime Pie Gelatin", "es": "Pay de Limón"}, "rompope": {"en": "Rompope", "es": "Rompope"}, "lechera": {"en": "Condensed Milk", "es": "Lechera"}, "mango-leche": {"en": "Mango and Condensed Milk", "es": "Mango con Leche Condensada"}, "queso-marias": {"en": "Cheese and Maria Cookies", "es": "Queso con Galletas Marías"}, "frutas-queso": {"en": "Fruit and Cream Cheese", "es": "Frutas con Queso Crema"}, "limonada-rosa": {"en": "Pink Lemonade", "es": "Limonada Rosa"}, "chocolate-leche": {"en": "Chocolate Milk", "es": "Chocolate con Leche"}, "mosaico-patrio": {"en": "Trio", "es": "Trío"}, "flan-napolitano": {"en": "Flan Napolitano", "es": "Flan Napolitano"}, "chocoflan": {"en": "Chocoflan", "es": "Pastel Imposible"}, "flan-maizena": {"en": "Cornstarch Flan", "es": "Flan de Maizena"}, "flan-queso-crema": {"en": "Flan with Cream Cheese", "es": "Flan con Queso Crema"}, "flan-sin-huevo": {"en": "Eggless Flan", "es": "Flan sin Huevo"}, "flan-maizena-canela": {"en": "Cinnamon Cornstarch Flan", "es": "Flan de Maizena con Canela"}, "flan-caramelo": {"en": "Caramel Flan", "es": "Flan con Caramelo"}, "jericalla": {"en": "Jericalla", "es": "Jericalla"}};
  var LINKS = {"individual": ["https://www.paypal.com/ncp/payment/4B87H99QJGAM8", "https://www.paypal.com/ncp/payment/B8LC28FNBPJKA", "https://www.paypal.com/ncp/payment/3FYRAFV4P73U8", "https://www.paypal.com/ncp/payment/PZSDGLMGAL9HL", "https://www.paypal.com/ncp/payment/PCWN6XPT5FAF6", "https://www.paypal.com/ncp/payment/87Y9XVQZJXE6J", "https://www.paypal.com/ncp/payment/MYRQPHF98U4Y4", "https://www.paypal.com/ncp/payment/AP9847Q6CVR2Q", "https://www.paypal.com/ncp/payment/6EKT54NSYESWL", "https://www.paypal.com/ncp/payment/TQ6HK84RQPK98"], "mold": ["https://www.paypal.com/ncp/payment/DN7SEZ8KW2FEA", "https://www.paypal.com/ncp/payment/XJMTFXG6HLXW2", "https://www.paypal.com/ncp/payment/KP7YHHT3ZAXVE", "https://www.paypal.com/ncp/payment/FST6DTAM6H6WN", "https://www.paypal.com/ncp/payment/NN64QM5UA7AY6"]}; /* Edgar's PayPal payment links: individual[0..9], mold[0..4] */
  var PRICE = { individual: 399, mold: 3000 }; /* cents, USD */
  var KEY = "jb-cart-v1";

  function lang() { return (document.documentElement.lang || "es").slice(0, 2) === "en" ? "en" : "es"; }
  function load() { try { var c = JSON.parse(localStorage.getItem(KEY)); return Array.isArray(c) ? c : []; } catch (e) { return []; } }
  function save(cart) { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {} }
  function money(cents) { return "$" + (cents / 100).toFixed(2); }
  function prodName(slug) { var c = CATALOG[slug]; return c ? c[lang()] : slug; }
  function sizeName(size) { if (size === "individual") return "Individual"; return lang() === "en" ? "Mold" : "Molde"; }
  function lineTotal(it) { return it.qty * PRICE[it.size]; }
  function cartCount(cart) { var n = 0; cart.forEach(function (it) { n += it.qty; }); return n; }
  function cartTotal(cart) { var t = 0; cart.forEach(function (it) { t += lineTotal(it); }); return t; }
  function itemsText(cart) { return cart.map(function (it) { return it.qty + "x " + prodName(it.slug) + " " + sizeName(it.size) + " (" + money(lineTotal(it)) + ")"; }).join(", "); }

  function updateBadges() {
    var n = cartCount(load());
    document.querySelectorAll(".cart-count").forEach(function (el) { el.textContent = n; });
  }

  function add(slug, size, btn) {
    var cart = load(), found = null;
    cart.forEach(function (it) { if (it.slug === slug && it.size === size) found = it; });
    if (found) found.qty += 1; else cart.push({ slug: slug, size: size, qty: 1 });
    save(cart); updateBadges();
    if (btn) {
      var old = btn.textContent;
      btn.textContent = lang() === "en" ? "\u2713 Added" : "\u2713 Agregado";
      btn.disabled = true;
      setTimeout(function () { btn.textContent = old; btn.disabled = false; }, 900);
    }
  }

  /* "Comprar" on a shop card: add 1 Individual of that flavor and go to
     the cart page (Edgar 2026-11-06). */
  function buyNow(slug) {
    add(slug, "individual", null);
    window.location.href = "cart.html";
  }

  /* Payment chain from Edgar's PayPal links: individuals first (link matching
     the individual count), then molds (link matching the mold count). Counts
     above the links are split into several link payments. */
  function buildChain(cart) {
    var steps = [];
    var ind = 0, mold = 0;
    cart.forEach(function (it) { if (it.size === "individual") ind += it.qty; else mold += it.qty; });
    var n = ind;
    while (n > 0) { var q = Math.min(n, LINKS.individual.length); steps.push({ kind: "individual", qty: q, url: LINKS.individual[q - 1], amount: q * PRICE.individual }); n -= q; }
    n = mold;
    while (n > 0) { var q2 = Math.min(n, LINKS.mold.length); steps.push({ kind: "mold", qty: q2, url: LINKS.mold[q2 - 1], amount: q2 * PRICE.mold }); n -= q2; }
    return steps;
  }
  function loadChain() { try { var c = JSON.parse(localStorage.getItem("jb-pay-chain")); return c && Array.isArray(c.steps) ? c : null; } catch (e) { return null; } }
  function saveChain(c) { try { if (c) localStorage.setItem("jb-pay-chain", JSON.stringify(c)); else localStorage.removeItem("jb-pay-chain"); } catch (e) {} }

  /* Cart page rendering (only runs on cart.html). */
  function renderCart() {
    var list = document.getElementById("cart-items");
    if (!list) return;
    var l = lang();
    var cart = load();
    var empty = document.getElementById("cart-empty");
    var formWrap = document.getElementById("cart-checkout");
    var totalEl = document.getElementById("cart-total");
    if (!cart.length) {
      list.innerHTML = "";
      if (empty) empty.style.display = "";
      if (formWrap) formWrap.style.display = "none";
      if (totalEl) totalEl.textContent = money(0);
      refreshCheckout();
      return;
    }
    if (empty) empty.style.display = "none";
    if (formWrap) formWrap.style.display = "";
    var html = "";
    cart.forEach(function (it, i) {
      html += '<div class="cart-line"><div class="cart-line-info"><strong>' + prodName(it.slug) + '</strong><br><span class="small">' + sizeName(it.size) + ' \u00b7 ' + money(PRICE[it.size]) + '</span></div>'
        + '<div class="cart-qty"><button type="button" class="qty-btn" data-i="' + i + '" data-d="-1">\u2212</button><span>' + it.qty + '</span><button type="button" class="qty-btn" data-i="' + i + '" data-d="1">+</button></div>'
        + '<div class="cart-line-total"><strong>' + money(lineTotal(it)) + '</strong><br><button type="button" class="cart-remove" data-i="' + i + '">' + (l === "en" ? "Remove" : "Quitar") + '</button></div></div>';
    });
    list.innerHTML = html;
    if (totalEl) totalEl.textContent = money(cartTotal(cart));
    list.querySelectorAll(".qty-btn").forEach(function (b) {
      b.addEventListener("click", function () {
        var c = load(); var it = c[+b.dataset.i]; if (!it) return;
        it.qty += (+b.dataset.d);
        if (it.qty <= 0) c.splice(+b.dataset.i, 1);
        save(c); updateBadges(); renderCart();
      });
    });
    list.querySelectorAll(".cart-remove").forEach(function (b) {
      b.addEventListener("click", function () {
        var c = load(); c.splice(+b.dataset.i, 1);
        save(c); updateBadges(); renderCart();
      });
    });
    refreshCheckout();
  }

  /* Cart checkout (Edgar 2026-11-06): the order form appears BEFORE PayPal
     for online buyers — they fill their details, then pay the PayPal link(s),
     and only then the order is sent to Web3Forms (so no unpaid order email).
     In-store buyers fill the same form and it posts right away (no payment).
     The filled form is saved to localStorage, so a reload mid-payment does
     not lose it; the payment chain is dropped if the cart changes. */
  function loadPath() { try { var p = localStorage.getItem("jb-pay-path"); return p === "store" ? "store" : "online"; } catch (e) { return "online"; } }
  function savePath(p) { try { localStorage.setItem("jb-pay-path", p); } catch (e) {} }
  function formOpen() { try { return localStorage.getItem("jb-form-open") === "1"; } catch (e) { return false; } }
  function setFormOpen(v) { try { if (v) localStorage.setItem("jb-form-open", "1"); else localStorage.removeItem("jb-form-open"); } catch (e) {} }
  var PATH = loadPath(); /* "online" (PayPal) or "store" (pay in store) */

  function saveFormData() {
    var form = document.getElementById("cart-form");
    if (!form) return;
    var d = {};
    ["Name", "Email", "Phone", "Address", "Message"].forEach(function (n) {
      var el = form.querySelector('[name="' + n + '"]');
      if (el) d[n] = el.value;
    });
    try { localStorage.setItem("jb-order-form", JSON.stringify(d)); } catch (e) {}
  }
  function restoreFormData() {
    var form = document.getElementById("cart-form");
    if (!form) return;
    var d = null;
    try { d = JSON.parse(localStorage.getItem("jb-order-form")); } catch (e) {}
    if (!d) return;
    Object.keys(d).forEach(function (n) {
      var el = form.querySelector('[name="' + n + '"]');
      if (el && d[n] !== undefined) el.value = d[n];
    });
  }

  function fillHidden() {
    var cart = load();
    var p = document.getElementById("cart-product");
    var t = document.getElementById("cart-total-input");
    var f = document.getElementById("cart-fulfill");
    if (p) p.value = itemsText(cart);
    if (t) t.value = money(cartTotal(cart));
    if (f) f.value = PATH === "store"
      ? (lang() === "en" ? "In store" : "En tienda")
      : (lang() === "en" ? "Online (PayPal)" : "En línea (PayPal)");
  }

  function stepText(step, index, total) {
    var l = lang();
    var word = l === "en" ? "Step" : "Paso";
    var of = l === "en" ? "of" : "de";
    return word + " " + (index + 1) + " " + of + " " + total + " — " + (l === "en" ? "Pay " : "Paga ") + money(step.amount) + " (" + step.qty + " " + sizeName(step.kind) + ")";
  }

  function renderStep(cs) {
    var l = lang();
    var text = document.getElementById("cart-step-text");
    var pay = document.getElementById("cart-step-pay");
    var done = document.getElementById("cart-step-done");
    if (text) text.textContent = stepText(cs.step, cs.chain.index, cs.chain.steps.length);
    if (pay) {
      if (cs.step.url) {
        pay.textContent = (l === "en" ? "Pay " : "Pagar ") + money(cs.step.amount) + (l === "en" ? " with PayPal" : " con PayPal");
        pay.href = cs.step.url;
      } else {
        pay.textContent = l === "en" ? "PayPal link pending" : "Link de PayPal pendiente";
        pay.removeAttribute("href");
      }
    }
    if (done) done.style.display = cs.step.url ? "" : "none";
  }

  function refreshCheckout() {
    var cart = load();
    var paySec = document.getElementById("cart-pay");
    var formSec = document.getElementById("cart-checkout");
    var stepsSec = document.getElementById("cart-steps");
    var addrWrap = document.getElementById("cart-address-wrap");
    var addrInput = document.getElementById("cart-address");
    var submitBtn = document.getElementById("cart-submit");
    /* Warning before the charge: two PayPal payments (and two orders) when
       the cart has both sizes; one charge when it has only one size. */
    var note = document.getElementById("cart-pay-note");
    if (note) {
      var hasInd = false, hasMold = false;
      cart.forEach(function (it) { if (it.size === "individual") hasInd = true; else hasMold = true; });
      note.textContent = (hasInd && hasMold) ? note.getAttribute("data-both") : note.getAttribute("data-single");
    }
    if (!cart.length) { [paySec, formSec, stepsSec].forEach(function (el) { if (el) el.style.display = "none"; }); return; }
    /* Cart changed after starting a payment chain: drop the stale chain
       (the saved form data stays — the typed details are still valid). */
    var ch = loadChain();
    if (ch && ch.total !== cartTotal(cart)) { saveChain(null); ch = null; }
    var cs = ch && ch.index < ch.steps.length ? { chain: ch, step: ch.steps[ch.index] } : null;
    var showForm = PATH === "store" || (PATH === "online" && formOpen());
    if (paySec) paySec.style.display = (!showForm && !cs) ? "" : "none";
    if (formSec) formSec.style.display = (showForm && !cs) ? "" : "none";
    if (stepsSec) stepsSec.style.display = cs ? "" : "none";
    var online = PATH !== "store";
    if (addrWrap) addrWrap.style.display = online ? "" : "none";
    if (addrInput) addrInput.required = online;
    if (submitBtn) submitBtn.textContent = online ? submitBtn.getAttribute("data-online") : submitBtn.getAttribute("data-store");
    if (cs) renderStep(cs);
    fillHidden();
  }

  function setupCheckout() {
    var form = document.getElementById("cart-form");
    if (!form) return;
    restoreFormData();
    form.addEventListener("input", function () { saveFormData(); });
    var payBtn = document.getElementById("pay-paypal");
    if (payBtn) payBtn.addEventListener("click", function () {
      var cart = load();
      if (!cart.length) return;
      PATH = "online"; savePath(PATH); setFormOpen(true);
      refreshCheckout();
    });
    var storeBtn = document.getElementById("pay-store");
    if (storeBtn) storeBtn.addEventListener("click", function () {
      PATH = "store"; savePath(PATH); setFormOpen(true);
      refreshCheckout();
    });
    document.querySelectorAll(".cart-back").forEach(function (b) {
      b.addEventListener("click", function () {
        saveChain(null); setFormOpen(false); PATH = "online"; savePath(PATH);
        refreshCheckout();
      });
    });
    var doneBtn = document.getElementById("cart-step-done");
    if (doneBtn) doneBtn.addEventListener("click", function () {
      var c = loadChain();
      if (!c) return;
      c.index += 1;
      if (c.index >= c.steps.length) {
        saveChain(null);
        restoreFormData();
        fillHidden();
        form.submit(); /* normal POST to Web3Forms -> thanks page */
      } else { saveChain(c); refreshCheckout(); }
    });
    form.addEventListener("submit", function (e) {
      fillHidden();
      if (PATH === "store") return; /* normal POST to Web3Forms */
      e.preventDefault();
      var cart = load();
      if (!cart.length) return;
      saveFormData();
      var steps = buildChain(cart);
      if (!steps.length) return;
      saveChain({ steps: steps, index: 0, total: cartTotal(cart) });
      refreshCheckout();
      if (steps[0].url) window.open(steps[0].url, "_blank");
    });
    refreshCheckout();
  }

  window.JB = { add: add, buyNow: buyNow, updateBadges: updateBadges };
  document.addEventListener("DOMContentLoaded", function () {
    /* Order completed (thanks page): clear the cart and all checkout state.
       Cancelling on PayPal leaves the cart intact, since the links open in
       a new tab and the cart page stays open. */
    if (/thanks\.html$/.test(location.pathname)) { save([]); try { localStorage.removeItem("jb-paid-total"); localStorage.removeItem("jb-pay-chain"); localStorage.removeItem("jb-order-form"); localStorage.removeItem("jb-pay-path"); localStorage.removeItem("jb-form-open"); } catch (e) {} }
    updateBadges(); renderCart(); setupCheckout();
  });
})();
