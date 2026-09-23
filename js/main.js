const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".navbar ul");

if (navToggle) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("open");
  });
}

const reservaForm = document.querySelector("#reserva-form");
const formFeedback = document.querySelector("#form-feedback");

if (reservaForm) {
  reservaForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formFeedback.textContent =
      "¡Gracias! Tu solicitud fue enviada, pronto te contactaremos.";
    formFeedback.classList.add("show");
    reservaForm.reset();
  });
}
