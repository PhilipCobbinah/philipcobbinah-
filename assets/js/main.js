/**
 * Philip Cobbinah Portfolio - Main JavaScript
 * Handles all interactive features and animations
 */

(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim();
    if (all) {
      return [...document.querySelectorAll(el)];
    } else {
      return document.querySelector(el);
    }
  };

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all);
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener));
      } else {
        selectEl.addEventListener(type, listener);
      }
    }
  };

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener);
  };

  /**
   * Preloader
   */
  const preloader = select('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('loaded');
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 500);
      }, 300);
    });
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.header-toggle', function(e) {
    select('#header').classList.toggle('header-show');
    this.classList.toggle('bi-list');
    this.classList.toggle('bi-x');
  });

  /**
   * Hide mobile nav on same-page/hash links
   */
  on('click', '.navmenu a', function(e) {
    if (select('#header').classList.contains('header-show')) {
      select('#header').classList.remove('header-show');
      select('.header-toggle').classList.toggle('bi-list');
      select('.header-toggle').classList.toggle('bi-x');
    }
  }, true);

  /**
   * Toggle mobile nav dropdowns
   */
  on('click', '.navmenu .toggle-dropdown', function(e) {
    e.preventDefault();
    this.parentNode.classList.toggle('active');
    this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
    e.stopImmediatePropagation();
  }, true);

  /**
   * Scroll top button
   */
  let scrollTop = select('#scroll-top');
  if (scrollTop) {
    const toggleScrollTop = function() {
      if (window.scrollY > 100) {
        scrollTop.classList.add('active');
      } else {
        scrollTop.classList.remove('active');
      }
    };
    window.addEventListener('load', toggleScrollTop);
    onscroll(document, toggleScrollTop);

    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /**
   * Animation on scroll function and init - AOS
   */
  function aosInit() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 600,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
        offset: 100
      });
    }
  }
  window.addEventListener('load', aosInit);

  /**
   * Init typed.js
   */
  const selectTyped = select('.typed');
  if (selectTyped) {
    if (typeof Typed !== 'undefined') {
      let typed_strings = selectTyped.getAttribute('data-typed-items');
      typed_strings = typed_strings.split(',');
      new Typed('.typed', {
        strings: typed_strings,
        loop: true,
        typeSpeed: 100,
        backSpeed: 50,
        backDelay: 2000
      });
    } else {
      selectTyped.textContent = 'Designer & Developer';
    }
  }

  /**
   * Initiate Pure Counter
   */
  if (typeof PureCounter !== 'undefined') {
    new PureCounter();
  } else {
    const counters = select('.purecounter', true);
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-purecounter-end');
      const duration = +counter.getAttribute('data-purecounter-duration') || 1;
      const increment = target / (duration * 60);
      
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = target;
          clearInterval(timer);
        } else {
          counter.textContent = Math.ceil(current);
        }
      }, 1000 / 60);
    });
  }

  /**
   * Animate the skills items on reveal - UPDATED VERSION
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  
  // Check if Waypoint library is available
  if (typeof Waypoint !== 'undefined') {
    skillsAnimation.forEach((item) => {
      new Waypoint({
        element: item,
        offset: '80%',
        handler: function(direction) {
          let progress = item.querySelectorAll('.progress .progress-bar');
          progress.forEach(el => {
            let progressValue = el.getAttribute('aria-valuenow');
            el.style.width = progressValue + '%';
            el.style.setProperty('--width', progressValue + '%');
          });
        }
      });
    });
  } else {
    // Fallback: Use scroll event listener
    let skillsAnimated = false;
    
    const animateSkills = function() {
      if (skillsAnimated) return;
      
      const skillsSection = document.querySelector('.skills-animation');
      if (!skillsSection) return;
      
      const sectionPos = skillsSection.getBoundingClientRect().top;
      const screenPos = window.innerHeight / 1.2;
      
      if (sectionPos < screenPos) {
        skillsAnimated = true;
        const progressBars = skillsSection.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
          const value = bar.getAttribute('aria-valuenow');
          bar.style.width = value + '%';
          bar.style.setProperty('--width', value + '%');
        });
      }
    };
    
    window.addEventListener('scroll', animateSkills);
    window.addEventListener('load', animateSkills);
  }

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (typeof Swiper !== 'undefined') {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Initiate glightbox
   */
  if (typeof GLightbox !== 'undefined') {
    const glightbox = GLightbox({
      selector: '.glightbox'
    });
  }

  /**
   * Isotope Layout and Filter for Portfolio
   */
  document.addEventListener('DOMContentLoaded', function() {
    
    // Portfolio Isotope and Filter
    document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
      let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
      let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
      let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

      let initIsotope;
      
      // Wait for images to load
      imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
        initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
          itemSelector: '.isotope-item',
          layoutMode: layout,
          filter: filter,
          sortBy: sort
        });
      });

      // Filter items on button click
      isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
        filters.addEventListener('click', function() {
          // Remove active class from all filters
          isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
          
          // Add active class to clicked filter
          this.classList.add('filter-active');
          
          // Apply filter
          if (initIsotope) {
            initIsotope.arrange({
              filter: this.getAttribute('data-filter')
            });
          }
          
          // Refresh AOS animations
          if (typeof aos_init === 'function') {
            aos_init();
          }
        }, false);
      });
    });

  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = select('#navmenu a', true);
  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = select(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('#navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    });
  }
  window.addEventListener('load', navmenuScrollspy);
  onscroll(document, navmenuScrollspy);

  /**
   * Smooth scroll for anchor links
   */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      if (this.getAttribute('href') === '#' || this.getAttribute('href') === '') return;
      
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerOffset = document.querySelector('#header') ? document.querySelector('#header').offsetHeight : 0;
        const elementPosition = target.offsetTop;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

})();