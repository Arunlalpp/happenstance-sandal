/** Linear interpolation. */
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Clamp a number between min and max. */
export const clamp = (v: number, min = 0, max = 1) => Math.min(Math.max(v, min), max);

/** Map a value from one range to another. */
export const mapRange = (v: number, inMin: number, inMax: number, outMin: number, outMax: number) =>
    outMin + ((v - inMin) * (outMax - outMin)) / (inMax - inMin);
