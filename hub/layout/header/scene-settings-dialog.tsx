"use client"

import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { UpdateSceneDataInput } from "@/convex/scenes"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import PublicEye from "@/components/ui/public-eye"

interface SceneSettingsDialogProps {
  sceneData: UpdateSceneDataInput
  onSubmit: (sceneData: UpdateSceneDataInput) => Promise<void>
}

const SceneSettingsDialog = ({
  sceneData,
  onSubmit,
}: SceneSettingsDialogProps) => {
  const [open, setOpen] = useState(false)
  const [currentSceneData, setCurrentSceneData] = useState(sceneData)

  const updateCurrentSceneData = (
    prop: keyof UpdateSceneDataInput,
    value: unknown
  ) => {
    setCurrentSceneData({ ...currentSceneData, [prop]: value })
  }

  const handleSubmit = () => {
    const cleanSceneData = {
      name: currentSceneData.name?.trim(),
      description: currentSceneData.description?.trim(),
      public: currentSceneData.public,
    }
    onSubmit(cleanSceneData).then(() => setOpen(false))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon-sm" variant="secondary">
          <Settings />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Scene Info</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <div className="text-xs text-muted-foreground">Name</div>
            <Input
              value={currentSceneData?.name}
              onChange={(e) => updateCurrentSceneData("name", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-xs text-muted-foreground">Description</div>
            <Textarea
              value={currentSceneData?.description}
              onChange={(e) =>
                updateCurrentSceneData("description", e.target.value)
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-xs text-muted-foreground">Visibility</div>
            <div className="flex items-center gap-4">
              <Switch
                checked={currentSceneData?.public ?? false}
                onCheckedChange={(checked) =>
                  updateCurrentSceneData("public", checked)
                }
              />
              <PublicEye isPublic={currentSceneData?.public ?? false} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              <div className="text-xs text-muted-foreground">Views</div>
              <div>{sceneData.views}</div>
            </div>
            <Button onClick={handleSubmit}>Submit</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SceneSettingsDialog
