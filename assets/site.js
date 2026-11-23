// Félagið Ísland-Palestína v2.0: menu, copy buttons, mail forms, photo viewer.
(function () {
  "use strict";

  // mobile menu
  var btn = document.querySelector(".menu-btn"), nav = document.getElementById("nav");
  if (btn && nav) btn.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });

  // copy bank details
  document.querySelectorAll("[data-copy]").forEach(function (b) {
    b.addEventListener("click", function () {
      var text = b.getAttribute("data-copy"), label = b.textContent;
      var done = function () { b.classList.add("done"); b.textContent = "Afritað"; setTimeout(function () { b.classList.remove("done"); b.textContent = label; }, 1600); };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () {});
      else { var t = document.createElement("textarea"); t.value = text; document.body.appendChild(t); t.select(); try { document.execCommand("copy"); done(); } catch (e) {} t.remove(); }
    });
  });

  // forms without a server: open the visitor's own mail app with the message filled in
  document.querySelectorAll("form[data-mailto]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!f.reportValidity()) return;
      var lines = [];
      f.querySelectorAll("input, textarea").forEach(function (el) {
        if (el.value.trim()) lines.push(el.getAttribute("data-label") + ": " + el.value.trim());
      });
      var url = "mailto:" + f.getAttribute("data-mailto") +
        "?subject=" + encodeURIComponent(f.getAttribute("data-subject")) +
        "&body=" + encodeURIComponent(lines.join("\n"));
      window.location.href = url;
    });
  });

  // photo viewer
  var box = document.querySelector(".lightbox");
  if (box) {
    var items = Array.prototype.slice.call(document.querySelectorAll(".photos button"));
    var img = box.querySelector("img"), cap = box.querySelector("p"), i = 0;
    var show = function (n) {
      i = (n + items.length) % items.length;
      img.src = items[i].getAttribute("data-full");
      img.alt = items[i].getAttribute("data-caption") || "";
      cap.textContent = (items[i].getAttribute("data-caption") || "") + "  " + (i + 1) + " / " + items.length;
    };
    items.forEach(function (b, n) { b.addEventListener("click", function () { show(n); box.showModal(); }); });
    box.querySelector(".lb-close").addEventListener("click", function () { box.close(); });
    box.querySelector(".lb-prev").addEventListener("click", function () { show(i - 1); });
    box.querySelector(".lb-next").addEventListener("click", function () { show(i + 1); });
    box.addEventListener("click", function (e) { if (e.target === box || e.target.classList.contains("stage")) box.close(); });
    document.addEventListener("keydown", function (e) {
      if (!box.open) return;
      if (e.key === "ArrowRight") show(i + 1);
      if (e.key === "ArrowLeft") show(i - 1);
    });
  }
})();
