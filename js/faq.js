/* ==========================================================================
   DentalCare Studio — faq.js
   Elenchi FAQ incorporati (home, prima visita) e pagina FAQ con ricerca,
   filtro per categoria, accordion accessibili e stato "nessun risultato".
   ========================================================================== */
(function () {
  "use strict";
  var DC = window.DC;
  if (!DC) return;
  var D = DC.data;

  /* Elenchi incorporati: data-faq-from="home" | data-faq-ids | data-faq-categories */
  function renderLists() {
    DC.qsa('[data-render="faq-list"]').forEach(function (el, n) {
      var items = [];
      if (el.dataset.faqFrom === "home") {
        items = (D.homeFaqIds || []).map(function (id) { return DC.findById(D.faqs, id); });
      } else if (el.dataset.faqIds) {
        items = el.dataset.faqIds.split(",").map(function (id) { return DC.findById(D.faqs, id.trim()); });
      } else if (el.dataset.faqCategories) {
        var cats = el.dataset.faqCategories.split(",");
        items = D.faqs.filter(function (f) { return cats.indexOf(f.category) !== -1; });
      }
      el.innerHTML = DC.renderAccordion(items.filter(Boolean), {
        headingLevel: Number(el.dataset.headingLevel) || 3,
        idPrefix: "faq" + n
      });
    });
  }

  /* Pagina FAQ */
  function initBrowser() {
    var section = DC.qs('[data-render="faq-browser"]');
    if (!section) return;
    var search = DC.qs("#faq-search");
    var chips = DC.qs("#faq-chips");
    var results = DC.qs("#faq-results");
    var empty = DC.qs("#faq-empty");
    var count = DC.qs("#faq-count");
    var reset = DC.qs("#faq-reset");
    var state = { q: "", cat: "tutte" };
    var initialCat = DC.params.get("categoria");
    if (initialCat && DC.findById(D.faqCategories, initialCat)) state.cat = initialCat;

    var options = [{ id: "tutte", label: "Tutte" }].concat(D.faqCategories);
    chips.innerHTML = options.map(function (c) {
      return '<button type="button" class="chip" data-cat="' + DC.esc(c.id) + '" aria-pressed="false">' + DC.esc(c.label) + "</button>";
    }).join("");

    function render() {
      var terms = DC.normalize(state.q).split(/\s+/).filter(Boolean);
      var list = D.faqs.filter(function (f) {
        var okCat = state.cat === "tutte" || f.category === state.cat;
        var text = DC.normalize(f.q + " " + f.a);
        return okCat && terms.every(function (t) { return text.indexOf(t) !== -1; });
      });
      var html = "";
      D.faqCategories.forEach(function (c) {
        var group = list.filter(function (f) { return f.category === c.id; });
        if (!group.length) return;
        html += '<div class="accordion-group"><h2>' + DC.esc(c.label) + '</h2><div class="accordion">' +
          DC.renderAccordion(group, { headingLevel: 3, idPrefix: "faqp" }) + "</div></div>";
      });
      results.innerHTML = html;
      results.hidden = !list.length;
      empty.hidden = !!list.length;
      count.textContent = list.length === 1 ? "1 domanda" : list.length + " domande";
      reset.disabled = !state.q && state.cat === "tutte";
      DC.qsa(".chip", chips).forEach(function (chip) {
        chip.setAttribute("aria-pressed", String(chip.dataset.cat === state.cat));
      });
    }
    function clearAll() { state.q = ""; state.cat = "tutte"; search.value = ""; render(); search.focus(); }

    search.addEventListener("input", function () { state.q = search.value.trim(); render(); });
    chips.addEventListener("click", function (e) {
      var chip = e.target.closest(".chip");
      if (!chip) return;
      state.cat = chip.dataset.cat;
      render();
    });
    reset.addEventListener("click", clearAll);
    section.addEventListener("click", function (e) { if (e.target.closest("[data-faq-reset]")) clearAll(); });
    render();
  }

  DC.ready(function () {
    renderLists();
    initBrowser();
  });
})();
