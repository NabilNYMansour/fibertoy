"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { SignIn, SignUp } from "@clerk/nextjs"
import dynamic from "next/dynamic"
import { Suspense } from "react"
import BasicLoader from "../loaders/basic-loader"

const DEFAULT_REDIRECT_URL = "/"

const SignInOrSignUp = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const onSignIn = pathname === "/sign-in"

  const redirectUrl = searchParams.get("redirectUrl") || DEFAULT_REDIRECT_URL

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
      {onSignIn ? (
        <SignIn signUpUrl={"/sign-up"} forceRedirectUrl={redirectUrl} />
      ) : (
        <SignUp signInUrl={"/sign-in"} forceRedirectUrl={redirectUrl} />
      )}
    </div>
  )
}

export default dynamic(
  () =>
    Promise.resolve(() => (
      <Suspense fallback={<BasicLoader />}>
        <SignInOrSignUp />
      </Suspense>
    )),
  { ssr: false, loading: () => <BasicLoader /> }
)
