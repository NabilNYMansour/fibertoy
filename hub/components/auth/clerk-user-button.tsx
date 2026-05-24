"use client"

import { UserButton } from "@clerk/nextjs"
import { Files } from "lucide-react"

const ClerkUserButton = () => {
  return (
    <UserButton userProfileMode="navigation" userProfileUrl="/user-profile">
      <UserButton.MenuItems>
        <UserButton.Link
          label="My Scenes"
          labelIcon={<Files className="h-4 w-4" />}
          href="/my-scenes"
        />
      </UserButton.MenuItems>
    </UserButton>
  )
}

export default ClerkUserButton
