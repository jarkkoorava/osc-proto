import { historySeed } from "./historySeed.ts";
import type { Load } from "./manifest.ts";

// All visitors start with the same committed history, independent of date or randomness.
export const demoHistory = (): Load[] => structuredClone(historySeed);
