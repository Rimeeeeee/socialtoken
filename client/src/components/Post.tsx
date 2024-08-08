import React, { useEffect, useState } from "react"
import { FaHeart, FaShareAlt } from "react-icons/fa"
import { readContract } from "thirdweb"
import { useSocialTokenContext } from "../context/context"
import { download } from "thirdweb/storage"
interface PostData {
  pid: bigint
  creator: string
  image_hash: string
  title: string
  description: string
  videos: string
  likes: bigint
  shares: bigint
  tags: string
}

interface NumberProps {
  pid?: number
}

const Post: React.FC<NumberProps> = ({ pid }) => {
  const [likes, setLikes] = useState<number>(0)
  const [shares, setShares] = useState<number>(0)
  const [imageUrl, setImageUrl] = useState<string>("")
  const [caption, setCaption] = useState<string>("")
  const [copied, setCopied] = useState<boolean>(false)
  const [title, setTitle] = useState("")
  const [tags, setTags] = useState("")
  const [creator, setCreator] = useState("")
  const [userName, setUserName] = useState("")
  const { SocialContract, client } = useSocialTokenContext()

  useEffect(() => {
    const getPost = async () => {
      if (pid) {
        try {
          const data: PostData = await readContract({
            contract: SocialContract,
            method:
              "function viewPostByPid(uint256 _pid) view returns ((uint256 pid, address creator, string image_hash, string title, string description, string videos, uint256 likes, uint256 shares, string tags))",
            params: [BigInt(pid)],
          })
          console.log(data)
          const ipfsHash = data.image_hash
          setCaption(data.description) // Assuming description is used as the caption
          setLikes(Number(data.likes))
          setShares(Number(data.shares))
          setTitle(data.title)
          setTags(data.tags)
          setCreator(data.creator)

          // Use thirdweb's download function to get the file from IPFS
          const response = await download({
            client,
            uri: `${ipfsHash}`, // Using the IPFS URI format
          })

          // Convert the response to a Blob
          const fileBlob = await response.blob()
          const fileUrl = URL.createObjectURL(fileBlob)
          setImageUrl(fileUrl)
        } catch (error) {
          console.error("Error fetching post data:", error)
        }
      }
    }
    getPost()
  }, [pid, SocialContract, client])
  useEffect(() => {
    const getUser = async () => {
      const data = await readContract({
        contract: SocialContract,
        method:
          "function getUserById(address _user) view returns ((uint256 uid, address userid, string name, string bio, string image_hash, string caption, uint256 dailylikes, uint256 dailyshares, uint256 dailycheckin, uint256[] dailycheckins, uint256[] dailylikestamp, uint256[] dailysharestamp, uint256[] pid, address[] followers, address[] following, (uint256 pid, address creator, string image_hash, string title, string description, string videos, uint256 likes, uint256 shares, string tags)[] content, uint256 token))",
        params: [creator],
      })
      console.log(data.name)
      setUserName(data.name)
      console.log(data.name)
    }
    getUser()
    return () => {}
  }, [])
  const handleLike = () => {
    setLikes(likes + 1)
  }

  const handleCopy = () => {
    const copyText = `${pid}`
    navigator.clipboard.writeText(copyText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000) // Reset copied state after 2 seconds
  }

  return (
    <div className="relative mt-8 sm:min-w-96 min-w-56 min-h-[65vh] mx-auto p-4 bg-zinc-950 border-white border-2 rounded-lg shadow-md">
      <h1 className="text-white font-bold text-xl">{userName}</h1>
      <h3>{creator.slice(0, 4) + "...." + creator.slice(30, 40)}</h3>
      <h1 className="text-white font-bold p-1  border-b-2 border-t-2S border-white">
        {title}
      </h1>
      <div className="post-content max-h-[85vh] p-2">
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Post content"
            className="rounded-lg max-h-[50vh] object-cover"
          />
        )}
        <h2 className="text-xl font-semibold mt-2 text-wrap">{caption}</h2>
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
          <span>{copied ? "Copied!" : ""}</span>
          <div className="text-blue-500">{shares}</div>
        </button>
      </div>
      <div className="text-purple-600">#{tags.split(",").join("  #")}</div>
    </div>
  )
}

export default Post
