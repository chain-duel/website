const swiper = new Swiper('.events', {
  effect: 'coverflow',
  speed: 700,
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
      scale: 0.72,
      slideShadows: true,
  },
  breakpoints: {
    0: {
      slidesPerView: 1.08,
      coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 160,
        modifier: 1,
        scale: 0.72,
        slideShadows: false,
      },
    },
    768: {
      slidesPerView: 2,
      coverflowEffect: {
        rotate: 50,
        stretch: 50,
        depth: 300,
        modifier: 1,
        scale: 0.72,
        slideShadows: true,
      },
    },
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  keyboard: {
    enabled: true,
    onlyInViewport: true,
  },
});

let lastActiveSlide = swiper.slides[swiper.activeIndex];

swiper.on('slideChangeTransitionStart', () => {
  const nextActive = swiper.slides[swiper.activeIndex];
  const speed = `${swiper.params.speed}ms`;

  swiper.slides.forEach((slide) => {
    slide.style.transition = 'none';
    if (slide === nextActive) slide.style.opacity = '0';
    else if (slide === lastActiveSlide) slide.style.opacity = '1';
  });

  setTimeout(() => {
    swiper.slides.forEach((slide) => {
      slide.style.transitionProperty = 'transform, opacity';
      slide.style.transitionDuration = speed;
      slide.style.transitionTimingFunction = 'ease';
      slide.style.opacity = slide === nextActive ? '1' : '0.35';
    });
    lastActiveSlide = nextActive;
  }, 30);
});

const navSectionLinks = [...document.querySelectorAll('.navbar-menu a[href^="#"]')];
const navToggleButton = document.querySelector('.navbar-toggle');
const navMenu = document.querySelector('.navbar-menu');
const navIndicator = document.querySelector('.navbar-indicator');
let navIndicatorReady = false;

const navSections = navSectionLinks
  .map((link) => {
    const target = document.querySelector(link.getAttribute('href'));
    return target ? { link, target } : null;
  })
  .filter(Boolean);

function updateActiveNavLink() {
  if (!navSections.length) return;

  const marker = window.scrollY + 140;
  let activeLink = null;

  navSections.forEach(({ link, target }) => {
    if (target.offsetTop <= marker) {
      activeLink = link;
    }
  });

  const atBottom =
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
  if (atBottom) {
    activeLink = navSections[navSections.length - 1].link;
  }

  navSectionLinks.forEach((link) => {
    link.classList.toggle('active', link === activeLink);
  });

  placeNavIndicator(activeLink);
}

function placeNavIndicator(link) {
  if (!navIndicator || !navMenu) return;
  if (!link) {
    navIndicator.classList.remove('is-placed');
    return;
  }
  if (getComputedStyle(navMenu).display === 'none') return;

  const menuRect = navMenu.getBoundingClientRect();
  const linkRect = link.getBoundingClientRect();
  if (!linkRect.width || !linkRect.height) return;

  if (!navIndicatorReady) {
    navIndicator.style.transition = 'none';
  }

  navIndicator.style.width = `${linkRect.width}px`;
  navIndicator.style.height = `${linkRect.height}px`;
  navIndicator.style.transform = `translate(${linkRect.left - menuRect.left + navMenu.scrollLeft}px, ${linkRect.top - menuRect.top + navMenu.scrollTop}px)`;
  navIndicator.classList.add('is-placed');

  if (!navIndicatorReady) {
    navIndicator.offsetHeight;
    navIndicator.style.transition = '';
    navIndicatorReady = true;
  }
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
    if (isOpen) {
      requestAnimationFrame(() => updateActiveNavLink());
    }
  });

  navSectionLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 900) {
        closeMobileMenu();
      }
    });
  });
}

const navbar = document.querySelector('.navbar');

function updateNavbarScroll() {
  if (!navbar) return;
  navbar.classList.toggle('is-scrolled', window.scrollY > 8);
}

window.addEventListener('scroll', updateActiveNavLink, { passive: true });
window.addEventListener('scroll', updateNavbarScroll, { passive: true });
updateNavbarScroll();
window.addEventListener('load', updateActiveNavLink);
window.addEventListener('resize', () => {
  if (window.innerWidth >= 900) {
    closeMobileMenu();
  }
  const active = navSectionLinks.find((link) => link.classList.contains('active'));
  placeNavIndicator(active);
});
updateActiveNavLink();

const footerYear = document.getElementById('footer-year');
if (footerYear) {
  footerYear.textContent = new Date().getFullYear();
}

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

/* Scroll-reveal: animate when entering viewport; run as soon as DOM is ready */
const revealEls = document.querySelectorAll('.reveal');
let revealReady = false;

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
      if (entry.isIntersecting && revealReady) {
        entry.target.classList.add('is-visible');
      }
    });
  },
  { rootMargin: '0px 0px -40px 0px', threshold: 0.05 }
);
revealEls.forEach((el) => revealObserver.observe(el));

const upcomingSection = document.querySelector('.appearances-upcoming');
if (upcomingSection) {
  const upcomingObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          upcomingObserver.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.2 }
  );
  upcomingObserver.observe(upcomingSection);
}

function runReveal() {
  if (!location.hash) window.scrollTo(0, 0);
  revealReady = true;
  revealInViewport();
  setTimeout(() => {
    if (!location.hash) window.scrollTo(0, 0);
  }, 700);
}

function fitHeroVideo(video) {
  if (!video.videoWidth || !video.videoHeight) return;
  video.style.setProperty('--hero-video-ratio', String(video.videoWidth / video.videoHeight));
}

function initHeroVideo() {
  document.querySelectorAll('.hero-video video').forEach((video) => {
    fitHeroVideo(video);
    video.addEventListener('loadedmetadata', () => fitHeroVideo(video));
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    runReveal();
    initHeroVideo();
  });
} else {
  runReveal();
  initHeroVideo();
}
