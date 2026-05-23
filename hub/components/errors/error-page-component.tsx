import { Button } from "@/components/ui/button"
import Link from "next/link"

const ErrorPageComponent = () => {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl">Error</h1>
        <p>An error occurred</p>
        <p className="text-sm">Sorry about that (´;︵;`)</p>
        <Link href="/">
          <Button>Go back Home</Button>
        </Link>
      </div>
    </div>
  )
}

export default ErrorPageComponent
