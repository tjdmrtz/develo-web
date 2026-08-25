
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
    function setOpen(open) {
      btn.setAttribute("aria-expanded", String(open));
      if (menu.classList) { menu.classList.toggle("open", open); }
      if (doc.body && doc.body.classList) { doc.body.classList.toggle("nav-open", open); }
    }
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      setOpen(!open);
    });
    if (doc.addEventListener) {
      doc.addEventListener("keydown", function (event) {
        if (event.key === "Escape") { setOpen(false); }
      });
    }
  }

  function initReveal(doc, win) {
    if (!win || !doc.documentElement || !doc.querySelectorAll) { return; }
    var reduce = win.matchMedia && win.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var items = Array.prototype.slice.call(doc.querySelectorAll("[data-reveal]"));
    if (reduce || typeof win.IntersectionObserver !== "function") {
      items.forEach(function (item) { if (item.classList) { item.classList.add("is-visible"); } });
      return;
    }
    doc.documentElement.classList.add("motion-ready");
    var observer = new win.IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && entry.target.classList) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8%", threshold: 0.08 });
    items.forEach(function (item) { observer.observe(item); });
  }

  function initSpatialHero(doc, win) {
    if (!win || !doc.querySelector || !doc.querySelectorAll) { return; }
    var room = doc.querySelector("[data-spatial-hero]");
    if (!room || !room.addEventListener ||
        (win.matchMedia && win.matchMedia("(prefers-reduced-motion: reduce)").matches)) { return; }
    var planes = Array.prototype.slice.call(room.querySelectorAll("[data-motion]"));
    function updatePlanes(pointerX, pointerY) {
      if (room.style) {
        room.style.setProperty("--pointer-x", pointerX.toFixed(3));
        room.style.setProperty("--pointer-y", pointerY.toFixed(3));
      }
      planes.forEach(function (plane) {
        if (!plane.style || !plane.getAttribute) { return; }
        var travel = Number(plane.getAttribute("data-travel")) || 0;
        var axis = plane.getAttribute("data-motion");
        var input = axis === "x" ? pointerY : pointerY * 0.78 + pointerX * 0.22;
        plane.style.setProperty("--plane-shift", (input * travel).toFixed(2) + "px");
      });
    }
    room.addEventListener("pointermove", function (event) {
      if (!room.getBoundingClientRect || !room.style) { return; }
      var rect = room.getBoundingClientRect();
      var x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      var y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      updatePlanes(Math.max(-1, Math.min(1, x)), Math.max(-1, Math.min(1, y)));
    });
    room.addEventListener("pointerleave", function () {
      updatePlanes(0, 0);
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
    initReveal(document, typeof window !== "undefined" ? window : undefined);
    initSpatialHero(document, typeof window !== "undefined" ? window : undefined);
    showEdgeInfo(document, typeof window !== "undefined" ? window : undefined);
  }
})();
