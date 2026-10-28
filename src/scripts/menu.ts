// Mobile menu: toggle, focus trap, Esc to close. Without JS the menu is listed open.
const header = document.querySelector<HTMLElement>('[data-menu]');
const toggle = header?.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const nav = header?.querySelector<HTMLElement>('#hoofdmenu');
const desktop = window.matchMedia('(min-width: 960px)');

if (header && toggle && nav) {
  const focusables = () =>
    [toggle, ...nav.querySelectorAll<HTMLElement>('a[href]')].filter((el) => el.offsetParent !== null);

  const setOpen = (open: boolean, returnFocus = false) => {
    if (open) {
      // The panel starts under the header, wherever the header is on screen.
      const bottom = Math.max(0, header.getBoundingClientRect().bottom);
      header.style.setProperty('--menu-top', `${bottom}px`);
    }
    header.classList.toggle('is-open', open);
    document.documentElement.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.visually-hidden')!.textContent = open ? 'Menu sluiten' : 'Menu';
    if (returnFocus) toggle.focus();
  };

  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));

  document.addEventListener('keydown', (e) => {
    if (!header.classList.contains('is-open')) return;
    if (e.key === 'Escape') {
      setOpen(false, true);
      return;
    }
    if (e.key !== 'Tab') return;
    const items = focusables();
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  // Same-page anchors and a resize to desktop both close the panel.
  nav.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a')) setOpen(false);
  });
  desktop.addEventListener('change', (e) => e.matches && setOpen(false));
}
