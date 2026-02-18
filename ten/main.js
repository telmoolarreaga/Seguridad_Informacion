// NULLSECTOR — main.js

// Animate val-bars on scroll (practica page)
const observer = new IntersectionObserver((entries) => {
  entries.forEach(el => {
    if (el.isIntersecting) {
      el.target.style.width = el.target.style.getPropertyValue('--pct') || el.target.getAttribute('style').match(/--pct:\s*([^;]+)/)?.[1] || '0%';
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.val-bar').forEach(bar => {
  const pct = getComputedStyle(bar).getPropertyValue('--pct').trim();
  bar.style.width = '0%';
  setTimeout(() => {
    bar.style.setProperty('--pct', pct);
    observer.observe(bar);
    setTimeout(() => { bar.style.width = pct; }, 100);
  }, 200);
});

// Typewriter for terminal
const typeTarget = document.querySelector('.type-effect');
if (typeTarget) {
  const text = typeTarget.textContent.replace('|', '').trim();
  typeTarget.innerHTML = '<span class="cursor-blink">|</span>';
  let i = 0;
  const type = () => {
    if (i < text.length) {
      typeTarget.innerHTML = text.slice(0, ++i) + '<span class="cursor-blink">|</span>';
      setTimeout(type, 60);
    }
  };
  setTimeout(type, 1200);
}

// Subtle parallax on hero bg text
const bgText = document.querySelector('.hero-bg-text');
if (bgText) {
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 10;
    bgText.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
  });
}

// Staggered card reveals
const cards = document.querySelectorAll('.practica-card, .about-card, .member-card');
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.animation = `fadeUp 0.5s ${i * 0.07}s both ease-out`;
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

cards.forEach(card => {
  card.style.opacity = '0';
  cardObserver.observe(card);
});
