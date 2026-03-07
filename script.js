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

const navSectionLinks = [...document.querySelectorAll('.navbar a[href^="#"]')];
const navToggleButton = document.querySelector('.navbar-toggle');
const navMenu = document.querySelector('.navbar-menu');
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
window.addEventListener('load', updateActiveNavLink);
window.addEventListener('resize', () => {
  if (window.innerWidth > 640) {
    closeMobileMenu();
  }
});
updateActiveNavLink();
