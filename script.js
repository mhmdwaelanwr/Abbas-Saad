(() => {
  const body = document.body;
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const navLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const closeMenu = () => {
    if (!menuButton || !nav) return;
    nav.classList.remove('open');
    body.classList.remove('menu-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'فتح القائمة');
  };

  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      body.classList.toggle('menu-open', isOpen);
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'إغلاق القائمة' : 'فتح القائمة');
    });

    navLinks.forEach((link) => link.addEventListener('click', closeMenu));

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('in-view'));
  }

  if ('IntersectionObserver' in window && sections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;

        navLinks.forEach((link) => {
          const targetId = link.getAttribute('href').slice(1);
          link.classList.toggle('active', targetId === visible.target.id);
        });
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.15, 0.3] }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  const heroImage = document.querySelector('.hero-photo img');
  if (heroImage) {
    heroImage.addEventListener(
      'error',
      () => {
        if (!heroImage.src.includes('/hqdefault.jpg')) {
          heroImage.src = 'https://i.ytimg.com/vi/Y0rYvHu3W60/hqdefault.jpg';
        }
      },
      { once: true }
    );
  }

  document.querySelectorAll('.thumb img').forEach((image) => {
    image.addEventListener(
      'error',
      () => {
        const match = image.src.match(/\/vi\/([^/]+)\//);
        if (match) image.src = `https://i.ytimg.com/vi/${match[1]}/mqdefault.jpg`;
      },
      { once: true }
    );
  });
})();
