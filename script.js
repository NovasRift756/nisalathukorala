/**
 * Nisal Athukorala – Biotechnology Undergraduate Portfolio
 * Ultra-Smooth Scroll Experience & Interactions
 * Features:
 * - Fluid 3D-Perspective DNA Double Helix Canvas with Scroll Velocity Response
 * - Top Reading Scroll Progress Bar
 * - Dynamic Floating Back-to-Top Button with Circular SVG Progress Ring
 * - Interactive Timeline Scroll Progress Fill
 * - Dynamic Skill Proficiency Bars Animation on Reveal
 * - Multi-Layer Parallax for Hero Ambient Glow Orbs
 * - Interactive Mouse-Spotlight Glow on Cards
 * - Cascading Staggered Scroll-Reveal Animations (IntersectionObserver)
 * - Sticky Glassmorphic Header & Active Section Spy
 * - Accessible Mobile Navigation Drawer
 * - One-Click Copy-To-Clipboard with Toast Notifications
 * - Client-Side Contact Form Validation
 * - Full prefers-reduced-motion accessibility compliance
 */

(function () {
  'use strict';

  /* --------------------------------------------------------------------------
     1. Motion Preference Check
     -------------------------------------------------------------------------- */
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let prefersReducedMotion = motionQuery.matches;

  motionQuery.addEventListener('change', (e) => {
    prefersReducedMotion = e.matches;
  });

  /* --------------------------------------------------------------------------
     2. Interactive Biotech DNA Double Helix Canvas Animation (All Sections)
     -------------------------------------------------------------------------- */
  const canvas = document.getElementById('dnaCanvas');
  let scrollVelocity = 0;
  let lastScrollY = window.scrollY;

  if (canvas) {
    const ctx = canvas.getContext('2d');
    let animationFrameId = null;
    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;
    let angle = 0;

    function resizeCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;

      dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';

      ctx.scale(dpr, dpr);
    }

    window.addEventListener('resize', resizeCanvas, { passive: true });
    resizeCanvas();

    // Configuration for Full-Viewport Continuous DNA Double Helix
    const baseSpeed = 0.013;
    const stepY = 32; // Evenly spaced nucleotide rungs

    function drawDNA() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      // Only animate if reduced motion is disabled
      if (!prefersReducedMotion) {
        // Smoothly decay scroll velocity momentum
        scrollVelocity *= 0.92;
        angle += baseSpeed + scrollVelocity;
      }

      // Dynamic pair count covering full viewport height
      const numPairs = Math.ceil(height / stepY) + 3;
      const strandRadius = Math.min(135, Math.max(70, width * 0.1));
      const scrollOffset = window.scrollY * 0.28;

      // Color palette
      const violetColor = 'rgba(139, 124, 255, ';
      const peachColor = 'rgba(255, 157, 122, ';
      const rungColor = 'rgba(154, 163, 199, ';

      // Render rungs and nucleotide nodes down the entire page height
      for (let i = -1; i <= numPairs; i++) {
        // Continuous wrapping vertical coordinates based on scroll
        const rawY = i * stepY;
        const y = ((rawY - (scrollOffset % stepY)) + height + stepY) % (height + stepY * 2) - stepY;

        // Cumulative angle considering vertical position and scroll depth
        const currentAngle = angle + (y + scrollOffset) * 0.007;

        // Gentle sinusoidal curve along the horizontal spine for organic flow
        const spineOffset = Math.sin((y + scrollOffset) * 0.0016) * (width * 0.07);
        const centerX = width * 0.5 + spineOffset;

        // 3D rotation projection
        const cosVal = Math.cos(currentAngle);
        const sinVal = Math.sin(currentAngle);

        // Strand A
        const x1 = centerX + cosVal * strandRadius;
        const z1 = sinVal; // depth: -1 to 1

        // Strand B (180 degrees opposite)
        const x2 = centerX - cosVal * strandRadius;
        const z2 = -sinVal;

        // Depth perspective scaling
        const alpha1 = 0.32 + (z1 + 1) * 0.32; // 0.32 to 0.96
        const alpha2 = 0.32 + (z2 + 1) * 0.32;
        const radius1 = 2.8 + (z1 + 1) * 1.8;
        const radius2 = 2.8 + (z2 + 1) * 1.8;

        // Base-pair connecting rung
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.strokeStyle = `${rungColor}${Math.min(alpha1, alpha2) * 0.28})`;
        ctx.lineWidth = 1.3;
        ctx.stroke();

        // Intermediate base markers (A-T / C-G base junction)
        const midX = (x1 + x2) / 2;
        ctx.beginPath();
        ctx.arc(midX, y, 1.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(236, 239, 253, ${(alpha1 + alpha2) * 0.2})`;
        ctx.fill();

        // Node on Strand A (Violet)
        ctx.beginPath();
        ctx.arc(x1, y, radius1, 0, Math.PI * 2);
        ctx.fillStyle = `${violetColor}${alpha1})`;
        ctx.shadowColor = 'rgba(139, 124, 255, 0.45)';
        ctx.shadowBlur = radius1 * 2;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Node on Strand B (Peach)
        ctx.beginPath();
        ctx.arc(x2, y, radius2, 0, Math.PI * 2);
        ctx.fillStyle = `${peachColor}${alpha2})`;
        ctx.shadowColor = 'rgba(255, 157, 122, 0.45)';
        ctx.shadowBlur = radius2 * 2;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(drawDNA);
      }
    }

    if (!prefersReducedMotion) {
      animationFrameId = requestAnimationFrame(drawDNA);
    } else {
      drawDNA(); // Single static render
    }
  }

  /* --------------------------------------------------------------------------
     3. Smooth Scroll Orchestration & Progress Indicators
     -------------------------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  const floatingTopBtn = document.getElementById('floatingTopBtn');
  const scrollProgressRing = document.getElementById('scrollProgressRing');
  const timelineProgressFill = document.getElementById('timelineProgressFill');
  const timelineContainer = document.querySelector('.timeline-container');
  const orbViolet = document.querySelector('.orb-violet');
  const orbPeach = document.querySelector('.orb-peach');

  const ringCircumference = 2 * Math.PI * 20; // r = 20 => ~125.66

  function onGlobalScroll() {
    const currentScrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollFraction = docHeight > 0 ? Math.min(1, Math.max(0, currentScrollY / docHeight)) : 0;

    // 1. Calculate scroll velocity for DNA canvas momentum
    if (!prefersReducedMotion) {
      const deltaY = currentScrollY - lastScrollY;
      scrollVelocity = Math.max(-0.04, Math.min(0.04, deltaY * 0.0004));
      lastScrollY = currentScrollY;
    }

    // 2. Header glassmorphism toggle
    if (navbar) {
      if (currentScrollY > 40) {
        navbar.classList.add('is-scrolled');
      } else {
        navbar.classList.remove('is-scrolled');
      }
    }

    // 3. Top reading progress bar width
    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${(scrollFraction * 100).toFixed(2)}%`;
    }

    // 4. Floating Back-to-Top visibility and SVG ring fill
    if (floatingTopBtn) {
      if (currentScrollY > 420) {
        floatingTopBtn.classList.add('is-visible');
      } else {
        floatingTopBtn.classList.remove('is-visible');
      }
    }

    if (scrollProgressRing) {
      const offset = ringCircumference - scrollFraction * ringCircumference;
      scrollProgressRing.style.strokeDashoffset = offset.toFixed(2);
    }

    // 5. Educational timeline fill on scroll
    if (timelineContainer && timelineProgressFill && !prefersReducedMotion) {
      const rect = timelineContainer.getBoundingClientRect();
      const containerHeight = timelineContainer.offsetHeight;
      const windowHeight = window.innerHeight;

      // How far down the timeline container has reached through viewport center
      const startPoint = windowHeight * 0.75;
      const progressPx = startPoint - rect.top;
      const progressRatio = Math.max(0, Math.min(1, progressPx / containerHeight));
      timelineProgressFill.style.height = `${(progressRatio * 100).toFixed(1)}%`;
    }

    // 6. Subtle Parallax for hero ambient glow orbs (if hero is near top)
    if (!prefersReducedMotion && currentScrollY < window.innerHeight) {
      if (orbViolet) {
        orbViolet.style.transform = `translate3d(0, ${currentScrollY * 0.12}px, 0)`;
      }
      if (orbPeach) {
        orbPeach.style.transform = `translate3d(0, ${currentScrollY * -0.08}px, 0)`;
      }
    }
  }

  window.addEventListener('scroll', onGlobalScroll, { passive: true });
  onGlobalScroll();

  /* --------------------------------------------------------------------------
     4. Interactive Mouse-Spotlight Glow on Cards
     -------------------------------------------------------------------------- */
  const cards = document.querySelectorAll('.card');
  if (window.matchMedia('(pointer: fine)').matches) {
    cards.forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      }, { passive: true });
    });
  }

  /* --------------------------------------------------------------------------
     5. Skill Progress Bars Scroll-Triggered Animation
     -------------------------------------------------------------------------- */
  const skillBars = document.querySelectorAll('.tool-bar-fill');
  if ('IntersectionObserver' in window && skillBars.length > 0) {
    const skillsObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            skillBars.forEach((bar, index) => {
              const targetPercent = bar.getAttribute('data-progress') || '80';
              setTimeout(() => {
                bar.style.width = `${targetPercent}%`;
              }, index * 160);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );

    const toolsCard = document.querySelector('.tools-list')?.closest('.card');
    if (toolsCard) {
      skillsObserver.observe(toolsCard);
    }
  } else {
    // Fallback if observer not supported
    skillBars.forEach((bar) => {
      bar.style.width = `${bar.getAttribute('data-progress') || '80'}%`;
    });
  }

  /* --------------------------------------------------------------------------
     6. Cascading Staggered Scroll-Reveal (IntersectionObserver)
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal-item, .reveal-fade');
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
      }
    );

    // Apply smart cascading delays based on sibling position in grids
    revealElements.forEach((el) => {
      const parentGrid = el.closest('.projects-grid, .skills-grid, .about-stats-grid, .timeline-container');
      if (parentGrid) {
        const siblings = Array.from(parentGrid.querySelectorAll('.reveal-item'));
        const index = siblings.indexOf(el);
        if (index >= 0) {
          el.style.transitionDelay = `${(index % 4) * 0.1}s`;
        }
      }
      revealObserver.observe(el);
    });
  } else {
    // If IntersectionObserver is unavailable or reduced motion is enabled, show all
    revealElements.forEach((el) => el.classList.add('is-revealed'));
  }

  /* --------------------------------------------------------------------------
     7. Mobile Navigation Drawer Toggle & Accessibility
     -------------------------------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.getElementById('primaryNav');

  function openMobileNav() {
    navToggle.classList.add('is-active');
    primaryNav.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
  }

  function closeMobileNav() {
    navToggle.classList.remove('is-active');
    primaryNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    // Close menu when clicking any nav link
    const navLinks = primaryNav.querySelectorAll('.nav-link, .btn');
    navLinks.forEach((link) => {
      link.addEventListener('click', closeMobileNav);
    });

    // Close on clicking outside
    document.addEventListener('click', (e) => {
      if (
        primaryNav.classList.contains('is-open') &&
        !primaryNav.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        closeMobileNav();
      }
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && primaryNav.classList.contains('is-open')) {
        closeMobileNav();
        navToggle.focus();
      }
    });
  }

  /* --------------------------------------------------------------------------
     8. Active Navigation Link Highlighting (IntersectionObserver)
     -------------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-menu .nav-link');

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-25% 0px -45% 0px',
      threshold: [0, 0.2, 0.5]
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navAnchors.forEach((anchor) => {
            if (anchor.getAttribute('href') === `#${currentId}`) {
              anchor.classList.add('active');
            } else {
              anchor.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach((section) => sectionObserver.observe(section));
  }

  /* --------------------------------------------------------------------------
     9. Toast Notification Utility
     -------------------------------------------------------------------------- */
  const toast = document.getElementById('toast');
  let toastTimer = null;

  function showToast(message, duration = 3000) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  /* --------------------------------------------------------------------------
     10. One-Click Copy to Clipboard
     -------------------------------------------------------------------------- */
  const copyButtons = document.querySelectorAll('.btn-copy');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(textToCopy);
        } else {
          // Fallback for non-https or older browser contexts
          const textarea = document.createElement('textarea');
          textarea.value = textToCopy;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }

        const originalText = btn.querySelector('.copy-text')?.textContent || 'Copy';
        const copyTextSpan = btn.querySelector('.copy-text');
        if (copyTextSpan) copyTextSpan.textContent = 'Copied!';
        btn.classList.add('copied');

        showToast(`Copied "${textToCopy}" to clipboard!`);

        setTimeout(() => {
          if (copyTextSpan) copyTextSpan.textContent = originalText;
          btn.classList.remove('copied');
        }, 2200);
      } catch (err) {
        showToast('Failed to copy. Please copy manually.');
      }
    });
  });

  /* --------------------------------------------------------------------------
     11. Interactive Contact Form with Validation
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const nameInput = document.getElementById('senderName');
    const emailInput = document.getElementById('senderEmail');
    const subjectInput = document.getElementById('messageSubject');
    const messageInput = document.getElementById('senderMessage');

    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');
    const formStatus = document.getElementById('formStatus');

    function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function clearErrors() {
      nameError.textContent = '';
      emailError.textContent = '';
      messageError.textContent = '';
      formStatus.textContent = '';
      formStatus.className = 'form-status';
    }

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();

      let hasError = false;

      // Name validation
      if (!nameInput.value.trim()) {
        nameError.textContent = 'Please enter your name.';
        hasError = true;
      }

      // Email validation
      if (!emailInput.value.trim()) {
        emailError.textContent = 'Please enter your email address.';
        hasError = true;
      } else if (!validateEmail(emailInput.value.trim())) {
        emailError.textContent = 'Please enter a valid email address.';
        hasError = true;
      }

      // Message validation
      if (!messageInput.value.trim()) {
        messageError.textContent = 'Please enter a message.';
        hasError = true;
      } else if (messageInput.value.trim().length < 10) {
        messageError.textContent = 'Please write at least 10 characters.';
        hasError = true;
      }

      if (hasError) return;

      // Successful validation: Prepare mailto link and trigger
      const subject = encodeURIComponent(subjectInput.value.trim() || 'Biotechnology Inquiry - Portfolio Contact');
      const body = encodeURIComponent(
        `Name: ${nameInput.value.trim()}\nEmail: ${emailInput.value.trim()}\n\nMessage:\n${messageInput.value.trim()}`
      );

      const mailtoUrl = `mailto:nnathukorala@gmail.com?subject=${subject}&body=${body}`;

      formStatus.textContent = 'Opening your email client... Thank you for reaching out!';
      formStatus.className = 'form-status success';
      showToast('Opening default email client...');

      // Trigger mailto link
      window.location.href = mailtoUrl;

      // Reset form after short delay
      setTimeout(() => {
        contactForm.reset();
      }, 1500);
    });
  }

  /* --------------------------------------------------------------------------
     12. Smooth Scroll To Top Handlers
     -------------------------------------------------------------------------- */
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
  }

  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', scrollToTop);
  }

  if (floatingTopBtn) {
    floatingTopBtn.addEventListener('click', scrollToTop);
  }

  /* --------------------------------------------------------------------------
     13. Dynamic Copyright Year
     -------------------------------------------------------------------------- */
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }
})();
