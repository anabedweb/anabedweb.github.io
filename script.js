document.addEventListener('DOMContentLoaded', () => {

  const files = document.querySelectorAll('.file');
  const tabs = document.querySelector('.tabs');
  const sections = document.querySelectorAll('.section');
  const main = document.getElementById('main');
  const sidebar = document.getElementById('sidebar');
  const mobileToggle = document.getElementById('mobileToggle');

  // MOBILE TOGGLE
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }

  function openSection(sectionId, addTab = true) {
    sections.forEach(s => s.classList.remove('visible'));
    const target = document.getElementById(sectionId);
    if (!target) return;
    target.classList.add('visible');
    target.scrollTop = 0;

    // Highlight sidebar selected file
    files.forEach(f => f.classList.remove('active'));
    const sidebarFile = document.querySelector(`.file[data-section="${sectionId}"]`);
    if (sidebarFile) sidebarFile.classList.add('active');

    // Tabs
    const existingTab = document.querySelector(`.tab[data-section="${sectionId}"]`);
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

    sidebar.classList.remove('open');
    main.focus();
  }

  files.forEach(f => {
    f.addEventListener('click', () => openSection(f.dataset.section));
  });

  // Default
  openSection('about', false);

  // Resume open button
  const openBtn = document.getElementById('open-in-new');
  if (openBtn) {
    openBtn.addEventListener('click', () => {
      window.open('resume.pdf', '_blank', 'noopener');
    });
  }

  // Close tabs on double-click
  tabs.addEventListener('dblclick', (e) => {
    const t = e.target.closest('.tab');
    if (!t) return;
    const sid = t.dataset.section;
    t.remove();
    const first = document.querySelector('.tab');
    if (first) openSection(first.dataset.section, false);
    else openSection('about', false);
  });
});

// TYPEWRITER EFFECT FOR NAME
const typewriterSpan = document.getElementById("typewriter");
if (typewriterSpan) {
  const text = typewriterSpan.getAttribute("data-text");
  let i = 0;

  function typeLetter() {
    if (i < text.length) {
      typewriterSpan.textContent += text.charAt(i);
      i++;
      setTimeout(typeLetter, 120); // typing speed
    }
  }

  typeLetter();
}
