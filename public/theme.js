/**
 * Color scheme for every page except the marketing landing ("/").
 * Default is the OS preference; an explicit light/dark choice is stored
 * and reused. The landing page always renders light — it has no dark theme.
 */
(function () {
  var KEY = "immio-theme";
  var landingForced = false;

  function isLandingPath(path) {
    return path === "/" || path === "";
  }

  function stored() {
    try {
      return localStorage.getItem(KEY);
    } catch (e) {
      return null;
    }
  }

  function systemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function resolved() {
    var value = stored();
    if (value === "light" || value === "dark") return value;
    return systemTheme();
  }

  function syncButtons(theme) {
    document.querySelectorAll(".site-header__theme").forEach(function (button) {
      var next = theme === "dark" ? "light" : "dark";
      button.setAttribute("aria-label", "Switch to " + next + " mode");
      button.setAttribute("title", "Switch to " + next + " mode");
    });
  }

  function apply(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.colorScheme = theme;
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#16181c" : "#ffffff");
    syncButtons(theme);
  }

  function applyForPath(path) {
    landingForced = isLandingPath(path);
    apply(landingForced ? "light" : resolved());
  }

  function toggle() {
    if (landingForced) return;
    var next = resolved() === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(KEY, next);
    } catch (e) {}
    apply(next);
  }

  function bind() {
    document.querySelectorAll(".site-header__theme").forEach(function (button) {
      if (button.getAttribute("data-theme-bound")) return;
      button.setAttribute("data-theme-bound", "1");
      button.addEventListener("click", toggle);
    });
    syncButtons(document.documentElement.getAttribute("data-theme") || resolved());
  }

  applyForPath(location.pathname);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bind);
  } else {
    bind();
  }

  var media = window.matchMedia("(prefers-color-scheme: dark)");
  var onChange = function () {
    if (stored() === "light" || stored() === "dark") return;
    if (landingForced) return;
    apply(systemTheme());
  };
  if (typeof media.addEventListener === "function") {
    media.addEventListener("change", onChange);
  } else if (typeof media.addListener === "function") {
    media.addListener(onChange);
  }

  window.__immioApplyTheme = applyForPath;
})();
