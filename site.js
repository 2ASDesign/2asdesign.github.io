/* 2AS Design Consultancy — shared site script
   Edit CONFIG when the business email, WhatsApp number and social links are final. */
window.TWOAS = {
  CONFIG: {
    email: "2as.designcounsaltant@gmail.com", // 2AS business Gmail
    whatsapp: "201067034616",                // international format, digits only
    linkedin: "https://www.linkedin.com/in/sarah-saher-elkhoreby-3631a883/", // replace with the 2AS company page when created
    instagram: "",                           // add when the account exists
    formEndpoint: "https://formsubmit.co/ajax/" // brief answers are emailed through FormSubmit (free, no backend)
  }
};

(function () {
  var C = window.TWOAS.CONFIG;
  var page = document.body.getAttribute("data-page") || "";

  function t(en, ar) { return '<span lang="en">' + en + '</span><span lang="ar">' + ar + '</span>'; }

  var nav = [
    ["index.html#services", "Services", "الخدمات", "home"],
    ["review.html", "The 2AS Review", "مراجعة 2AS", "review"],
    ["index.html#work", "Experience", "الخبرة", "work"],
    ["partners.html", "Network", "الشركاء", "partners"],
    ["index.html#founder", "Founder", "المؤسِّسة", "founder"]
  ];

  var head = document.getElementById("site-head");
  if (head) {
    head.className = "site-head";
    head.innerHTML =
      '<div class="wrap">' +
        '<a class="brand" href="index.html" aria-label="2AS Design Consultancy, home">' +
          '<img src="2AS_mark_charcoal.svg" alt="" width="34" height="44">' +
          '<span><b>2AS</b><small>DESIGN CONSULTANCY</small></span></a>' +
        '<nav class="nav" id="nav" aria-label="Main">' +
          nav.map(function (n) {
            return '<a href="' + n[0] + '"' + (n[3] === page ? ' aria-current="page"' : '') + '>' + t(n[1], n[2]) + '</a>';
          }).join("") +
          '<a class="btn" href="brief.html" style="padding:10px 18px;min-height:40px">' + t("Start your brief", "ابدأ الاستبيان") + '</a>' +
        '</nav>' +
        '<div style="display:flex;gap:10px;align-items:center">' +
          '<button class="lang" id="lang-btn" type="button" aria-label="Switch language">' + t("العربية", "English") + '</button>' +
          '<button class="menu-btn" id="menu-btn" type="button" aria-expanded="false" aria-controls="nav">' + t("Menu", "القائمة") + '</button>' +
        '</div>' +
      '</div>';
  }

  var foot = document.getElementById("site-foot");
  if (foot) {
    foot.className = "site-foot";
    var wa = "https://wa.me/" + C.whatsapp;
    foot.innerHTML =
      '<div class="wrap">' +
        '<div class="cols">' +
          '<div style="display:grid;gap:14px">' +
            '<img src="2AS_full_gold.svg" alt="2AS Design Consultancy" style="width:150px;height:auto">' +
            '<p>' + t("We bring professional judgement to design. Online, across Saudi Arabia, the GCC and Egypt.",
                      "نُضيف إلى التصميم حُكمًا مهنيًا. عن بُعد، في السعودية والخليج ومصر.") + '</p>' +
          '</div>' +
          '<div style="display:grid;gap:8px;align-content:start">' +
            '<div class="label">' + t("Explore", "تصفّح") + '</div>' +
            '<a href="index.html#services">' + t("Services", "الخدمات") + '</a>' +
            '<a href="review.html">' + t("The 2AS Review", "مراجعة 2AS") + '</a>' +
            '<a href="partners.html">' + t("Partner network", "شبكة الشركاء") + '</a>' +
            '<a href="brief.html">' + t("Start your brief", "ابدأ الاستبيان") + '</a>' +
          '</div>' +
          '<div style="display:grid;gap:8px;align-content:start">' +
            '<div class="label">' + t("Contact", "تواصل") + '</div>' +
            '<a href="' + wa + '" target="_blank" rel="noopener">WhatsApp</a>' +
            '<a href="mailto:' + C.email + '">' + C.email + '</a>' +
            (C.linkedin ? '<a href="' + C.linkedin + '" target="_blank" rel="noopener">LinkedIn</a>' : '') +
            (C.instagram ? '<a href="' + C.instagram + '" target="_blank" rel="noopener">Instagram</a>' : '') +
          '</div>' +
        '</div>' +
        '<div class="bottom"><span>© <span id="yr"></span> 2AS Design Consultancy</span>' +
        '<span>' + t("Portfolio images: projects under the design direction and management of Sara Saher, published with the developer's approval.",
                     "صور المشاريع: مشاريع تحت توجيه وإدارة التصميم لسارة ساهر، منشورة بموافقة المطوّر.") + '</span></div>' +
      '</div>';
    var y = document.getElementById("yr"); if (y) y.textContent = new Date().getFullYear();
  }

  // language
  function getLang() {
    try { var s = localStorage.getItem("2as-lang"); if (s) return s; } catch (e) {}
    return (navigator.language || "").toLowerCase().indexOf("ar") === 0 ? "ar" : "en";
  }
  function setLang(l) {
    document.documentElement.lang = l;
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
    try { localStorage.setItem("2as-lang", l); } catch (e) {}
    document.dispatchEvent(new CustomEvent("langchange", { detail: l }));
  }
  setLang(getLang());
  document.addEventListener("click", function (e) {
    if (e.target.closest && e.target.closest("#lang-btn")) setLang(document.documentElement.lang === "ar" ? "en" : "ar");
    var m = e.target.closest && e.target.closest("#menu-btn");
    if (m) {
      var n = document.getElementById("nav");
      var open = n.classList.toggle("open");
      m.setAttribute("aria-expanded", open ? "true" : "false");
    }
  });
  window.TWOAS.lang = function () { return document.documentElement.lang; };
})();
