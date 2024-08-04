import React from "react"

interface UserProps {
  profilePic?: string
  name?: string
  userId?: string
}
//need to make it a navlink for future navigation to the profile
const User: React.FC<UserProps> = ({ profilePic, name, userId }) => {
  return (
    <div className="flex items-center p-2 sm:p-4 w-56 lg:w-64 bg-zinc-950 rounded-lg shadow-lg border-white border">
      {/* Profile Picture */}
      <img
        src={profilePic}
        alt="Profile"
        className="sm:w-16 sm:h-16 w-12 h-12 rounded-full border-2 border-gray-600"
      />
      <div className="ml-2 sm:ml-4 text-white">
        {/* Name */}
        <h2 className="text-lg sm:text-xl font-semibold">{name}</h2>
        {/* User ID */}
        <p className="text-gray-400 text-sm">@{userId}</p>
      </div>
    </div>
  )
}

export default User
