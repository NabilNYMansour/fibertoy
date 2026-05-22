import { Loader2 } from "lucide-react"

const BasicLoader = () => {
  return (
    <div className="flex h-full w-full flex-1 items-center justify-center">
      <Loader2 className="animate-spin" />
    </div>
  )
}

export default BasicLoader
