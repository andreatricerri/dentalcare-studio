/* ==========================================================================
   DentalCare Studio — services.js
   Card servizio, servizi in evidenza (home), catalogo con ricerca e filtri
   (servizi.html) e pagina di dettaglio dinamica (servizio.html?id=...).
   ========================================================================== */
(function () {
  "use strict";
  var DC = window.DC;
  if (!DC) return;
  var D = DC.data;

  /* --------------------------------------------------------- card servizio */
  DC.renderServiceCard = function (s, opts) {
    opts = opts || {};
    var level = opts.headingLevel || 3;
    var cat = DC.category(s.category);
    var member = DC.member(s.teamId);
    var url = "servizio.html?id=" + encodeURIComponent(s.id);
    var previewId = "preview-" + s.id + (opts.suffix || "");
    var preview = opts.preview === false ? "" :
      '<button type="button" class="card__preview-toggle" aria-expanded="false" aria-controls="' + previewId + '">' +
      "Anteprima" + DC.icon("chevron-down") + '<span class="visually-hidden"> di ' + DC.esc(s.name) + "</span></button>" +
      '<div class="card__preview" id="' + previewId + '" hidden><p><strong>Obiettivo:</strong> ' + DC.esc(s.goal) + "</p>" +
      (member ? '<p style="margin-top:.4rem"><strong>Referente:</strong> ' + DC.esc(member.name) + ", " + DC.esc(member.role.toLowerCase()) + "</p>" : "") + "</div>";

    return '<article class="card card--hover reveal">' +
      '<div class="card__media">' + DC.img(s.image, { width: 800, height: 500, alt: "" }) + "</div>" +
      '<div class="card__body">' +
      (cat ? '<span class="badge service-category-badge">' + DC.esc(cat.label) + "</span>" : "") +
      "<h" + level + ">" + DC.esc(s.name) + "</h" + level + ">" +
      "<p>" + DC.esc(s.summary) + "</p>" + preview +
      '<div class="card__footer"><a class="btn btn--secondary btn--sm" href="' + url + '">Scopri il servizio<span class="visually-hidden">: ' + DC.esc(s.name) + "</span> " + DC.icon("arrow-right") + "</a></div>" +
      "</div></article>";
  };

  /* Anteprima espandibile (delegata) */
  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".card__preview-toggle");
    if (!btn) return;
    var panel = document.getElementById(btn.getAttribute("aria-controls"));
    var open = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!open));
    if (panel) panel.hidden = open;
  });

  /* ---------------------------------------------------- servizi in evidenza */
  function renderFeatured() {
    DC.qsa('[data-render="featured-services"]').forEach(function (el) {
      var list = D.services.filter(function (s) { return s.featured; }).slice(0, 6);
      el.innerHTML = list.map(function (s) { return DC.renderServiceCard(s, { suffix: "-home" }); }).join("");
      DC.observeReveal(el);
    });
  }

  /* ------------------------------------------------- catalogo con filtri */
  function initCatalog() {
    var section = DC.qs('[data-render="services-catalog"]');
    if (!section) return;
    var search = DC.qs("#service-search");
    var chipsEl = DC.qs("#category-chips");
    var grid = DC.qs("#services-grid");
    var empty = DC.qs("#services-empty");
    var count = DC.qs("#results-count");
    var reset = DC.qs("#reset-filters");
    var state = { q: DC.params.get("q") || "", cats: [] };

    var initialCat = DC.params.get("categoria");
    if (initialCat && DC.category(initialCat)) state.cats.push(initialCat);
    search.value = state.q;

    chipsEl.innerHTML = D.categories.map(function (c) {
      return '<button type="button" class="chip" data-cat="' + DC.esc(c.id) + '" aria-pressed="false">' + DC.esc(c.label) + "</button>";
    }).join("");

    function haystack(s) {
      var cat = DC.category(s.category);
      return DC.normalize([s.name, s.summary, s.intro, (s.keywords || []).join(" "), cat ? cat.label : ""].join(" "));
    }
    function matches(s) {
      var okCat = !state.cats.length || state.cats.indexOf(s.category) !== -1;
      var terms = DC.normalize(state.q).split(/\s+/).filter(Boolean);
      var text = haystack(s);
      var okText = terms.every(function (t) { return text.indexOf(t) !== -1; });
      return okCat && okText;
    }
    function updateUrl() {
      if (!window.history || !history.replaceState) return;
      var p = new URLSearchParams();
      if (state.q) p.set("q", state.q);
      if (state.cats.length === 1) p.set("categoria", state.cats[0]);
      var qs = p.toString();
      history.replaceState(null, "", window.location.pathname + (qs ? "?" + qs : ""));
    }
    function render() {
      var list = D.services.filter(matches);
      grid.innerHTML = list.map(function (s) { return DC.renderServiceCard(s, { headingLevel: 2 }); }).join("");
      grid.hidden = list.length === 0;
      empty.hidden = list.length !== 0;
      var active = !!state.q || state.cats.length > 0;
      reset.disabled = !active;
      count.textContent = list.length === 1 ? "1 servizio trovato" :
        list.length + " servizi trovati" + (active ? "" : " in totale");
      DC.qsa(".chip", chipsEl).forEach(function (chip) {
        chip.setAttribute("aria-pressed", String(state.cats.indexOf(chip.dataset.cat) !== -1));
      });
      DC.observeReveal(grid);
      updateUrl();
    }
    function clearAll() {
      state.q = ""; state.cats = []; search.value = "";
      render();
      search.focus();
    }

    search.addEventListener("input", function () { state.q = search.value.trim(); render(); });
    chipsEl.addEventListener("click", function (e) {
      var chip = e.target.closest(".chip");
      if (!chip) return;
      var id = chip.dataset.cat;
      var idx = state.cats.indexOf(id);
      if (idx === -1) state.cats.push(id); else state.cats.splice(idx, 1);
      render();
    });
    reset.addEventListener("click", clearAll);
    section.addEventListener("click", function (e) { if (e.target.closest("[data-reset-filters]")) clearAll(); });
    render();
  }

  /* ---------------------------------------------------- dettaglio servizio */
  function initDetail() {
    var section = DC.qs('[data-render="service-detail"]');
    if (!section) return;
    var id = DC.params.get("id");
    var s = id ? DC.service(id) : null;
    var title = DC.qs("#service-title");
    var intro = DC.qs("#service-intro");
    var content = DC.qs("#service-content");
    var crumb = DC.qs("#crumb-current");

    if (!s) {
      var reason = id
        ? "Il servizio richiesto (“" + DC.esc(id) + "”) non esiste o potrebbe essere stato rinominato."
        : "Nell'indirizzo non è indicato alcun servizio.";
      title.textContent = "Servizio non trovato";
      intro.innerHTML = reason + " Puoi tornare all'elenco completo o scegliere uno dei servizi qui sotto.";
      if (crumb) crumb.textContent = "Servizio non trovato";
      document.title = "Servizio non trovato · DentalCare Studio (demo)";
      content.innerHTML =
        '<div class="not-found">' +
        '<div class="cluster" style="margin-bottom:2rem"><a class="btn" href="servizi.html">' + DC.icon("arrow-left") + " Vai a tutti i servizi</a>" +
        '<a class="btn btn--secondary" href="contatti.html">Contattaci</a></div>' +
        '<h2 style="font-size:1.3rem;margin-bottom:1rem">Servizi disponibili</h2><ul class="check-list">' +
        D.services.map(function (x) { return '<li><a href="servizio.html?id=' + encodeURIComponent(x.id) + '">' + DC.esc(x.name) + "</a></li>"; }).join("") +
        "</ul></div>";
      return;
    }

    var cat = DC.category(s.category);
    var member = DC.member(s.teamId);
    var infoUrl = "preventivo.html?tipo=informazioni&servizio=" + encodeURIComponent(s.id);
    document.title = s.name + " · DentalCare Studio (demo)";
    var meta = DC.qs('meta[name="description"]');
    if (meta) meta.setAttribute("content", s.summary);
    title.textContent = s.name;
    intro.textContent = s.intro;
    if (crumb) crumb.textContent = s.name;
    if (cat) DC.qs("[data-service-badge]").innerHTML = '<a class="badge" href="servizi.html?categoria=' + encodeURIComponent(cat.id) + '">' + DC.esc(cat.label) + "</a>";
    var actions = DC.qs("#service-actions");
    actions.innerHTML = '<a class="btn" href="' + infoUrl + '">' + DC.icon("chat") + " Richiedi informazioni</a>" +
      '<a class="btn btn--secondary" href="preventivo.html?tipo=prima-visita&servizio=' + encodeURIComponent(s.id) + '">Prenota la prima visita</a>';
    actions.hidden = false;
    DC.qs("#service-media").innerHTML = '<div class="media media--16x10">' + DC.img(s.image, { width: 800, height: 500, eager: true }) + "</div>";

    var faqs = (s.faqIds || []).map(function (fid) { return DC.findById(D.faqs, fid); }).filter(Boolean);

    content.innerHTML =
      '<div class="service-layout"><div>' +
      '<div class="service-block"><h2>Obiettivo generale</h2><p>' + DC.esc(s.goal) + "</p></div>" +
      '<div class="service-block"><h2>Come si svolge una valutazione</h2><ol class="num-list">' +
      s.evaluation.map(function (x) { return "<li>" + DC.esc(x) + "</li>"; }).join("") + "</ol></div>" +
      '<div class="service-block"><h2>Aspetti da discutere con il professionista</h2><ul class="check-list">' +
      s.discuss.map(function (x) { return "<li>" + DC.esc(x) + "</li>"; }).join("") + "</ul></div>" +
      '<div class="service-block"><div class="info-box">' + DC.icon("info") +
      "<p>Queste informazioni sono generali e non costituiscono una diagnosi né un'indicazione di terapia. Indicazioni e piano di cura dipendono dalla valutazione clinica del professionista.</p></div></div>" +
      (faqs.length ? '<div class="service-block"><h2>Domande frequenti</h2><div class="accordion">' +
        DC.renderAccordion(faqs, { headingLevel: 3, idPrefix: "sfaq" }) + "</div></div>" : "") +
      "</div>" +
      '<aside class="service-aside aside-stack" aria-label="Professionista e richiesta informazioni">' +
      (member ? '<div class="card card--pad" style="gap:1rem"><p class="small muted">Professionista di riferimento</p>' +
        '<div class="pro-mini"><img src="' + DC.esc(member.avatar) + '" alt="" width="72" height="72" loading="lazy">' +
        "<div><strong>" + DC.esc(member.name) + '</strong><br><span class="team-card__role">' + DC.esc(member.role) + "</span></div></div>" +
        '<p class="muted small">' + DC.esc(member.bio) + "</p>" +
        '<button type="button" class="btn btn--secondary btn--sm" data-team-modal="' + DC.esc(member.id) + '">Conosci il professionista</button>' +
        '<p class="small muted">Profilo dimostrativo con nome fittizio.</p></div>' : "") +
      '<div class="card card--pad" style="gap:.9rem;background:var(--accent-soft);border-color:#C9DFEA"><h2 style="font-size:1.15rem">Hai domande su questo servizio?</h2>' +
      "<p class=\"muted\">Il modulo verrà precompilato con “" + DC.esc(s.name) + "”.</p>" +
      '<a class="btn btn--block" href="' + infoUrl + '">Richiedi informazioni</a></div>' +
      "</aside></div>";

    var related = (s.related || []).map(DC.service).filter(Boolean);
    if (related.length) {
      DC.qs("#related-grid").innerHTML = related.map(function (r) { return DC.renderServiceCard(r, { headingLevel: 3, preview: false }); }).join("");
      DC.qs("#related-section").hidden = false;
      DC.observeReveal(DC.qs("#related-grid"));
    }
  }

  DC.ready(function () {
    renderFeatured();
    initCatalog();
    initDetail();
  });
})();
