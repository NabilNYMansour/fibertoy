import { query } from "./_generated/server"
import { v } from "convex/values"

export const getCode = query({
  args: {
    sceneId: v.id("scenes"),
    ownerId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { sceneId, ownerId } = args
    const scene = await ctx.db.get("scenes", sceneId)
    if (!scene || (!scene.public && scene.ownerId !== ownerId)) {
      throw new Error("Scene not found")
    }
    const codeDoc = await ctx.db
      .query("codes")
      .withIndex("by_sceneId", (q) => q.eq("sceneId", sceneId))
      .first()
    return codeDoc?.code
  },
})
