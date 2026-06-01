"use client"

import { Copy, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Id } from "@/convex/_generated/dataModel"
import { toast } from "sonner"
import { useState } from "react"
import { Switch } from "@/components/ui/switch"

interface ShareDialogProps {
  sceneId: Id<"scenes">
}

const ShareDialog = ({ sceneId }: ShareDialogProps) => {
  const [fullscreen, setFullscreen] = useState(false)

  const shareUrl = `${window.location.origin}/view/${sceneId}`
  const fullscreenUrl = `${shareUrl}?embed=true`
  const iframeUrl = `<iframe src="${fullscreenUrl}" width="100%" height="400px"></iframe>`

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(fullscreen ? fullscreenUrl : shareUrl)
      toast.success("Link copied!")
    } catch {
      toast.error("Failed to copy link")
    }
  }

  const handleCopyIframe = async () => {
    try {
      await navigator.clipboard.writeText(iframeUrl)
      toast.success("Iframe copied!")
    } catch {
      toast.error("Failed to copy iframe")
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon-sm" variant="secondary">
          <Share2 />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Scene</DialogTitle>
        </DialogHeader>
        <div>
          <div className="flex items-center justify-between gap-2">
            <p className="mb-1 text-sm">Direct Link:</p>
            <div className="mb-1 flex items-center gap-2">
              <p className="text-xs text-muted-foreground">Fullscreen</p>
              <Switch
                checked={fullscreen}
                size="sm"
                onCheckedChange={setFullscreen}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Input
              readOnly
              value={fullscreen ? fullscreenUrl : shareUrl}
              className="font-mono text-xs"
            />
            <Button onClick={handleCopyUrl} size="icon" variant="outline">
              <Copy />
            </Button>
          </div>
        </div>
        <div>
          <p className="mb-1 text-sm">iframe Embed:</p>
          <div className="flex gap-2">
            <Input readOnly value={iframeUrl} className="font-mono text-xs" />
            <Button onClick={handleCopyIframe} size="icon" variant="outline">
              <Copy />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ShareDialog
