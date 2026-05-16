"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function RedirectToSignUp() {
  const router = useRouter()

  useEffect(() => {
    router.push("/sign-up")
  }, [router])

  return null
}
