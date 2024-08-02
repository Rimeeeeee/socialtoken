import React from "react"
import { useParams } from "react-router-dom"

const CurrentProfile = () => {
  const { userId } = useParams()

  // Fetch user data based on userId or use dummy data for now
  const user = {
    username: "John Doe",
    profilePic: "https://via.placeholder.com/150",
    userId: userId,
    bio: "This is the user's bio",
  }

  return (
    <div className="p-4">
      <div className="flex items-center space-x-4">
        <img
          src={user.profilePic}
          alt="Profile"
          className="w-20 h-20 rounded-full"
        />
        <div>
          <div className="text-2xl">{user.username}</div>
          <div className="text-gray-700">@{user.userId}</div>
        </div>
      </div>
      <div className="mt-4">
        <p>{user.bio}</p>
      </div>
    </div>
  )
}

export default CurrentProfile
