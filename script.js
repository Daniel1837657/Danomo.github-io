// =============================================
//            VARIABLES GLOBALES
// =============================================
const DOM = {
  navbar: document.querySelector('.navbar'),
  logoImg: document.querySelector('.logo-img'),
  navLinks: document.querySelectorAll('.nav-links a'),
  sections: document.querySelectorAll('section'),
  backToTopBtn: document.getElementById('volver-arriba'),
  servicios: document.querySelectorAll('.servicio'),
  contactForm: document.getElementById('formulario-contacto'),
  whatsappBtn: document.querySelector('.whatsapp-float'),
  lazyImages: document.querySelectorAll('img[data-src]')
};

// =============================================
//            UTILITIES
// =============================================
const utils = {
  throttle: (func, limit) => {
    let lastFunc;
    let lastRan;
    return function() {
      const context = this;
      const args = arguments;
      if (!lastRan) {
        func.apply(context, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(() => {
          if ((Date.now() - lastRan) >= limit) {
            func.apply(context, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    };
  },

  validateEmail: (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  },

  showAlert: (message, type, parent) => {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${type}`;
    alertDiv.textContent = message;
    parent.insertBefore(alertDiv, parent.firstChild);

    setTimeout(() => {
      alertDiv.classList.add('fade-out');
      setTimeout(() => alertDiv.remove(), 300);
    }, 4500);
  }
};

// =============================================
//            NAVBAR SCROLL EFFECT
// =============================================
function handleNavbarScroll() {
  if (window.scrollY > 100) {
    DOM.navbar.classList.add('scrolled');
    DOM.logoImg.classList.add('scrolled');
    DOM.navLinks.forEach(link => link.classList.add('scrolled'));
  } else {
    DOM.navbar.classList.remove('scrolled');
    DOM.logoImg.classList.remove('scrolled');
    DOM.navLinks.forEach(link => link.classList.remove('scrolled'));
  }
}

// =============================================
//            NEON EFFECT ON NAVBAR BASED ON SECTION
// =============================================
function updateNavbarNeon() {
  const neonColors = {
    banner: '0 0 8px #00f0ff, 0 0 12px #00f0ff, 0 0 16px #00f0ff',
    servicios: '0 0 8px #ff00ff, 0 0 12px #ff00ff, 0 0 16px #ff00ff',
    sobre: '0 0 8px #00ff99, 0 0 12px #00ff99, 0 0 16px #00ff99',
    enfoque: '0 0 8px #ff6600, 0 0 12px #ff6600, 0 0 16px #ff6600',
    contacto: '0 0 8px #ff0055, 0 0 12px #ff0055, 0 0 16px #ff0055'
  };

  let activeSection = '';

  DOM.sections.forEach(section => {
    const sectionTop = section.offsetTop - 90; // ajustar por navbar height
    const sectionHeight = section.offsetHeight;

    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      activeSection = section.id;
    }
  });

  let glow = '';

  switch (activeSection) {
    case 'banner': glow = neonColors.banner; break;
    case 'servicios': glow = neonColors.servicios; break;
    case 'sobre-nosotros': glow = neonColors.sobre; break;
    case 'enfoque': glow = neonColors.enfoque; break;
    case 'contacto': glow = neonColors.contacto; break;
    default: glow = '';
  }

  if (glow) {
    DOM.navbar.style.boxShadow = glow;
  } else {
    DOM.navbar.style.boxShadow = 'none';
  }
}

// =============================================
//           SCROLL REVEAL ANIMATION
// =============================================
function scrollReveal() {
  const windowHeight = window.innerHeight;
  const revealPoint = 150;

  DOM.sections.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;

    if (sectionTop < windowHeight - revealPoint) {
      section.classList.add('revealed');
    }
  });
}

function initScrollReveal() {
  DOM.sections.forEach(section => {
    section.classList.add('scroll-reveal');
  });
  scrollReveal();
}

// =============================================
//           SERVICE CARDS 3D EFFECT
// =============================================
function initServiceCards() {
  DOM.servicios.forEach(servicio => {
    servicio.addEventListener('mousemove', (e) => {
      const rect = servicio.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const angleX = (y - centerY) / 20;
      const angleY = (centerX - x) / 20;

      servicio.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale(1.05)`;
    });

    servicio.addEventListener('mouseleave', () => {
      servicio.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
  });
}

// =============================================
//           CONTACT FORM VALIDATION
// =============================================
function initContactForm() {
  if (!DOM.contactForm) return;

  DOM.contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = DOM.contactForm.querySelector('#nombre').value.trim();
    const email = DOM.contactForm.querySelector('#email').value.trim();
    const mensaje = DOM.contactForm.querySelector('#mensaje').value.trim();

    if (!nombre || !email || !mensaje) {
      utils.showAlert('Por favor complete todos los campos', 'error', DOM.contactForm);
      return;
    }

    if (nombre.length < 3) {
      utils.showAlert('El nombre debe tener al menos 3 caracteres', 'error', DOM.contactForm);
      return;
    }

    if (!utils.validateEmail(email)) {
      utils.showAlert('Por favor ingrese un email válido', 'error', DOM.contactForm);
      return;
    }

    if (mensaje.length < 10) {
      utils.showAlert('El mensaje debe tener al menos 10 caracteres', 'error', DOM.contactForm);
      return;
    }

    utils.showAlert('Mensaje enviado con éxito! Nos pondremos en contacto pronto.', 'success', DOM.contactForm);
    DOM.contactForm.reset();
  });
}

// =============================================
//           WHATSAPP BUTTON ANIMATION
// =============================================
function initWhatsappButton() {
  if (!DOM.whatsappBtn) return;

  DOM.whatsappBtn.addEventListener('mouseenter', () => {
    DOM.whatsappBtn.style.animation = 'none';
  });

  DOM.whatsappBtn.addEventListener('mouseleave', () => {
    DOM.whatsappBtn.style.animation = 'pulse 2s infinite';
  });
}

// =============================================
//           ACTIVE LINK HIGHLIGHTING
// =============================================
function updateActiveLink() {
  let currentSection = '';

  DOM.sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
      currentSection = section.id;
    }
  });

  DOM.navLinks.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('href') === `#${currentSection}`) {
      item.classList.add('active');
    }
  });
}

// =============================================
//           IMAGE LAZY LOADING
// =============================================
function initLazyLoading() {
  if (!('IntersectionObserver' in window)) {
    DOM.lazyImages.forEach(img => {
      img.src = img.dataset.src;
    });
    return;
  }

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.onload = () => img.classList.add('loaded');
        imageObserver.unobserve(img);
      }
    });
  }, { rootMargin: '0px 0px 100px 0px' });

  DOM.lazyImages.forEach(img => imageObserver.observe(img));
}

// =============================================
//           SMOOTH SCROLL FOR LINKS
// =============================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
}

// =============================================
//           MOBILE MENU TOGGLE
// =============================================
function initMobileMenu() {
  const mobileMenuBtn = document.createElement('div');
  mobileMenuBtn.className = 'mobile-menu-btn';
  mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';

  DOM.navbar.insertBefore(mobileMenuBtn, DOM.navbar.firstChild);

  function toggleMobileMenu() {
    DOM.navbar.classList.toggle('mobile-open');
    document.body.style.overflow = DOM.navbar.classList.contains('mobile-open') ? 'hidden' : '';
    mobileMenuBtn.innerHTML = DOM.navbar.classList.contains('mobile-open')
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-bars"></i>';
  }

  mobileMenuBtn.addEventListener('click', toggleMobileMenu);

  DOM.navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (DOM.navbar.classList.contains('mobile-open')) {
        toggleMobileMenu();
      }
    });
  });
}

// =============================================
//           COUNTER ANIMATION
// =============================================
function animateCounter(counter, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16);

  const updateCounter = () => {
    const current = +counter.textContent;
    if (current < target) {
      counter.textContent = Math.ceil(current + increment);
      requestAnimationFrame(updateCounter);
    } else {
      counter.textContent = target;
    }
  };

  counter.textContent = start;
  requestAnimationFrame(updateCounter);
}

function initCounters() {
  const counterSection = document.querySelector('.stats-section');
  if (!counterSection) return;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      const counters = document.querySelectorAll('.counter');
      counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        animateCounter(counter, target);
      });
      observer.unobserve(counterSection);
    }
  });

  observer.observe(counterSection);
}

// =============================================
//           INICIALIZACIÓN
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initServiceCards();
  initContactForm();
  initWhatsappButton();
  initLazyLoading();
  initSmoothScroll();
  initMobileMenu();
  initCounters();

  const throttledScroll = utils.throttle(() => {
    handleNavbarScroll();
    scrollReveal();
    handleBackToTop();
    updateActiveLink();
    updateNavbarNeon();
  }, 100);

  window.addEventListener('scroll', throttledScroll);

  DOM.backToTopBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
