import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export type UpdateSceneDataInput = {
  name?: string
  description?: string
  public?: boolean
  code?: string
}

export const updateScene = mutation({
  args: {
    sceneId: v.optional(v.id("scenes")),
    ownerId: v.string(),
    data: v.object({
      name: v.optional(v.string()),
      description: v.optional(v.string()),
      public: v.optional(v.boolean()),
      code: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const { sceneId, ownerId, data } = args
    //---------------- New scene ----------------//
    if (!sceneId) {
      const now = Date.now()
      const cleanData = {
        name: data.name ?? "new scene",
        description: data.description ?? "",
        public: data.public ?? false,
        createdAt: now,
        updatedAt: now,
      }
      const newSceneId = await ctx.db.insert("scenes", {
        ownerId,
        ...cleanData,
      })
      await ctx.db.insert("codes", {
        sceneId: newSceneId,
        code: data.code ?? "",
      })
      return newSceneId
    } else {
      //---------------- Update scene ----------------//
      const scene = await ctx.db.get(sceneId)
      if (!scene) {
        throw new Error("Scene not found")
      }
      if (scene.ownerId !== ownerId) {
        throw new Error("Unauthorized")
      }
      const { code: codeUpdate, ...sceneFields } = data
      await ctx.db.patch(sceneId, {
        ...sceneFields,
        updatedAt: Date.now(),
      })
      if (codeUpdate !== undefined) {
        const codeDoc = await ctx.db
          .query("codes")
          .withIndex("by_sceneId", (q) => q.eq("sceneId", sceneId))
          .first()
        if (codeDoc) {
          await ctx.db.patch(codeDoc._id, { code: codeUpdate })
        } else {
          await ctx.db.insert("codes", {
            sceneId,
            code: codeUpdate,
          })
        }
      }
      return sceneId
    }
  },
})

export const getUserScenes = query({
  args: { ownerId: v.string() },
  handler: async (ctx, args) => {
    const { ownerId } = args
    const scenes = await ctx.db
      .query("scenes")
      .withIndex("by_ownerId", (q) => q.eq("ownerId", ownerId))
      .collect()
    return scenes
  },
})

export const deleteScene = mutation({
  args: {
    sceneId: v.id("scenes"),
    ownerId: v.string(),
  },
  handler: async (ctx, args) => {
    const { sceneId, ownerId } = args
    const scene = await ctx.db.get(sceneId)
    if (!scene || scene.ownerId !== ownerId) {
      throw new Error("Scene not found")
    }
    await ctx.db.delete(sceneId)
    return sceneId
  },
})

export const getScene = query({
  args: {
    sceneId: v.id("scenes"),
    ownerId: v.string(),
  },
  handler: async (ctx, args) => {
    const { sceneId, ownerId } = args
    const scene = await ctx.db.get("scenes", sceneId)
    if (!scene || (!scene.public && scene.ownerId !== ownerId)) {
      throw new Error("Scene not found")
    }
    return scene
  },
})
