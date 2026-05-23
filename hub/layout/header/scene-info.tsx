"use client"

import { Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { UpdateSceneDataInput } from "@/convex/scenes"

interface SceneInfoDialogProps {
  sceneData: UpdateSceneDataInput
}

const SceneInfoDialog = ({ sceneData }: SceneInfoDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon-sm" variant="secondary">
          <Info />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Scene Info</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <div className="text-xs text-muted-foreground">Name</div>
            <div className="flex items-baseline gap-2">
              <div>{sceneData?.name}</div>
              <div className="text-xs text-muted-foreground">by</div>
              <div>{sceneData?.username}</div>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-xs text-muted-foreground">Description</div>
            <div>
              {sceneData?.description?.length ? (
                sceneData.description
              ) : (
                <i className="text-xs">No description</i>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SceneInfoDialog
