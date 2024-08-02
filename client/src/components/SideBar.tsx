import React, { useState } from "react"
import {
  FaHome,
  FaCompass,
  FaUsers,
  FaShoppingCart,
  FaClipboardList,
  FaBars,
  FaTimes,
} from "react-icons/fa"
import { NavLink } from "react-router-dom"

const user = {
  username: "John Doe",
  profilePic: "https://via.placeholder.com/40",
  userId: "12345",
}

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(true)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div
      className={`fixed h-screen ${isOpen ? "sm:w-64 w-52" : "w-0"} bg-zinc-950 text-white gap-4 flex flex-col transition-all duration-300 z-50`}
    >
      <div className="flex flex-col flex-grow">
        {/* Header with profile */}
        <div
          className={`p-2 text-2xl font-semibold flex flex-col items-center ${!isOpen && "hidden"}`}
        >
          <NavLink
            to={`/profile/${user.userId}`}
            className="flex items-center space-x-2 mt-8"
          >
            <img
              src={user.profilePic}
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <div className="text-lg text-wrap">{user.username}</div>
              <div className="text-sm text-gray-700">@{user.userId}</div>
            </div>
          </NavLink>
          <button
            onClick={toggleSidebar}
            className="text-lg mt-9 ml-1 absolute top-4 right-4 "
          >
            <FaTimes />
          </button>
        </div>
        {/* Navigation links */}
        <div
          className={`flex flex-col space-y-4 gap-8 p-4 ${!isOpen && "hidden"}`}
        >
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "flex items-center space-x-2 p-2 bg-blue-500 rounded-md"
                : "flex items-center space-x-2 p-2 hover:bg-blue-500 rounded-md"
            }
          >
            <FaHome className="text-xl" />
            <span>Home</span>
          </NavLink>
          <NavLink
            to="/explore"
            className={({ isActive }) =>
              isActive
                ? "flex items-center space-x-2 p-2 bg-blue-500 rounded-md"
                : "flex items-center space-x-2 p-2 hover:bg-blue-500 rounded-md"
            }
          >
            <FaCompass className="text-xl" />
            <span>Explore</span>
          </NavLink>
          <NavLink
            to="/people"
            className={({ isActive }) =>
              isActive
                ? "flex items-center space-x-2 p-2 bg-blue-500 rounded-md"
                : "flex items-center space-x-2 p-2 hover:bg-blue-500 rounded-md"
            }
          >
            <FaUsers className="text-xl" />
            <span>People</span>
          </NavLink>
          <NavLink
            to="/shop"
            className={({ isActive }) =>
              isActive
                ? "flex items-center space-x-2 p-2 bg-blue-500 rounded-md"
                : "flex items-center space-x-2 p-2 hover:bg-blue-500 rounded-md"
            }
          >
            <FaShoppingCart className="text-xl" />
            <span>Shop</span>
          </NavLink>
          <NavLink
            to="/create"
            className={({ isActive }) =>
              isActive
                ? "flex items-center space-x-2 p-2 bg-blue-500 rounded-md"
                : "flex items-center space-x-2 p-2 hover:bg-blue-500 rounded-md"
            }
          >
            <FaClipboardList className="text-xl" />
            <span>Create Post</span>
          </NavLink>
        </div>
      </div>
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="text-2xl p-2 bg-black text-white fixed top-4 left-4 z-50"
        >
          <FaBars />
        </button>
      )}
    </div>
  )
}

export default SideBar
