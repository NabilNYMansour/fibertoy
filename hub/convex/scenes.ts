import { mutation, query } from "./_generated/server"
import { paginationOptsValidator } from "convex/server"
import { v } from "convex/values"

export type UpdateSceneDataInput = {
  name?: string
  description?: string
  public?: boolean
  code?: string
}

export const MAX_CODE_LENGTH = 200_000

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
    //---------------- Code length check ----------------//
    if ((data.code?.length ?? 0) > MAX_CODE_LENGTH) {
      throw new Error("Code too long")
    }
    //---------------- Create new scene ----------------//
    const createNewScene = async (
      name: string = "new scene",
      description: string = ""
    ) => {
      const now = Date.now()
      const cleanData = {
        name,
        description,
        public: false,
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
    }
    //---------------- New scene ----------------//
    if (!sceneId) {
      return await createNewScene()
    } else {
      //---------------- Update scene ----------------//
      const scene = await ctx.db.get(sceneId)
      if (!scene) {
        throw new Error("Scene not found")
      }
      if (scene.ownerId !== ownerId) {
        return await createNewScene(`${scene.name} fork`, scene.description)
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

const INDEX_BY_MY_SCENES_SORT = {
  name: "by_ownerId_and_name",
  updatedAt: "by_ownerId_and_updatedAt",
  createdAt: "by_ownerId_and_createdAt",
  public: "by_ownerId_and_public",
} as const

export const listMyScenesPaginated = query({
  args: {
    ownerId: v.string(),
    sortBy: v.union(
      v.literal("name"),
      v.literal("updatedAt"),
      v.literal("createdAt"),
      v.literal("public")
    ),
    sortDirection: v.union(v.literal("asc"), v.literal("desc")),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const { ownerId, sortBy, sortDirection, paginationOpts } = args
    const indexName = INDEX_BY_MY_SCENES_SORT[sortBy]
    return await ctx.db
      .query("scenes")
      .withIndex(indexName, (q) => q.eq("ownerId", ownerId))
      .order(sortDirection)
      .paginate(paginationOpts)
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
    ownerId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { sceneId, ownerId } = args
    const scene = await ctx.db.get("scenes", sceneId)
    const isPublic = scene?.public ?? false
    const requesterIsOwner = scene?.ownerId === ownerId
    if (isPublic && !requesterIsOwner) {
      const cleanData = {
        ...scene,
        ownerId: undefined,
        readOnly: true,
      }
      return cleanData
    }
    if (!scene || (!isPublic && !requesterIsOwner)) {
      throw new Error("Scene not found")
    }
    return {
      ...scene,
      ownerId: undefined,
      readOnly: false,
    }
  },
})
