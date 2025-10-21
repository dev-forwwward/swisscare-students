document.addEventListener("DOMContentLoaded", function () {

    // LENIS
    window.lenis = new Lenis(); // globally available

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    // FANCYBOX INIT
    const fancyboxEl = document.querySelector("[data-fancybox]");
    if (fancyboxEl) {
        Fancybox.bind("[data-fancybox]", {
            on: {
                init: () => {
                    lenis.stop();
                },
                close: () => {
                    lenis.start();
                }
            }
        });
    }

    requestAnimationFrame(raf);

});