import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ClerkLoaded, ClerkLoading, Show, UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { Separator } from "./ui/separator"
import { Plus } from "lucide-react"

const Header = () => {
  return (
    <header className="flex items-center justify-between border-b px-2 py-1">
      {/*==========={Title}===========*/}
      <Link href="/" className="text-2xl font-semibold">
        FiberToy
      </Link>
      <div className="flex gap-2">
        {/*==========={Sign in/up and Clerk button}===========*/}
        <div className="flex gap-2">
          <Show when="signed-in">
            <ClerkLoading>
              <Skeleton className="h-7 w-7 rounded-full" />
            </ClerkLoading>
            <ClerkLoaded>
              <div className="h-7 w-7">
                <UserButton />
              </div>
            </ClerkLoaded>
          </Show>

          <Show when="signed-out">
            <div className="flex gap-2">
              <Link href={"/sign-in"}>
                <Button size="sm" variant="outline" className="w-full">
                  Sign In
                </Button>
              </Link>

              <Link href={"/sign-up"}>
                <Button size="sm" className="w-full">
                  Sign up
                </Button>
              </Link>
            </div>
          </Show>
        </div>

        <Separator orientation="vertical" />

        {/*==========={New/Browse}===========*/}
        <Link href={"/new"}>
          <Button size="sm" variant="secondary">
            <Plus />
            New
          </Button>
        </Link>
        <Link href={"/browse"}>
          <Button size="sm" variant="secondary">
            Browse
          </Button>
        </Link>
      </div>
    </header>
  )
}

export default Header
