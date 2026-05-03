/**
 * Sticky A/B variant assignment for the "mobile-first Pro tier" experiment.
 *
 * Variants:
 *   - "pro_first_mobile"  → Pro card renders first on mobile
 *   - "control"           → Pro card stays in middle (Starter → Pro → Scale)
 */
const KEY = "ss_ab_pricing_mobile_v1";
const VARIANTS = ["pro_first_mobile", "control"];

export const getPricingVariant = () => {
  if (typeof window === "undefined") return VARIANTS[0];
  try {
    const stored = window.localStorage.getItem(KEY);
    if (stored && VARIANTS.includes(stored)) return stored;
    const picked = VARIANTS[Math.floor(Math.random() * VARIANTS.length)];
    window.localStorage.setItem(KEY, picked);
    return picked;
  } catch {
    return VARIANTS[0];
  }
};
