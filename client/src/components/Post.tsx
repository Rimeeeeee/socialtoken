import React, { ChangeEvent, useEffect, useState } from "react"
import { FaHeart, FaShareAlt } from "react-icons/fa"
import { FaGift } from "react-icons/fa"
import { prepareContractCall, readContract, sendTransaction } from "thirdweb"
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
  name?: string
}

const Post: React.FC<NumberProps> = ({ pid, name }) => {
  const [likes, setLikes] = useState<number>(0)
  const [shares, setShares] = useState<number>(0)
  const [imageUrl, setImageUrl] = useState<string>("")
  const [caption, setCaption] = useState<string>("")
  const [copied, setCopied] = useState<boolean>(false)
  const [title, setTitle] = useState("")
  const [tags, setTags] = useState("")
  const [creator, setCreator] = useState("")
  const [userName, setUserName] = useState("")
  const [profilePic, setProfilePic] = useState("")
  const [amount, setAmount] = useState(0)
  const { SocialContract, client, account, ICSContract } =
    useSocialTokenContext()

  useEffect(() => {
    const getPost = async () => {
      if (pid) {
        try {
          const result: readonly [
            bigint,
            string,
            string,
            string,
            string,
            string,
            bigint,
            bigint,
            string,
          ] = await readContract({
            contract: SocialContract,
            method:
              "function posts(uint256) view returns (uint256 pid, address creator, string image_hash, string title, string description, string videos, uint256 likes, uint256 shares, string tags)",
            params: [BigInt(pid)],
          })
          console.log(result)
          // Destructure the result tuple and assign to a PostData object
          const data: PostData = {
            pid: result[0],
            creator: result[1],
            image_hash: result[2],
            title: result[3],
            description: result[4],
            videos: result[5],
            likes: result[6],
            shares: result[7],
            tags: result[8],
          }

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
      try {
        // Fetch user data from the contract
        const data = await readContract({
          contract: SocialContract,
          method:
            "function getUserById(address _user) view returns ((uint256 uid, address userid, string name, string bio, string image_hash, string caption, uint256 dailylikes, uint256 dailyshares, uint256 dailycheckin, uint256[] dailycheckins, uint256[] dailylikestamp, uint256[] dailysharestamp, uint256[] pid, address[] followers, address[] following, (uint256 pid, address creator, string image_hash, string title, string description, string videos, uint256 likes, uint256 shares, string tags)[] content, uint256 token))",
          params: [creator],
        })

        console.log("Contract Data:", data) // Debugging: Log the entire response

        // Ensure data is structured as expected
        if (data && data.name) {
          console.log("User Name:", data.name) // Debugging: Log the name to verify it's there
          setUserName(data.name)
        } else {
          console.warn("No name found in the data.")
        }

        // Check if image_hash exists
        if (data.image_hash) {
          // Fetch the profile picture from IPFS
          const response = await download({
            client,
            uri: `${data.image_hash}`, // Ensure IPFS URI format
          })

          // Convert the response to a Blob and create a URL for the image
          const fileBlob = await response.blob()
          const fileUrl = URL.createObjectURL(fileBlob)
          setProfilePic(fileUrl)
        } else {
          console.warn("No image hash found for the user.")
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }

    if (creator && SocialContract) {
      getUser()
    } else {
      // console.warn("Missing dependencies: creator or SocialContract")
    }
  }, [SocialContract, client, creator, name])

  const handleLike = async () => {
    if (pid) {
      const transaction = await prepareContractCall({
        contract: SocialContract,
        method: "function giveLike(uint256 _pid)",
        params: [BigInt(pid)],
      })
      const { transactionHash } = await sendTransaction({
        transaction,
        account,
      })
    }
  }

  const handleShare = async () => {
    const copyText = `${pid}`
    navigator.clipboard.writeText(copyText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    if (pid) {
      const transaction = await prepareContractCall({
        contract: SocialContract,
        method: "function share(uint256 _pid)",
        params: [BigInt(pid)],
      })
      const { transactionHash } = await sendTransaction({
        transaction,
        account,
      })
    } // Reset copied state after 2 seconds
  }
  const approve = async () => {
    const spender = import.meta.env.VITE_SOCIAL_CONTRACT_ADDRESS
    console.log(spender)
    if (spender) {
      const transaction = await prepareContractCall({
        contract: ICSContract,
        method:
          "function approve(address spender, uint256 value) returns (bool)",
        params: [spender, BigInt(amount)],
      })
      const { transactionHash } = await sendTransaction({
        transaction,
        account,
      })
    }
  }
  const handleGift = async () => {
    if (pid) {
      approve()
      const transaction = await prepareContractCall({
        contract: SocialContract,
        method: "function sendMoneyToPostCreator(uint256 _p, uint256 _amount)",
        params: [BigInt(pid), BigInt(amount)],
      })
      const { transactionHash } = await sendTransaction({
        transaction,
        account,
      })
    }
  }
  const [showFullCaption, setShowFullCaption] = useState(false)

  const toggleCaption = () => {
    setShowFullCaption(!showFullCaption)
  }
  const breakTextIntoLines = (text: string, maxLength: number) => {
    const lines = []
    let currentLine = ""

    text.split(" ").forEach((word) => {
      if ((currentLine + word).length > maxLength) {
        lines.push(currentLine.trim())
        currentLine = word + " "
      } else {
        currentLine += word + " "
      }
    })

    if (currentLine) {
      lines.push(currentLine.trim())
    }

    return lines
  }
  const captionLines = breakTextIntoLines(caption, 40)
  //console.log(caption)
  return (
    <div
      className="relative mt-4 sm:min-w-96 min-w-52 min-h-[60vh] mx-auto p-1
     bg-zinc-950 border-white border-2 rounded-lg shadow-md"
    >
      <div className="flex flex-col">
        <div className="flex flex-row gap-2 mb-4">
          <img
            className="h-14 w-14 border border-white rounded-full"
            src={profilePic}
            alt="dp"
          />
          <div className="flex flex-col ml-2">
            <h1 className="text-white font-bold text-xl mt-1">{userName}</h1>
            <p className="mt-1 text-sm text-gray-400">
              {creator.slice(0, 8) + "...." + creator.slice(30, 40)}
            </p>
          </div>
        </div>
      </div>
      <h1 className="text-white font-bold p-1 border-b-2 border-t-2 border-white">
        {title}
      </h1>
      <div className="post-content max-h-[85vh] p-2">
        <div className="flex items-center justify-center">
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Post content"
              className="rounded-lg sm:max-h-[50vh] h-[45vh] object-cover "
            />
          )}
        </div>
        <div className="mt-2 flex gap-1">
          <h2 className="text-xl text-primary font-semibold mt-2">
            {showFullCaption ? (
              captionLines.map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  <br />
                </React.Fragment>
              ))
            ) : (
              <>
                {captionLines.slice(0, 2).map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
                {caption.length > 80 && (
                  <button
                    onClick={toggleCaption}
                    className="text-blue-500 ml-2"
                  >
                    {showFullCaption ? "Read Less" : "Read More"}
                  </button>
                )}
              </>
            )}
          </h2>
        </div>
      </div>
      <div className="post-actions flex space-x-4 mt-4 justify-between px-3">
        <button
          onClick={handleLike}
          className="flex items-center flex-col space-x-1 text-blue-500 hover:text-red-500"
        >
          <FaHeart className="ml-1" />
          <span>{likes}</span>
        </button>
        <div className="flex flex-row gap-1">
          <button
            onClick={handleGift}
            className="flex items-center flex-col space-x-1 text-blue-500 hover:text-purple-500"
          >
            <FaGift className="ml-1" />
          </button>
          <input
            type="number"
            className="w-14 h-4 ml-1 mt-[1px] rounded-lg p-2 text-sm text-black focus:border-blue-500 focus:border outline-none focus:outline-none"
            id="amount"
            value={amount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setAmount(Number(e.target.value))
              console.log(e.target.value)
            }}
          />
        </div>
        <button
          onClick={handleShare}
          className="flex flex-col items-center space-x-1 text-blue-500 hover:text-blue-700"
        >
          <FaShareAlt />
          <span>{copied ? "Copied!" : ""}</span>
          <div className="text-blue-500">{shares}</div>
        </button>
      </div>
      <div className="text-purple-600 mt-2">#{tags.split(",").join("  #")}</div>
    </div>
  )
}

export default Post
