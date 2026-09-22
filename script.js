/* Progressive enhancement only: the site is fully usable with JavaScript off.
   Highlights the navigation entry for the section currently in view. */
(function () {
  "use strict";

  var links = Array.prototype.slice.call(
    document.querySelectorAll('.nav-list a[href^="#"]')
  );
  if (!links.length || !("IntersectionObserver" in window)) return;

  var byId = {};
  var sections = [];

  links.forEach(function (link) {
    var section = document.getElementById(link.hash.slice(1));
    if (!section) return;
    byId[section.id] = link;
    sections.push(section);
  });
  if (!sections.length) return;

  var current = null;

  function activate(id) {
    if (id === current) return;
    current = id;
    links.forEach(function (link) { link.removeAttribute("aria-current"); });
    if (byId[id]) byId[id].setAttribute("aria-current", "true");
  }

  var visible = Object.create(null);

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) visible[entry.target.id] = true;
        else delete visible[entry.target.id];
      });

      // Pick the first section (in document order) that is currently on screen.
      for (var i = 0; i < sections.length; i++) {
        if (visible[sections[i].id]) {
          activate(sections[i].id);
          return;
        }
      }
    },
    { rootMargin: "-10% 0px -55% 0px", threshold: 0 }
  );

  sections.forEach(function (section) { observer.observe(section); });
})();
