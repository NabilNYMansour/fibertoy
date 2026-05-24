import { Button } from "@/components/ui/button"

const NotFound = () => {
  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center gap-4">
      <div>404 Not Found ¯\_(ツ)_/¯</div>
      <div>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/">
          <Button>Go Home</Button>
        </a>
      </div>
    </div>
  )
}

export default NotFound
