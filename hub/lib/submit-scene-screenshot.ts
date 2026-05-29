"use client"

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useMutation } from "convex/react"

export async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const response = await fetch(dataUrl)
  return await response.blob()
}

export async function submitSceneScreenshot({
  sceneId,
  dataUrl,
  generateUploadUrl,
  updateSceneThumbnail,
}: {
  sceneId: Id<"scenes">
  dataUrl: string
  generateUploadUrl: ReturnType<
    typeof useMutation<typeof api.scenes.generateThumbnailUploadUrl>
  >
  updateSceneThumbnail: ReturnType<
    typeof useMutation<typeof api.scenes.updateSceneThumbnail>
  >
}) {
  const resizedUrl = await resizeDataUrlTo16x9(dataUrl)
  const blob = await dataUrlToBlob(resizedUrl)
  const uploadUrl = await generateUploadUrl()
  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": blob.type },
    body: blob,
  })
  if (!response.ok) {
    throw new Error("Thumbnail upload failed")
  }
  const { storageId } = (await response.json()) as { storageId: Id<"_storage"> }
  await updateSceneThumbnail({ sceneId, storageId })
}

type ImageType = "image/jpeg" | "image/png" | "image/webp"

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

export async function resizeDataUrlTo16x9(
  dataUrl: string,
  type: ImageType = "image/webp",
  quality = 0.8
): Promise<string> {
  const targetWidth = 512
  const targetHeight = 288

  const img = await loadImage(dataUrl)

  const sourceRatio = img.width / img.height
  const targetRatio = 16 / 9

  let sx = 0
  let sy = 0
  let sWidth = img.width
  let sHeight = img.height

  if (sourceRatio > targetRatio) {
    sWidth = img.height * targetRatio
    sx = (img.width - sWidth) / 2
  } else {
    sHeight = img.width / targetRatio
    sy = (img.height - sHeight) / 2
  }

  const canvas = document.createElement("canvas")
  canvas.width = targetWidth
  canvas.height = targetHeight

  const ctx = canvas.getContext("2d")

  if (!ctx) {
    throw new Error("Could not get canvas context")
  }

  ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, targetWidth, targetHeight)

  return canvas.toDataURL(type, quality)
}
