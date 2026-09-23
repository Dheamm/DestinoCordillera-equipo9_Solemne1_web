const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".navbar ul");

if (navToggle) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("open");
  });
}
