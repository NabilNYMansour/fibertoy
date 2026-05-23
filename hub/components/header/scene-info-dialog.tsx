"use client"

import { Info } from "lucide-react"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "../ui/input"
import { useState } from "react"
import { UpdateSceneDataInput } from "@/convex/scenes"
import { Textarea } from "../ui/textarea"
import { Switch } from "../ui/switch"
import PublicEye from "../ui/public-eye"

interface SceneInfoDialogProps {
  sceneData: UpdateSceneDataInput
  onSubmit: (sceneData: UpdateSceneDataInput) => void
}

const SceneInfoDialog = ({ sceneData, onSubmit }: SceneInfoDialogProps) => {
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
    onSubmit(cleanSceneData)
  }

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
            Name
            <Input
              value={currentSceneData?.name}
              onChange={(e) => updateCurrentSceneData("name", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            Description
            <Textarea
              value={currentSceneData?.description}
              onChange={(e) =>
                updateCurrentSceneData("description", e.target.value)
              }
            />
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                Visibility
                <PublicEye isPublic={currentSceneData?.public ?? false} />
              </div>
              <Switch
                checked={currentSceneData?.public ?? false}
                onCheckedChange={(checked) =>
                  updateCurrentSceneData("public", checked)
                }
              />
            </div>
            <Button onClick={handleSubmit}>Submit</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SceneInfoDialog
