import { useLayoutEffect, useRef } from "react";

/** Locks the page scroll and restores it exactly where it was. */
export function useScrollLock(locked) {
  const scrollY = useRef(0);

  useLayoutEffect(() => {
    const body = document.body;
    const html = document.documentElement;

    if (locked) {
      // remember where we were
      scrollY.current = window.scrollY || window.pageYOffset || 0;

      // lock layout
      body.style.position = "fixed";
      body.style.top = `-${scrollY.current}px`;
      body.style.left = "0";
      body.style.right = "0";
      body.style.width = "100%";
      body.style.overflow = "hidden";

      // tame overscroll / pull-to-refresh
      html.style.overscrollBehavior = "none";
      body.style.touchAction = "none";
    } else {
      // restore layout
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      body.style.overflow = "";

      html.style.overscrollBehavior = "";
      body.style.touchAction = "";

      // jump back to exact spot
      window.scrollTo(0, scrollY.current);
    }
  }, [locked]);
}
