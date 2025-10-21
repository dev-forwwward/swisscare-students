document.addEventListener("DOMContentLoaded", () => {
    if (window.innerWidth <= 767) {
        const toggle = document.querySelector(".fs-toc_title");
        const list = document.querySelector(".fs-toc_link-content");

        let isOpen = false;

        const openMenu = () => {
            toggle.classList.add("open");
            gsap.set(list, { display: "flex", opacity: 0, y: -10 });
            gsap.to(list, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" });
            isOpen = true;
        };

        const closeMenu = () => {
            toggle.classList.remove("open");
            gsap.to(list, {
                opacity: 0,
                y: -10,
                duration: 0.2,
                ease: "power2.in",
                onComplete: () => gsap.set(list, { display: "none" }),
            });
            isOpen = false;
        };

        if (toggle) {
            toggle.addEventListener("click", () => {
                isOpen ? closeMenu() : openMenu();
            });
        }

        if (list) {
            list.addEventListener("click", (event) => {
                const anchor = event.target.closest("a.fs-toc_link");
                if (anchor && list.contains(anchor)) {
                    event.preventDefault();

                    const targetId = anchor.getAttribute("href").replace("#", "");
                    const target = document.getElementById(targetId);

                    if (target) {
                        const scrollOffsetPx = 500;
                        const elementTop = target.getBoundingClientRect().top + window.pageYOffset;
                        const scrollTarget = Math.max(0, elementTop - scrollOffsetPx);

                        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
                        const finalScroll = Math.min(scrollTarget, maxScroll);

                        window.scrollTo({
                            top: finalScroll,
                            behavior: "smooth"
                        });

                        closeMenu();
                    }
                }
            });
        }
    }

    // Dynamically set the TOC attribute offset
    const tocElement = document.querySelector('[fs-toc-element="contents"]');
    if (!tocElement) return;

    const updateOffsetAndReInit = () => {
        const tocOffsetRem = window.innerWidth <= 991 ? "0rem" : "7rem";
        tocElement.setAttribute("fs-toc-offsettop", tocOffsetRem);

        if (window.fsAttributes?.toc?.init) {
            setTimeout(() => {
                window.fsAttributes.toc.init();
            }, 100);
        }
    };

    updateOffsetAndReInit();
    window.addEventListener("resize", updateOffsetAndReInit);
});





// document.addEventListener("DOMContentLoaded", () => {
//     if (window.innerWidth <= 767) {
//         const toggle = document.querySelector(".fs-toc_title");
//         const list = document.querySelector(".fs-toc_link-content");

//         let isOpen = false;

//         const openMenu = () => {
//             toggle.classList.add("open");
//             gsap.set(list, { display: "flex", opacity: 0, y: -10 });
//             gsap.to(list, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" });
//             isOpen = true;
//         };

//         const closeMenu = () => {
//             toggle.classList.remove("open");
//             gsap.to(list, {
//                 opacity: 0,
//                 y: -10,
//                 duration: 0.2,
//                 ease: "power2.in",
//                 onComplete: () => gsap.set(list, { display: "none" }),
//             });
//             isOpen = false;
//         };

//         toggle.addEventListener("click", () => {
//             isOpen ? closeMenu() : openMenu();
//         });

//         // ✅ Delegated event: catch clicks on any anchor inside .fs-toc_link-content
//         list.addEventListener("click", (event) => {
//             const anchor = event.target.closest("a.fs-toc_link");
//             if (anchor && list.contains(anchor)) {
//                 closeMenu();
//             }
//         });
//     }

//     const tocElement = document.querySelector('[fs-toc-element="contents"]');

//     if (!tocElement) return;

//     const updateOffsetAndReInit = () => {
//         const offset = window.innerWidth <= 991 ? "12rem" : "7rem";
//         tocElement.setAttribute("fs-toc-offsettop", offset);

//         // Finsweet TOC may already be initialized — wait a bit and re-init
//         if (window.fsAttributes?.toc?.init) {
//             setTimeout(() => {
//                 window.fsAttributes.toc.init();
//             }, 100); // small delay to ensure attribute is set
//         }
//     };

//     updateOffsetAndReInit(); // on load

//     // Optional: also update on resize
//     window.addEventListener("resize", updateOffsetAndReInit);
// });