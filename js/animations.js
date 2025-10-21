document.addEventListener("DOMContentLoaded", () => {

    // HP HERO
    // Cloud 1
    gsap.fromTo(".s_hhp_icon_1",
        { x: 0, y: 0, rotation: 0, scale: 1 },
        {
            x: 40,
            y: -30,
            rotation: 2,
            scale: 1.02,
            duration: 6,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut"
        }
    );

    // Cloud 2
    gsap.fromTo(".s_hhp_icon_2",
        { x: 0, y: 0, rotation: 0, scale: 1 },
        {
            x: 35,
            y: -25,
            rotation: -2,
            scale: 1.03,
            duration: 7,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
            delay: -1
        }
    );

    // Cloud 3
    gsap.fromTo(".s_hhp_icon_3",
        { x: 0, y: 0, rotation: 0, scale: 1 },
        {
            x: 50,
            y: -35,
            rotation: 1.5,
            scale: 1.01,
            duration: 8,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
            delay: -2
        }
    );

    // Navbar input
    const wrapper = document.querySelector('.nav_form_wrapper');
    const input = wrapper.querySelector('.nav_form_input');

    input.addEventListener('focus', () => {
        wrapper.classList.add('is-expanded');
        // gsap.to(wrapper, {
        //     maxWidth: "47.5rem",
        //     duration: 0.6,
        //     ease: "power2.out"
        // });
    });

    input.addEventListener('blur', () => {
        wrapper.classList.remove('is-expanded');
        // gsap.to(wrapper, {
        //     maxWidth: "27.5rem",
        //     duration: 0.6,
        //     ease: "power2.inOut"
        // });
    });

    // section_eligible
    const visionCards = document.querySelectorAll('.s_eli_c2_cards_l_item');
    const sectionTrigger = document.querySelector('.section_eligible');

    if (visionCards.length && sectionTrigger) {
        let visionReveal = gsap.timeline({
            scrollTrigger: {
                trigger: sectionTrigger,
                start: 'top top',
                //end: '+=200%',
                end: '+=400%',
                pin: true,
                scrub: true,
                toggleActions: "play resume play reverse",
                //anticipatePin: 1,
                //pinSpacing: false,
                //pinSpacer: false,
                // markers: {
                //     startColor: "green",
                //     endColor: "lime",
                //     fontSize: "14px",
                //     indent: 20
                // }
            }
        });

        visionCards.forEach((card, index) => {
            visionReveal.from(card, {
                yPercent: 300,
                duration: 8,
                ease: "power3.out"
            }, `${index * 4}`);
        });
    }

    // section_find_insurance
    const graphicStar = document.querySelectorAll('.graphic-star');
    if (graphicStar) {
        gsap.to(graphicStar, {
            rotation: 360,
            duration: 100,
            ease: "linear",
            repeat: -1, // infinite
        });
    }


    // section_steps - Homepage
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
        const section = document.querySelector(".section_steps");
        if (!section) return;

        const leftCol = section.querySelector(".s_ste_content_1");
        const rightCol = section.querySelector(".s_ste_c3_inner");
        const faces = gsap.utils.toArray(".s_ste_c3_inner .face");
        const steps = gsap.utils.toArray(".s_ben_c1_row_divider");

        // Prep faces (SVG-friendly)
        gsap.set(faces, {
            autoAlpha: 0,
            transformOrigin: "50% 50%",
            transformBox: "fill-box"
        });
        if (faces[0]) gsap.set(faces[0], { autoAlpha: 1 });

        // Map: keep face 0 for first step; last face on last step
        const faceForStep = steps.map((_, i) => {
            if (i === 0) return 0;
            if (i === steps.length - 1) return faces.length - 1;
            return Math.min(i, faces.length - 2);
        });

        // Pin right column
        ScrollTrigger.create({
            trigger: section,
            start: "top top",
            end: () => "+=" + Math.max(0, leftCol.scrollHeight - innerHeight),
            pin: rightCol,
            invalidateOnRefresh: true
        });

        // ---- Continuous rotation proxy (unchanged) ----
        const rot = { r: 0 };
        const setRotation = gsap.quickSetter(faces, "rotation", "deg");
        const apply = () => setRotation(rot.r);

        // ---- Normalize per-step rotation so the grand total = 360deg ----
        const rawDeltas = steps.map(stepEl => parseFloat(stepEl.dataset.rot || "90"));
        const sum = rawDeltas.reduce((a, b) => a + b, 0) || 1;
        const scale = 360 / sum;                               // target full turn
        const deltas = rawDeltas.map(v => v * scale);          // scaled per-step degrees

        // Scrub rotation FROM each divider TO the next divider (last goes to end of leftCol)
        steps.forEach((stepEl, i) => {
            const nextStepEl = steps[i + 1];

            gsap.timeline({
                scrollTrigger: {
                    trigger: stepEl,
                    start: "top center",
                    endTrigger: nextStepEl || leftCol,
                    end: nextStepEl ? "top center" : "bottom center",
                    scrub: true,
                    invalidateOnRefresh: true,
                    onUpdate: apply
                }
            })
                .to(rot, { r: `+=${deltas[i]}`, ease: "none", onUpdate: apply }, 0);
        });

        // Optional: after refresh, re-apply current angle so faces keep the right orientation
        ScrollTrigger.addEventListener("refresh", apply);

        // Face switches (skip first divider). Rotation continuity is automatic.
        steps.forEach((stepEl, i) => {
            if (i === 0) return;

            const incoming = faces[faceForStep[i]];
            const outgoing = faces[faceForStep[i - 1]];
            if (!incoming || !outgoing || incoming === outgoing) return;

            gsap.timeline({
                scrollTrigger: {
                    trigger: stepEl,
                    start: "top center",
                    end: "top center+=1",
                    toggleActions: "play none none reverse",
                    invalidateOnRefresh: true,
                    onEnter: () => setRotation(rot.r),   // ensure both faces at same angle
                    onEnterBack: () => setRotation(rot.r)
                }
            })
                .to(outgoing, { autoAlpha: 0, duration: 0.25, ease: "none" }, 0)
                .to(incoming, { autoAlpha: 1, duration: 0.25, ease: "none" }, 0);
        });

        // Keep angles consistent after refresh/resize
        ScrollTrigger.addEventListener("refresh", apply);

        return () => {
            ScrollTrigger.removeEventListener("refresh", apply);
            ScrollTrigger.getAll().forEach(st => st.kill());
        };
    });


});