/* Juicy Bouncy cart: localStorage cart, single PayPal payment (_xclick). */
(function () {
  var CATALOG = {"mosaico": {"en": "Mosaic", "es": "Mosaico"}, "vainilla-espumosa": {"en": "Foamy Vanilla", "es": "Espumosa de Vainilla"}, "pina-cremosa": {"en": "Creamy Pineapple", "es": "Piña Cremosa"}, "fresas-crema": {"en": "Strawberries and Cream", "es": "Fresas con Crema"}, "tresleches-platano": {"en": "Tres Leches with Banana", "es": "Tres Leches con Plátano"}, "tresleches-manzana": {"en": "Tres Leches with Apple", "es": "Tres Leches con Manzana"}, "durazno-queso": {"en": "Peach and Cheese", "es": "Durazno con Queso"}, "limon-lechera": {"en": "Lime and Condensed Milk", "es": "Limón y Lechera"}, "queso-crema": {"en": "Cream Cheese", "es": "Queso Crema"}, "mosaico-naranja": {"en": "Orange Mosaic", "es": "Mosaico de Naranja"}, "mosaico-limonada": {"en": "Lemonade Mosaic", "es": "Mosaico de Limonada"}, "calabaza-tresleches": {"en": "Pumpkin Tres Leches", "es": "Calabaza Tres Leches"}, "pay-limon": {"en": "Lime Pie Gelatin", "es": "Pay de Limón"}, "rompope": {"en": "Rompope", "es": "Rompope"}, "lechera": {"en": "Condensed Milk", "es": "Lechera"}, "mango-leche": {"en": "Mango and Condensed Milk", "es": "Mango con Leche Condensada"}, "queso-marias": {"en": "Cheese and Maria Cookies", "es": "Queso con Galletas Marías"}, "frutas-queso": {"en": "Fruit and Cream Cheese", "es": "Frutas con Queso Crema"}, "limonada-rosa": {"en": "Pink Lemonade", "es": "Limonada Rosa"}, "chocolate-leche": {"en": "Chocolate Milk", "es": "Chocolate con Leche"}, "mosaico-patrio": {"en": "Trio", "es": "Trío"}, "flan-napolitano": {"en": "Flan Napolitano", "es": "Flan Napolitano"}, "chocoflan": {"en": "Chocoflan", "es": "Pastel Imposible"}, "flan-maizena": {"en": "Cornstarch Flan", "es": "Flan de Maizena"}, "flan-queso-crema": {"en": "Flan with Cream Cheese", "es": "Flan con Queso Crema"}, "flan-sin-huevo": {"en": "Eggless Flan", "es": "Flan sin Huevo"}, "flan-maizena-canela": {"en": "Cinnamon Cornstarch Flan", "es": "Flan de Maizena con Canela"}, "flan-caramelo": {"en": "Caramel Flan", "es": "Flan con Caramelo"}, "jericalla": {"en": "Jericalla", "es": "Jericalla"}};
  var PRICE = { individual: 399, mold: 3000 }; /* cents, USD */
  var PAYPAL_EMAIL = "tamarindongo10@gmail.com";
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

  function paypalUrl(cart) {
    var total = (cartTotal(cart) / 100).toFixed(2);
    var l = lang();
    var p = new URLSearchParams({
      cmd: "_xclick",
      business: PAYPAL_EMAIL,
      item_name: l === "en" ? "Juicy Bouncy - Online order" : "Juicy Bouncy - Pedido en l\u00ednea",
      amount: total,
      currency_code: "USD",
      no_shipping: "1",
      custom: itemsText(cart).slice(0, 200),
      return: "https://juicybouncy.com/" + l + "/cart.html?paid=1",
      cancel_return: "https://juicybouncy.com/" + l + "/cart.html"
    });
    return "https://www.paypal.com/cgi-bin/webscr?" + p.toString();
  }

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

  /* Cart checkout, pay-first flow (Edgar 2026-11-06): the customer pays on
     PayPal first, then fills the order form. The paid state is remembered
     in localStorage as the paid total, so adding items afterwards asks for
     payment again. The form posts to Web3Forms normally (redirect to the
     thanks page, same as the single-product checkout). */
  var PATH = "online"; /* "online" (paid with PayPal) or "store" (pay in store) */
  function paidTotal() { try { var v = localStorage.getItem("jb-paid-total"); return v === null ? -1 : +v; } catch (e) { return -1; } }
  function isPaid(cart) { var t = cartTotal(cart); return t > 0 && paidTotal() === t; }

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

  function refreshCheckout() {
    var cart = load();
    var paySec = document.getElementById("cart-pay");
    var formSec = document.getElementById("cart-checkout");
    var paidNote = document.getElementById("cart-paid-note");
    var addrWrap = document.getElementById("cart-address-wrap");
    var addrInput = document.getElementById("cart-address");
    if (!cart.length) { if (paySec) paySec.style.display = "none"; if (formSec) formSec.style.display = "none"; return; }
    var paid = isPaid(cart);
    var showForm = paid || PATH === "store";
    if (paySec) paySec.style.display = showForm ? "none" : "";
    if (formSec) formSec.style.display = showForm ? "" : "none";
    if (paidNote) paidNote.style.display = paid ? "" : "none";
    var online = PATH !== "store";
    if (addrWrap) addrWrap.style.display = online ? "" : "none";
    if (addrInput) addrInput.required = online;
    fillHidden();
  }

  function setupCheckout() {
    var form = document.getElementById("cart-form");
    if (!form) return;
    /* Back from PayPal after a payment: remember the paid total. */
    var params = new URLSearchParams(location.search);
    if (params.get("paid") === "1") {
      try { localStorage.setItem("jb-paid-total", String(cartTotal(load()))); } catch (e) {}
      try { history.replaceState(null, "", location.pathname); } catch (e) {}
    }
    var payBtn = document.getElementById("pay-paypal");
    if (payBtn) payBtn.addEventListener("click", function () {
      var cart = load();
      if (cart.length) window.location.href = paypalUrl(cart);
    });
    var storeBtn = document.getElementById("pay-store");
    if (storeBtn) storeBtn.addEventListener("click", function () { PATH = "store"; refreshCheckout(); });
    form.addEventListener("submit", function () { fillHidden(); });
    refreshCheckout();
  }

  window.JB = { add: add, updateBadges: updateBadges };
  document.addEventListener("DOMContentLoaded", function () {
    /* Order completed (thanks page): clear the cart and the paid flag.
       Cancelling on PayPal returns to cart.html instead, so the cart
       stays intact there. */
    if (/thanks\.html$/.test(location.pathname)) { save([]); try { localStorage.removeItem("jb-paid-total"); } catch (e) {} }
    updateBadges(); renderCart(); setupCheckout();
  });
})();
