/* ==========================================================================
   DentalCare Studio — gallery.js
   Galleria con lightbox accessibile (lo studio) e carousel leggero delle
   recensioni dimostrative (home): navigazione manuale, tastiera, no autoplay.
   ========================================================================== */
(function () {
  "use strict";
  var DC = window.DC;
  if (!DC) return;
  var D = DC.data;

  /* --------------------------------------------------------------- galleria */
  function initGallery() {
    var grid = DC.qs('[data-render="gallery"]');
    if (!grid) return;
    var items = (D.gallery || []).map(function (g) {
      var img = D.images[g.image];
      return img ? { src: img.src, alt: img.alt, width: img.width, height: img.height, caption: g.caption } : null;
    }).filter(Boolean);

    grid.innerHTML = items.map(function (it, i) {
      return '<button type="button" class="gallery-item reveal" data-index="' + i + '" aria-label="Apri immagine: ' + DC.esc(it.caption) + '">' +
        DC.img(it, { alt: "" }) + '<span class="gallery-item__caption" aria-hidden="true">' + DC.esc(it.caption) + "</span></button>";
    }).join("");
    DC.observeReveal(grid);

    grid.addEventListener("click", function (e) {
      var btn = e.target.closest(".gallery-item");
      if (btn) openLightbox(items, Number(btn.dataset.index));
    });
  }

  function openLightbox(items, start) {
    var index = start;
    DC.openModal({
      title: items[index].caption,
      className: "lightbox",
      html:
        '<figure class="lightbox__figure" style="margin:0"><img src="" alt="" width="1200" height="900"></figure>' +
        '<div class="lightbox__controls">' +
        '<button type="button" class="lightbox__nav" data-dir="-1">' + DC.icon("arrow-left") + " Precedente</button>" +
        '<span class="lightbox__counter" aria-live="polite"></span>' +
        '<button type="button" class="lightbox__nav" data-dir="1">Successiva ' + DC.icon("arrow-right") + "</button></div>",
      onOpen: function (dialog) {
        var img = DC.qs(".lightbox__figure img", dialog);
        var title = DC.qs(".modal__header h2", dialog);
        var counter = DC.qs(".lightbox__counter", dialog);
        DC.qs(".modal__body", dialog).style.padding = "0";
        function show(i) {
          index = (i + items.length) % items.length;
          var it = items[index];
          img.src = it.src;
          img.alt = it.alt;
          title.textContent = it.caption;
          counter.textContent = "Immagine " + (index + 1) + " di " + items.length;
        }
        dialog.addEventListener("click", function (e) {
          var nav = e.target.closest(".lightbox__nav");
          if (nav) show(index + Number(nav.dataset.dir));
        });
        dialog.addEventListener("keydown", function (e) {
          if (e.key === "ArrowRight") { e.preventDefault(); show(index + 1); }
          if (e.key === "ArrowLeft") { e.preventDefault(); show(index - 1); }
        });
        show(index);
      }
    });
  }

  /* ---------------------------------------------------- carousel recensioni */
  function initReviews() {
    DC.qsa('[data-render="reviews"]').forEach(function (el) {
      var reviews = D.reviews || [];
      el.innerHTML =
        '<div class="carousel" role="region" aria-roledescription="carousel" aria-label="Recensioni dimostrative">' +
        '<div class="carousel__viewport" tabindex="0" aria-label="Usa le frecce sinistra e destra per scorrere le recensioni">' +
        '<div class="carousel__track">' +
        reviews.map(function (r, i) {
          return '<div class="carousel__slide" role="group" aria-roledescription="slide" aria-label="' + (i + 1) + " di " + reviews.length + '">' +
            '<figure class="review-card" style="margin:0"><blockquote><p>' + DC.esc(r.text) + "</p></blockquote>" +
            '<footer><cite>' + DC.esc(r.name) + '</cite><span class="badge badge--demo">Recensione dimostrativa</span></footer></figure></div>';
        }).join("") +
        "</div></div>" +
        '<div class="carousel__controls">' +
        '<div class="carousel__dots" role="group" aria-label="Scegli la recensione"></div>' +
        '<div class="carousel__buttons">' +
        '<button type="button" class="carousel__btn" data-dir="-1">' + DC.icon("arrow-left") + '<span class="visually-hidden">Recensione precedente</span></button>' +
        '<button type="button" class="carousel__btn" data-dir="1">' + DC.icon("arrow-right") + '<span class="visually-hidden">Recensione successiva</span></button>' +
        "</div></div>" +
        '<p class="visually-hidden" aria-live="polite" data-carousel-status></p></div>';

      var track = DC.qs(".carousel__track", el);
      var viewport = DC.qs(".carousel__viewport", el);
      var slides = DC.qsa(".carousel__slide", el);
      var dotsEl = DC.qs(".carousel__dots", el);
      var prev = DC.qs('[data-dir="-1"]', el);
      var next = DC.qs('[data-dir="1"]', el);
      var status = DC.qs("[data-carousel-status]", el);
      var index = 0;

      function perView() { return window.matchMedia("(min-width: 900px)").matches ? 2 : 1; }
      function maxIndex() { return Math.max(0, slides.length - perView()); }

      function buildDots() {
        var n = maxIndex() + 1;
        var html = "";
        for (var i = 0; i < n; i++) {
          html += '<button type="button" class="carousel__dot" data-index="' + i + '"><span></span><span class="visually-hidden">Vai alla posizione ' + (i + 1) + " di " + n + "</span></button>";
        }
        dotsEl.innerHTML = html;
      }
      function update(announce) {
        index = Math.min(Math.max(index, 0), maxIndex());
        var pv = perView();
        track.style.transform = "translateX(" + (-index * (100 / pv)) + "%)";
        slides.forEach(function (s, i) {
          var visible = i >= index && i < index + pv;
          s.setAttribute("aria-hidden", String(!visible));
          if ("inert" in s) s.inert = !visible;
        });
        prev.disabled = index === 0;
        next.disabled = index >= maxIndex();
        DC.qsa(".carousel__dot", dotsEl).forEach(function (d, i) {
          if (i === index) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current");
        });
        if (announce) status.textContent = "Recensione " + (index + 1) + " di " + slides.length;
      }
      function go(i) { index = i; update(true); }

      el.addEventListener("click", function (e) {
        var btn = e.target.closest(".carousel__btn");
        if (btn && !btn.disabled) go(index + Number(btn.dataset.dir));
        var dot = e.target.closest(".carousel__dot");
        if (dot) go(Number(dot.dataset.index));
      });
      viewport.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") { e.preventDefault(); go(index + 1); }
        if (e.key === "ArrowLeft") { e.preventDefault(); go(index - 1); }
        if (e.key === "Home") { e.preventDefault(); go(0); }
        if (e.key === "End") { e.preventDefault(); go(maxIndex()); }
      });

      /* Swipe su touch, senza librerie */
      var startX = null;
      viewport.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
      viewport.addEventListener("touchend", function (e) {
        if (startX === null) return;
        var dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
        startX = null;
      });

      var resizeTimer;
      window.addEventListener("resize", function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () { buildDots(); update(false); }, 150);
      });
      buildDots();
      update(false);
    });
  }

  DC.ready(function () {
    initGallery();
    initReviews();
  });
})();
