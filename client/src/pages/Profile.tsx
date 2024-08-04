import React, { useState } from "react"
import User from "../components/User"
import { FaSearch } from "react-icons/fa"

const Profile: React.FC = () => {
  // Define an array of user data
  const users = Array.from({ length: 56 }, (_, index) => ({
    profilePic: "https://example.com/profile-pic.jpg", // Replace with the actual URL of the profile picture
    name: `User ${index + 1}`, // Generate a unique name for each user
    userId: `ID${index + 1}`, // Generate a unique user ID for each user
  }))

  // State for the search input
  const [searchQuery, setSearchQuery] = useState("")

  // Filter users based on search input
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex flex-col items-center p-4">
      {/* Search input */}
      <div className="relative w-full max-w-md mb-4 mt-20">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 pl-10 border rounded-lg bg-zinc-950 text-white focus:border-blue-500 focus:border-2 focus:outline-none"
        />
        <FaSearch className="absolute top-2 left-3 text-gray-300 text-2xl" />
      </div>
      {/* Grid of users */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-8 lg:gap-10 mt-5 no-scrollbar">
        {filteredUsers.map((user, index) => (
          <User
            key={index} // Use the index as a unique key for each user
            profilePic={user.profilePic}
            name={user.name}
            userId={user.userId}
          />
        ))}
      </div>
    </div>
  )
}

export default Profile
