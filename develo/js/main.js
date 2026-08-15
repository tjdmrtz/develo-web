
(function () {
  "use strict";

  function setYear(doc) {
    var el = doc.getElementById("year");
    if (el) { el.textContent = String(new Date().getFullYear()); }
  }

  function initNav(doc) {
    var btn = doc.querySelector("[data-nav-toggle]");
    var menu = doc.querySelector("[data-nav-menu]");
    if (!btn || !menu) { return; }
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      if (menu.classList) { menu.classList.toggle("open", !open); }
    });
  }

  function showEdgeInfo(doc, win) {
    var el = doc.getElementById("deploy-info");
    if (!el || typeof win === "undefined" || !win || !win.location) { return; }
    if (typeof fetch === "undefined") { return; }
    try {
      fetch(win.location.href, { method: "HEAD" }).then(function (res) {
        var region = res.headers.get("X-Edge-Location");
        if (region) { el.textContent = "Served from CloudFront edge: " + region; }
      }).catch(function () { /* header not exposed — no problem */ });
    } catch (e) { /* not in a browser context */ }
  }

  if (typeof document !== "undefined") {
    setYear(document);
    initNav(document);
    showEdgeInfo(document, typeof window !== "undefined" ? window : undefined);
  }
})();
