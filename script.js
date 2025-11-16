document.addEventListener('DOMContentLoaded', () => {
  const files = document.querySelectorAll('.file');
  const tabs = document.querySelector('.tabs');
  const sections = document.querySelectorAll('.section');
  const main = document.getElementById('main');

  // -----------------------
  // MOBILE SIDEBAR TOGGLE
  // -----------------------
  const sidebar = document.getElementById('sidebar');
  const mobileToggle = document.getElementById('mobileToggle');

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }

  // Utility: show a section and manage tabs + active file
  function openSection(sectionId, addTab = true) {
    sections.forEach(s => s.classList.remove('visible'));
    const target = document.getElementById(sectionId);
    if (!target) return;
    target.classList.add('visible');
    target.scrollTop = 0;

    files.forEach(f => f.classList.remove('active'));
    const sidebarFile = document.querySelector(`.file[data-section="${sectionId}"]`);
    if (sidebarFile) sidebarFile.classList.add('active');

    let existingTab = document.querySelector(`.tab[data-section="${sectionId}"]`);
    if (addTab && !existingTab) {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      const tab = document.createElement('div');
      tab.className = 'tab active';
      tab.dataset.section = sectionId;
      tab.textContent = target.dataset.name || sectionId;
      tabs.appendChild(tab);
      tab.addEventListener('click', () => openSection(sectionId, false));
    } else if (existingTab) {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      existingTab.classList.add('active');
    }

    main.focus();
  }

  // CLICK HANDLERS FOR FILES (corrected)
  files.forEach(f => {
    f.addEventListener('click', () => {
      openSection(f.dataset.section);
      sidebar.classList.remove('open'); // close sidebar on mobile
    });

    f.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') openSection(f.dataset.section);
    });
  });

  openSection('about', false);

  // Resume button
  const openBtn = document.getElementById('open-in-new');
  if (openBtn) {
    openBtn.addEventListener('click', () => {
      window.open('resume.pdf', '_blank', 'noopener');
    });
  }

  // LinkedIn Embed Logic
  const loadBtn = document.getElementById('load-linkedin');
  const urlInput = document.getElementById('linkedin-url');
  const iframe = document.getElementById('linkedin-iframe');
  const fallback = document.getElementById('linkedin-fallback');
  const linkAnchor = document.getElementById('linkedin-link');
  const fallbackLinkAnchor = document.getElementById('fallback-link');

  function showFallback(url) {
    iframe.classList.add('hidden');
    fallback.classList.remove('hidden');
    if (linkAnchor) {
      linkAnchor.href = url || '#';
      linkAnchor.textContent = url ? 'Open on LinkedIn' : 'Open LinkedIn';
    }
    if (fallbackLinkAnchor) {
      fallbackLinkAnchor.href = url || '#';
      fallbackLinkAnchor.target = '_blank';
      fallbackLinkAnchor.rel = 'noopener';
    }
  }

  function attemptEmbed(url) {
    fallback.classList.add('hidden');
    iframe.classList.remove('hidden');
    iframe.src = url;

    let loaded = false;
    const to = setTimeout(() => {
      if (!loaded) showFallback(url);
    }, 1400);

    iframe.onload = function () {
      loaded = true;
      clearTimeout(to);
      try {
        const loc = iframe.contentWindow.location.href;
        if (!loc || loc === 'about:blank') showFallback(url);
      } catch {
        showFallback(url);
      }
    };
  }

  if (loadBtn) {
    loadBtn.addEventListener('click', () => {
      const raw = urlInput.value.trim();
      if (!raw) {
        alert('Paste your full LinkedIn profile URL');
        return;
      }
      let url = raw;
      if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
      if (linkAnchor) linkAnchor.href = url;
      attemptEmbed(url);
    });

    urlInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') loadBtn.click();
    });
  }

  // Close tabs on double-click
  tabs.addEventListener('dblclick', (e) => {
    const t = e.target.closest('.tab');
    if (!t) return;
    const sectionId = t.dataset.section;
    t.remove();
    if (t.classList.contains('active')) {
      const firstTab = document.querySelector('.tab');
      if (firstTab) openSection(firstTab.dataset.section, false);
      else openSection('about', false);
    }
  });

});