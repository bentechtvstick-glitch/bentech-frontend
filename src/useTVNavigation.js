import { useEffect, useRef } from "react";

/* ---------------------------------------------------------------------------
   useTVNavigation
   ---------------------------------------------------------------------------
   Adds D-pad / remote-control style navigation (ArrowUp/Down/Left/Right +
   Enter/OK) to any screen built with normal <button>/<a> elements.

   Fire TV, Android TV, and most smart-TV remotes send standard keyboard
   events: ArrowUp/Down/Left/Right for the D-pad and "Enter" for OK/Select.
   Browsers already fire a click on a focused <button> when Enter is
   pressed, so the only real gap is: arrow keys don't move focus between
   arbitrary elements the way Tab does. This hook fills that gap by finding
   the closest focusable element in the direction pressed.

   USAGE
   -----
   import { useTVNavigation } from "./useTVNavigation";

   export default function TVApp() {
     useTVNavigation(); // call once, near the top of the root component
     ...
   }

   Add the CSS block at the bottom of this file (or import it) so focused
   elements get a visible highlight — required for TV remotes since there's
   no mouse cursor to show where you are.
--------------------------------------------------------------------------- */

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function isVisible(el) {
  if (el.hasAttribute("disabled") || el.getAttribute("aria-hidden") === "true") return false;
  const rect = el.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) return false;
  const style = window.getComputedStyle(el);
  return style.visibility !== "hidden" && style.display !== "none";
}

function getFocusableElements(root = document) {
  return Array.from(root.querySelectorAll(FOCUSABLE_SELECTOR)).filter(isVisible);
}

function findNearest(current, direction, candidates) {
  const rect = current.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  let best = null;
  let bestScore = Infinity;

  for (const el of candidates) {
    if (el === current) continue;
    const r = el.getBoundingClientRect();
    const ex = r.left + r.width / 2;
    const ey = r.top + r.height / 2;
    const dx = ex - cx;
    const dy = ey - cy;

    let primary;
    let secondary;
    let valid;

    switch (direction) {
      case "ArrowRight":
        valid = dx > 4;
        primary = dx;
        secondary = Math.abs(dy);
        break;
      case "ArrowLeft":
        valid = dx < -4;
        primary = -dx;
        secondary = Math.abs(dy);
        break;
      case "ArrowDown":
        valid = dy > 4;
        primary = dy;
        secondary = Math.abs(dx);
        break;
      case "ArrowUp":
        valid = dy < -4;
        primary = -dy;
        secondary = Math.abs(dx);
        break;
      default:
        valid = false;
    }

    if (!valid) continue;

    // Favor elements that are mostly aligned (small secondary offset),
    // then the closest ones in the primary direction.
    const score = primary + secondary * 2.2;
    if (score < bestScore) {
      bestScore = score;
      best = el;
    }
  }

  return best;
}

/**
 * @param {boolean} enabled - pass false to temporarily disable (e.g. while
 *   a text input/search box is focused, if you want native cursor movement
 *   inside the input instead of jumping focus).
 */
export function useTVNavigation(enabled = true) {
  const lastFocusedRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    function onKeyDown(e) {
      const DIRECTIONS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
      if (!DIRECTIONS.includes(e.key)) return;

      const active = document.activeElement;

      // Let arrow keys move the text cursor normally inside inputs.
      if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA")) {
        return;
      }

      const candidates = getFocusableElements();
      if (candidates.length === 0) return;

      if (!active || active === document.body) {
        const target = lastFocusedRef.current && candidates.includes(lastFocusedRef.current)
          ? lastFocusedRef.current
          : candidates[0];
        target.focus();
        e.preventDefault();
        return;
      }

      const next = findNearest(active, e.key, candidates);
      if (next) {
        next.focus();
        lastFocusedRef.current = next;
        next.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
        e.preventDefault();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enabled]);
}

/* ---------------------------------------------------------------------------
   TV_FOCUS_STYLES
   ---------------------------------------------------------------------------
   Drop this <style> block once near the root of the app (or move its
   contents into your global CSS). It gives every focusable element a
   visible glow ring in the BenTech accent color when focused via keyboard/
   remote, without adding an outline for mouse clicks (focus-visible).
--------------------------------------------------------------------------- */
export const TV_FOCUS_STYLES = `
  button:focus,
  a:focus,
  [tabindex]:focus {
    outline: none;
  }
  button:focus-visible,
  a:focus-visible,
  [tabindex]:focus-visible {
    outline: 3px solid #3FA9F5;
    outline-offset: 3px;
    border-radius: 10px;
    box-shadow: 0 0 0 6px rgba(63, 169, 245, 0.25);
    transition: outline-offset 0.12s ease, box-shadow 0.12s ease;
    z-index: 5;
  }
`;
