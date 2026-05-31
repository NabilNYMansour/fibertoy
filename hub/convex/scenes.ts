import { mutation, query } from "./_generated/server"
import type { QueryCtx } from "./_generated/server"
import type { Doc } from "./_generated/dataModel"
import { paginationOptsValidator } from "convex/server"
import { v } from "convex/values"

async function sceneWithThumbnailUrl(ctx: QueryCtx, scene: Doc<"scenes">) {
  const thumbnailUrl = scene.thumbnailStorageId
    ? ((await ctx.storage.getUrl(scene.thumbnailStorageId)) ?? undefined)
    : undefined
  return { ...scene, thumbnailUrl }
}

export type UpdateSceneDataInput = {
  name?: string
  description?: string
  public?: boolean
  code?: string
  username?: string
  views?: number
  likes?: number
}

export const MAX_CODE_LENGTH = 200_000
export const MAX_NAME_LENGTH = 100

export const updateScene = mutation({
  args: {
    sceneId: v.optional(v.id("scenes")),
    username: v.string(),
    data: v.object({
      name: v.optional(v.string()),
      description: v.optional(v.string()),
      public: v.optional(v.boolean()),
      code: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const { sceneId, username, data } = args
    const ownerId = (await ctx.auth.getUserIdentity())?.subject
    if (!ownerId) throw new Error("Unauthorized")
    //---------------- Code length check ----------------//
    if ((data.code?.length ?? 0) > MAX_CODE_LENGTH) {
      throw new Error("Code too long")
    }
    //---------------- Name length check ----------------//
    if ((data.name?.length ?? 0) > MAX_NAME_LENGTH) {
      throw new Error("Name too long")
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
        views: 0,
        likes: 0,
      }
      const newSceneId = await ctx.db.insert("scenes", {
        ownerId,
        username,
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
        username,
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

const INDEX_BY_SCENES_SORT = {
  name: "by_ownerId_and_name",
  updatedAt: "by_ownerId_and_updatedAt",
  createdAt: "by_ownerId_and_createdAt",
  public: "by_ownerId_and_public",
  views: "by_ownerId_and_views",
  likes: "by_ownerId_and_likes",
} as const

const INDEX_BROWSE_SCENES_SORT = {
  name: "by_public_and_name",
  updatedAt: "by_public_and_updatedAt",
  createdAt: "by_public_and_createdAt",
  views: "by_public_and_views",
  likes: "by_public_and_likes",
} as const

const sortByValidator = v.union(
  v.literal("name"),
  v.literal("updatedAt"),
  v.literal("createdAt"),
  v.literal("public"),
  v.literal("views"),
  v.literal("likes")
)

const browseSortByValidator = v.union(
  v.literal("name"),
  v.literal("updatedAt"),
  v.literal("createdAt"),
  v.literal("views"),
  v.literal("likes")
)

export const listMyScenesPaginated = query({
  args: {
    sortBy: sortByValidator,
    sortDirection: v.union(v.literal("asc"), v.literal("desc")),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const { sortBy, sortDirection, paginationOpts } = args
    const ownerId = (await ctx.auth.getUserIdentity())?.subject
    if (!ownerId) throw new Error("Not authenticated")
    const indexName = INDEX_BY_SCENES_SORT[sortBy]
    const result = await ctx.db
      .query("scenes")
      .withIndex(indexName, (q) => q.eq("ownerId", ownerId))
      .order(sortDirection)
      .paginate(paginationOpts)
    return {
      ...result,
      page: await Promise.all(
        result.page.map(async (scene) => {
          const withThumbnail = await sceneWithThumbnailUrl(ctx, scene)
          return { ...withThumbnail, ownerId: undefined }
        })
      ),
    }
  },
})

export const listBrowseScenesPaginated = query({
  args: {
    sortBy: browseSortByValidator,
    search: v.optional(v.string()),
    sortDirection: v.union(v.literal("asc"), v.literal("desc")),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const { sortBy, search, sortDirection, paginationOpts } = args

    if (search) {
      const page = await ctx.db
        .query("scenes")
        .withSearchIndex("search_name", (q) =>
          q.search("name", search).eq("public", true)
        )
        .paginate(paginationOpts)

      return {
        ...page,
        page: await Promise.all(
          page.page.map(async (scene) => {
            const withThumbnail = await sceneWithThumbnailUrl(ctx, scene)
            return { ...withThumbnail, ownerId: undefined }
          })
        ),
      }
    }

    const indexName = INDEX_BROWSE_SCENES_SORT[sortBy]
    const page = await ctx.db
      .query("scenes")
      .withIndex(indexName, (q) => q.eq("public", true))
      .order(sortDirection)
      .paginate(paginationOpts)

    return {
      ...page,
      page: await Promise.all(
        page.page.map(async (scene) => {
          const withThumbnail = await sceneWithThumbnailUrl(ctx, scene)
          return { ...withThumbnail, ownerId: undefined }
        })
      ),
    }
  },
})

const WEEK_MS = 7 * 24 * 60 * 60 * 1000
const HOMEPAGE_RANK_COUNT = 5
const HOMEPAGE_WEEK_POOL_CAP = 3000

function compareScenesForHomeRanking<
  T extends {
    likes: number
    views: number
    updatedAt: number
  },
>(a: T, b: T) {
  if (b.likes !== a.likes) return b.likes - a.likes
  if (b.views !== a.views) return b.views - a.views
  return b.updatedAt - a.updatedAt
}

export const homeRankedPublicScenes = query({
  args: {},
  handler: async (ctx) => {
    const weekAgo = Date.now() - WEEK_MS

    const weekPool = await ctx.db
      .query("scenes")
      .withIndex("by_public_and_createdAt", (q) =>
        q.eq("public", true).gte("createdAt", weekAgo)
      )
      .take(HOMEPAGE_WEEK_POOL_CAP)

    if (weekPool.length < HOMEPAGE_RANK_COUNT) {
      const ranked = await ctx.db
        .query("scenes")
        .withIndex("by_public_and_likes_views_and_updatedAt", (q) =>
          q.eq("public", true)
        )
        .order("desc")
        .take(HOMEPAGE_RANK_COUNT)
      return {
        rankingSource: "allTime" as const,
        ranked: await Promise.all(
          ranked.map(async (s) => {
            const withThumbnail = await sceneWithThumbnailUrl(ctx, s)
            return { ...withThumbnail, ownerId: undefined }
          })
        ),
      }
    }

    const top = [...weekPool]
      .sort(compareScenesForHomeRanking)
      .slice(0, HOMEPAGE_RANK_COUNT)

    return {
      rankingSource: "lastWeek" as const,
      ranked: await Promise.all(
        top.map(async (s) => {
          const withThumbnail = await sceneWithThumbnailUrl(ctx, s)
          return { ...withThumbnail, ownerId: undefined }
        })
      ),
    }
  },
})

export const deleteScene = mutation({
  args: {
    sceneId: v.id("scenes"),
  },
  handler: async (ctx, args) => {
    const { sceneId } = args
    const ownerId = (await ctx.auth.getUserIdentity())?.subject
    if (!ownerId) throw new Error("Not authenticated")
    const scene = await ctx.db.get(sceneId)
    if (!scene || scene.ownerId !== ownerId) {
      throw new Error("Scene not found")
    }
    const likes = await ctx.db
      .query("userSceneLikes")
      .withIndex("by_sceneId", (q) => q.eq("sceneId", sceneId))
      .collect()
    for (const like of likes) {
      await ctx.db.delete(like._id)
    }
    const codes = await ctx.db
      .query("codes")
      .withIndex("by_sceneId", (q) => q.eq("sceneId", sceneId))
      .collect()
    for (const code of codes) {
      await ctx.db.delete(code._id)
    }
    if (scene.thumbnailStorageId) {
      await ctx.storage.delete(scene.thumbnailStorageId)
    }
    await ctx.db.delete(sceneId)
    return sceneId
  },
})

export const getScene = query({
  args: {
    sceneId: v.id("scenes"),
  },
  handler: async (ctx, args) => {
    const { sceneId } = args
    const ownerId = (await ctx.auth.getUserIdentity())?.subject
    const scene = await ctx.db.get("scenes", sceneId)
    const isPublic = scene?.public ?? false
    const requesterIsOwner = scene?.ownerId === ownerId
    if (scene && isPublic && !requesterIsOwner) {
      const withThumbnail = await sceneWithThumbnailUrl(ctx, scene)
      return {
        ...withThumbnail,
        ownerId: undefined,
        readOnly: true,
      }
    }
    if (!scene || (!isPublic && !requesterIsOwner)) {
      throw new Error("Scene not found")
    }
    const withThumbnail = await sceneWithThumbnailUrl(ctx, scene)
    return {
      ...withThumbnail,
      ownerId: undefined,
      readOnly: false,
    }
  },
})

export const getUserPublicScenes = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const { username } = args
    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", username))
      .first()
    if (!user) {
      throw new Error("User not found")
    }
    const clerkId = user.clerkId
    const scenes = await ctx.db
      .query("scenes")
      .withIndex("by_ownerId_and_public", (q) =>
        q.eq("ownerId", clerkId).eq("public", true)
      )
      .collect()
    return (
      await Promise.all(
        scenes.map(async (scene) => {
          const withThumbnail = await sceneWithThumbnailUrl(ctx, scene)
          return { ...withThumbnail, ownerId: undefined }
        })
      )
    ).reverse()
  },
})

export const incrementSceneViews = mutation({
  args: { sceneId: v.id("scenes") },
  handler: async (ctx, args) => {
    const { sceneId } = args

    const scene = await ctx.db.get(sceneId)

    if (!scene) {
      throw new Error("Scene not found")
    }

    if (scene.public) {
      await ctx.db.patch(sceneId, {
        views: scene.views + 1,
      })
    }
  },
})

export const toggleLikeScene = mutation({
  args: { sceneId: v.id("scenes") },
  handler: async (ctx, args) => {
    const { sceneId } = args
    const userId = (await ctx.auth.getUserIdentity())?.subject

    if (!userId) {
      return false
    }

    const scene = await ctx.db.get(sceneId)
    if (!scene) {
      throw new Error("Scene not found")
    }

    const existingLike = await ctx.db
      .query("userSceneLikes")
      .withIndex("by_userId_and_sceneId", (q) =>
        q.eq("userId", userId).eq("sceneId", sceneId)
      )
      .unique()

    const currentCount = scene.likes

    if (existingLike) {
      await ctx.db.delete(existingLike._id)
      await ctx.db.patch(sceneId, {
        likes: Math.max(0, currentCount - 1),
      })
      return false
    } else {
      await ctx.db.insert("userSceneLikes", { userId, sceneId })
      await ctx.db.patch(sceneId, { likes: currentCount + 1 })
      return true
    }
  },
})

export const getUserLikedScene = query({
  args: { sceneId: v.id("scenes") },
  handler: async (ctx, args) => {
    const { sceneId } = args
    const userId = (await ctx.auth.getUserIdentity())?.subject
    if (!userId) return false
    const existingLike = await ctx.db
      .query("userSceneLikes")
      .withIndex("by_userId_and_sceneId", (q) =>
        q.eq("userId", userId).eq("sceneId", sceneId)
      )
      .unique()
    return !!existingLike
  },
})

export const generateThumbnailUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    if (!(await ctx.auth.getUserIdentity())) {
      throw new Error("Not authenticated")
    }
    return await ctx.storage.generateUploadUrl()
  },
})

export const updateSceneThumbnail = mutation({
  args: {
    sceneId: v.id("scenes"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const { sceneId, storageId } = args
    const ownerId = (await ctx.auth.getUserIdentity())?.subject
    if (!ownerId) throw new Error("Not authenticated")
    const scene = await ctx.db.get(sceneId)
    if (!scene || scene.ownerId !== ownerId) {
      throw new Error("Scene not found")
    }
    const previousStorageId = scene.thumbnailStorageId
    await ctx.db.patch(sceneId, {
      thumbnailStorageId: storageId,
      updatedAt: Date.now(),
    })
    if (previousStorageId) {
      await ctx.storage.delete(previousStorageId)
    }
    return storageId
  },
})
