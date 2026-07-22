/* ═══════════════════════════════════════════════════════════════
   ARMAN PORTFOLIO — INTERACTIVE ENGINE v3
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isMobile = window.innerWidth < 768;

  /* ─── LOADING SCREEN ─── */
  var loader = document.getElementById('loader');
  var loaderBar = document.getElementById('loader-bar');
  var loadProgress = 0;

  function updateLoader() {
    loadProgress += Math.random() * 15 + 5;
    if (loadProgress > 95) loadProgress = 95;
    loaderBar.style.width = loadProgress + '%';
    if (loadProgress < 95) {
      requestAnimationFrame(function () { setTimeout(updateLoader, 60); });
    }
  }
  updateLoader();

  window.addEventListener('load', function () {
    loaderBar.style.width = '100%';
    setTimeout(function () {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
      initReveal();
    }, 500);
  });

  /* ─── CURRENT YEAR ─── */
  var yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ─── SCROLL PROGRESS ─── */
  var scrollProgress = document.getElementById('scroll-progress');
  function updateScrollProgress() {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = pct + '%';
  }

  /* ─── NAVIGATION ─── */
  var nav = document.getElementById('nav');
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-link');

  function updateNav() {
    var scrollY = window.scrollY;
    nav.classList.toggle('scrolled', scrollY > 40);
    var current = '';
    sections.forEach(function (s) {
      if (scrollY >= s.offsetTop - 120) current = s.id;
    });
    navLinks.forEach(function (l) {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current);
    });
  }

  /* ─── MOBILE MENU ─── */
  var menuToggle = document.getElementById('menu-toggle');
  var menuClose = document.getElementById('menu-close');
  var mobileMenu = document.getElementById('mobile-menu');
  var menuOpen = false;

  function toggleMenu() {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    menuToggle.setAttribute('aria-expanded', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  }

  menuToggle.addEventListener('click', toggleMenu);
  menuClose.addEventListener('click', toggleMenu);
  document.querySelectorAll('.mobile-link').forEach(function (l) {
    l.addEventListener('click', function () {
      if (menuOpen) toggleMenu();
    });
  });

  /* ─── MOUSE GLOW ─── */
  var mouseGlow = document.getElementById('mouse-glow');
  var mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;

  if (!isMobile && mouseGlow) {
    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    function animateGlow() {
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      mouseGlow.style.left = glowX + 'px';
      mouseGlow.style.top = glowY + 'px';
      requestAnimationFrame(animateGlow);
    }
    animateGlow();
  } else if (mouseGlow) {
    mouseGlow.style.display = 'none';
  }

  /* ─── SCROLL REVEAL ─── */
  var revealEls = document.querySelectorAll('[data-reveal]');
  var timelineItems = document.querySelectorAll('.timeline-item');

  function initReveal() {
    checkReveal();
    checkTimeline();
  }

  function checkReveal() {
    var bottom = window.scrollY + window.innerHeight * 0.85;
    revealEls.forEach(function (el) {
      if (el.getBoundingClientRect().top + window.scrollY < bottom) {
        el.classList.add('revealed');
      }
    });
  }

  function checkTimeline() {
    var bottom = window.scrollY + window.innerHeight * 0.82;
    timelineItems.forEach(function (item, i) {
      if (item.getBoundingClientRect().top + window.scrollY < bottom) {
        setTimeout(function () {
          item.classList.add('visible');
        }, i * 120);
      }
    });
  }

  /* ─── SCROLL EVENT (THROTTLED) ─── */
  var scrollTicking = false;
  function onScroll() {
    if (!scrollTicking) {
      requestAnimationFrame(function () {
        updateNav();
        updateScrollProgress();
        checkReveal();
        checkTimeline();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  updateNav();
  updateScrollProgress();

  /* ─── SKILL → PROJECT HIGHLIGHTING ─── */
  var chips = document.querySelectorAll('.skill-chip');
  var cards = document.querySelectorAll('.project-card');
  var activeSkill = null;

  function resetHL() {
    cards.forEach(function (c) { c.classList.remove('dimmed', 'highlighted'); });
    chips.forEach(function (c) { c.classList.remove('active'); });
    activeSkill = null;
  }

  chips.forEach(function (chip) {
    chip.addEventListener('mouseenter', function () {
      var sk = chip.getAttribute('data-skill');
      if (activeSkill === sk) { resetHL(); return; }
      activeSkill = sk;
      chips.forEach(function (c) {
        c.classList.toggle('active', c.getAttribute('data-skill') === sk);
      });
      cards.forEach(function (card) {
        var cs = (card.getAttribute('data-skills') || '').split(',');
        if (cs.indexOf(sk) !== -1) {
          card.classList.remove('dimmed');
          card.classList.add('highlighted');
        } else {
          card.classList.remove('highlighted');
          card.classList.add('dimmed');
        }
      });
    });
  });

  document.querySelectorAll('.skill-domain').forEach(function (d) {
    d.addEventListener('mouseleave', resetHL);
  });

  /* ─── CONTACT FORM ─── */
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var n = document.getElementById('name').value.trim();
      var em = document.getElementById('email').value.trim();
      var m = document.getElementById('message').value.trim();

      if (!n || !em || !m) {
        showStatus('Please fill in all fields.', 'error');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
        showStatus('Please enter a valid email.', 'error');
        return;
      }

      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.innerHTML = '<svg class="animate-spin" width="16" height="16" fill="none" viewBox="0 0 24 24"><circle opacity="0.25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path opacity="0.75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg> Sending...';

      setTimeout(function () {
        showStatus('Message sent successfully. I will get back to you soon.', 'success');
        btn.disabled = false;
        btn.innerHTML = '<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg> Sent!';
        form.reset();
        setTimeout(function () {
          btn.innerHTML = '<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12z"/></svg><span>Send Message</span><svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>';
          status.classList.add('hidden');
        }, 4000);
      }, 1200);
    });
  }

  function showStatus(msg, type) {
    status.textContent = msg;
    status.className = 'form-status ' + type;
  }

  /* ─── PROJECT CARD SPOTLIGHT + TILT ─── */
  if (!isMobile) {
    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;
        var rotateX = ((y - centerY) / centerY) * -4;
        var rotateY = ((x - centerX) / centerX) * 4;
        card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-8px)';
        var mouseXPct = ((x / rect.width) * 100).toFixed(1);
        var mouseYPct = ((y / rect.height) * 100).toFixed(1);
        card.style.setProperty('--mouse-x', mouseXPct + '%');
        card.style.setProperty('--mouse-y', mouseYPct + '%');
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  /* ═══════════════════════════════════════════
     HERO CANVAS — NEURAL NETWORK
     ═══════════════════════════════════════════ */
  var canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var particles = [];
  var animId;
  var canvasW, canvasH;

  function resizeCanvas() {
    canvasW = canvas.width = window.innerWidth;
    canvasH = canvas.height = window.innerHeight;
  }

  function Particle(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.r = Math.random() * 1.6 + 0.3;
    this.o = Math.random() * 0.4 + 0.08;
  }

  function initParticles() {
    particles = [];
    var cnt = Math.min(Math.floor((canvasW * canvasH) / 16000), 65);
    for (var i = 0; i < cnt; i++) {
      particles.push(new Particle(Math.random() * canvasW, Math.random() * canvasH));
    }
  }

  function drawCanvas() {
    ctx.clearRect(0, 0, canvasW, canvasH);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = canvasW;
      if (p.x > canvasW) p.x = 0;
      if (p.y < 0) p.y = canvasH;
      if (p.y > canvasH) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(165, 111, 99, ' + p.o + ')';
      ctx.fill();

      for (var j = i + 1; j < particles.length; j++) {
        var q = particles[j];
        var dx = p.x - q.x;
        var dy = p.y - q.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = 'rgba(217, 155, 127, ' + ((1 - dist / 150) * 0.1) + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    animId = requestAnimationFrame(drawCanvas);
  }

  function startCanvas() {
    resizeCanvas();
    initParticles();
    if (!reducedMotion) {
      drawCanvas();
    } else {
      particles.forEach(function (p) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(165, 111, 99, ' + p.o + ')';
        ctx.fill();
      });
    }
  }

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (animId) cancelAnimationFrame(animId);
      startCanvas();
    }, 250);
  });

  startCanvas();

  /* ─── NEURAL NETWORK NODES ─── */
  var neuralSvg = document.querySelector('.neural-nodes');
  if (neuralSvg && !reducedMotion) {
    var nnNodes = [];
    var nnSvgW = 500, nnSvgH = 500;

    function initNeuralNodes() {
      nnNodes = [];
      var count = isMobile ? 12 : 20;
      for (var i = 0; i < count; i++) {
        nnNodes.push({
          x: Math.random() * nnSvgW,
          y: Math.random() * nnSvgH,
          r: Math.random() * 2.5 + 1,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          o: Math.random() * 0.4 + 0.15
        });
      }
    }

    function drawNeuralNodes() {
      if (!neuralSvg) return;
      var svgContent = '';

      for (var i = 0; i < nnNodes.length; i++) {
        for (var j = i + 1; j < nnNodes.length; j++) {
          var dx = nnNodes[i].x - nnNodes[j].x;
          var dy = nnNodes[i].y - nnNodes[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            var op = (1 - dist / 150) * 0.12;
            svgContent += '<line x1="' + nnNodes[i].x.toFixed(1) + '" y1="' + nnNodes[i].y.toFixed(1) + '" x2="' + nnNodes[j].x.toFixed(1) + '" y2="' + nnNodes[j].y.toFixed(1) + '" stroke="rgba(217,155,127,' + op.toFixed(3) + ')" stroke-width="0.5"/>';
          }
        }
      }

      for (var k = 0; k < nnNodes.length; k++) {
        var n = nnNodes[k];
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > nnSvgW) n.vx *= -1;
        if (n.y < 0 || n.y > nnSvgH) n.vy *= -1;
        n.x = Math.max(0, Math.min(nnSvgW, n.x));
        n.y = Math.max(0, Math.min(nnSvgH, n.y));
        svgContent += '<circle cx="' + n.x.toFixed(1) + '" cy="' + n.y.toFixed(1) + '" r="' + n.r + '" fill="rgba(165,111,99,' + n.o.toFixed(3) + ')"/>';
        svgContent += '<circle cx="' + n.x.toFixed(1) + '" cy="' + n.y.toFixed(1) + '" r="' + (n.r + 3) + '" fill="rgba(165,111,99,0.03)"/>';
      }

      neuralSvg.innerHTML = svgContent;
      requestAnimationFrame(drawNeuralNodes);
    }

    initNeuralNodes();
    drawNeuralNodes();
  }

  /* ─── BUTTON RIPPLE ─── */
  document.querySelectorAll('.btn-ripple').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      var rect = btn.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var ripple = document.createElement('span');
      ripple.className = 'ripple-effect';
      var size = Math.max(rect.width, rect.height) * 2;
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (x - size / 2) + 'px';
      ripple.style.top = (y - size / 2) + 'px';
      btn.appendChild(ripple);
      setTimeout(function() { ripple.remove(); }, 600);
    });
  });

  /* ─── AMBIENT GRADIENT MOVEMENT ─── */
  if (!isMobile && !reducedMotion) {
    var gradAngle = 0;
    function animateGradient() {
      gradAngle += 0.1;
      var x1 = 50 + Math.sin(gradAngle * 0.01) * 20;
      var y1 = 50 + Math.cos(gradAngle * 0.015) * 20;
      document.body.style.setProperty('--grad-x', x1 + '%');
      document.body.style.setProperty('--grad-y', y1 + '%');
      requestAnimationFrame(animateGradient);
    }
    animateGradient();
  }

})();
