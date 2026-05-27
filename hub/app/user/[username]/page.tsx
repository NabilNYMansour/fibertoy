"use client"

import { useQuery } from "convex/react"
import { notFound, usePathname } from "next/navigation"
import { api } from "@/convex/_generated/api"
import { SceneCard } from "@/components/scene-card"

const UserPage = () => {
  const pathname = usePathname()
  const username = pathname.split("/")[2]

  const userScenes = useQuery(
    api.scenes.getUserPublicScenes,
    username ? { username: username } : "skip"
  )

  if (!username || userScenes?.length === 0) return notFound()

  return (
    <div className="grid grid-cols-1 gap-4 p-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {userScenes?.map((scene) => (
        <SceneCard key={scene._id} scene={scene} />
      ))}
    </div>
  )
}

export default UserPage
