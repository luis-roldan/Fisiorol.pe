const NUMERO = "51913515980"; // WhatsApp y Yape de Fisiorol
const MIN_DIAS = 1; // días de anticipación mínimos (cámbialo a 2 si lo prefieres)
const wa = (t) => "https://wa.me/" + NUMERO + "?text=" + encodeURIComponent(t);

// precio: texto mostrado · meta: duración / paquetes
const SERVICIOS = [
	{
		n: "Botas de compresión",
		p: "S/ 50",
		m: "30 min",
		d: "Favorecen el retorno venoso, alivian la sensación de piernas cansadas y disminuyen la pesadez muscular.",
	},
	{
		n: "Botas de compresión + estiramientos",
		p: "S/ 70",
		m: "45 min",
		d: "Complementan la recuperación después de entrenamientos intensos.",
	},
	{
		n: "Botas de compresión + descarga muscular",
		p: "S/ 120",
		m: "1 h 30 min",
		d: "Alivian la tensión muscular, disminuyen la sensación de sobrecarga y la fatiga, y ayudan a optimizar el rendimiento.",
	},
	{
		n: "Descarga muscular",
		p: "S/ 80",
		m: "Sesión",
		d: "terapia manual + pistola de percusión + estiramientos al finalizar, para aliviar la tensión y favorecer la recuperación.",
	},
	{
		n: "Tratamiento especializado",
		p: "S/ 100",
		m: "Sesión",
		d: "Para deportistas, adultos, personas que trabajan en oficina y público en general que buscan recuperar su bienestar, acelerar la recuperación tras una lesión o aliviar molestias posturales.",
	},
	{
		n: "Evaluación inicial + tratamiento",
		p: "S/ 120",
		m: "1 h 10 min",
		d: "Entrevista sobre molestias, antecedentes y actividades diarias; evaluación de postura, movilidad, fuerza y flexibilidad; y ejercicios sugeridos para hacer en casa.",
	},
	{
		n: "Ondas de choque",
		p: "S/ 150",
		m: "Paquetes: S/ 500 (x4) · S/ 1000 (x8)",
		d: "Ondas acústicas de alta energía que estimulan los tejidos en ciertas lesiones musculoesqueléticas, como fascitis plantar y tendinopatías. Su indicación depende de la evaluación profesional.",
	},
	{
		n: "Colocación de tape",
		p: "S/ 10",
		m: "Rápido",
		d: "Colocación de tape para dar soporte o estabilidad, el precio es por zona y varía según la cantidad de tape que se requiera.",
	},
	{
		n: "Terapia a domicilio",
		p: "Desde S/ 120",
		m: "Descarga 50 min · Tratamiento 1 h",
		d: "Vamos a tu casa. El precio varía según el distrito y si es descarga muscular o tratamiento.",
		dom: true,
	},
];

const lista = document.getElementById("lista-servicios");
const sel = document.getElementById("servicio");
SERVICIOS.forEach((s, i) => {
	const el = document.createElement("article");
	el.className = "srv";
	el.innerHTML = `<div><h3>${s.n}</h3><div class="meta">${s.m}</div><p>${s.d}</p>
    <a class="btn sec sm" href="#reservar" data-pick="${i}">Reservar</a></div><div class="precio">${s.p}</div>`;
	lista.appendChild(el);
	sel.add(new Option(`${s.n} (${s.p})`, i));
});
lista.addEventListener("click", (e) => {
	const a = e.target.closest("[data-pick]");
	if (!a) return;
	sel.value = a.dataset.pick;
	if (SERVICIOS[a.dataset.pick].dom) modalidad.value = "A domicilio";
});

// enlaces de WhatsApp con texto prellenado
document.querySelectorAll("[data-wa]").forEach((a) => {
	a.href = wa(a.dataset.wa);
	a.target = "_blank";
	a.rel = "noopener";
});

// copiar número de Yape
document.getElementById("copiar").addEventListener("click", async (e) => {
	try {
		await navigator.clipboard.writeText("913515980");
		e.target.textContent = "Número copiado";
	} catch (_) {
		e.target.textContent = "913 515 980";
	}
	setTimeout(() => (e.target.textContent = "Copiar número"), 2500);
});

// horarios según el día
const H = {
	sem: [
		"9:00 am",
		"10:00 am",
		"11:00 am",
		"12:00 pm",
		"2:00 pm",
		"3:00 pm",
		"4:00 pm",
		"5:00 pm",
		"6:00 pm",
		"7:00 pm",
	],
	sab: [
		"9:00 am",
		"10:00 am",
		"11:00 am",
		"12:00 pm",
		"2:00 pm",
		"3:00 pm",
		"4:00 pm",
		"5:00 pm",
	],
	dom: ["8:00 am", "9:00 am", "10:00 am", "11:00 am", "12:00 pm"],
};
const fecha = document.getElementById("fecha"),
	hora = document.getElementById("hora"),
	modalidad = document.getElementById("modalidad"),
	aviso = document.getElementById("aviso");
const iso = (d) =>
	`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; // fecha local, no UTC
const min = new Date();
min.setDate(min.getDate() + 1); // desde mañana
fecha.min = iso(min);

function dia() {
	// día de la semana sin problemas de zona horaria
	const [y, m, d] = fecha.value.split("-").map(Number);
	return new Date(y, m - 1, d).getDay();
}
function pintarHoras() {
	hora.innerHTML = "";
	if (!fecha.value) {
		hora.add(new Option("Elige una fecha primero", ""));
		return;
	}
	const w = dia(),
		set = w === 0 ? H.dom : w === 6 ? H.sab : H.sem;
	set.forEach((h) => hora.add(new Option(h, h)));
	if (w === 0) {
		modalidad.value = "A domicilio";
		aviso.textContent = "Los domingos solo atendemos terapias a domicilio.";
	} else aviso.textContent = "";
}
fecha.addEventListener("change", pintarHoras);
modalidad.addEventListener("change", () => {
	if (fecha.value && dia() === 0 && modalidad.value !== "A domicilio") {
		modalidad.value = "A domicilio";
		aviso.textContent = "Los domingos solo atendemos terapias a domicilio.";
	}
});

document.getElementById("form-reserva").addEventListener("submit", (e) => {
	e.preventDefault();
	if (!fecha.value || !hora.value) {
		aviso.style.color = "#c0392b";
		aviso.style.fontWeight = "700";
		aviso.textContent = "Elige una fecha y una hora para continuar.";
		fecha.focus();
		return;
	}
	if (fecha.value < fecha.min) {
		aviso.style.color = "#c0392b";
		aviso.style.fontWeight = "700";
		aviso.textContent =
			"No hay citas ni reprogramaciones el mismo día. Elige desde mañana.";
		return;
	}
	const s = SERVICIOS[sel.value];
	const f = fecha.value.split("-").reverse().join("/");
	const nombre =
		document.getElementById("nombre").value.trim() || "(sin nombre)";
	const msg = `Hola Fisiorol, quiero reservar:\n• Nombre: ${nombre}\n• Servicio: ${s.n} (${s.p})\n• Fecha: ${f}\n• Hora: ${hora.value}\n• Modalidad: ${modalidad.value}\n\nTe envío la constancia del Yape del 50% para separar mi cita.`;
	aviso.style.color = "";
	aviso.textContent = "Abriendo WhatsApp…";
	const url = wa(msg);
	const w = window.open(url, "_blank");
	if (!w || w.closed) {
		window.location.href = url;
	} // si el navegador bloquea la ventana, abre en la misma pestaña
});

// QR de Yape: si todavía no subiste assets/yape-qr.png, muestra un recuadro en su lugar
const qr = document.querySelector(".yape-qr img");
if (qr) {
	const sinQR = () => {
		qr.hidden = true;
		qr.nextElementSibling.hidden = false;
	};
	qr.addEventListener("error", sinQR);
	if (qr.complete && qr.naturalWidth === 0) sinQR();
}
