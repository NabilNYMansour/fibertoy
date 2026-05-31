import { fetchMutation } from "convex/nextjs"
import { api } from "@/convex/_generated/api"

export async function POST(req: Request) {
  const body = await req.json()

  const { type, data } = body

  if (type === "user.updated") {
    const { username, id: userId } = data
    try {
      await fetchMutation(api.users.unprotectedUpdateUserUsername, {
        userId,
        username,
      })
    } catch (error) {
      console.error(error)
      return new Response(null, { status: 500 })
    }
  } else if (type === "user.deleted") {
    const { id: userId } = data
    try {
      await fetchMutation(api.users.unprotectedDeleteUser, { userId })
    } catch (error) {
      console.error(error)
      return new Response(null, { status: 500 })
    }
  }

  return new Response(null, { status: 200 })
}
