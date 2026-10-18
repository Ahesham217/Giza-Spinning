export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function motionDuration(ms: number): number {
  return prefersReducedMotion() ? 0 : ms;
}
