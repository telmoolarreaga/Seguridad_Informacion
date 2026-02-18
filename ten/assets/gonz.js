// ================== CONFIGURACIÓN ==================
const LINES = [
"Esta es una pagina de test",
"made by Asier",
"Hay que aprender a hacer nuevas cosas..."
];

const TYPE_SPEED_MS = 85; // ms por carácter
const LINE_PAUSE_MS = 650; // pausa entre líneas
const START_DELAY_MS = 400; // retardo inicial
const LOOP = false; // repetir todo el bloque
// ====================================================


const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));


async function typeText(el, text) {
for (let i = 1; i <= text.length; i++) {
el.textContent = text.slice(0, i);
await sleep(TYPE_SPEED_MS);
}
}


async function run() {
const host = document.getElementById('typer');
do {
host.textContent = '';
await sleep(START_DELAY_MS);


if (prefersReduced) {
host.innerHTML = LINES.map((t, i) => i === 0 ? t : `\n${t}`).join('');
} else {
for (let i = 0; i < LINES.length; i++) {
const lineSpan = document.createElement('span');
if (i === 1) lineSpan.className = 'subtle';
if (i === 2) lineSpan.className = 'not-subtle';
host.appendChild(lineSpan);
await typeText(lineSpan, LINES[i]);
if (i < LINES.length - 1) {
await sleep(LINE_PAUSE_MS);
host.appendChild(document.createElement('br'));
}
}
}


if (LOOP) {
await sleep(900);
}
} while (LOOP);
}


document.addEventListener('DOMContentLoaded', run);


// Scroll a la siguiente sección al pulsar la flecha
document.querySelector('.scroll-down')?.addEventListener('click', (e) => {
  e.preventDefault();
  const next = document.getElementById('more');
  if (!next) return;

  // Respeta reduced-motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('scrollBehavior' in document.documentElement.style && !prefersReduced) {
    next.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    // Fallback sin animación
    const y = next.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo(0, y);
  }
});


document.querySelector('.scroll-down').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('next').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// ===== Forzar que al volver arriba se encaje del todo en el inicio =====
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
  const st = window.pageYOffset || document.documentElement.scrollTop;
  const wrap = document.querySelector('.wrap');
  const wrapRect = wrap.getBoundingClientRect();

  // Detecta si el usuario está haciendo scroll hacia arriba
  if (st < lastScrollTop) {
    // Si la parte superior del hero está visible y casi llegando al top
    if (wrapRect.top < 100 && wrapRect.top > -window.innerHeight / 2) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  lastScrollTop = st <= 0 ? 0 : st; // evita valores negativos
}, { passive: true });


// ===== CONTADOR =====

// ===== CONTADOR con flip (sin parpadeo innecesario) =====
let targetDate = new Date("2026-06-11T15:00:00"); // ← cámbiala

const $units = {
  days:    document.querySelector('.unit[data-unit="days"]   .flip'),
  hours:   document.querySelector('.unit[data-unit="hours"]  .flip'),
  minutes: document.querySelector('.unit[data-unit="minutes"] .flip'),
  seconds: document.querySelector('.unit[data-unit="seconds"] .flip'),
};

function flipTo($flip, nextValue) {
  if (!$flip) return;
  const front = $flip.querySelector('.front');
  const back  = $flip.querySelector('.back');
  const current = front.textContent;
  const next = String(nextValue).padStart(2, "0");

  // 🔹 Si el valor no cambia → no animamos nada
  if (current === next) return;

  // Prepara la back con el nuevo valor
  back.textContent = next;

  // Reinicia animaciones
  $flip.classList.remove('animate');
  void $flip.offsetWidth; // reflow
  $flip.classList.add('animate');

  // Al terminar el flip, actualiza el front y limpia clase
  const onAnimEnd = () => {
    front.textContent = next;
    $flip.classList.remove('animate');
    $flip.removeEventListener('animationend', onAnimEnd);
  };
  $flip.addEventListener('animationend', onAnimEnd);
}

function getParts(diffMs) {
  const totalSec = Math.max(0, Math.floor(diffMs / 1000));
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  return { days, hours, minutes, seconds };
}

function tick() {
  const now = new Date();
  const diff = targetDate - now;

  if (diff <= 0) {
    const cd = document.getElementById('countdown');
    if (cd) cd.innerHTML = '<p>The time has come.</p>';
    clearInterval(timer);
    return;
  }

  const { days, hours, minutes, seconds } = getParts(diff);
  flipTo($units.days, days);
  flipTo($units.hours, hours);
  flipTo($units.minutes, minutes);
  flipTo($units.seconds, seconds);
}

const timer = setInterval(tick, 1000);
tick();

