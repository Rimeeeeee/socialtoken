import React, { useState } from "react"
import { AiOutlineUser, AiOutlineTeam } from "react-icons/ai"
import { useNavigate } from "react-router-dom"
import { FaTimes } from "react-icons/fa" // Importing the close icon
import Post from "../components/Post"

const ViewProfile = () => {
  const navigate = useNavigate()
  const posts = Array(48).fill(null) // Example post data

  const [isVisible, setIsVisible] = useState(false)
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null)

  const handlePostClick = (index: number) => {
    setSelectedPostId(index) // Set the selected post ID
    setIsVisible(true) // Show the modal
  }

  const handleClose = () => {
    setIsVisible(false) // Hide the modal
    setSelectedPostId(null) // Clear the selected post ID
  }

  return (
    <div className="p-4 w-full h-full max-w-screen-lg mx-auto">
      <div className="lg:mt-4 p-4">
        <div className="flex items-center justify-center md:space-x-2 space-x-1 mt-10">
          <img
            src="https://via.placeholder.com/150"
            alt="img"
            className="h-16 w-16 mt-2 rounded-full border-2 border-white"
          />
          <div className="flex flex-col space-y-2">
            <h1 className="text-xl md:text-2xl font-bold ml-5 mt-8">
              John Doe
            </h1>
            <p className="text-gray-400 ml-5">@johndoe</p>
            <p className="text-gray-200">
              This is the bio of the user. It can be a few lines long.
            </p>
          </div>
        </div>
        <div className="flex space-x-8 mt-4 items-center justify-center">
          <div className="flex items-center space-x-1">
            <AiOutlineUser className="text-lg" />
            <span className="font-bold">100</span>
            <span className="text-gray-600">Followers</span>
          </div>
          <div className="flex items-center space-x-1">
            <AiOutlineTeam className="text-lg" />
            <span className="font-bold">150</span>
            <span className="text-gray-600">Following</span>
          </div>
        </div>
      </div>
      <div className="border-t-2 border-white w-full"></div>
      <div className="mt-8 overflow-y-auto max-h-[500px] p-6 no-scrollbar">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {posts.map((_, index) => (
            <div
              key={index}
              className="bg-blue-600 h-40 flex items-center justify-center cursor-pointer"
              onClick={() => handlePostClick(index)}
            >
              <p>Post {index + 1}</p>
            </div>
          ))}
        </div>
      </div>
      {isVisible && selectedPostId !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-blaxk-800 bg-opacity-50 z-50">
          <div className="bg-black p-4 rounded relative w-[430px]">
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 text-white hover:text-gray-800"
            >
              <FaTimes size={20} />
            </button>
            <Post pid={selectedPostId} />
            {selectedPostId}
          </div>
        </div>
      )}
    </div>
  )
}

export default ViewProfile
