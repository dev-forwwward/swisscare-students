document.addEventListener("DOMContentLoaded", function () {

    const wrapper = document.querySelector('.s_str_swipper .swiper-wrapper');
    if(wrapper){
        const logos = Array.from(wrapper.children);
        // Clone logos BEFORE initializing Swiper
        while (wrapper.scrollWidth < window.innerWidth * 2) {
            logos.forEach(logo => {
                wrapper.appendChild(logo.cloneNode(true));
            });
        }

        const swiperLogos = new Swiper('.s_str_swipper', {
            slidesPerView: 'auto',
            spaceBetween: 5,
            speed: 4000,
            loop: true,
            loopedSlides: wrapper.children.length, // Optional, helps loop when cloning
            allowTouchMove: false,
            autoplay: {
                delay: 0,
                disableOnInteraction: false,
            },
        });
    }

    var swiper = new Swiper(".s_tes_c2_slider", {
        effect: 'fade',
        fadeEffect: {
            crossFade: true, // optional: smooth transition
        },
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        navigation: {
            nextEl: ".s_tes_c2_slider_wrapper .swiper-next",
            prevEl: ".s_tes_c2_slider_wrapper .swiper-prev",
        },
    });

});




// breakpoints: {
//     //when window width is >= 640px
//     640: {
//         slidesPerView: 4,
//     },
//     // when window width is >= 768px
//     768: {
//         slidesPerView: 5,
//         //spaceBetween: 25,
//     },
//     // when window width is >= 991px
//     991: {
//         slidesPerView: 7,
//         //spaceBetween: 25,
//     },
//     // when window width is >= 1024px
//     1024: {
//         slidesPerView: 9,
//         //spaceBetween: 25,
//     }
// }