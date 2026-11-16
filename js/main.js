/* ==========================================================================
   DentalCare Studio — main.js
   Funzioni condivise da tutte le pagine: utilità, menu mobile, header,
   dati dello studio, avvisi demo (telefono, email, social, WhatsApp),
   modali accessibili, accordion, passi della prima visita, reveal.
   Espone il namespace globale window.DC usato dagli altri script.
   ========================================================================== */
(function () {
  "use strict";

  var D = window.SITE_DATA || {};
  var DC = (window.DC = window.DC || {});
  var root = document.documentElement;
  root.classList.add("js");

  /* ------------------------------------------------------------ utilità */
  DC.data = D;
  DC.qs = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  DC.qsa = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  DC.esc = function (value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  DC.normalize = function (text) {
    return String(text || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
  };
  DC.icon = function (name, cls) {
    return '<svg class="' + (cls || "icon") + '" aria-hidden="true" focusable="false"><use href="#i-' + name + '"></use></svg>';
  };
  DC.findById = function (list, id) {
    return (list || []).filter(function (item) { return item.id === id; })[0] || null;
  };
  DC.service = function (id) { return DC.findById(D.services, id); };
  DC.member = function (id) { return DC.findById(D.team, id); };
  DC.category = function (id) { return DC.findById(D.categories, id); };
  DC.params = new URLSearchParams(window.location.search);
  DC.reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /** Genera un <img> con dimensioni, alt e lazy loading. */
  DC.img = function (image, opts) {
    opts = opts || {};
    if (!image) return "";
    var w = opts.width || image.width || 800;
    var h = opts.height || image.height || 500;
    return '<img src="' + DC.esc(image.src) + '" alt="' + DC.esc(opts.alt != null ? opts.alt : image.alt) + '" width="' + w + '" height="' + h + '"' +
      (opts.eager ? ' fetchpriority="high"' : ' loading="lazy"') + ' decoding="async">';
  };

  /* ------------------------------------------- fallback immagini mancanti */
  var FALLBACK = "assets/images/fallback.svg";
  function applyFallback(img) {
    if (!img || img.dataset.fallbackApplied) return;
    img.dataset.fallbackApplied = "1";
    img.classList.add("img-fallback");
    img.src = FALLBACK;
  }
  document.addEventListener("error", function (e) {
    if (e.target && e.target.tagName === "IMG") applyFallback(e.target);
  }, true);

  /* Immagini statiche: allinea src/alt ai percorsi centralizzati in SITE_DATA.images */
  function syncStaticImages() {
    DC.qsa("img[data-image]").forEach(function (img) {
      var data = D.images && D.images[img.dataset.image];
      if (!data) return;
      if (img.getAttribute("src") !== data.src) img.setAttribute("src", data.src);
      img.setAttribute("alt", data.alt);
    });
    DC.qsa("img").forEach(function (img) {
      if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) applyFallback(img);
    });
  }

  /* --------------------------------------------- dati dello studio (bind) */
  function hoursDl() {
    return (D.hours || []).map(function (h) {
      return "<div><dt>" + DC.esc(h.days) + "</dt><dd>" + DC.esc(h.time) + "</dd></div>";
    }).join("");
  }
  function bindStudioData() {
    var s = D.studio || {};
    var a = s.address || {};
    var values = {
      name: s.name,
      description: s.description,
      address: a.street ? a.street + ", " + a.cap + " " + a.city : "",
      "address-note": a.note,
      phone: s.phoneDisplay,
      "phone-note": s.phoneNote,
      email: s.email,
      year: String(new Date().getFullYear())
    };
    DC.qsa("[data-bind]").forEach(function (el) {
      var key = el.getAttribute("data-bind");
      if (key === "hours") { el.innerHTML = hoursDl(); return; }
      if (key === "hours-table") {
        var body = DC.qs("tbody", el);
        if (body) body.innerHTML = (D.hours || []).map(function (h) {
          return '<tr><th scope="row">' + DC.esc(h.days) + "</th><td>" + DC.esc(h.time) + "</td></tr>";
        }).join("");
        return;
      }
      if (values[key]) el.textContent = values[key];
    });
  }

  /* ------------------------------------------------------- menu mobile */
  function initNav() {
    var toggle = DC.qs(".nav-toggle");
    var nav = DC.qs("#main-nav");
    var header = DC.qs("#site-header");
    if (!toggle || !nav) return;

    function setOpen(open, returnFocus) {
      toggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
      DC.qs(".nav-toggle__label", toggle).textContent = open ? "Chiudi" : "Menu";
      if (!open && returnFocus) toggle.focus();
    }
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") setOpen(false, true);
    });
    document.addEventListener("click", function (e) {
      if (toggle.getAttribute("aria-expanded") === "true" && !header.contains(e.target)) setOpen(false);
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    var mq = window.matchMedia("(min-width: 1101px)");
    var onChange = function () { if (mq.matches) setOpen(false); };
    if (mq.addEventListener) mq.addEventListener("change", onChange); else mq.addListener(onChange);

    var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 8); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* --------------------------------------------------------------- modali
     Usa <dialog> nativo: Escape chiude, il resto della pagina diventa inerte
     (focus contenuto), il focus torna all'elemento che ha aperto la modale. */
  DC.openModal = function (opts) {
    opts = opts || {};
    var opener = document.activeElement;
    var id = "modal-" + Math.random().toString(36).slice(2, 8);
    var dialog = document.createElement("dialog");
    dialog.className = "modal" + (opts.className ? " " + opts.className : "");
    dialog.setAttribute("aria-labelledby", id + "-title");
    dialog.innerHTML =
      '<div class="modal__header"><h2 id="' + id + '-title">' + DC.esc(opts.title) + "</h2>" +
      '<button type="button" class="modal__close" data-close>' + DC.icon("x") + '<span class="visually-hidden">Chiudi</span></button></div>' +
      '<div class="modal__body">' + (opts.html || "") + "</div>";
    document.body.appendChild(dialog);

    function cleanup() {
      document.body.classList.remove("modal-open");
      if (dialog.parentNode) dialog.parentNode.removeChild(dialog);
      if (opts.onClose) opts.onClose();
      if (opener && typeof opener.focus === "function" && document.contains(opener)) opener.focus();
    }
    function close() {
      if (typeof dialog.close === "function" && dialog.open) dialog.close(); else cleanup();
    }
    dialog.addEventListener("close", cleanup);
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog || e.target.closest("[data-close]")) close();
    });
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
      dialog.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
    }
    document.body.classList.add("modal-open");
    var focusTarget = DC.qs("[autofocus]", dialog) || DC.qs(".modal__close", dialog);
    if (focusTarget) focusTarget.focus();
    if (opts.onOpen) opts.onOpen(dialog, close);
    return { dialog: dialog, close: close };
  };

  /* ---------------------------------------------------------- avvisi demo */
  var DEMO_MESSAGES = {
    phone: { title: "Numero dimostrativo", text: "Questo è un progetto per portfolio: il numero di telefono è fittizio e non viene chiamato nessuno. In un sito reale questo pulsante avvierebbe una chiamata verso il numero verificato dello studio." },
    email: { title: "Indirizzo email dimostrativo", text: "L'indirizzo usa il dominio riservato .example e non riceve messaggi. Per provare il flusso puoi usare il modulo di contatto, che simula l'invio senza trasmettere dati." },
    social: { title: "Profilo social segnaposto", text: "I collegamenti ai social sono segnaposto: lo studio è fittizio e non ha profili reali." },
    whatsapp: { title: "WhatsApp (simulazione)", text: "In un sito reale questo pulsante aprirebbe una chat WhatsApp con il numero autorizzato dello studio. In questa demo non viene aperta alcuna chat e nessun messaggio viene inviato." }
  };
  function initDemoLinks() {
    document.addEventListener("click", function (e) {
      var trigger = e.target.closest("[data-demo]");
      if (!trigger) return;
      e.preventDefault();
      var kind = trigger.getAttribute("data-demo");

      /* >>> WHATSAPP REALE: se in data.js è presente un link autorizzato
         (studio.whatsappUrl), il pulsante lo apre al posto dell'avviso demo. */
      if (kind === "whatsapp" && D.studio && D.studio.whatsappUrl) {
        window.open(D.studio.whatsappUrl, "_blank", "noopener");
        return;
      }
      var msg = DEMO_MESSAGES[kind] || DEMO_MESSAGES.social;
      DC.openModal({
        title: msg.title,
        html:
          '<div class="info-box info-box--demo">' + DC.icon("info") + "<p>" + DC.esc(msg.text) + "</p></div>" +
          '<div class="cluster"><a class="btn" href="contatti.html#ct-title">Vai al modulo di contatto</a>' +
          '<button type="button" class="btn btn--secondary" data-close>Ho capito</button></div>'
      });
    });
  }

  /* ------------------------------------------------------------ accordion */
  DC.renderAccordion = function (items, opts) {
    opts = opts || {};
    var level = opts.headingLevel || 3;
    var prefix = opts.idPrefix || "acc";
    return items.map(function (item, i) {
      var id = prefix + "-" + (item.id || i);
      return '<div class="accordion__item">' +
        "<h" + level + ' class="accordion__heading">' +
        '<button type="button" class="accordion__trigger" aria-expanded="false" aria-controls="' + id + '-panel" id="' + id + '-btn">' +
        "<span>" + DC.esc(item.q) + '</span><span class="accordion__icon" aria-hidden="true"></span></button></h' + level + ">" +
        '<div class="accordion__panel" id="' + id + '-panel" role="region" aria-labelledby="' + id + '-btn" hidden><p>' + DC.esc(item.a) + "</p></div></div>";
    }).join("");
  };
  function initAccordion() {
    document.addEventListener("click", function (e) {
      var btn = e.target.closest(".accordion__trigger");
      if (!btn) return;
      var panel = document.getElementById(btn.getAttribute("aria-controls"));
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      if (panel) panel.hidden = open;
    });
  }

  /* ----------------------------------------------- passi della prima visita */
  function renderSteps() {
    DC.qsa('[data-render="steps"]').forEach(function (el) {
      var timeline = el.classList.contains("steps--timeline");
      el.innerHTML = (D.firstVisitSteps || []).map(function (s, i) {
        return '<li class="step' + (timeline ? "" : " reveal") + '"><span class="step__num" aria-hidden="true">' + (i + 1) + "</span>" +
          "<div><h3><span class=\"visually-hidden\">Passo " + (i + 1) + ": </span>" + DC.esc(s.title) + "</h3><p>" + DC.esc(s.text) + "</p></div></li>";
      }).join("");
    });
  }

  /* --------------------------------------------------------------- reveal
     Il contenuto resta visibile se JS o IntersectionObserver non sono
     disponibili: la classe .js-reveal viene aggiunta solo quando serve. */
  var observer = null;
  DC.observeReveal = function (ctx) {
    var items = DC.qsa(".reveal:not(.is-visible)", ctx);
    if (!observer) { items.forEach(function (el) { el.classList.add("is-visible"); }); return; }
    items.forEach(function (el) { observer.observe(el); });
  };
  function initReveal() {
    if (DC.reducedMotion || !("IntersectionObserver" in window)) return;
    root.classList.add("js-reveal");
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.08 });
    DC.observeReveal();
  }

  /* ----------------------------------------------------------------- init */
  DC.ready = function (fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  };
  DC.ready(function () {
    syncStaticImages();
    bindStudioData();
    initNav();
    initDemoLinks();
    initAccordion();
    renderSteps();
    initReveal();
  });
})();
