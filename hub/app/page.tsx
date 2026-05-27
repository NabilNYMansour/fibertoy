import { HomeScenes } from "@/components/layout/home-scenes"
import ErrorRedirect from "@/components/layout/error/error-redirect"

export default function Page() {
  return (
    <ErrorRedirect>
      <main className="relative flex flex-1 flex-col bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-zinc-800/40 via-zinc-950 to-zinc-950">
        {/* subtle grid like Shadertoy's charcoal texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.17]"
          aria-hidden
          style={{
            backgroundImage: `linear-gradient(to right, rgb(39 39 42 / 0.45) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(39 39 42 / 0.45) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative flex flex-1 flex-col">
          <HomeScenes />
        </div>
      </main>
    </ErrorRedirect>
  )
}
