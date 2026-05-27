"use client"

import BasicLoader from "@/components/loaders/basic-loader"
import { Button } from "@/components/ui/button"
import { SceneCard } from "@/components/scene-card"
import { api } from "@/convex/_generated/api"
import { useQuery } from "convex/react"
import Link from "next/link"
import { Heart, Plus } from "lucide-react"

export function HomeScenes() {
  const result = useQuery(api.scenes.homeRankedPublicScenes, {})

  if (result === undefined) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <BasicLoader />
      </div>
    )
  }

  const { ranked, rankingSource } = result
  const [hero, ...featured] = ranked

  if (!hero) {
    return (
      <div className="flex w-full flex-col gap-6 px-6 py-20 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            Welcome to FiberToy
          </h1>
          <p className="text-lg text-muted-foreground">
            No public scenes yet. Be the first to publish something.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/new">
            <Button size="lg" className="px-8">
              Create a scene
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const sourceLabel =
    rankingSource === "lastWeek"
      ? "Ranked by likes among scenes published in the last 7 days"
      : "Not enough scenes from the last week, showing all‑time favorites"

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 md:py-12">
      <section className="flex flex-col-reverse gap-10 xl:flex-row xl:gap-14">
        <div className="max-w-2xl min-w-0 flex-1 space-y-3">
          <p className="text-sm font-medium tracking-[0.2em] text-muted-foreground uppercase">
            Scene of the week
          </p>
          <SceneCard scene={hero} />
          <p className="max-w-xl text-xs text-muted-foreground">
            {sourceLabel}
          </p>
        </div>

        <div className="flex w-full shrink-0 flex-col justify-center xl:max-w-md">
          <h2 className="mb-4 text-4xl leading-[1.1] font-bold tracking-tight text-muted-foreground md:text-[2.65rem]">
            Build and share{" "}
            <Link
              href="https://github.com/pmndrs/react-three-fiber"
              className="text-white hover:underline"
              target="_blank"
            >
              React Three Fiber
            </Link>{" "}
            Scenes with the world
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/new">
              <Button size="lg" className="w-40">
                <Plus />
                New scene
              </Button>
            </Link>
            <Link href="/browse">
              <Button size="lg" variant="outline" className="w-40">
                Browse all
              </Button>
            </Link>
            <Link href="https://buymeacoffee.com/nabilmansour" target="_blank">
              <Button size="lg" variant="destructive" className="w-40">
                <Heart className="mr-1" />
                Support
              </Button>
            </Link>
            <Link
              href="https://github.com/NabilNYMansour/fibertoy"
              target="_blank"
            >
              <Button size="lg" className="w-40">
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  color="white"
                >
                  <title>GitHub</title>
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                Contribute
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mt-4">
          <p className="text-sm font-medium tracking-[0.2em] text-muted-foreground uppercase">
            {rankingSource === "lastWeek"
              ? "Featured this week"
              : "More community favorites"}
          </p>
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {featured.map((scene) => (
              <li key={scene._id}>
                <SceneCard scene={scene} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
