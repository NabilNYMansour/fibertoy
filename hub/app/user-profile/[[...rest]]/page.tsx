"use client"

import { Show, UserProfile, useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const UserProfilePage = () => {
  const { isSignedIn } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isSignedIn === false) {
      router.push("/")
    }
  }, [isSignedIn, router])

  return (
    <div className="m-4 flex flex-1 justify-center">
      <Show when="signed-in">
        <UserProfile />
      </Show>
    </div>
  )
}

export default UserProfilePage
