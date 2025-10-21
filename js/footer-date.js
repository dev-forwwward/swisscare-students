document.addEventListener("DOMContentLoaded", () => {
    // Update footer date
    let spanInstances = document.querySelectorAll(".current-year");

    spanInstances.forEach((span) => {
        span.innerHTML = new Date().getFullYear();
    });
});


function recolorMascot(wrapper) {
  const svg = wrapper.querySelector('svg');
  if (!svg) return;

  // All your groups to recolor
  const selectors = [
    'g g:nth-child(2) g path',
    'g g g:nth-child(2) path',
    'g g g:nth-child(3) path'
  ];

  selectors.forEach(sel => {
    svg.querySelectorAll(sel).forEach(el => {
      el.style.fill = 'currentColor';
      el.style.stroke = 'currentColor';
    });
  });
}

// INIT
const wrapper = document.querySelector('#mascot-icon');
if (wrapper) {
  const apply = () => recolorMascot(wrapper);

  const mo = new MutationObserver(apply);
  mo.observe(wrapper, { childList: true, subtree: true });

  apply();
}