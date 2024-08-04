import React from "react"
import { NavLink } from "react-router-dom"
import { FaUserCircle, FaUserPlus } from "react-icons/fa"

// Dummy user data for demonstration purposes
const user = {
  username: "John Doe",
  profilePic: "https://via.placeholder.com/40",
  userId: "john_doe",
}

const TopBar = () => {
  return (
    <div
      className="w-full h-16 bg-zinc-950 shadow-sm text-white flex items-center
     justify-between px-4 shadow-white fixed top-0 z-40"
    >
      {/* Profile section */}
      <div className="ml-12 hidden sm:block">
        <NavLink
          to={`/profile/${user.userId}`}
          className="flex items-center space-x-2"
        >
          <img
            src={user.profilePic}
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <div className="text-md font-semibold">{user.username}</div>
            <div className="text-sm text-gray-400">@{user.userId}</div>
          </div>
        </NavLink>
      </div>
      <div>
        {" "}
        <span className="dancing-script-500 text-gradient font-bold text-xl sm:text-4xl ml-14 sm:ml-0">
          Enigma
        </span>
      </div>
      {/* Connect button */}
      <button className="bg-blue-600 text-white py-2 px-4 rounded-md flex items-center space-x-2 hover:bg-blue-700">
        <FaUserPlus className="text-lg" />
        <span>Connect</span>
      </button>
    </div>
  )
}

export default TopBar
