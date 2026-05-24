"use client"

import { Button } from "@/components/ui/button"

export function LoadMoreFooter({
  visible,
  isLoadingMore,
  canLoadMore,
  queryIsLoading,
  onLoadMore,
}: {
  visible: boolean
  isLoadingMore: boolean
  canLoadMore: boolean
  queryIsLoading: boolean
  onLoadMore: () => void
}) {
  if (!visible) return null

  return (
    <div className="flex justify-center pt-2">
      <Button
        type="button"
        variant="outline"
        onClick={onLoadMore}
        disabled={queryIsLoading || !canLoadMore}
      >
        {isLoadingMore ? "Loading…" : "Load more"}
      </Button>
    </div>
  )
}
