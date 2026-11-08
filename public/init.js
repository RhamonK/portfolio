(function () {
  var root = document.documentElement;
  root.classList.add("js");
  try {
    if (!sessionStorage.getItem("rn-intro-vue") && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.classList.add("intro");
    }
  } catch (_) {
    // Storage may be disabled; the page remains readable.
  }
})();
