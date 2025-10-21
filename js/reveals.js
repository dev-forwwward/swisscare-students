document.addEventListener("DOMContentLoaded", () => {

    // GSAP Reveals CMS 
    // Target each CMS item inside the .blog-card-grid container
    const cmsItems = document.querySelectorAll(
        '.section_faqs .accordion__item .nop'
    );
    cmsItems.forEach((item, index) => {
        item.setAttribute('data-reveal', 'true');
        item.setAttribute('data-reveal-type', 'fade-up'); // You can change this to 'fade-left', etc.
        item.setAttribute('data-reveal-delay', (index * 0.3).toFixed(1)); // 0.3 second delay per item
    });


    //GSAP Reveals
    document.querySelectorAll('[data-reveal="true"]').forEach((el) => {
        const type = el.dataset.revealType || "fade-up";
        const delay = parseFloat(el.dataset.revealDelay) || 0;
        const offset = 50;

        const { x, y } = {
            "fade": { x: 0, y: 0 },
            "fade-up": { x: 0, y: offset },
            "fade-down": { x: 0, y: -offset },
            "fade-left": { x: offset, y: 0 },
            "fade-right": { x: -offset, y: 0 }
        }[type] || { x: 0, y: offset };

        // Set initial hidden state (but skip transform to avoid stacking issues)
        gsap.set(el, { opacity: 0, x, y });

        // Create scroll-triggered reveal
        ScrollTrigger.create({
            trigger: el,
            start: "top bottom",
            once: true,
            onEnter: () => {
                gsap.to(el, {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    delay,
                    duration: 1,
                    ease: "power2.out",
                    onComplete: () => {
                        // Remove transform after animation to eliminate stacking context
                        el.style.transform = "none";
                    }
                });
            }
        });
    });

    // Force a refresh after load in case of hero content
    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 100); // slight delay allows Webflow layout to settle
});


/*

data-reveal
true

data-reveal-delay
0.3

data-reveal-type
fade-right

*/