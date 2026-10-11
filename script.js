(() => {
  const body = document.body;
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const navLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];

  const closeMenu = () => {
    if (!menuButton || !nav) return;
    nav.classList.remove('open');
    body.classList.remove('menu-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'فتح القائمة');
  };

  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      body.classList.toggle('menu-open', open);
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'إغلاق القائمة' : 'فتح القائمة');
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
    const observer = new IntersectionObserver(
      (entries, instance) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('in-view');
          instance.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -24px 0px' }
    );
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('in-view'));
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
      { rootMargin: '-38% 0px -52% 0px', threshold: [0, 0.15, 0.3] }
    );
    sections.forEach((section) => sectionObserver.observe(section));
  }

  const copyButton = document.querySelector('.copy-bio');
  const bio = document.querySelector('#media-bio');

  if (copyButton && bio) {
    copyButton.addEventListener('click', async () => {
      const text = bio.textContent.trim();
      const original = copyButton.textContent;

      try {
        await navigator.clipboard.writeText(text);
        copyButton.textContent = 'تم النسخ';
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
        copyButton.textContent = 'تم النسخ';
      }

      window.setTimeout(() => {
        copyButton.textContent = original;
      }, 1800);
    });
  }

  const printButton = document.querySelector('.print-profile');
  if (printButton) {
    printButton.addEventListener('click', () => window.print());
  }

  document.querySelectorAll('img[src*="i.ytimg.com"]').forEach((image) => {
    image.addEventListener(
      'error',
      () => {
        const match = image.src.match(/\/vi\/([^/]+)\//);
        if (match && !image.src.includes('/mqdefault.jpg')) {
          image.src = `https://i.ytimg.com/vi/${match[1]}/mqdefault.jpg`;
        }
      },
      { once: true }
    );
  });
})();
