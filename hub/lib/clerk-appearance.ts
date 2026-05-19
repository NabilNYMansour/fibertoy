import { neobrutalism } from "@clerk/themes"

/**
 * Shared Clerk visuals. Keeps layered styles compatible with Tailwind v4 —
 * enable `cssLayerName` globally and declare layer order at the top of `globals.css`
 * (@see https://clerk.com/changelog/2025-06-17-css-layer-name ).
 */
export const clerkAppearance = {
  baseTheme: neobrutalism,
  cssLayerName: "clerk",
} as const
