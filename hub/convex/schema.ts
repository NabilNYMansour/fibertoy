import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    username: v.string(),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_username", ["username"]),
  scenes: defineTable({
    ownerId: v.string(),

    username: v.string(),
    name: v.string(),
    description: v.optional(v.string()),

    views: v.number(),
    likes: v.number(),

    createdAt: v.number(),
    updatedAt: v.number(),

    public: v.boolean(),
  })
    .index("by_ownerId_and_name", ["ownerId", "name"])
    .index("by_ownerId_and_updatedAt", ["ownerId", "updatedAt"])
    .index("by_ownerId_and_createdAt", ["ownerId", "createdAt"])
    .index("by_ownerId_and_public", ["ownerId", "public"])
    .index("by_ownerId_and_views", ["ownerId", "views"])
    .index("by_ownerId_and_likes", ["ownerId", "likes"])
    .index("by_public_and_name", ["public", "name"])
    .index("by_public_and_updatedAt", ["public", "updatedAt"])
    .index("by_public_and_createdAt", ["public", "createdAt"])
    .index("by_public_and_views", ["public", "views"])
    .index("by_public_and_likes", ["public", "likes"])
    // Global ranking: likes → views → updatedAt (desc via .order("desc")).
    .index("by_public_and_likes_views_and_updatedAt", [
      "public",
      "likes",
      "views",
      "updatedAt",
    ]),
  codes: defineTable({
    sceneId: v.id("scenes"),
    code: v.string(),
  }).index("by_sceneId", ["sceneId"]),
  userSceneLikes: defineTable({
    userId: v.string(),
    sceneId: v.id("scenes"),
  })
    .index("by_sceneId", ["sceneId"])
    .index("by_userId_and_sceneId", ["userId", "sceneId"]),
})
