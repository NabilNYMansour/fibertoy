import { mutation } from "./_generated/server"
import { v } from "convex/values"

export const createUser = mutation({
  args: {
    userId: v.string(),
    username: v.string(),
    secret: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId, username, secret } = args
    if (secret !== process.env.FIBERTOY_WEBHOOK_SECRET) {
      throw new Error("Invalid secret")
    }
    await ctx.db.insert("users", { clerkId: userId, username })
  },
})

export const updateUserUsername = mutation({
  args: {
    userId: v.string(),
    username: v.string(),
    secret: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId, username, secret } = args
    if (secret !== process.env.FIBERTOY_WEBHOOK_SECRET) {
      throw new Error("Invalid secret")
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", userId))
      .first()
    if (!user) {
      throw new Error("User not found")
    }
    await ctx.db.patch("users", user._id, { username })
    const scenes = await ctx.db
      .query("scenes")
      .withIndex("by_ownerId_and_createdAt", (q) => q.eq("ownerId", userId))
      .collect()
    for (const scene of scenes) {
      await ctx.db.patch(scene._id, { username })
    }
  },
})

export const deleteUser = mutation({
  args: {
    userId: v.string(),
    secret: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId, secret } = args
    if (secret !== process.env.FIBERTOY_WEBHOOK_SECRET) {
      throw new Error("Invalid secret")
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", userId))
      .first()
    if (!user) {
      throw new Error("User not found")
    }
    await ctx.db.delete(user._id)
    const scenes = await ctx.db
      .query("scenes")
      .withIndex("by_ownerId_and_createdAt", (q) => q.eq("ownerId", userId))
      .collect()
    for (const scene of scenes) {
      const code = await ctx.db
        .query("codes")
        .withIndex("by_sceneId", (q) => q.eq("sceneId", scene._id))
        .first()
      if (code) {
        await ctx.db.delete(code._id)
      }
      await ctx.db.delete(scene._id)
      if (scene.thumbnailStorageId) {
        await ctx.storage.delete(scene.thumbnailStorageId)
      }
    }
    const sceneLikes = await ctx.db
      .query("userSceneLikes")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect()
    for (const like of sceneLikes) {
      const scene = await ctx.db.get(like.sceneId)
      if (scene) {
        await ctx.db.patch("scenes", like.sceneId, { likes: scene.likes - 1 })
      }
      await ctx.db.delete(like._id)
    }
  },
})
