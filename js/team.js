/* ==========================================================================
   DentalCare Studio — team.js
   Card professionisti (team.html e anteprima in home) e modale profilo.
   La modale si apre anche da URL: team.html#profilo-<id>
   ========================================================================== */
(function () {
  "use strict";
  var DC = window.DC;
  if (!DC) return;
  var D = DC.data;

  function card(m, compact) {
    return '<article class="card team-card' + (compact ? " team-card--compact" : "") + ' card--hover reveal" id="profilo-' + DC.esc(m.id) + '">' +
      '<div class="card__media">' + DC.img({ src: m.avatar, alt: "Avatar illustrato di " + m.name + " (profilo dimostrativo)" }, { width: 400, height: 400 }) + "</div>" +
      '<div class="card__body">' +
      "<h" + (compact ? 3 : 2) + ' style="font-size:1.2rem">' + DC.esc(m.name) + "</h" + (compact ? 3 : 2) + ">" +
      '<p class="team-card__role">' + DC.esc(m.role) + "</p>" +
      (compact ? "" :
        "<p>" + DC.esc(m.bio) + "</p>" +
        '<div class="badge-list" aria-label="Aree di attività">' + m.areas.map(function (a) { return '<span class="badge badge--neutral">' + DC.esc(a) + "</span>"; }).join("") + "</div>" +
        '<p class="team-meta"><strong>Lingue:</strong> ' + DC.esc(m.languages.join(", ")) + "</p>") +
      '<div class="card__footer"><button type="button" class="btn ' + (compact ? "btn--ghost btn--sm" : "btn--secondary btn--sm") + '" data-team-modal="' + DC.esc(m.id) + '">' +
      "Conosci il professionista" + '<span class="visually-hidden">: ' + DC.esc(m.name) + "</span></button></div>" +
      "</div></article>";
  }

  DC.openMemberModal = function (id) {
    var m = DC.member(id);
    if (!m) return;
    var services = (m.services || []).map(DC.service).filter(Boolean);
    var first = services[0];
    DC.openModal({
      title: m.name,
      className: "modal--wide",
      html:
        '<div class="modal-profile">' +
        DC.img({ src: m.avatar, alt: "Avatar illustrato di " + m.name }, { width: 400, height: 400 }) +
        '<div class="stack">' +
        '<p class="team-card__role">' + DC.esc(m.role) + "</p>" +
        "<p>" + DC.esc(m.longBio) + "</p>" +
        '<div><h3 style="font-size:1rem;margin-bottom:.5rem">Aree di attività</h3><div class="badge-list">' +
        m.areas.map(function (a) { return '<span class="badge badge--neutral">' + DC.esc(a) + "</span>"; }).join("") + "</div></div>" +
        '<p class="team-meta"><strong>Lingue:</strong> ' + DC.esc(m.languages.join(", ")) + "</p>" +
        (services.length ? '<div><h3 style="font-size:1rem;margin-bottom:.5rem">Servizi seguiti</h3><ul class="check-list">' +
          services.map(function (s) { return '<li><a href="servizio.html?id=' + encodeURIComponent(s.id) + '">' + DC.esc(s.name) + "</a></li>"; }).join("") + "</ul></div>" : "") +
        "</div></div>" +
        '<div class="info-box info-box--demo">' + DC.icon("info") + "<p>Profilo dimostrativo: nome fittizio e avatar illustrato. Non sono indicati titoli o iscrizioni.</p></div>" +
        '<div class="cluster">' +
        (first ? '<a class="btn" href="preventivo.html?tipo=informazioni&servizio=' + encodeURIComponent(first.id) + '">Richiedi informazioni</a>' : "") +
        '<button type="button" class="btn btn--secondary" data-close>Chiudi</button></div>'
    });
  };

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-team-modal]");
    if (btn) DC.openMemberModal(btn.getAttribute("data-team-modal"));
  });

  DC.ready(function () {
    DC.qsa('[data-render="team-grid"]').forEach(function (el) {
      el.innerHTML = D.team.map(function (m) { return card(m, false); }).join("");
      DC.observeReveal(el);
    });
    DC.qsa('[data-render="team-preview"]').forEach(function (el) {
      el.innerHTML = D.team.map(function (m) { return card(m, true); }).join("");
      DC.observeReveal(el);
    });
    var hash = window.location.hash.replace("#profilo-", "");
    if (hash && hash !== window.location.hash && DC.member(hash) && DC.qs('[data-render="team-grid"]')) {
      DC.openMemberModal(hash);
    }
  });
})();
