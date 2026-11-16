/* ==========================================================================
   DentalCare Studio — forms.js
   Moduli dimostrativi (richiesta informazioni / prima visita, contatto):
   validazione lato client, errori accanto ai campi, riepilogo, conferma.

   PRIVACY DEMO: questo script NON invia richieste di rete e NON salva dati
   (niente fetch, niente localStorage/sessionStorage, niente cookie).
   Alla conferma i dati vengono cancellati dalla pagina.
   ========================================================================== */
(function () {
  "use strict";
  var DC = window.DC;
  if (!DC) return;
  var D = DC.data;

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var PHONE_RE = /^\+?[0-9\s().-]{6,20}$/;

  function fieldError(el, message) {
    var errId = (el.getAttribute("aria-describedby") || "").split(" ").filter(function (x) { return /-err$/.test(x); })[0];
    var errEl = errId ? document.getElementById(errId) : null;
    if (errEl) errEl.textContent = message || "";
    if (message) el.setAttribute("aria-invalid", "true"); else el.removeAttribute("aria-invalid");
  }

  function validateField(form, el) {
    var name = el.getAttribute("name");
    var label = el.getAttribute("data-label") || name;
    var value = (el.value || "").trim();

    if (el.type === "checkbox") {
      return el.required && !el.checked ? "Conferma di aver letto la nota privacy dimostrativa." : "";
    }
    if (el.required && !value) {
      if (el.tagName === "SELECT") return "Seleziona un'opzione per “" + label + "”.";
      return "Compila il campo “" + label + "”.";
    }
    if (!value) return "";
    var min = Number(el.getAttribute("minlength")) || 0;
    if (min && value.length < min) return "“" + label + "” deve contenere almeno " + min + " caratteri.";
    var max = Number(el.getAttribute("maxlength")) || 0;
    if (max && value.length > max) return "“" + label + "” può contenere al massimo " + max + " caratteri.";
    if (el.getAttribute("data-validate") === "email" && !EMAIL_RE.test(value)) return "Inserisci un indirizzo email valido, ad esempio nome@esempio.example.";
    if (el.getAttribute("data-validate") === "phone" && !PHONE_RE.test(value)) return "Inserisci un numero valido (solo cifre, spazi e prefisso +) oppure lascia il campo vuoto.";
    if (name === "nome" && /[0-9]/.test(value)) return "Il nome non dovrebbe contenere numeri.";
    return "";
  }

  function validateRadioGroup(form, groupName) {
    var group = DC.qs('[data-group="' + groupName + '"]', form);
    if (!group) return "";
    var checked = DC.qs('input[name="' + groupName + '"]:checked', form);
    var holder = DC.qs(".choice-group", group);
    var message = checked ? "" : "Scegli una fascia oraria.";
    fieldError(holder, message);
    return message;
  }

  function collect(form) {
    var fd = new FormData(form);
    var out = {};
    fd.forEach(function (v, k) { out[k] = String(v).trim(); });
    return out;
  }

  function summaryRows(type, values) {
    var rows = [];
    if (type === "request") {
      var s = DC.service(values.servizio);
      rows.push(["Tipo di richiesta", values.tipo === "prima-visita" ? "Prima visita" : "Informazioni su un servizio"]);
      rows.push(["Nome", values.nome]);
      rows.push(["Email", values.email]);
      rows.push(["Telefono", values.telefono || "Non indicato"]);
      rows.push(["Servizio", s ? s.name : "—"]);
      rows.push(["Giorno preferito", values.giorno]);
      rows.push(["Fascia oraria", values.fascia]);
      rows.push(["Messaggio", values.messaggio || "Nessun messaggio"]);
    } else {
      rows.push(["Nome", values.nome]);
      rows.push(["Email", values.email]);
      rows.push(["Messaggio", values.messaggio]);
    }
    return rows.map(function (r) {
      return "<div><dt>" + DC.esc(r[0]) + "</dt><dd>" + DC.esc(r[1]) + "</dd></div>";
    }).join("");
  }

  function initForm(form) {
    var rootEl = form.closest("[data-form-root]");
    var steps = {
      form: DC.qs('[data-form-step="form"]', rootEl),
      summary: DC.qs('[data-form-step="summary"]', rootEl),
      success: DC.qs('[data-form-step="success"]', rootEl)
    };
    var errorBox = DC.qs("[data-form-errors]", rootEl);
    var type = form.getAttribute("data-demo-form");
    var submitted = false;

    /* Opzioni servizio da SITE_DATA + precompilazione da URL (?servizio=&tipo=) */
    var select = DC.qs("[data-service-select]", form);
    if (select) {
      select.insertAdjacentHTML("beforeend", D.services.map(function (s) {
        return '<option value="' + DC.esc(s.id) + '">' + DC.esc(s.name) + "</option>";
      }).join(""));
      var pre = DC.params.get("servizio");
      if (pre && DC.service(pre)) select.value = pre;
    }
    var tipoParam = DC.params.get("tipo");
    var tipoRadio = tipoParam ? DC.qs('input[name="tipo"][value="' + tipoParam + '"]', form) : null;
    if (tipoRadio && tipoRadio.type === "radio") tipoRadio.checked = true;

    function syncMode() {
      var tipo = (DC.qs('input[name="tipo"]:checked', form) || DC.qs('input[name="tipo"]', form) || {}).value;
      if (select && tipo === "prima-visita" && !select.value) select.value = "prima-visita";
    }
    form.addEventListener("change", function (e) { if (e.target.name === "tipo") syncMode(); });
    syncMode();
    if (DC.syncChecked) DC.syncChecked();

    /* Contatore caratteri */
    var textarea = DC.qs("textarea", form);
    var counter = DC.qs("[data-char-count]", form);
    function updateCount() {
      if (textarea && counter) counter.textContent = textarea.value.length + " / " + (textarea.getAttribute("maxlength") || 500) + " caratteri";
    }
    if (textarea) textarea.addEventListener("input", updateCount);

    function fields() { return DC.qsa("input:not([type=radio]):not([type=hidden]), select, textarea", form); }

    function validateAll() {
      var errors = [];
      fields().forEach(function (el) {
        var msg = validateField(form, el);
        fieldError(el, msg);
        if (msg) errors.push({ el: el, msg: msg });
      });
      var radioMsg = validateRadioGroup(form, "fascia");
      if (radioMsg) errors.push({ el: DC.qs('input[name="fascia"]', form), msg: radioMsg });
      return errors;
    }

    /* Rivalidazione dal vivo dopo il primo invio */
    form.addEventListener("input", function (e) {
      if (!submitted) return;
      if (e.target.name === "fascia") validateRadioGroup(form, "fascia");
      else if (e.target.matches("input, select, textarea")) fieldError(e.target, validateField(form, e.target));
    });
    form.addEventListener("change", function (e) {
      if (submitted && e.target.name === "fascia") validateRadioGroup(form, "fascia");
    });
    form.addEventListener("focusout", function (e) {
      var el = e.target;
      if (!el.matches("input:not([type=radio]):not([type=checkbox]), select, textarea")) return;
      if (submitted || (el.value || "").trim()) fieldError(el, validateField(form, el));
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      submitted = true;
      var errors = validateAll();
      if (errors.length) {
        errorBox.innerHTML = DC.icon("alert") + "<div><strong>" +
          (errors.length === 1 ? "C'è un campo da correggere." : "Ci sono " + errors.length + " campi da correggere.") +
          "</strong>Controlla i messaggi accanto ai campi evidenziati.</div>";
        errorBox.hidden = false;
        errors[0].el.focus();
        return;
      }
      errorBox.hidden = true;
      DC.qs("[data-summary]", rootEl).innerHTML = summaryRows(type, collect(form));
      show("summary");
    });

    form.addEventListener("reset", function () {
      setTimeout(function () {
        submitted = false;
        errorBox.hidden = true;
        DC.qsa("[aria-invalid]", form).forEach(function (el) { fieldError(el, ""); });
        updateCount();
        syncMode();
      }, 0);
    });

    function show(step) {
      Object.keys(steps).forEach(function (k) { if (steps[k]) steps[k].hidden = k !== step; });
      var heading = DC.qs("h2", steps[step]);
      rootEl.scrollIntoView({ behavior: DC.reducedMotion ? "auto" : "smooth", block: "start" });
      if (heading) {
        if (!heading.hasAttribute("tabindex")) heading.setAttribute("tabindex", "-1");
        heading.focus({ preventScroll: true });
      }
    }

    rootEl.addEventListener("click", function (e) {
      var action = e.target.closest("[data-action]");
      if (!action) return;
      var a = action.getAttribute("data-action");
      if (a === "edit") {
        show("form");
      } else if (a === "confirm") {
        /* Simulazione: nessun invio, nessun salvataggio. Si cancellano i dati. */
        DC.qs("[data-summary]", rootEl).innerHTML = "";
        form.reset();
        show("success");
      } else if (a === "restart") {
        show("form");
      }
    });
  }

  DC.ready(function () {
    DC.qsa("form[data-demo-form]").forEach(initForm);
  });
})();
