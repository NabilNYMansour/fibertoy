import { verifyWebhook } from "@clerk/backend/webhooks"
import { fetchMutation } from "convex/nextjs"
import { api } from "@/convex/_generated/api"

export async function POST(req: Request) {
  let evt
  try {
    evt = await verifyWebhook(req, {
      signingSecret: process.env.CLERK_WEBHOOK_SIGNING_SECRET,
    })
  } catch (error) {
    console.error("Webhook verification failed:", error)
    return new Response("Webhook verification failed", { status: 400 })
  }

  const { type, data } = evt

  if (!type || !data || !data.id) {
    return new Response("Invalid webhook event", { status: 400 })
  }

  if (!process.env.FIBERTOY_WEBHOOK_SECRET) {
    return new Response("Secret not set", { status: 500 })
  }

  try {
    if (type === "user.created") {
      const { id: userId, username } = data
      if (!username) {
        throw new Error("Invalid webhook event")
      }
      await fetchMutation(api.users.createUser, {
        userId,
        username,
        secret: process.env.FIBERTOY_WEBHOOK_SECRET,
      })
    } else if (type === "user.updated") {
      const { username, id: userId } = data
      if (!username) {
        throw new Error("Invalid webhook event")
      }
      await fetchMutation(api.users.updateUserUsername, {
        userId,
        username,
        secret: process.env.FIBERTOY_WEBHOOK_SECRET,
      })
    } else if (type === "user.deleted") {
      const { id: userId } = data
      await fetchMutation(api.users.deleteUser, {
        userId,
        secret: process.env.FIBERTOY_WEBHOOK_SECRET,
      })
    }
  } catch (error) {
    console.error(error)
    return new Response(null, { status: 500 })
  }

  return new Response(null, { status: 200 })
}
