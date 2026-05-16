"use client"

import { useClerk, useUser } from "@clerk/nextjs"
import { useEffect } from "react"

export default function Page() {
  const { isSignedIn } = useUser()
  const { signOut } = useClerk()

  useEffect(() => {
    if (isSignedIn) signOut()
  }, [isSignedIn, signOut])

  return null
}
