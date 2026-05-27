import ErrorRedirect from "@/components/layout/error/error-redirect"

import { ScenesTable } from "./_components/scenes-table"

export default function Page() {
  return (
    <ErrorRedirect>
      <ScenesTable />
    </ErrorRedirect>
  )
}
