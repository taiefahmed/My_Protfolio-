/* ============================================================
   Portfolio — Arman Ahmed Taief
   Interactions: theme toggle, navbar, preloader, reveal, typing,
   progress, skills bars, form handling
   ============================================================ */

(function () {
  'use strict';

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ---------- Preloader ---------- */
  var preloader = $('#preloader');
  if (preloader) preloader.style.display = 'flex';

  function hidePreloader() {
    if (!preloader) return;
    preloader.classList.add('hidden');
    setTimeout(function () { preloader.style.display = 'none'; }, 500);
  }

  window.addEventListener('load', function () {
    setTimeout(hidePreloader, 400);
  });
  /* A slow external resource must never keep the portfolio covered forever. */
  setTimeout(hidePreloader, 3500);

  /* ---------- Theme toggle ---------- */
  var root = document.documentElement;
  var themeToggle = $('#themeToggle');
  var savedTheme = getCookie('theme');

  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    document.cookie = 'theme=' + theme + '; path=/; max-age=31536000';
  }

  if (savedTheme === 'dark') applyTheme('dark');
  else if (savedTheme === 'light') applyTheme('light');
  else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) applyTheme('dark');

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  /* ---------- Navbar scroll + progress + back-to-top ---------- */
  var navbar = $('#navbar');
  var progressBar = $('#progressBar');
  var backToTop = $('#backToTop');

  function onScroll() {
    var y = window.scrollY;
    var total = document.documentElement.scrollHeight - window.innerHeight;

    if (navbar) navbar.classList.toggle('scrolled', y > 30);
    if (progressBar) progressBar.style.width = (total > 0 ? (y / total) * 100 : 0) + '%';
    if (backToTop) backToTop.classList.toggle('show', y > 500);
    updateActiveLink();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTop) backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Mobile menu ---------- */
  var hamburger = $('#hamburger');
  var navLinks = $('#navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
    });

    $$('.nav-link', navLinks).forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
      });
    });
  }

  /* ---------- Active nav link on scroll ---------- */
  var navLinksAll = $$('.nav-link');

  function updateActiveLink() {
    var pos = window.scrollY + 120;
    var current = 'home';
    $$('section[id]').forEach(function (sec) {
      if (pos >= sec.offsetTop) current = sec.id;
    });
    navLinksAll.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealItems = $$('.reveal');
  if ('IntersectionObserver' in window) {
    document.documentElement.classList.add('motion-ready');
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealItems.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealItems.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- Skill / language bars ---------- */
  var barFills = $$('.bar-fill');
  if ('IntersectionObserver' in window) {
    var barObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var fill = entry.target;
          fill.style.width = fill.dataset.progress + '%';
          barObserver.unobserve(fill);
        }
      });
    }, { threshold: 0.6 });

    barFills.forEach(function (fill) {
      barObserver.observe(fill);
    });
  } else {
    barFills.forEach(function (fill) { fill.style.width = fill.dataset.progress + '%'; });
  }

  /* ---------- Typing effect ---------- */
  var typedEl = $('#typed');
  if (typedEl) {
    var roles = ['CSE Student at BUBT', 'Software Developer', 'Machine Learning Explorer', 'Problem Solver'];
    var roleIndex = 0, charIndex = 0, deleting = false;

    function type() {
      var current = roles[roleIndex];
      var text = current.substring(0, charIndex);

      typedEl.innerHTML = '<span class="typed">' + text + '<\/span>';

      if (!deleting && charIndex < current.length) {
        charIndex++;
        setTimeout(type, 70);
      } else if (!deleting && charIndex === current.length) {
        setTimeout(function () { deleting = true; type(); }, 1800);
      } else if (deleting && charIndex > 0) {
        charIndex--;
        setTimeout(type, 35);
      } else {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(type, 300);
      }
    }
    setTimeout(type, 600);
  }

  /* ---------- Cursor glow ---------- */
  var glow = $('#cursorGlow');
  if (glow && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.addEventListener('mousemove', function (e) {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });
  }

  /* ---------- Contact form ---------- */
  var form = $('#contactForm');
  var statusEl = $('#formStatus');

  if (form) {
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function setError(input, msg) {
      var group = input.closest('.form-group');
      var err = group ? group.querySelector('.error') : null;
      input.classList.add('invalid');
      if (err) err.textContent = msg;
    }
    function clearError(input) {
      var group = input.closest('.form-group');
      var err = group ? group.querySelector('.error') : null;
      input.classList.remove('invalid');
      if (err) err.textContent = '';
    }

    [['#name', validateRequired], ['#email', validateEmail], ['#message', validateRequired]].forEach(function (cfg) {
      var input = $(cfg[0], form);
      if (!input) return;
      input.addEventListener('input', function () { cfg[1](input, true); });
    });

    function validateRequired(input, silent) {
      var ok = input.value.trim().length > 0;
      if (!ok && !silent) setError(input, 'This field is required.');
      if (ok) clearError(input);
      return ok;
    }
    function validateEmail(input, silent) {
      var value = input.value.trim();
      var ok = value.length > 0 && emailRe.test(value);
      if (!ok && !silent) setError(input, 'Please enter a valid email address.');
      if (ok) clearError(input);
      return ok;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fields = { name: $('#name', form), email: $('#email', form), message: $('#message', form) };
      var ok = validateRequired(fields.name) & validateEmail(fields.email) & validateRequired(fields.message);

      if (!ok) {
        if (statusEl) { statusEl.textContent = 'Please fix the highlighted fields.'; statusEl.className = 'form-status error'; }
        return;
      }

      /* Front-end only demo — connect to a backend / email service here */
      if (statusEl) {
        statusEl.textContent = 'Sending your message…';
        statusEl.className = 'form-status success';
      }
      form.submit();
    });
  }

  /* ---------- Dynamic year ---------- */
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
