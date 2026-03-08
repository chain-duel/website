const swiper = new Swiper('.events', {
  effect: 'coverflow',
  centeredSlides: true,
  slidesPerView: 1,
  loop: true,
  //createElements: true,
  pagination: true,
  //autoplay: true,
  coverflowEffect: {
      rotate: 50,
      stretch: 50,
      depth: 300,
      modifier: 1,
      slideShadows: true,
  },
  breakpoints: {
    10: {
      slidesPerView: 2,
    }
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  }
});

const navbar = document.querySelector('.navbar');
const navSectionLinks = [...document.querySelectorAll('.navbar-menu a[href^="#"]')];
const navToggleButton = document.querySelector('.navbar-toggle');
const navMenu = document.querySelector('.navbar-menu');

function updateNavbarScroll() {
  if (!navbar) return;
  const scrolled = window.scrollY > 24;
  navbar.classList.toggle('is-scrolled', scrolled);
}
const navSections = navSectionLinks
  .map((link) => {
    const target = document.querySelector(link.getAttribute('href'));
    return target ? { link, target } : null;
  })
  .filter(Boolean);

function updateActiveNavLink() {
  if (!navSections.length) return;

  const marker = window.scrollY + 140;
  let activeLink = navSections[0].link;

  navSections.forEach(({ link, target }) => {
    if (target.offsetTop <= marker) {
      activeLink = link;
    }
  });

  navSectionLinks.forEach((link) => {
    link.classList.toggle('active', link === activeLink);
  });
}

function closeMobileMenu() {
  if (!navMenu || !navToggleButton) return;
  navMenu.classList.remove('is-open');
  navToggleButton.classList.remove('is-open');
  navToggleButton.setAttribute('aria-expanded', 'false');
}

if (navToggleButton && navMenu) {
  navToggleButton.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-open');
    navToggleButton.classList.toggle('is-open', isOpen);
    navToggleButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  navSectionLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 640) {
        closeMobileMenu();
      }
    });
  });
}

window.addEventListener('scroll', updateActiveNavLink, { passive: true });
window.addEventListener('scroll', updateNavbarScroll, { passive: true });
window.addEventListener('load', updateActiveNavLink);
window.addEventListener('load', updateNavbarScroll);
window.addEventListener('resize', () => {
  if (window.innerWidth > 640) {
    closeMobileMenu();
  }
});
updateActiveNavLink();

const footerYear = document.getElementById('footer-year');
if (footerYear) {
  footerYear.textContent = new Date().getFullYear();
}

/* Keep page at top on load so nav doesn’t get scrolled background */
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

/* Scroll-reveal: animate when entering viewport; delay until after load to avoid layout-shift glitch */
const revealEls = document.querySelectorAll('.reveal');
let loadFired = false;

function revealInViewport() {
  revealEls.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('is-visible');
    }
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && loadFired) {
        entry.target.classList.add('is-visible');
      }
    });
  },
  { rootMargin: '0px 0px -40px 0px', threshold: 0.05 }
);
revealEls.forEach((el) => revealObserver.observe(el));

window.addEventListener('load', () => {
  window.scrollTo(0, 0);
  loadFired = true;
  revealInViewport();
  /* Reset scroll again after reveal transition so animation can’t trigger nav background */
  setTimeout(() => window.scrollTo(0, 0), 700);
});
