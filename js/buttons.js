document.addEventListener("DOMContentLoaded", () => {
    // wrappers hover (unchanged)
    document.querySelectorAll('.form_btn_wrapper').forEach(w => {
        w.addEventListener('mouseenter', () => w.classList.add('hovered'));
        w.addEventListener('mouseleave', () => w.classList.remove('hovered'));
    });

    document.querySelectorAll('.button, .button_form, #menu-trigger, .card_download').forEach((button) => {
        const circle = button.querySelector('.btn_circle');
        if (!circle) return;

        // ensure positioning context
        if (getComputedStyle(button).position === 'static') button.style.position = 'relative';

        // compute circle diameter so it fully covers the button when scale:1
        const sizeCircle = () => {
            // use offset* (very stable across browsers)
            const w = button.offsetWidth;
            const h = button.offsetHeight;
            const radius = Math.hypot(w / 2, h);
            const d = radius * 2;
            circle.style.width = `${d}px`;
            circle.style.height = `${d}px`;
            circle.style.borderRadius = '50%';
        };

        sizeCircle();

        // keep responsive (RO is fine in FF, but we also add a fallback on load/fonts)
        const ro = new ResizeObserver(sizeCircle);
        ro.observe(button);
        window.addEventListener('load', sizeCircle);
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(sizeCircle).catch(() => { });
        }

        // let GSAP own transforms from the start (no CSS transitions)
        gsap.set(circle, {
            position: 'absolute',
            left: '50%',
            top: '100%',          // circle center sits at the button bottom
            xPercent: -50,
            yPercent: -50,        // move center to bottom edge
            transformOrigin: '50% 100%', // grow from bottom center upward
            scale: 0,
            opacity: 0,           // avoid visibility toggling in FF
            pointerEvents: 'none',
            force3D: true
        });

        // force a layout flush before wiring events (stabilizes first hover in FF)
        // eslint-disable-next-line no-unused-expressions
        circle.getBoundingClientRect();

        // prebuilt timeline
        const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } })
            .to(circle, { scale: 1, opacity: 1, duration: 0.35 }, 0);

        // attach listeners next frame
        requestAnimationFrame(() => {
            const play = () => tl.play();
            const rev = () => tl.reverse();
            button.addEventListener('mouseenter', play);
            button.addEventListener('mouseleave', rev);
            button.addEventListener('focusin', play);
            button.addEventListener('focusout', rev);
        });
    });
});



// document.addEventListener("DOMContentLoaded", () => {
//   // wrappers hover (unchanged)
//   document.querySelectorAll('.form_btn_wrapper').forEach(w => {
//     w.addEventListener('mouseenter', () => w.classList.add('hovered'));
//     w.addEventListener('mouseleave', () => w.classList.remove('hovered'));
//   });

//   document.querySelectorAll('.button, .button_form').forEach((button) => {
//     const circle = button.querySelector('.btn_circle');
//     if (!circle) return;

//     // ensure positioning context
//     if (getComputedStyle(button).position === 'static') button.style.position = 'relative';

//     // compute circle diameter so it fully covers the button when scale:1
//     const sizeCircle = () => {
//       const r = button.getBoundingClientRect();
//       const radius = Math.hypot(r.width / 2, r.height);
//       const diameter = radius * 2;
//       circle.style.width = `${diameter}px`;
//       circle.style.height = `${diameter}px`;
//       circle.style.borderRadius = '50%';
//     };
//     sizeCircle();

//     // keep responsive
//     const ro = new ResizeObserver(sizeCircle);
//     ro.observe(button);

//     // IMPORTANT: let GSAP own the transform from the start
//     gsap.set(circle, {
//       position: 'absolute',
//       left: '50%',
//       top: '100%',           // circle center sits on button bottom
//       xPercent: -50,
//       yPercent: -50,
//       transformOrigin: '50% 100%', // bottom center
//       scale: 0,
//       autoAlpha: 0,          // opacity + visibility
//       pointerEvents: 'none',
//     });

//     // one timeline to rule them all (prebuilt, paused)
//     const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } })
//       .to(circle, { scale: 1, autoAlpha: 1, duration: 0.35 }, 0);

//     // arm after the current frame so initial set is committed
//     requestAnimationFrame(() => {
//       button.addEventListener('mouseenter', () => tl.play());
//       button.addEventListener('mouseleave', () => tl.reverse());
//       button.addEventListener('focusin',   () => tl.play());
//       button.addEventListener('focusout',  () => tl.reverse());
//     });
//   });
// });