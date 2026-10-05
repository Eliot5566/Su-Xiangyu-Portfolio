(function () {
  var nav = document.querySelector(".nav");
  var toggle = document.querySelector(".nav__toggle");
  var links = document.getElementById("nav-links");

  toggle.addEventListener("click", function () {
    var open = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "關閉選單" : "開啟選單");
  });

  links.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      links.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  function onScroll() {
    nav.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  document.getElementById("year").textContent = new Date().getFullYear();

  // Fade sections in as they enter the viewport
  if ("IntersectionObserver" in window) {
    var items = document.querySelectorAll(
      ".feature, .card, .timeline > li, .skill, .certs li"
    );
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    items.forEach(function (el) {
      el.classList.add("reveal");
      io.observe(el);
    });
  }
})();
