import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  scenes: defineTable({
    ownerId: v.string(),

    username: v.string(),
    name: v.string(),
    description: v.optional(v.string()),

    views: v.number(),

    createdAt: v.number(),
    updatedAt: v.number(),

    public: v.boolean(),
  })
    .index("by_ownerId_and_name", ["ownerId", "name"])
    .index("by_ownerId_and_updatedAt", ["ownerId", "updatedAt"])
    .index("by_ownerId_and_createdAt", ["ownerId", "createdAt"])
    .index("by_ownerId_and_public", ["ownerId", "public"])
    .index("by_public_and_name", ["public", "name"])
    .index("by_public_and_updatedAt", ["public", "updatedAt"])
    .index("by_public_and_createdAt", ["public", "createdAt"]),
  codes: defineTable({
    sceneId: v.id("scenes"),
    code: v.string(),
  }).index("by_sceneId", ["sceneId"]),
})
