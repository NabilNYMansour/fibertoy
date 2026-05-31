import { mutation } from "./_generated/server"
import { v } from "convex/values"

export const createUser = mutation({
  args: {
    userId: v.string(),
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId, username } = args
    await ctx.db.insert("users", { clerkId: userId, username })
  },
})

export const unprotectedUpdateUserUsername = mutation({
  args: {
    userId: v.string(),
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId, username } = args
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

export const unprotectedDeleteUser = mutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId } = args
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
    }
  },
})
