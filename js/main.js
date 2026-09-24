/* ===== Menú responsive (todas las páginas) ===== */
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".navbar ul");

navToggle.addEventListener("click", () => {
  navMenu.classList.toggle("open");
});

/* ===== Página Reserva ===== */
const form = document.querySelector("#reserva-form");

if (form) {
  const aviso = document.querySelector("#form-feedback");
  const resumen = document.querySelector("#resumen");
  const fecha = document.querySelector("#fecha");
  const llegada = document.querySelector("#llegada");
  const salida = document.querySelector("#salida");
  const nombre = document.querySelector("#nombre");
  const actividad = document.querySelector("#actividad");
  const alojamiento = document.querySelector("#alojamiento");
  const hoy = new Date().toLocaleDateString("en-CA");
  const tipoActual = () => form.querySelector('[name="tipo"]:checked').value;

  [fecha, llegada, salida].forEach((campo) => (campo.min = hoy));

  function actualizarFormulario() {
    const tipo = tipoActual();

    form.querySelectorAll("[data-tipo]").forEach((bloque) => {
      const activo = bloque.dataset.tipo === tipo;
      bloque.hidden = !activo;
      bloque.querySelectorAll("input, select").forEach((campo) => {
        campo.disabled = !activo;
      });
    });

    if (tipo === "alojamiento") calcularNoches();
  }

  function calcularNoches() {
    salida.min = llegada.value || hoy;

    const noches =
      llegada.value && salida.value
        ? Math.round(
            (new Date(salida.value) - new Date(llegada.value)) / 86400000,
          )
        : 0;

    salida.setCustomValidity(
      salida.value && noches < 1
        ? "La salida debe ser posterior a la llegada."
        : "",
    );

    const precio = Number(alojamiento.selectedOptions[0].dataset.precio);
    const total = (precio * noches).toLocaleString("es-CL");

    resumen.textContent =
      noches >= 1
        ? `${noches} ${noches === 1 ? "noche" : "noches"} · valor referencial $${total}`
        : "";
    resumen.classList.toggle("show", noches >= 1);
  }

  form.addEventListener("change", actualizarFormulario);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const primerNombre = nombre.value.trim().split(" ")[0];
    const detalle =
      tipoActual() === "actividad" ? actividad.value : alojamiento.value;

    aviso.textContent = `¡Gracias, ${primerNombre}! Recibimos tu solicitud para "${detalle}". Te contactaremos pronto por correo.`;
    aviso.classList.add("show");
    form.reset();
    actualizarFormulario();
  });

  actualizarFormulario();

  /* Mapa: se muestra solo cuando terminó de cargar */
  const mapa = document.querySelector("#map-frame");
  const mostrarMapa = () => mapa.classList.add("loaded");

  mapa.querySelector("iframe").addEventListener("load", mostrarMapa);
  setTimeout(mostrarMapa, 8000);
}

/* ===== Inicio: lista de videos del hero ===== */
const heroVideos = document.querySelector(".hero-videos");

if (heroVideos) {
  const lista = heroVideos.dataset.playlist.split(",");
  let [visible, oculto] = heroVideos.querySelectorAll("video");
  let posicion = 0;

  oculto.src = lista[1];

  function siguienteVideo() {
    posicion = (posicion + 1) % lista.length;

    [visible, oculto] = [oculto, visible];
    visible.play();
    visible.classList.add("activo");
    oculto.classList.remove("activo");

    setTimeout(() => {
      oculto.src = lista[(posicion + 1) % lista.length];
    }, 900);
  }

  visible.addEventListener("ended", siguienteVideo);
  oculto.addEventListener("ended", siguienteVideo);
}
