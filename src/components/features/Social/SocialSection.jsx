import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./styles/Social.module.css";
import Background from "../../Background/Background";

/** Put your card data here */
const CARDS = [
  { platform: "Instagram", img: "/images/social/insta.jpg", href: "https://instagram.com/", tag: "Instagram", icon: "/images/icons/instagram.png" },
  { platform: "Dribbble",  img: "/images/social/img1.jpg", href: "https://dribbble.com/",  tag: "Dribbble",  icon: "/images/icons/dribbble.png" },
  { platform: "Facebook",  img: "/images/social/facebook.jpg", href: "https://facebook.com/", tag: "Facebook",  icon: "/images/icons/facebook.png" },
  { platform: "YouTube",   img: "/images/social/img1.jpg", href: "https://youtube.com/",   tag: "YouTube",   icon: "/images/icons/youtube.png" },
];

export default function SocialDeckSection() {
const sectionRef = useRef(null);
  const stickyRef = useRef(null);
  const deckRef = useRef(null);

  // heading chars
  const titleRef = useRef(null);
  const letterRefs = useRef([]);

  // mutable state (refs so we don't re-render)
  const currentRef = useRef(0); // how many popped (0..CARDS.length)
  const animatingRef = useRef(false);
  const pinnedRef = useRef(false);
  const accRef = useRef(0);
  const cooldownRef = useRef(false);
  const textActiveRef = useRef(true); // controls whether the heading effect runs
  // FIXED: Simplified the refs for the new animation logic
  const wheelDeltaRef = useRef(0);

  // tuning
  const THRESH = 80;
  const COOLDOWN = 300;
  const pages = CARDS.length + 1; // anchors: cards + release

  // small rotation pattern for nicer stack look
  const baseRotation = (i) => {
    const arr = [0,0,0,0,0];
    return arr[i % arr.length];
  };

  // ----- title splitting & relax loop -----
  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const text = el.textContent || "";
    el.textContent = "";
    letterRefs.current = [];
    [...text].forEach((ch) => {
      const s = document.createElement("span");
      s.className = styles.ch;
      s.textContent = ch;
      el.appendChild(s);
      letterRefs.current.push(s);
    });

    let raf;
    const relax = () => {
      // On each frame, apply a little of the scroll "force" to the letters
      nudgeHeading(wheelDeltaRef.current);
      // Then, apply "friction" to the force so it diminishes over time
      wheelDeltaRef.current *= 0.92;

      raf = requestAnimationFrame(relax);
    };
    raf = requestAnimationFrame(relax);
    return () => cancelAnimationFrame(raf);
  }, []); // Empty dependency array is correct here

   // FIXED: This function no longer creates tweens. It just calculates the target positions.
  const nudgeHeading = (delta) => {
    const letters = letterRefs.current;
    if (!letters?.length) return;

    // A much smaller multiplier for a more subtle effect
    const dist = Math.max(-40, Math.min(40, delta * 0.5));
    const translateBase = gsap.utils.mapRange(40, -40, -50, 50, dist);
    const rotateBase = gsap.utils.mapRange(40, -40, -5, 5, dist);
    const mid = Math.ceil(letters.length / 2);

    letters.forEach((span, j) => {
      const factor = j < mid ? j / mid : (letters.length - 1 - j) / mid;
      const localTy = factor * translateBase;
      const localRz = (j - mid) * rotateBase * factor * 0.2;
      
      // Smoothly interpolate the current position towards the target
      const currentY = parseFloat(gsap.getProperty(span, "y")) || 0;
      const currentR = parseFloat(gsap.getProperty(span, "rotation")) || 0;
      
      gsap.set(span, {
        y: currentY + (localTy - currentY) * 0.8,
        rotation: currentR + (localRz - currentR) * 0.1,
      });
    });
  };

  // ----- initialize tidy stack -----
  useEffect(() => {
    if (!deckRef.current) return;
    const cards = [...deckRef.current.querySelectorAll(`.${styles.card}`)];
    cards.forEach((el, i) => {
      const z = 100 + (cards.length - i);
      gsap.set(el, { zIndex: z, y: 0, scale: 1, rotate: baseRotation(i), opacity: 1 });
      el.dataset.idx = String(i);
      el.classList.remove(styles.isGone);
      el.style.display = "";
    });
    currentRef.current = 0;
    textActiveRef.current = true;
  }, []);

  // ----- pinned detector (sticky viewport) -----
  useEffect(() => {
    const el = stickyRef.current;
    if (!el) return;
    let lastPinned = null;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const isPinned = rect.top <= 0 && rect.bottom >= vh;
      // when we become pinned, reset accumulators and add small cooldown so we don't consume leftover momentum
      if (isPinned && !lastPinned) {
        accRef.current = 0;
        cooldownRef.current = true;
        setTimeout(() => (cooldownRef.current = false), 160);
      }
      pinnedRef.current = isPinned;
      lastPinned = isPinned;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // ----- precise sticky release helper -----
  // When we reach the end (or fully restack to the top), jump to the exact scroll position
  // that unpins the sticky viewport so the user can continue scrolling naturally.
  const releaseStickyToIndex = (index, dir /* 1 down, -1 up */) => {
    const sec = sectionRef.current;
    if (!sec) return;
    const vh = window.innerHeight;
    const top = sec.getBoundingClientRect().top + window.scrollY; // section top in page coords
    // to release downward: scroll to top + index * vh (index == CARDS.length -> move to after last anchor)
    // to release upward: scroll to top - 2 (slightly above section so it unpins)
    const target = dir > 0 ? Math.min(top + index * vh, top + (pages - 1) * vh) : top - 2;
    // do immediate jump so user isn't forced to wheel many times; small timeout allows current wheel handling to finish
    setTimeout(() => {
      window.scrollTo({ top: Math.round(target), left: 0, behavior: "auto" });
    }, 30);
  };

  // ----- wheel handling (global so it triggers even if your mouse isn't exactly over the deck) -----
  useEffect(() => {
    const onWheel = (e) => {
      // if section isn't pinned we let page scroll normally
      if (!pinnedRef.current) return;
      // FIXED: Instead of calling an animation, we just add to the "force"
      wheelDeltaRef.current += e.deltaY;

      const dir = e.deltaY > 0 ? 1 : -1;
      const atLast = currentRef.current >= CARDS.length;
      const atFirst = currentRef.current <= 0;

      // If at edges and user wants to leave, allow it (do not preventDefault).
      if ((atLast && dir > 0) || (atFirst && dir < 0)) {
        return;
      }

      // otherwise we control the stack — prevent scroll
      e.preventDefault();

      // throttle
      if (animatingRef.current || cooldownRef.current) return;

      // accumulate small deltas into threshold
      accRef.current += e.deltaY;

      if (Math.abs(accRef.current) >= THRESH) {
        const step = accRef.current > 0 ? 1 : -1;
        accRef.current = 0;

        if (step > 0) {
          // POP: remove top card if any left
          if (currentRef.current < CARDS.length) {
            popTopCard(currentRef.current);
            currentRef.current += 1;

            // if we just popped the final card -> disable title effect & release sticky to let page continue
            if (currentRef.current >= CARDS.length) {
              textActiveRef.current = false;
              // release to exactly the end anchor to avoid many wheel steps
              releaseStickyToIndex(currentRef.current, 1);
            }
          }
        } else {
          // PUSH: put back a previously popped card
          if (currentRef.current > 0) {
            currentRef.current -= 1;
            pushBackCard(currentRef.current);
            // re-enable text effect once we're back inside the deck
            if (currentRef.current < CARDS.length) {
              textActiveRef.current = true;
            }
            // if we restored all the way to the start -> release sticky upward so user can get to previous section
            if (currentRef.current <= 0) {
              releaseStickyToIndex(0, -1);
            }
          }
        }

        cooldownRef.current = true;
        setTimeout(() => (cooldownRef.current = false), COOLDOWN);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  // ----- animations -----
  const popTopCard = (idx) => {
    const card = deckRef.current?.querySelector(`.${styles.card}[data-idx="${idx}"]`);
    if (!card) return;
    animatingRef.current = true;

    // ensure it's on top visually while flying out
    gsap.set(card, { zIndex: 999 });

    gsap.to(card, {
      y: "-120vh",
      rotate: gsap.utils.random(-10, -18),
      scale: 1.04,
      boxShadow: "0 30px 60px rgba(0,0,0,0.25)",
      duration: 0.55,
      ease: "power3.in",
      onComplete: () => {
        // permanently hide popped card to avoid overlaying other sections
        card.classList.add(styles.isGone);
        card.style.display = "none";
        animatingRef.current = false;
      },
    });
  };

  const pushBackCard = (idx) => {
    const card = deckRef.current?.querySelector(`.${styles.card}[data-idx="${idx}"]`);
    if (!card) return;
    animatingRef.current = true;

    // bring back into view from above
    card.style.display = "";
    card.classList.remove(styles.isGone);
    gsap.set(card, {
      zIndex: 200,
      y: "-110vh",
      rotate: gsap.utils.random(6, 12),
      scale: 1.03,
      opacity: 1,
      boxShadow: "0 30px 60px rgba(0,0,0,0.25)",
    });

    gsap.to(card, {
      y: 0,
      rotate: baseRotation(idx),
      scale: 1,
      boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
      duration: 0.65,
      ease: "power3.out",
      onComplete: () => {
        // re-normalize z-index so whole stack looks correct afterwards
        const cards = [...deckRef.current.querySelectorAll(`.${styles.card}`)];
        cards.forEach((el, i) => {
          const z = 100 + (cards.length - i);
          gsap.set(el, { zIndex: z });
        });
        animatingRef.current = false;
      },
    });
  };

  // hover tilt (visual only)
  const handleMove = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(el, {
      rotationY: px * -8,
      rotationX: py * 8,
      scale: 1.03,
      duration: 0.18,
      ease: "power2.out",
      transformPerspective: 800,
      transformOrigin: "center",
    });
  };
  const handleLeave = (e) => {
    const el = e.currentTarget;
    gsap.to(el, { rotationX: 0, rotationY: 0, scale: 1, duration: 0.35, ease: "power3.out" });
  };

  return (
    <section ref={sectionRef} className={styles.section} style={{ height: `${pages * 100}vh` }}>
      <div ref={stickyRef} className={styles.sticky}>
        <Background modelUrl="/assets/models/contour.glb" textureUrl="/marble-texture.webp" theme="light" />
        <div className={styles.header}>
          <p className={styles.kicker}>
            <span className={styles.dot} /> follow us
          </p>
          <h2 className={styles.title} aria-label="Social media.">
            <span ref={titleRef}>Social media.</span>
          </h2>
        </div>

        <div ref={deckRef} className={styles.deck}>
          {CARDS.map((c, i) => (
            <a
              key={c.platform}
              href={c.href}
              target="_blank"
              rel="noreferrer"
              className={styles.card}
              data-idx={i}
              onMouseMove={handleMove}
              onMouseLeave={handleLeave}
            >
              <img src={c.img} alt={c.platform} />
              <span className={styles.badge}>
                <span className={styles.badgeIcon} style={{ backgroundImage: `url(${c.icon})` }} />
                <span className={styles.badgeLabel}>{c.tag}</span>
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* anchors so section height = pages * 100vh */}
      <div className={styles.anchors}>
        {Array.from({ length: pages - 0 }).map((_, i) => (
          <div key={i} className={styles.anchor} />
        ))}
      </div>
    </section>
  );
}