"use client"

import { useEffect, useMemo, useRef } from "react"
import { useMutation, useQuery_experimental as useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { usePathname, notFound, useSearchParams } from "next/navigation"
import { Id } from "@/convex/_generated/dataModel"
import useMessageHandler from "@/hooks/use-message-handler"
import { cn } from "@/lib/utils"

export default function Page() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const sceneId = useMemo(
    () => pathname.split("/")[2] as Id<"scenes">,
    [pathname]
  )

  const result = useQuery({
    query: api.codes.getCode,
    args: sceneId ? { sceneId } : "skip",
  })

  const incrementResult = useMutation(api.scenes.incrementSceneViews)

  useEffect(() => {
    incrementResult({ sceneId })
  }, [sceneId, incrementResult])

  if (result.status === "error") {
    notFound()
  }

  const data = result.status === "success" ? result.data : undefined

  useMessageHandler({ iframeRef, sceneId, code: data?.code, fork: data?.fork })

  const embed = searchParams.get("embed") === "true"

  return (
    <div className="flex flex-1">
      <iframe
        ref={iframeRef}
        src={`http://localhost:5173?embed=${embed}`}
        className={cn(
          "flex-1 bg-transparent",
          embed && "absolute top-0 h-screen w-screen"
        )}
        sandbox="allow-scripts"
      />
    </div>
  )
}
