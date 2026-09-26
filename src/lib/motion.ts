import gsap from "gsap";

// Intros must land on schedule even when the first frames stutter (large image decode),
// so never stretch a timeline to hide dropped frames; jump ahead instead
gsap.ticker.lagSmoothing(0);

export { gsap };
