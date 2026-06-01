export const SITE_URL =
  process.env.NODE_ENV === "production"
    ? "https://fibertoy.dev"
    : "http://localhost:3000"

export type SortDirection = "asc" | "desc"
