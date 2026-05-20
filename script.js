/* =========================================
   script.js - Paul Mumo Nzyoki Portfolio
========================================= */

// -- Animated particle background --
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
const PARTICLE_COUNT = 60;

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x  = Math.random() * canvas.width;
    this.y  = Math.random() * canvas.height;
    this.r  = Math.random() * 1.2 + 0.2;
    this.dx = (Math.random() - 0.5) * 0.25;
    this.dy = (Math.random() - 0.5) * 0.25;
    this.alpha = Math.random() * 0.4 + 0.1;
  }
  update() {
    this.x += this.dx;
    this.y += this.dy;
    if (this.x < 0 || this.x > canvas.width ||
        this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,149,0,${this.alpha})`;
    ctx.fill();
  }
}

function initParticles() {
  particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
}

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(255,149,0,${0.06 * (1 - dist / 100)})`;
        ctx.lineWidth = 0.4;
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animate);
}

initParticles();
animate();

// -- Navbar scroll effect --
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// -- Hamburger menu --
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// -- Typing animation --
const phrases = [
  'Fullstack Developer.',
  'Data Science Learner.',
  'Tech Professional.',
  'Creative Coder.',
];
let phraseIndex = 0;
let charIndex   = 0;
let deleting    = false;
const typedEl   = document.getElementById('typed-text');

function type() {
  const current = phrases[phraseIndex];
  if (!deleting) {
    typedEl.textContent = current.slice(0, ++charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(type, 1800);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, --charIndex);
    if (charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }
  setTimeout(type, deleting ? 55 : 85);
}
type();

// -- Intersection Observer: fade-up --
const observerOptions = {
  threshold: 0.05,
  rootMargin: '0px 0px 0px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Manual check: reveal anything already in (or near) the viewport
function revealVisible() {
  document.querySelectorAll('.fade-up').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 60 && rect.bottom > 0) {
      el.classList.add('visible');
    }
  });
}

// Observe all potential animated elements
function initAnimations() {
  const elements = document.querySelectorAll(
    '.fade-up, .project-card, .skill-tile, .bento-card, .about-layout, section .section-inner'
  );
  elements.forEach(el => {
    if (!el.classList.contains('fade-up')) el.classList.add('fade-up');
    observer.observe(el);
  });
  // Also immediately reveal anything already visible
  revealVisible();
}

// Re-check on scroll and resize (catches cards that don't trigger the observer)
window.addEventListener('scroll', revealVisible, { passive: true });
window.addEventListener('resize', revealVisible, { passive: true });

// Run on load
document.addEventListener('DOMContentLoaded', initAnimations);
// Fallback if DOMContentLoaded already fired
if (document.readyState === 'interactive' || document.readyState === 'complete') {
  initAnimations();
}

// -- Contact form --
function handleSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('submit-btn');
  const successMsg = document.getElementById('form-success');
  btn.textContent = 'Sending...';
  btn.disabled = true;

  // Simulate send (replace with real EmailJS / Formspree integration)
  setTimeout(() => {
    successMsg.style.display = 'block';
    btn.textContent = 'Sent ✓';
    btn.style.background = '#34d399';
    document.getElementById('contact-form').reset();
  }, 1400);
}

// -- Smooth nav highlight (active section) --
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navAnchors.forEach(a => {
      a.style.color = a.getAttribute('href') === `#${entry.target.id}`
        ? 'var(--accent)' : '';
    });
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));
