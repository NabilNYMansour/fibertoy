"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

const SearchBar = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const currentSearch = searchParams.get("q") ?? ""
  const [search, setSearch] = useState(currentSearch)

  const route = `/browse?q=${search}`

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      router.push(route)
    }
  }

  return (
    <div className="flex items-center">
      <Input
        className="h-7"
        value={search}
        onChange={handleOnChange}
        onKeyDown={handleOnKeyDown}
        placeholder="Search"
      />
      <Link href={route}>
        <Button variant="outline" size="icon-sm" className="border-l-0">
          <Search className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  )
}

export default SearchBar
