import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  scenes: defineTable({
    name: v.string(),

    description: v.optional(v.string()),

    createdAt: v.number(),
    updatedAt: v.number(),
  }),
  codes: defineTable({
    sceneId: v.id("scenes"),
    code: v.string(),
  }).index("by_sceneId", ["sceneId"]),
})
