"use client"

import { useMemo, useRef } from "react"
import { useQuery_experimental as useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { usePathname, notFound } from "next/navigation"
import { Id } from "@/convex/_generated/dataModel"
import { useUser } from "@clerk/nextjs"
import useMessageHandler from "@/hooks/use-message-handler"

export default function Page() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const pathname = usePathname()
  const { user } = useUser()

  const sceneId = useMemo(
    () => pathname.split("/")[2] as Id<"scenes">,
    [pathname]
  )

  const result = useQuery({
    query: api.codes.getCode,
    args: sceneId ? { sceneId, ownerId: user?.id } : "skip",
  })

  if (result.status === "error") {
    notFound()
  }

  const data = result.status === "success" ? result.data : undefined

  useMessageHandler({ sceneId, code: data?.code, fork: data?.fork, iframeRef })

  return (
    <div className="flex flex-1">
      <iframe
        ref={iframeRef}
        src="http://localhost:5173"
        className="flex-1 bg-transparent"
        sandbox="allow-scripts"
      />
    </div>
  )
}
