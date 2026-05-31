import { fetchMutation } from "convex/nextjs"
import { api } from "@/convex/_generated/api"

export async function POST(req: Request) {
  const body = await req.json()

  const { type, data } = body

  try {
    if (type === "user.created") {
      const { id: userId, username } = data
      await fetchMutation(api.users.createUser, {
        userId,
        username,
      })
    } else if (type === "user.updated") {
      const { username, id: userId } = data
      await fetchMutation(api.users.unprotectedUpdateUserUsername, {
        userId,
        username,
      })
    } else if (type === "user.deleted") {
      const { id: userId } = data
      await fetchMutation(api.users.unprotectedDeleteUser, { userId })
    }
  } catch (error) {
    console.error(error)
    return new Response(null, { status: 500 })
  }

  return new Response(null, { status: 200 })
}
