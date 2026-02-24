// BENTEN — main.js v2.0 (Enhanced)

// =============================================
// MATRIX RAIN BACKGROUND
// =============================================
(function initMatrix() {
  const canvas = document.createElement('canvas');
  canvas.id = 'matrix-canvas';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const chars = 'BENTEN01アイウエオカキクケコ10110100'.split('');
  const fontSize = 14;
  let columns = Math.floor(canvas.width / fontSize);
  let drops = Array(columns).fill(1);

  function draw() {
    ctx.fillStyle = 'rgba(5, 8, 16, 0.12)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00ff8830';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
      const text = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  setInterval(draw, 80);

  window.addEventListener('resize', () => {
    columns = Math.floor(canvas.width / fontSize);
    drops = Array(columns).fill(1);
  });
})();

// =============================================
// FLOATING PARTICLES
// =============================================
(function initParticles() {
  const container = document.createElement('div');
  container.id = 'particles';
  document.body.prepend(container);

  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.top = Math.random() * 100 + '%';
    p.style.animationDelay = Math.random() * 4 + 's';
    p.style.animationDuration = (3 + Math.random() * 4) + 's';
    p.style.width = p.style.height = (1 + Math.random() * 2) + 'px';
    if (Math.random() > 0.5) {
      p.style.background = '#00d4ff';
    }
    container.appendChild(p);
  }
})();

// =============================================
// NAVBAR SCROLL BEHAVIOR
// =============================================
(function initNavbar() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const curr = window.scrollY;
    if (curr > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = curr;
  }, { passive: true });
})();

// =============================================
// SCROLL REVEAL ANIMATIONS
// =============================================
(function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    '.about-card, .member-card, .practica-card, .practica-block, .val-item, .findings-table'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger the animation based on sibling index
        const siblings = entry.target.parentElement.children;
        const index = Array.from(siblings).indexOf(entry.target);
        const delay = index * 80;

        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, delay);

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
  });
})();

// =============================================
// VAL-BAR ANIMATION
// =============================================
(function initValBars() {
  const bars = document.querySelectorAll('.val-bar');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(el => {
      if (el.isIntersecting) {
        const pct = getComputedStyle(el.target).getPropertyValue('--pct').trim();
        el.target.style.width = '0%';
        setTimeout(() => {
          el.target.style.width = pct;
        }, 200);
        observer.unobserve(el.target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => {
    bar.style.width = '0%';
    observer.observe(bar);
  });
})();

// =============================================
// TYPEWRITER FOR TERMINAL
// =============================================
(function initTypewriter() {
  const typeTarget = document.querySelector('.type-effect');
  if (!typeTarget) return;

  const text = typeTarget.textContent.replace('|', '').trim();
  typeTarget.innerHTML = '<span class="cursor-blink">|</span>';
  let i = 0;

  function type() {
    if (i < text.length) {
      typeTarget.innerHTML = text.slice(0, ++i) + '<span class="cursor-blink">|</span>';
      setTimeout(type, 50 + Math.random() * 40);
    }
  }

  setTimeout(type, 1200);
})();

// =============================================
// TERMINAL LINE-BY-LINE REVEAL
// =============================================
(function initTerminalReveal() {
  const terminal = document.querySelector('.terminal-body');
  if (!terminal) return;

  const lines = terminal.querySelectorAll('p');
  lines.forEach((line, i) => {
    if (line.querySelector('.type-effect')) return;
    line.style.opacity = '0';
    line.style.transform = 'translateX(-10px)';
    line.style.transition = 'all 0.4s ease-out';
    setTimeout(() => {
      line.style.opacity = '1';
      line.style.transform = 'translateX(0)';
    }, 800 + i * 200);
  });
})();

// =============================================
// HERO BG TEXT PARALLAX
// =============================================
(function initParallax() {
  const bgText = document.querySelector('.hero-bg-text');
  if (!bgText) return;

  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 25;
    const y = (e.clientY / window.innerHeight - 0.5) * 12;
    bgText.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
  }, { passive: true });
})();

// =============================================
// CARD TILT EFFECT ON HOVER (subtle 3D)
// =============================================
(function initTiltCards() {
  const cards = document.querySelectorAll('.member-card, .about-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      card.style.transform = `translateY(-6px) perspective(600px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease-out';
    });
  });
})();

// =============================================
// COUNTER ANIMATION FOR BLOCK NUMS
// =============================================
(function initCounters() {
  const nums = document.querySelectorAll('.block-num');
  nums.forEach(num => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          num.style.transition = 'color 0.6s, text-shadow 0.6s';
          observer.unobserve(num);
        }
      });
    }, { threshold: 0.5 });
    observer.observe(num);
  });
})();

// =============================================
// SMOOTH SECTION SEPARATORS GLOW
// =============================================
(function initGlowLines() {
  const blocks = document.querySelectorAll('.practica-block');
  blocks.forEach(block => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          block.style.borderBottomColor = 'rgba(0,255,136,0.15)';
          setTimeout(() => {
            block.style.borderBottomColor = '';
          }, 1500);
        }
      });
    }, { threshold: 0.2 });
    observer.observe(block);
  });
})();

// =============================================
// MEMBER BAR INITIAL STATE
// =============================================
document.querySelectorAll('.member-bar').forEach(bar => {
  bar.style.width = '60%';
});
