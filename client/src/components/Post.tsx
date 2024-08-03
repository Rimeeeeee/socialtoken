import React, { useState } from "react"
import { FaHeart, FaShareAlt, FaRegComment } from "react-icons/fa"
import Vanta from "./Vanta"

interface MockPostData {
  fileHash: string
  caption: string
}

interface Comment {
  username: string
  profilePic: string
  text: string
}

const mockPostData: MockPostData = {
  fileHash: "QmT78zSuB4zzn3o9nR7p9vZgxJZxT4jswRdFw9NzjwSJE3", // Replace with a real IPFS hash or a sample image hash
  caption: "Look what Vanta Js is capable of...its just amazing",
}

const Post: React.FC = () => {
  const [likes, setLikes] = useState<number>(0)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState<string>("")
  const [copied, setCopied] = useState<boolean>(false)
  const [showComments, setShowComments] = useState<boolean>(false)

  const handleLike = () => {
    setLikes(likes + 1)
  }

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment(event.target.value)
  }

  const handleCommentSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const newCommentData: Comment = {
      username: "user123",
      profilePic: "https://via.placeholder.com/40", // Replace with real profile picture URL
      text: newComment,
    }
    setComments([...comments, newCommentData])
    setNewComment("")
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(mockPostData.fileHash)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000) // Reset copied state after 2 seconds
  }

  const toggleComments = () => {
    setShowComments(!showComments)
  }

  return (
    <div className="relative mt-8 sm:min-w-96 min-w-56  min-h-[65vh] mx-auto p-4 bg-zinc-950 border-white border-2 rounded-lg shadow-md">
      <div className="post-content max-h-[85vh] ">
        {/* <img
          //src={`https://ipfs.io/ipfs/${mockPostData.fileHash}`}
          alt="Post content"
        /> */}
        <Vanta />
        <h2 className="text-xl font-semibold mt-2 text-wrap">
          {mockPostData.caption}
        </h2>
      </div>
      <div className="post-actions flex space-x-4 mt-4 justify-between">
        <button
          onClick={handleLike}
          className="flex items-center flex-col space-x-1 text-blue-500 hover:text-red-500"
        >
          <FaHeart className="ml-1" />
          <span>{likes}</span>
        </button>
        <button
          onClick={handleCopy}
          className="flex flex-col items-center space-x-1 text-blue-500 hover:text-blue-700"
        >
          <FaShareAlt />
          <span>{copied ? "Copied!" : "Share"}</span>
        </button>
      </div>
    </div>
  )
}

export default Post
