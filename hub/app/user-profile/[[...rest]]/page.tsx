import { UserProfile } from "@clerk/nextjs"

const UserProfilePage = () => {
  return (
    <div className="m-4 flex flex-1 justify-center">
      <UserProfile />
    </div>
  )
}

export default UserProfilePage
