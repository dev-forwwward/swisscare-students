document.addEventListener("DOMContentLoaded", function () {
    // ---------------------------------------
    // NAV MENU
    const trigger = document.querySelector('#menu-trigger');
    const menuNavBar = document.querySelector(".menu-navbar");
    const navLinks = document.querySelectorAll('.menu-link-container');
    const html = document.documentElement;
    const body = document.body;
    const mobileMenu = document.querySelector('.mobile-dropdown-menu');

    navLinks.forEach((link) => {
        link.addEventListener('click', () => trigger.click());
    });

    let scrollY = 0;
    // Hide initially with class
    mobileMenu.classList.add('is-hidden');

    trigger.addEventListener("click", function (event) {
        event.stopPropagation();

        const isOpen = menuNavBar.classList.contains("w--open");

        if (isOpen) {
            // CLOSE MENU
            body.classList.remove("navbar-menu-open");
            html.classList.remove("lock-viewport");

            // Restore scroll
            body.style.position = '';
            body.style.top = '';
            window.scrollTo(0, scrollY);

            gsap.to(mobileMenu, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    mobileMenu.classList.add('is-hidden');
                    menuNavBar.classList.remove("w--open");
                }
            });

        } else {
            // OPEN MENU
            scrollY = window.scrollY;

            // Lock scroll
            body.style.position = 'fixed';
            body.style.top = `-${scrollY}px`;
            body.classList.add("navbar-menu-open");
            html.classList.add("lock-viewport");

            // Remove display none
            mobileMenu.classList.remove('is-hidden');

            gsap.fromTo(mobileMenu, { opacity: 0 }, {
                opacity: 1,
                duration: 0.5,
                ease: 'power2.out',
                onStart: () => {
                    menuNavBar.classList.add("w--open");
                }
            });

            // Additional elements
            gsap.fromTo('.nav_menu_bg_gradient', { opacity: 0 }, {
                opacity: 1,
                duration: 0.5,
                ease: 'power3.out'
            });

            gsap.fromTo('.menu-link-container, .mobile-dropdown-menu .button, .text-size-medium', {
                opacity: 0,
                yPercent: 10
            }, {
                opacity: 1,
                yPercent: 0,
                stagger: 0.1,
                duration: 1,
                ease: 'power2.out'
            });
        }
    });

    const overlay = document.querySelector('.menu-overlay');

    trigger.addEventListener("click", function (event) {
        event.stopPropagation();
        const isOpen = menuNavBar.classList.contains("w--open");

        if (isOpen) {
            overlay.classList.add('is-hidden');
        } else {
            overlay.classList.remove('is-hidden');
        }
    });

    // Clicking the overlay should close the menu
    overlay.addEventListener('click', () => {
        if (menuNavBar.classList.contains("w--open")) {
            trigger.click(); // close it
        }
    });



    // // Close menu when clicking outside
    // document.addEventListener('click', function (event) {
    //     const isOpen = menuNavBar.classList.contains("w--open");

    //     // Do nothing if menu is closed
    //     if (!isOpen) return;

    //     // Do nothing if the click is inside the mobile menu or on the trigger
    //     const isClickInsideMenu = menuNavBar.contains(event.target);
    //     const isClickOnTrigger = trigger.contains(event.target);

    //     if (!isClickInsideMenu && !isClickOnTrigger) {
    //         trigger.click(); // Simulate trigger click to close menu
    //     }
    // });


// ---------------------------------------
// THEME TOGGLE
  (function () {
    const root = document.documentElement;
    const body = document.body;
    const toggle = document.querySelector('.theme-toggle');
    const options = document.querySelectorAll('.theme-option');
    const indicator = document.querySelector('.theme-indicator');

    if (!toggle || !indicator || !options.length) return;

    // --- storage helpers ---
    function setCookie(name, value, days) {
      const d = new Date(); d.setTime(d.getTime() + (days*24*60*60*1000));
      document.cookie = name + '=' + encodeURIComponent(value) + ';path=/;expires=' + d.toUTCString() + ';SameSite=Lax';
      try { localStorage.setItem(name, value); } catch(e) {}
    }
    function getCookie(name) {
      const m = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g,'\\$1') + '=([^;]*)'));
      return m ? decodeURIComponent(m[1]) : null;
    }
    function getSavedTheme() {
      let t = getCookie('theme');
      if (!t) { try { t = localStorage.getItem('theme'); } catch(e) {} }
      return t || 'system';
    }

    // --- theme apply ---
    function setDark(on) {
      root.classList.toggle('u-theme-dark', on);
      body.classList.toggle('u-theme-dark', on);
    }
    function applyTheme(theme) {
      if (theme === 'system') {
        setDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
      } else {
        setDark(theme === 'dark');
      }
    }

    // Watch system changes only when in "system"
    let unwatch = null;
    function watchSystem() {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => applyTheme('system');
      if (mq.addEventListener) {
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
      }
      if ('onchange' in mq) {
        mq.onchange = handler;
        return () => { mq.onchange = null; };
      }
      return () => {};
    }

    // --- initial load: set last choice + theme, then reveal indicator ---
    requestAnimationFrame(() => {
      const saved = getSavedTheme();                         // "system" | "light" | "dark"
      toggle.setAttribute('data-choice', saved);             // <-- drives indicator via CSS
      applyTheme(saved);
      body.classList.add('js-loaded');                       // reveals the indicator
      if (saved === 'system') unwatch = watchSystem();
    });

    // --- clicks ---
    options.forEach((btn) => {
      btn.addEventListener('click', () => {
        const theme = btn.dataset.theme;
        toggle.setAttribute('data-choice', theme);           // moves indicator
        if (unwatch) { unwatch(); unwatch = null; }
        if (theme === 'system') unwatch = watchSystem();
        applyTheme(theme);
        setCookie('theme', theme, 365);
      });
    });

    // No resize handler needed — left is percentage-based.
  })();


    // ---------------------------------------
    // MENU PLANS - ACCORDION
    //https://webflow.com/made-in-webflow/website/pageblock-accordion-with-plus

    class PBAccordionMenu {
        constructor() {
            this.cleanupInitialState();
            this.init();
        }

        cleanupInitialState() {
            document.querySelectorAll('[pb-component-menu="accordion"]').forEach(accordion => {
                const group = accordion.querySelector('[pb-accordion-element-menu="group"]');
                if (!group) return;

                const items = group.querySelectorAll('[pb-accordion-element-menu="accordion"]');
                items.forEach(item => {
                    const content = item.querySelector('[pb-accordion-element-menu="content"]');
                    const trigger = item.querySelector('[pb-accordion-element-menu="trigger"]');
                    const arrow = item.querySelector('[pb-accordion-element-menu="arrow"]');
                    const plus = item.querySelector('[pb-accordion-element-menu="plus"]');

                    if (content) {
                        content.style.maxHeight = '0';
                        content.style.opacity = '0';
                        content.style.visibility = 'hidden';
                        content.style.display = 'none';
                    }
                    if (trigger) trigger.setAttribute('aria-expanded', 'false');

                    item.classList.remove('is-active-accordion');
                    content?.classList.remove('is-active-accordion');
                    if (arrow) arrow.classList.remove('is-active-accordion');
                    if (plus) plus.classList.remove('is-active-accordion');
                });

                const initial = group.getAttribute('pb-accordion-initial');
                if (initial && initial !== 'none') {
                    const initialItem = items[parseInt(initial) - 1];
                    if (initialItem) {
                        this.openAccordion(initialItem);
                    }
                }
            });
        }

        init() {
            document.querySelectorAll('[pb-component-menu="accordion"]').forEach(accordion => {
                const group = accordion.querySelector('[pb-accordion-element-menu="group"]');
                if (!group) return;
                group.addEventListener('click', (e) => this.handleClick(e, group));
            });
        }

        handleClick(event, group) {
            const triggerClicked = event.target.closest('[pb-accordion-element-menu="trigger"]');
            if (!triggerClicked) return; // only toggle if the trigger itself (or a child of it) was clicked

            const accordionItem = triggerClicked.closest('[pb-accordion-element-menu="accordion"]');
            if (!accordionItem) return;

            const isOpen = accordionItem.classList.contains('is-active-accordion');
            const isSingle = group.getAttribute('pb-accordion-single-menu') === 'true';

            if (isSingle) {
                group.querySelectorAll('[pb-accordion-element-menu="accordion"]').forEach(item => {
                    if (item !== accordionItem && item.classList.contains('is-active-accordion')) {
                        this.closeAccordion(item);
                    }
                });
            }

            if (isOpen) {
                this.closeAccordion(accordionItem);
            } else {
                this.openAccordion(accordionItem);
            }
        }

        openAccordion(item) {
            const trigger = item.querySelector('[pb-accordion-element-menu="trigger"]');
            const content = item.querySelector('[pb-accordion-element-menu="content"]');
            const arrow = item.querySelector('[pb-accordion-element-menu="arrow"]');
            const plus = item.querySelector('[pb-accordion-element-menu="plus"]');

            content.style.visibility = 'visible';
            content.style.display = 'block';

            content.offsetHeight;

            const contentHeight = content.scrollHeight;

            requestAnimationFrame(() => {
                content.style.maxHeight = `${contentHeight}px`;
                content.style.opacity = '1';
                trigger.setAttribute('aria-expanded', 'true');
                item.classList.add('is-active-accordion');
                content.classList.add('is-active-accordion');
                if (arrow) arrow.classList.add('is-active-accordion');
                if (plus) plus.classList.add('is-active-accordion');
            });

            content.addEventListener('transitionend', () => {
                if (item.classList.contains('is-active-accordion')) {
                    content.style.maxHeight = 'none';
                }
            }, { once: true });
        }

        closeAccordion(item) {
            const trigger = item.querySelector('[pb-accordion-element-menu="trigger"]');
            const content = item.querySelector('[pb-accordion-element-menu="content"]');
            const arrow = item.querySelector('[pb-accordion-element-menu="arrow"]');
            const plus = item.querySelector('[pb-accordion-element-menu="plus"]');

            content.style.maxHeight = `${content.scrollHeight}px`;
            content.style.display = 'block';

            content.offsetHeight;

            requestAnimationFrame(() => {
                content.style.maxHeight = '0';
                content.style.opacity = '0';
                trigger.setAttribute('aria-expanded', 'false');
                item.classList.remove('is-active-accordion');
                content.classList.remove('is-active-accordion');
                if (arrow) arrow.classList.remove('is-active-accordion');
                if (plus) plus.classList.remove('is-active-accordion');
            });

            content.addEventListener('transitionend', () => {
                if (!item.classList.contains('is-active-accordion')) {
                    content.style.visibility = 'hidden';
                    content.style.display = 'none';
                }
            }, { once: true });
        }
    }

    // Initialize
    new PBAccordionMenu();



});