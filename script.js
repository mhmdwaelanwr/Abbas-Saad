(() => {
  const body = document.body;
  const header = document.querySelector('.news-header, .site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.news-nav, .main-nav');
  const navLinks = nav ? [...nav.querySelectorAll('a[href^="#"]')] : [];

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

  if (header) {
    const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 16);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const today = document.getElementById('today');
  if (today) {
    try {
      const formatted = new Intl.DateTimeFormat('ar-EG', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(new Date());
      today.textContent = `القاهرة · ${formatted}`;
    } catch (_) {
      today.textContent = 'القاهرة';
    }
  }

  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const current = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!current) return;

        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${current.target.id}`);
        });
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.12, 0.25] }
    );
    sections.forEach((section) => sectionObserver.observe(section));
  }

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (_) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    }
  };

  document.querySelectorAll('[data-copy], [data-copy-target]').forEach((button) => {
    button.addEventListener('click', async () => {
      const selector = button.dataset.copy || button.dataset.copyTarget;
      const target = selector ? document.querySelector(selector) : null;
      if (!target) return;

      const original = button.textContent;
      await copyText(target.textContent.trim());
      const english = /^copy$/i.test(original.trim()) || button.closest('[dir="ltr"]');
      button.textContent = english ? 'Copied' : 'تم النسخ';
      button.setAttribute('aria-live', 'polite');
      window.setTimeout(() => { button.textContent = original; }, 1600);
    });
  });

  document.querySelectorAll('.print-profile').forEach((button) => {
    button.addEventListener('click', () => window.print());
  });

  document.querySelectorAll('img[src*="i.ytimg.com"]').forEach((image) => {
    image.addEventListener('error', () => {
      const match = image.src.match(/\/vi\/([^/]+)\//);
      if (!match) return;
      image.src = image.src.includes('/maxresdefault.jpg')
        ? `https://i.ytimg.com/vi/${match[1]}/hqdefault.jpg`
        : `https://i.ytimg.com/vi/${match[1]}/mqdefault.jpg`;
    }, { once: true });
  });
})();