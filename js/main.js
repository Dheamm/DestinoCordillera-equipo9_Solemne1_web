/* ===== Menú responsive (todas las páginas) ===== */
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".navbar ul");

if (navToggle) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("open");
  });
}

/* ===== Página Reserva ===== */
const reservaForm = document.querySelector("#reserva-form");

if (reservaForm) {
  const formFeedback = document.querySelector("#form-feedback");
  const resumen = document.querySelector("#resumen");
  const selAloja = reservaForm.alojamiento;
  const llegada = reservaForm.llegada;
  const salida = reservaForm.salida;

  const formatoCLP = (n) => "$" + n.toLocaleString("es-CL");
  const tipoActual = () => reservaForm.tipo.value;

  const hoy = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];
  [reservaForm.fecha, llegada, salida].forEach((el) => (el.min = hoy));

  function actualizarTipo() {
    const tipo = tipoActual();
    reservaForm.querySelectorAll("[data-tipo]").forEach((bloque) => {
      const activo = bloque.dataset.tipo === tipo;
      bloque.hidden = !activo;
      bloque.querySelectorAll("input, select").forEach((el) => {
        el.disabled = !activo;
      });
    });
    actualizarResumen();
  }

  function noches() {
    if (!llegada.value || !salida.value) return 0;
    const dif = new Date(salida.value) - new Date(llegada.value);
    return Math.round(dif / 86400000);
  }

  function actualizarResumen() {
    if (tipoActual() !== "alojamiento") return;

    if (llegada.value) salida.min = llegada.value;
    const n = noches();
    salida.setCustomValidity(
      salida.value && n < 1 ? "La salida debe ser posterior a la llegada." : "",
    );

    if (n >= 1) {
      const precio = Number(selAloja.selectedOptions[0].dataset.precio);
      resumen.textContent = `${n} ${n === 1 ? "noche" : "noches"} · valor referencial ${formatoCLP(precio * n)}`;
      resumen.classList.add("show");
    } else {
      resumen.textContent = "";
      resumen.classList.remove("show");
    }
  }

  reservaForm
    .querySelectorAll('input[name="tipo"]')
    .forEach((r) => r.addEventListener("change", actualizarTipo));
  [selAloja, llegada, salida].forEach((el) =>
    el.addEventListener("change", actualizarResumen),
  );

  reservaForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const nombre = reservaForm.nombre.value.trim().split(" ")[0];
    const detalle =
      tipoActual() === "actividad"
        ? reservaForm.actividad.value
        : selAloja.value;

    formFeedback.textContent = `¡Gracias, ${nombre}! Recibimos tu solicitud para "${detalle}". Te contactaremos pronto por correo.`;
    formFeedback.classList.add("show");
    reservaForm.reset();
    actualizarTipo();
    formFeedback.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  actualizarTipo();

  /* Mapa: se muestra solo cuando terminó de cargar */
  const mapFrame = document.querySelector("#map-frame");
  if (mapFrame) {
    const mostrarMapa = () => mapFrame.classList.add("loaded");
    mapFrame.querySelector("iframe").addEventListener("load", mostrarMapa);
    setTimeout(mostrarMapa, 8000); // respaldo si la carga demora demasiado
  }
}

/* ===== Inicio: lista de videos del hero  ===== */
const heroVideos = document.querySelector(".hero-videos");

if (heroVideos) {
  const lista = heroVideos.dataset.playlist.split(",").map((v) => v.trim());
  let [actual, libre] = heroVideos.querySelectorAll("video");
  let indice = 0;

  const siguiente = () => (indice + 1) % lista.length;

  function precargar() {
    libre.src = lista[siguiente()];
    libre.load();
  }

  function avanzar() {
    indice = siguiente();
    libre.currentTime = 0;
    libre.play().catch(() => {});
    libre.classList.add("activo");
    actual.classList.remove("activo");
    [actual, libre] = [libre, actual];
    actual.addEventListener("ended", avanzar, { once: true });
    // espera a que termine el fundido antes de cargar el siguiente
    setTimeout(precargar, 900);
  }

  if (lista.length > 1) {
    precargar();
    actual.addEventListener("ended", avanzar, { once: true });
  } else {
    actual.loop = true;
  }
}
