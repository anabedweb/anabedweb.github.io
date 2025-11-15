
document.addEventListener('DOMContentLoaded', () => {
  const files = document.querySelectorAll('.file');
  const tabs = document.querySelector('.tabs');
  const sections = document.querySelectorAll('.section');
  const main = document.getElementById('main');

  // Utility: show a section and manage tabs + active file
  function openSection(sectionId, addTab = true) {
    // show section
    sections.forEach(s => s.classList.remove('visible'));
    const target = document.getElementById(sectionId);
    if (!target) return;
    target.classList.add('visible');
    target.scrollTop = 0;

    // mark file active in sidebar
    files.forEach(f => f.classList.remove('active'));
    const sidebarFile = document.querySelector(`.file[data-section="${sectionId}"]`);
    if (sidebarFile) sidebarFile.classList.add('active');

    // manage tabs
    let existingTab = document.querySelector(`.tab[data-section="${sectionId}"]`);
    if (addTab && !existingTab) {
      // deactivate current tabs
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

    // focus main for accessibility
    main.focus();
  }

  // Click on sidebar files
  files.forEach(f => {
    f.addEventListener('click', () => openSection(f.dataset.section));
    f.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') openSection(f.dataset.section);
    });
  });

  // Default
  openSection('about', false);

  /* ---------------------------
     RESUME: open in new tab button
     --------------------------- */
  const openBtn = document.getElementById('open-in-new');
  if (openBtn) {
    openBtn.addEventListener('click', () => {
      // open resume.pdf in a new tab (user must have uploaded resume.pdf)
      window.open('resume.pdf', '_blank', 'noopener');
    });
  }

  /* ---------------------------
     LINKEDIN EMBED with fallback
     --------------------------- */
  const loadBtn = document.getElementById('load-linkedin');
  const urlInput = document.getElementById('linkedin-url');
  const iframe = document.getElementById('linkedin-iframe');
  const fallback = document.getElementById('linkedin-fallback');
  const linkAnchor = document.getElementById('linkedin-link');
  const fallbackLinkAnchor = document.getElementById('fallback-link');

  function showFallback(url) {
    iframe.classList.add('hidden');
    fallback.classList.remove('hidden');
    // set the hrefs for the fallback
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
    // clear previous
    fallback.classList.add('hidden');
    iframe.classList.remove('hidden');
    iframe.src = url;

    // Try to detect embed failure: LinkedIn typically blocks framing (X-Frame-Options).
    // We'll wait briefly for iframe onload; if load fails (no onload fire), show fallback.
    let loaded = false;
    const to = setTimeout(() => {
      if (!loaded) {
        // assume blocked
        showFallback(url);
      }
    }, 1400);

    iframe.onload = function() {
      loaded = true;
      clearTimeout(to);
      // Some sites still refuse but may trigger onload; try to read contentWindow.location (may throw)
      try {
        const loc = iframe.contentWindow.location.href;
        // If it's ok, keep iframe visible.
        if (!loc || loc === 'about:blank') {
          showFallback(url);
        } else {
          // success — hide fallback
          fallback.classList.add('hidden');
          iframe.classList.remove('hidden');
        }
      } catch (err) {
        // cross-origin access error — still probably fine if page displayed; but LinkedIn often blocks with X-Frame header
        // if we reach here, assume embed likely blocked -> fallback
        showFallback(url);
      }
    };
  }

  if (loadBtn) {
    loadBtn.addEventListener('click', () => {
      const raw = urlInput.value.trim();
      if (!raw) {
        alert('Paste your full LinkedIn profile URL (e.g. https://www.linkedin.com/in/yourname)');
        return;
      }
      // basic normalization: ensure https
      let url = raw;
      if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
      // set link for fallback
      if (linkAnchor) linkAnchor.href = url;
      attemptEmbed(url);
    });

    // allow quick load using Enter in input
    urlInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') loadBtn.click();
    });
  }

  // Accessibility: close tabs by double-clicking a tab (simple)
  tabs.addEventListener('dblclick', (e) => {
    const t = e.target.closest('.tab');
    if (!t) return;
    // don't allow closing the only tab; remove the tab and show its section hidden
    const sectionId = t.dataset.section;
    t.remove();
    // if removed tab was active, switch to first tab
    if (t.classList.contains('active')) {
      const firstTab = document.querySelector('.tab');
      if (firstTab) {
        openSection(firstTab.dataset.section, false);
      } else {
        openSection('about', false);
      }
    }
  });

});

// Sidebar toggle button

const sidebarToggle = document.getElementById('sidebar-toggle');

const sidebar = document.querySelector('.sidebar');



sidebarToggle.addEventListener('click', () => {

    sidebar.classList.toggle('open');

});



// Optional: close sidebar when clicking a file (mobile)

document.querySelectorAll('.file').forEach(f => {

    f.addEventListener('click', () => {

        if (window.innerWidth <= 880) {

            sidebar.classList.remove('open');

        }

    });

});