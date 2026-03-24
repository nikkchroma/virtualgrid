// =============================================
//   VIRTUAL GRID — GAMING CAFE WEBSITE JS
// =============================================

// === NAVBAR SCROLL EFFECT ===
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// === HAMBURGER MENU ===
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close nav on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// === SCROLL REVEAL ANIMATION ===
const revealElements = document.querySelectorAll(
  '.feature-card, .service-card, .price-card, .gallery-item, .info-item, .badge, .about-text p, .section-title, .section-label'
);

revealElements.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 60);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// === PARTICLE CANVAS ===
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

let particles = [];
let animId;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.5 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = -Math.random() * 0.5 - 0.2;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.5
      ? `rgba(168, 85, 247, ${this.opacity})`
      : Math.random() > 0.5
        ? `rgba(59, 130, 246, ${this.opacity})`
        : `rgba(34, 211, 238, ${this.opacity})`;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
      this.reset();
      this.y = canvas.height + 10;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

// Init particles
for (let i = 0; i < 80; i++) {
  particles.push(new Particle());
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  animId = requestAnimationFrame(animateParticles);
}

animateParticles();

// === ACTIVE NAV LINK ON SCROLL ===
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navItems.forEach(item => {
    item.style.color = '';
    if (item.getAttribute('href') === `#${current}`) {
      item.style.color = 'var(--purple)';
    }
  });
});

// === CONTACT FORM ===
function handleSubmit(e) {
  e.preventDefault();
  const msg = document.getElementById('formMsg');
  msg.textContent = '⏳ Sending...';
  msg.style.color = 'var(--cyan)';

  setTimeout(() => {
    msg.textContent = '✅ Message sent! We\'ll get back to you soon.';
    msg.style.color = '#22d3ee';
    e.target.reset();

    setTimeout(() => {
      msg.textContent = '';
    }, 5000);
  }, 1200);
}

// === SMOOTH SCROLL OFFSET FOR FIXED NAV ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// === COUNTER ANIMATION FOR STATS ===
function animateCounter(el, target, suffix = '') {
  let count = 0;
  const duration = 1500;
  const steps = 60;
  const increment = target / steps;
  const timer = setInterval(() => {
    count += increment;
    if (count >= target) {
      count = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(count) + suffix;
  }, duration / steps);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statNums = document.querySelectorAll('.stat-num');
      statNums.forEach(el => {
        const text = el.textContent;
        if (text.includes('+')) animateCounter(el, parseInt(text), '+');
        else if (text === '24/7') return;
        else if (text.includes('Gbps')) animateCounter(el, 1, 'Gbps');
      });
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// === TYPING EFFECT FOR SCREEN TEXT ===
const screenText = document.querySelector('.screen-text');
if (screenText) {
  const messages = ['READY PLAYER ONE', 'ENTER THE GRID', 'LEVEL UP NOW', 'GAME ON, PLAYER'];
  let msgIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeEffect() {
    const current = messages[msgIndex];
    if (!isDeleting) {
      screenText.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        isDeleting = true;
        setTimeout(typeEffect, 2000);
        return;
      }
    } else {
      screenText.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        msgIndex = (msgIndex + 1) % messages.length;
      }
    }
    setTimeout(typeEffect, isDeleting ? 60 : 100);
  }

  setTimeout(typeEffect, 1000);
}

// === RGB GLOW CURSOR ===
document.addEventListener('mousemove', (e) => {
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;
  document.querySelector('.glow1').style.transform =
    `translate(${x * 30}px, ${y * 30}px)`;
  document.querySelector('.glow2').style.transform =
    `translate(${-x * 20}px, ${-y * 20}px)`;
});

console.log('%c⚡ VIRTUAL GRID GAMING CAFE ⚡', 'color: #a855f7; font-size: 20px; font-weight: bold;');
console.log('%cBuilt with 💜 for gamers.', 'color: #60a5fa;');
