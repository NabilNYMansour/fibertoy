"use client"

import BasicLoader from "@/components/basic-loader"
import ErrorRedirect from "@/components/errors/error-redirect"
import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useUser } from "@clerk/nextjs"
import { useMutation, useQuery } from "convex/react"
import { Trash } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

const MyScenesPage = () => {
  const { isSignedIn, user, isLoaded } = useUser()

  const scenes = useQuery(
    api.scenes.getUserScenes,
    user?.id ? { ownerId: user?.id } : "skip"
  )

  const deleteScene = useMutation(api.scenes.deleteScene)

  const handleDelete = async (sceneId: Id<"scenes">) => {
    if (!user?.id) return
    const toastId = toast.loading("Deleting scene...")
    try {
      await deleteScene({ sceneId, ownerId: user.id })
      toast.success("Scene deleted", { id: toastId })
    } catch {
      toast.error("Failed to delete scene", { id: toastId })
    }
  }

  if (!isLoaded || !scenes) {
    return <BasicLoader />
  }

  if (!isSignedIn) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-2">
        <p>You must be signed in to view this page.</p>
        <Link href="/sign-in?redirectUrl=/my-scenes">
          <Button>Sign in</Button>
        </Link>
      </div>
    )
  }

  if (scenes?.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl">No scenes found</h1>
          <p>Make a new one ᕕ(ᐛ)ᕗ</p>
          <Link href="/new">
            <Button>New Scene</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col items-center gap-2 p-2">
      {scenes?.map((scene) => (
        <div key={scene._id} className="flex items-center gap-4">
          <Link href={`/view/${scene._id}`} className="hover:underline">
            {scene.name}
          </Link>
          <div className="flex gap-2">
            <Button
              variant="destructive"
              size="icon-sm"
              onClick={() => handleDelete(scene._id)}
            >
              <Trash />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Page() {
  return (
    <ErrorRedirect>
      <MyScenesPage />
    </ErrorRedirect>
  )
}
