/* 2AS interactive brief: step navigation, validation, recommendation, submission */
(function () {
  var C = window.TWOAS.CONFIG;
  var form = document.getElementById("brief-form");
  var steps = Array.prototype.slice.call(form.querySelectorAll("fieldset[data-step]"));
  var navItems = Array.prototype.slice.call(document.querySelectorAll("#steps-nav li"));
  var prev = document.getElementById("prev"), next = document.getElementById("next"), send = document.getElementById("send");
  var err = document.getElementById("err");
  var cur = 1, total = steps.length;
  function ar() { return document.documentElement.lang === "ar"; }
  function L(en, a) { return ar() ? a : en; }

  // preselect from ?service=
  var q = new URLSearchParams(location.search).get("service");
  if (q === "review") check("svc", ["Review L2 Layout"]);
  if (q === "partners") check("svc", ["Partner: engineering"]);
  function check(name, vals) {
    form.querySelectorAll('input[name="' + name + '"]').forEach(function (i) { if (vals.indexOf(i.value) > -1) i.checked = true; });
  }

  // max 2 styles
  document.getElementById("styles").addEventListener("change", function (e) {
    var on = form.querySelectorAll('input[name="style"]:checked');
    if (on.length > 2) e.target.checked = false;
  });

  function show(n) {
    cur = n;
    steps.forEach(function (s) { s.hidden = +s.dataset.step !== n; });
    navItems.forEach(function (li) {
      var s = +li.dataset.s;
      li.classList.toggle("on", s === n); li.classList.toggle("done", s < n);
      if (s === n) li.setAttribute("aria-current", "step"); else li.removeAttribute("aria-current");
    });
    prev.style.visibility = n === 1 ? "hidden" : "visible";
    next.hidden = n === total; send.hidden = n !== total;
    err.textContent = "";
    if (n === total) buildSummary();
    var top = form.getBoundingClientRect().top + window.scrollY - 100;
    if (window.scrollY > top) window.scrollTo({ top: top, behavior: "smooth" });
  }

  function valid(n) {
    var fs = steps[n - 1];
    var bad = null;
    fs.querySelectorAll("[required]").forEach(function (el) {
      if (bad) return;
      if (el.type === "radio") {
        if (!form.querySelector('input[name="' + el.name + '"]:checked')) bad = el;
      } else if (el.type === "checkbox") {
        if (!el.checked) bad = el;
      } else if (!el.value.trim() || (el.type === "email" && !/^\S+@\S+\.\S+$/.test(el.value))) bad = el;
    });
    if (bad) {
      err.textContent = L("Please complete the required fields marked *.", "يُرجى استكمال الحقول المطلوبة المعلّمة بـ *.");
      if (bad.type === "checkbox" && bad.id === "consent") err.textContent = L("Please confirm we may contact you.", "يُرجى الموافقة على التواصل.");
      bad.focus();
      return false;
    }
    return true;
  }

  next.addEventListener("click", function () { if (valid(cur)) show(cur + 1); });
  prev.addEventListener("click", function () { if (cur > 1) show(cur - 1); });

  function val(name) {
    var el = form.elements[name];
    if (!el) return "";
    if (el.length !== undefined && el[0] && (el[0].type === "radio" || el[0].type === "checkbox")) {
      return Array.prototype.filter.call(el, function (i) { return i.checked; }).map(function (i) { return i.value; }).join(", ");
    }
    return (el.value || "").trim();
  }

  function recommend() {
    var status = val("status"), ptype = val("ptype"), clarity = +val("clarity") || 0, chosen = val("svc");
    var dev = /building|Serviced|Commercial/.test(ptype);
    var r;
    if (ptype.indexOf("Outdoor") === 0) r = ["Integrated Landscape", "تنسيق المساحات الخارجية"];
    else if (status === "3d") r = ["Working Drawings", "المخططات التنفيذية"];
    else if (status === "layout") r = dev ? ["The 2AS Review · Level 3, Full Design Review Report", "مراجعة 2AS · المستوى الثالث، تقرير متكامل"] : ["The 2AS Review · Level 2, Layout & Function", "مراجعة 2AS · المستوى الثاني، التوزيع والوظيفة"];
    else if (status === "moodboard") r = ["The 2AS Review · Level 1, Style Coherence, then Concept & Moodboard", "مراجعة 2AS · المستوى الأول، اتساق الطابع، ثم الفكرة ولوحة الإلهام"];
    else if (status === "construction") r = ["Design Consultation, then a targeted Review", "استشارة تصميم، ثم مراجعة مركّزة"];
    else r = clarity && clarity <= 2 ? ["Design Consultation, then Concept & Moodboard", "استشارة تصميم، ثم الفكرة ولوحة الإلهام"] : ["Full Interior Design", "التصميم الداخلي المتكامل"];
    return { en: r[0], ar: r[1], chosen: chosen };
  }

  var labels = [
    ["name", "Name", "الاسم"], ["email", "Email", "البريد"], ["phone", "WhatsApp", "واتساب"], ["country", "Lives in", "مكان الإقامة"],
    ["ptype", "Property", "العقار"], ["status", "Stage", "المرحلة"], ["area", "Area (m²)", "المساحة (م²)"], ["spaces", "Rooms / spaces", "الغرف / الفراغات"],
    ["plocation", "Project location", "موقع المشروع"], ["svc", "Services selected", "الخدمات المختارة"], ["household", "Users", "المستخدمون"],
    ["guests", "Guests", "الضيوف"], ["style", "Style", "الطابع"], ["clarity", "Vision clarity (1–5)", "وضوح الرؤية (1–5)"],
    ["budget", "Budget", "الميزانية"], ["start", "Execution start", "بدء التنفيذ"], ["files", "Files", "الملفات"], ["notes", "Notes", "ملاحظات"]
  ];
  var statusNames = { empty: "Empty space", moodboard: "References / moodboard", layout: "Has a layout or design", "3d": "Has 3D, no drawings", construction: "Under construction" };

  function data() {
    var o = {};
    labels.forEach(function (l) {
      var v = val(l[0]);
      if (l[0] === "status") v = statusNames[v] || v;
      if (l[0] === "budget" && v) v = val("currency") + " " + v;
      o[l[1]] = v;
    });
    return o;
  }

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function buildSummary() {
    var r = recommend();
    document.getElementById("reco").innerHTML =
      '<div class="label">' + L("Our first recommendation", "ترشيحنا المبدئي") + '</div>' +
      '<div style="font-family:var(--f-display);font-size:24px">' + esc(ar() ? r.ar : r.en) + '</div>' +
      '<div class="note">' + L("We'll confirm the right scope on our introductory call. Every project is quoted individually.", "نؤكد النطاق المناسب في مكالمة التعارف، ويُسعَّر كل مشروع على حدة.") + '</div>';
    var d = data(), html = "<dl>";
    labels.forEach(function (l) { var v = d[l[1]]; if (v) html += "<dt>" + esc(ar() ? l[2] : l[1]) + "</dt><dd>" + esc(v) + "</dd>"; });
    document.getElementById("summary").innerHTML = html + "</dl>";
  }
  document.addEventListener("langchange", function () { if (cur === total) buildSummary(); });

  function waText() {
    var d = data(), r = recommend();
    var lines = ["Hello 2AS, I've just sent my project brief.", ""];
    Object.keys(d).forEach(function (k) { if (d[k]) lines.push(k + ": " + d[k]); });
    lines.push("", "Suggested: " + r.en);
    return "https://wa.me/" + C.whatsapp + "?text=" + encodeURIComponent(lines.join("\n"));
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!valid(cur)) return;
    var d = data(), r = recommend();
    var payload = Object.assign({ _subject: "New 2AS brief: " + (d["Name"] || "") + " · " + (d["Property"] || ""), _template: "table", _captcha: "false", "Suggested service": r.en, "Language": document.documentElement.lang }, d);
    send.disabled = true;
    err.textContent = L("Sending…", "جارٍ الإرسال…");
    fetch(C.formEndpoint + encodeURIComponent(C.email), {
      method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(payload)
    }).then(function (res) { return res.json().catch(function () { return {}; }).then(function (j) { if (!res.ok || j.success === "false") throw new Error("send"); }); })
      .then(done)
      .catch(function () {
        send.disabled = false;
        err.innerHTML = L("We couldn't send the form automatically. Please send it on WhatsApp instead: ", "تعذّر الإرسال التلقائي. يُرجى إرساله عبر واتساب: ") +
          '<a href="' + waText() + '" target="_blank" rel="noopener">WhatsApp</a>';
      });
  });

  function done() {
    steps.forEach(function (s) { s.hidden = true; });
    document.getElementById("form-nav").hidden = true;
    err.textContent = "";
    document.getElementById("done").hidden = false;
    document.getElementById("wa-done").href = waText();
    navItems.forEach(function (li) { li.classList.remove("on"); li.classList.add("done"); });
  }

  show(1);
})();
