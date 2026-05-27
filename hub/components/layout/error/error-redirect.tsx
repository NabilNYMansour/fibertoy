import { redirect } from "next/navigation"
import { ErrorBoundary } from "react-error-boundary"

const Redirect = () => {
  redirect("/error")
}

export default function ErrorRedirect({
  children,
}: {
  children: React.ReactNode
}) {
  return <ErrorBoundary fallback={<Redirect />}>{children}</ErrorBoundary>
}
