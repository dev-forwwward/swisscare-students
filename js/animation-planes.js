document.addEventListener("DOMContentLoaded", () => {

    // section_hero_hp
    function recolorLottie(wrapper) {
        const svg = wrapper.querySelector('svg');
        if (!svg) return;

        // 1) Plane outline (stroke-width="4" in your JSON)
        svg.querySelectorAll('[stroke-width="4"]').forEach(el => {
            el.style.stroke = 'var(--lottie-plane-stroke)';
        });

        // 2) Plane body (filled vector shapes in the plane comp)
        svg.querySelectorAll('[fill]').forEach(el => {
            const f = el.getAttribute('fill');
            if (f && f.toLowerCase() !== 'none') {
                el.style.fill = 'var(--lottie-plane-fill)';
            }
        });

        // 3) Trail (thicker path, stroke-width="3")
        svg.querySelectorAll('[stroke-width="3"]').forEach(el => {
            el.style.stroke = 'var(--lottie-trail)';
        });

        // 4) Dashed path (has stroke-dasharray)
        svg.querySelectorAll('[stroke-dasharray]').forEach(el => {
            el.style.stroke = 'var(--lottie-dash)';
        });
    }

    function watchWrapper(wrapper) {
        const apply = () => recolorLottie(wrapper);

        // Recolor when Webflow/Lottie injects or rerenders the <svg>
        const mo = new MutationObserver(apply);
        mo.observe(wrapper, { childList: true, subtree: true });

        // Try immediately (in case SVG is already there)
        apply();
    }

    // Re-apply on theme toggle (when body gains/removes .u-theme-dark)
    const themeMO = new MutationObserver(() => {
        const wrapper = document.querySelector('#planeLottie');
        if (wrapper) recolorLottie(wrapper);
    });
    themeMO.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    // INIT: single Lottie wrapper
    const wrapper = document.querySelector('#planeLottie');
    if (wrapper) watchWrapper(wrapper);

    // Extra: make sure we also apply after Webflow finishes interactions init
    window.Webflow = window.Webflow || [];
    window.Webflow.push(function () {
        const wrapper = document.querySelector('#planeLottie');
        if (wrapper) recolorLottie(wrapper);
    });



    // section_paperwork - timeout gives space for page graphics to load before applying scrollTrigger
    if (document.querySelector("#spw_linePathEl")) {
        setTimeout(() => {
            gsap.to("#spw_planeEl", {
                scrollTrigger: {
                    trigger: "#spw_linePathEl",
                    start: "top center",   // when path enters viewport
                    end: "bottom center",  // when path leaves viewport
                    scrub: true,           // sync with scroll
                },
                duration: 1,
                ease: "none",
                motionPath: {
                    path: "#spw_linePathEl",
                    align: "#spw_linePathEl",
                    alignOrigin: [0.5, 0.5], // centers the plane on the path
                    autoRotate: 240         // plane follows curve direction
                }
            });
        }, 500);
    }





    // const groupEl3 = document.querySelector("#planeGroup3");
    // const pathEl3 = document.querySelector("#linePath3");
    // const trailEl = document.querySelector("#planeTrail");

    // if (groupEl3 && pathEl3 && trailEl) {
    //     const duration = 50;
    //     const trailTime = 10;
    //     const pathLength = trailEl.getTotalLength();
    //     const trailLength = pathLength * (trailTime / duration);

    //     // Plane movement
    //     gsap.to(groupEl3, {
    //         duration: duration,
    //         repeat: -1,
    //         ease: "none",
    //         motionPath: {
    //             path: pathEl3,
    //             align: pathEl3,
    //             alignOrigin: [0.5, 0.5],
    //             autoRotate: 60,
    //         },
    //     });

    //     // Trail stroke
    //     gsap.set(trailEl, {
    //         strokeDasharray: `${trailLength} ${pathLength}`,
    //         strokeDashoffset: trailLength,
    //     });

    //     gsap.to(trailEl, {
    //         strokeDashoffset: pathLength * -.8,
    //         duration: duration,
    //         ease: "none",
    //         repeat: -1,
    //     });
    // }


    // section_hero_country
    const groupEl1 = document.querySelector("#planeGroup1");
    const linePathEl1 = document.querySelector("#linePath1");
    if (groupEl1 && linePathEl1) {
        gsap.to(groupEl1, {
            duration: 30,
            repeat: -1,
            ease: "none",
            motionPath: {
                path: linePathEl1,
                align: linePathEl1,
                alignOrigin: [0.5, 0.5],
                autoRotate: 13
            }
        });
    }

    // section_hero_plan
    const groupEl2 = document.querySelector("#planeGroup");
    const circlePathEl2 = document.querySelector("#circlePath");
    if (groupEl2 && circlePathEl2) {
        gsap.to(groupEl2, {
            duration: 30,
            repeat: -1,
            ease: "none",
            motionPath: {
                path: circlePathEl2,
                align: circlePathEl2,
                alignOrigin: [0.5, 0.5],
                autoRotate: 70
            }
        });
    }

    // section_coverage
    const planes = [
        { id: "#plane1", delay: 0, autoRotate: 250 },
        { id: "#plane2", delay: 3, autoRotate: 35 },
        { id: "#plane3", delay: 6, autoRotate: 85 },
    ].filter(plane => document.querySelector(plane.id));

    planes.forEach(({ id, delay, autoRotate }) => {
        gsap.to(id, {
            duration: 30,
            repeat: -1,
            ease: "none",
            delay,
            motionPath: {
                path: "#flightPath",
                align: "#flightPath",
                autoRotate, // adjust plane rotation
                alignOrigin: [0.5, 0.5]
            }
        });
    });

    // section_insurance_cover COMP
    const planeEl = document.querySelector("#s_inc_plane");
    const pathEl = document.querySelector("#s_inc_flightPath");
    if (planeEl && pathEl) {
        gsap.to(planeEl, {
            duration: 30,
            repeat: -1,
            ease: "none",
            motionPath: {
                path: pathEl,
                align: pathEl,
                alignOrigin: [0.5, 0.5],
                autoRotate: 49
            }
        });
    }

});




// const groupEl3 = document.querySelector("#planeGroup3");
// const circlePathEl3 = document.querySelector("#linePath3");
// if (groupEl3 && circlePathEl3) {
//     gsap.to(groupEl3, {
//         duration: 60,
//         repeat: -1,
//         ease: "none",
//             motionPath: {
//             path: circlePathEl3,
//             align: circlePathEl3,
//             alignOrigin: [0.5, 0.5],
//             autoRotate: 60
//         }
//     });
// }
// const trail = document.querySelector("#planeTrail");

// if (trail) {
//     const pathLength = trail.getTotalLength();
//     const duration = 66; // full plane animation duration in seconds
//     const trailTime = 1;  // trail visibility in seconds

//     //const trailLength = pathLength * (trailTime / duration);
//     const trailLength = 300;

//     gsap.set(trail, {
//         strokeDasharray: `${trailLength} ${pathLength}`,
//         strokeDashoffset: 300 // Start at 0, animate negative
//     });

//     gsap.to(trail, {
//         strokeDashoffset: -pathLength,
//         duration: duration,
//         ease: "none",
//         repeat: -1
//     });
// }