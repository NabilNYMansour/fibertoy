"use client"

import { Copy, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Id } from "@/convex/_generated/dataModel"
import { toast } from "sonner"

interface ShareDialogProps {
  sceneId: Id<"scenes">
  isPublic?: boolean
}

const ShareDialog = ({ sceneId, isPublic }: ShareDialogProps) => {
  const shareUrl = `${window.location.origin}/view/${sceneId}`
  const iframeUrl = `<iframe src="${shareUrl}?embed=true" width="100%" height="400px"></iframe>`

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
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
          {!isPublic && (
            <DialogDescription>
              This scene is private. Only you can view it until you make it
              public in settings.
            </DialogDescription>
          )}
        </DialogHeader>
        <div>
          <p className="mb-1 text-xs text-muted-foreground">Direct Link:</p>
          <div className="flex gap-2">
            <Input readOnly value={shareUrl} className="font-mono text-xs" />
            <Button onClick={handleCopyUrl} size="icon" variant="outline">
              <Copy />
            </Button>
          </div>
        </div>
        <div>
          <p className="mb-1 text-xs text-muted-foreground">iframe Embed:</p>
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
