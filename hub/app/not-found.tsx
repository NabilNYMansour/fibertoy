import { Button } from "@/components/ui/button"
import Link from "next/link"

const NotFound = () => {
  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center gap-4">
      <div>404 Not Found ¯\_(ツ)_/¯</div>
      <div>
        <Link href="/">
          <Button>Go Home</Button>
        </Link>
      </div>
    </div>
  )
}

export default NotFound
