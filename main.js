console.log("JS ON");
const $themeBtn = document.querySelector(".theme");

const getCurrentTheme = () => {
  let theme;

  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    theme = "dark";
  } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    theme = "light";
  } else if (window.matchMedia("(prefers-color-scheme: purple)").matches) {
    theme = "purple";
  }

  localStorage.getItem("devfinder.theme") ? (theme = localStorage.getItem("devfinder.theme")) : null;
  return theme;
};

function loadTheme(theme) {
  const root = document.querySelector(":root");
  console.log($themeBtn);

  root.setAttribute("color-scheme", `${theme}`);
}

$themeBtn.addEventListener("click", () => {
  console.log("btn event listener");
  let theme = getCurrentTheme();
  if (theme === "light") {
    theme = "purple";
  } else if (theme === "dark") {
    theme = "light";
  } else if (theme === "purple") {
    theme = "dark";
  }
  localStorage.setItem("devfinder.theme", `${theme}`);
  loadTheme(theme);
});

window.addEventListener("DOMContentLoaded", () => {
  loadTheme(getCurrentTheme());
});
