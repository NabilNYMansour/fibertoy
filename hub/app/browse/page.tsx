import { BrowseScenes } from "./_components/browse-scenes"
import ErrorRedirect from "@/layout/error/error-redirect"

export default function Page() {
  return (
    <ErrorRedirect>
      <BrowseScenes />
    </ErrorRedirect>
  )
}
