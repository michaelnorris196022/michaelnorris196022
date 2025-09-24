
(() => {
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));

  // Mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Theme toggle with localStorage
  const themeBtn = $('#theme-toggle');
  const root = document.documentElement;

  function applyTheme(mode){
    if (mode === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else if (mode === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.setAttribute('data-theme', 'auto');
    }
  }

  const savedTheme = localStorage.getItem('theme-mode') || 'auto';
  applyTheme(savedTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || 'auto';
      const next = current === 'dark' ? 'light' : current === 'light' ? 'auto' : 'dark';
      localStorage.setItem('theme-mode', next);
      applyTheme(next);
      themeBtn.setAttribute('aria-label', `Theme: ${next}`);
    });
  }

  // Parts page: populate and filter table
  const partsTableBody = $('#parts-tbody');
  if (partsTableBody) {
    const data = [
      { category: 'CPU', model: 'AMD Ryzen 7 9800X3D', notes: 'Great for gaming; AM5 platform' },
      { category: 'CPU', model: 'Intel Core i7-14700K', notes: 'Strong hybrid performance' },
      { category: 'GPU', model: 'NVIDIA GeForce RTX 4070 Super', notes: '1440p high-refresh sweet spot' },
      { category: 'GPU', model: 'AMD Radeon RX 7900 GRE', notes: 'Great raster performance' },
      { category: 'Motherboard', model: 'GIGABYTE X870 AORUS ELITE WIFI7 ICE', notes: 'AM5; PCIe 5.0 NVMe support' },
      { category: 'Memory', model: '32GB DDR5-6000 (2×16GB)', notes: 'EXPO/XMP; dual-channel' },
      { category: 'Storage', model: '1TB NVMe PCIe 4.0 SSD', notes: 'OS + apps; add 2TB for games' },
      { category: 'PSU', model: '750W 80+ Gold ATX 3.0/3.1', notes: 'Headroom for mid/high GPUs' },
      { category: 'Case', model: 'Lian Li O11 Dynamic EVO XL', notes: 'Spacious, good for custom loops' },
      { category: 'Cooling', model: 'Lian Li Galahad II 360 AIO', notes: 'Keep high-core CPUs cool' },
    ];

    const categorySelect = $('#category');
    const searchInput = $('#search');

    function render(rows) {
      partsTableBody.innerHTML = rows.map(r => `
        <tr>
          <td>${r.category}</td>
          <td>${r.model}</td>
          <td>${r.notes}</td>
        </tr>
      `).join('');
    }

    function filter() {
      const cat = categorySelect ? categorySelect.value : 'all';
      const q = (searchInput ? searchInput.value : '').toLowerCase().trim();
      const rows = data.filter(d => {
        const catOk = (cat === 'all') || d.category === cat;
        const qOk = !q || [d.category, d.model, d.notes].join(' ').toLowerCase().includes(q);
        return catOk && qOk;
      });
      render(rows);
    }

    if (categorySelect) categorySelect.addEventListener('change', filter);
    if (searchInput) searchInput.addEventListener('input', filter);

    render(data);
  }

  // Contact form validation (client-side only)
  const form = $('#contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true;

      const name = $('#name');
      const email = $('#email');
      const message = $('#message');
      const nameErr = $('#name-error');
      const emailErr = $('#email-error');
      const messageErr = $('#message-error');

      function setErr(el, err, msg){
        if (!el) return;
        if (msg) {
          err.textContent = msg;
          el.setAttribute('aria-invalid', 'true');
          ok = false;
        } else {
          err.textContent = '';
          el.removeAttribute('aria-invalid');
        }
      }

      setErr(name, nameErr, !name.value.trim() ? 'Please enter your name.' : '');
      const emailVal = email.value.trim();
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);
      setErr(email, emailErr, !emailVal ? 'Please enter your email.' : (!emailValid ? 'Please enter a valid email.' : ''));
      setErr(message, messageErr, !message.value.trim() ? 'Please enter a message.' : '');

      const success = $('#form-success');
      if (ok) {
        success.hidden = false;
        form.reset();
        setTimeout(() => { success.hidden = true; }, 4000);
      }
    });
  }

  // Highlight current nav (handles home/index special-case)
  const bodyId = document.body.id;
  $$('.nav-menu a').forEach(a => {
    const href = a.getAttribute('href') || '';
    const isHome = bodyId === 'home' && href.includes('index.html');
    if (isHome || href.includes(bodyId)) a.classList.add('active');
  });
})();
