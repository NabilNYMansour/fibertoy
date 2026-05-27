import { BrowseScenes } from "./_components/browse-scenes"
import ErrorRedirect from "@/components/layout/error/error-redirect"

export default function Page() {
  return (
    <ErrorRedirect>
      <BrowseScenes />
    </ErrorRedirect>
  )
}
