'use strict';

(() => {
  const button = document.querySelector('#javascript-details-toggle');
  const panel = document.querySelector('#javascript-details-panel');
  const requiredNotice = document.querySelector('#javascript-required');
  const state = document.querySelector('#javascript-details-state');

  function showState() {
    state.textContent =
      `aria-expanded: ${button.getAttribute('aria-expanded')}; hidden: ${panel.hidden}`;
  }

  if (new URLSearchParams(window.location.search).get('embedded') === '1') {
    document.body.classList.add('embedded');
  }
  button.addEventListener('click', () => {
    const nextExpanded = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(nextExpanded));
    panel.hidden = !nextExpanded;
    showState();
  });
  button.disabled = false;
  requiredNotice.hidden = true;
  showState();
})();
