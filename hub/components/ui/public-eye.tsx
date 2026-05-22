import { Eye, EyeOff } from "lucide-react"

const PublicEye = ({ isPublic }: { isPublic: boolean }) => {
  return isPublic ? (
    <Eye className="h-4 w-4 text-green-500" />
  ) : (
    <EyeOff className="h-4 w-4 text-red-500" />
  )
}

export default PublicEye
