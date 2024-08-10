import React, { useEffect, useState } from "react"
import { AiOutlineUser, AiOutlineTeam } from "react-icons/ai"
import { useParams, Link } from "react-router-dom"
import { FaTimes } from "react-icons/fa"
import Post from "../components/Post"
import FollowButton from "../components/FollowButton"
import { readContract } from "thirdweb"
import { useSocialTokenContext } from "../context/context"
import { download } from "thirdweb/storage"
import Balance from "../components/Balance"

const ViewProfile: React.FC = () => {
  const { userId } = useParams() // Use userId instead of id
  const { SocialContract, client, account } = useSocialTokenContext()

  const [user, setUser] = useState<any>(null)
  const [imageUrl, setImageUrl] = useState<string>("")
  const [isVisible, setIsVisible] = useState(false)
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null)
  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    const getUser = async () => {
      if (userId && SocialContract) {
        try {
          const data = await readContract({
            contract: SocialContract,
            method:
              "function getUserById(address _user) view returns ((uint256 uid, address userid, string name, string bio, string image_hash, string caption, uint256 dailylikes, uint256 dailyshares, uint256 dailycheckin, uint256[] dailycheckins, uint256[] dailylikestamp, uint256[] dailysharestamp, uint256[] pid, address[] followers, address[] following, (uint256 pid, address creator, string image_hash, string title, string description, string videos, uint256 likes, uint256 shares, string tags)[] content, uint256 token))",
            params: [userId.toString()],
          })

          setUser({
            name: data.name,
            userid: data.userid,
            bio: data.bio,
            imageHash: data.image_hash,
            followers: data.followers.length,
            following: data.following.length,
            posts: data.content,
          })

          try {
            const response = await download({
              client,
              uri: `${data.image_hash}`,
            })

            const fileBlob = await response.blob()
            const fileUrl = URL.createObjectURL(fileBlob)
            setImageUrl(fileUrl)
          } catch (error) {
            console.error("Failed to fetch user image", error)
            // Set a dummy image URL if there's an error
            setImageUrl("path_to_dummy_image.jpg")
          }
        } catch (error) {
          console.error("Failed to fetch user data", error)
        }
      }
    }

    getUser()
  }, [userId, SocialContract, client])

  useEffect(() => {
    if (userId) {
      const getPosts = async () => {
        try {
          const results = await readContract({
            contract: SocialContract,
            method:
              "function viewCreatorPost(address _creator) view returns ((uint256 pid, address creator, string image_hash, string title, string description, string videos, uint256 likes, uint256 shares, string tags)[])",
            params: [userId],
          })

          const imageHashesAndPids = await Promise.all(
            results.map(async (result) => {
              let fileUrl = ""
              try {
                const response = await download({
                  client,
                  uri: result.image_hash,
                })

                const fileBlob = await response.blob()
                fileUrl = URL.createObjectURL(fileBlob)
              } catch (error) {
                console.error("Failed to fetch post image", error)
                // Use a dummy image URL if the download fails
                fileUrl = "path_to_dummy_image.jpg"
              }

              return {
                pid: result.pid,
                image_url: fileUrl, // Use the resolved or dummy image URL
              }
            }),
          )
          setPosts(imageHashesAndPids)
          console.log(imageHashesAndPids) // Log to see the extracted values
        } catch (error) {
          console.error("Failed to fetch posts", error)
        }
      }

      getPosts()
    }
  }, [userId, SocialContract, client])

  const handlePostClick = (index: number) => {
    setSelectedPostId(index)
    setIsVisible(true)
  }

  const handleClose = () => {
    setIsVisible(false)
    setSelectedPostId(null)
  }

  return (
    <div className="p-4 w-full h-full max-w-screen-lg mx-auto">
      {user && (
        <div className="lg:mt-4 p-4">
          <div className="flex items-center justify-center md:space-x-2 space-x-1 mt-10">
            <img
              src={imageUrl}
              alt="Profile"
              className="h-14 w-14 sm:h-14 sm:w-14 mt-2 rounded-full border-2 border-white"
            />
            <div className="flex flex-col space-y-2">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold ml-5 mt-8">
                {user.name}
              </h1>
              <p className="text-gray-400 ml-5 text-xs sm:text-md hidden lg:block">
                @{user.userid}
              </p>
              <p className="text-gray-400 ml-5 text-xs sm:text-md block lg:hidden">
                @{user.userid.slice(0, 4) + "..." + user.userid.slice(36, 40)}
              </p>
              <p className="text-gray-20 ml-5">{user.bio}</p>
            </div>
          </div>
          <div className="flex space-x-1 md:space-x-8 mt-4 items-center justify-center">
            <div className="flex flex-col">
              <div className="flex flex-row">
                <div className="flex items-center space-x-1">
                  <AiOutlineUser className="text-lg" />
                  <Link to={`/followers/${user.userid}`}>
                    <span className="font-bold">{user.followers}</span>
                  </Link>
                  <Link to={`/followers/${user.userid}`}>
                    <span className="text-gray-600 cursor-pointer hover:none sm:text-md text-sm">
                      Followers
                    </span>
                  </Link>
                </div>

                <div className="flex items-center space-x-1">
                  <AiOutlineTeam className="text-lg" />
                  <span className="font-bold">{user.following}</span>
                  <Link to={`/following/${user.userid}`}>
                    <span className="text-gray-600 sm:text-md text-sm cursor-pointer hover:none">
                      Following
                    </span>
                  </Link>
                </div>
                <div>
                  {account?.address === userId ? (
                    <Balance /> // Show Balance component if account matches userId
                  ) : (
                    <FollowButton userId={user.userid} /> // Show FollowButton otherwise
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="border-t-2 border-white w-full"></div>
      <div className="mt-8 overflow-y-auto max-h-[500px] p-6 no-scrollbar">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(posts || []).map((post: any, index: any) => (
            <div
              key={post.pid} // Use pid as the unique key
              className="h-40 flex items-center justify-center cursor-pointer relative"
              onClick={() => handlePostClick(post.pid)} // Use pid as the postId
            >
              <img
                src={post.image_url} // Use image_url here
                alt={`Post ${index + 1}`}
                className="h-full w-full object-cover"
                onError={(e) => {
                  // Set a dummy image if the image fails to load
                  ;(e.target as HTMLImageElement).src =
                    "path_to_dummy_image.jpg"
                }}
              />
              {/* <p className="absolute text-white text-lg">Post {index + 1}</p> */}
            </div>
          ))}
        </div>
      </div>
      {isVisible && selectedPostId !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black-800 bg-opacity-50 z-50">
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
