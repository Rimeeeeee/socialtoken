import React, { useState, useEffect } from "react"
import User from "../components/User"
import { FaSearch } from "react-icons/fa"
import { useSocialTokenContext } from "../context/context"
import { readContract } from "thirdweb"
import { download } from "thirdweb/storage"
import { useNavigate } from "react-router-dom"

const Profile: React.FC = () => {
  // Define state for user data, loading, and error
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const { client, SocialContract } = useSocialTokenContext()
  const [searchQuery, setSearchQuery] = useState<string>("")

  const navigate = useNavigate() // Hook for navigation

  // Fetch data from the contract when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const totalUsers = await readContract({
          contract: SocialContract,
          method:
            "function getAllUsers() view returns ((uint256 uid, address userid, string name, string bio, string image_hash, string caption, uint256 dailylikes, uint256 dailyshares, uint256 dailycheckin, uint256[] dailycheckins, uint256[] dailylikestamp, uint256[] dailysharestamp, uint256[] pid, address[] followers, address[] following, (uint256 pid, address creator, string image_hash, string title, string description, string videos, uint256 likes, uint256 shares, string tags)[] content, uint256 token)[])",
          params: [],
        })

        // Resolve IPFS image URLs for each user
        const usersWithImages = await Promise.all(
          totalUsers.map(async (user: any) => {
            const response = await download({
              client,
              uri: user.image_hash, // Using the IPFS URI format
            })
            const fileBlob = await response.blob()
            const fileUrl = URL.createObjectURL(fileBlob)
            return { ...user, image_url: fileUrl }
          }),
        )

        setUsers(usersWithImages)
        setLoading(false)
      } catch (error: any) {
        setError(error.message)
        setLoading(false)
      }
    }

    if (SocialContract) {
      fetchData()
    }
  }, [SocialContract, client])

  // Filter users based on search input (by name or user ID)
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.userid.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex flex-col items-center p-4">
      {/* Search input */}
      <div className="relative w-full max-w-md mb-4 mt-20">
        <input
          type="text"
          placeholder="Search users by name or address..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 pl-10 border rounded-lg bg-zinc-950 text-white focus:border-blue-500 focus:border-2 focus:outline-none"
        />
        <FaSearch className="absolute top-2 left-3 text-gray-300 text-2xl" />
      </div>

      {/* Conditional rendering for loading, error, and user grid */}
      {loading ? (
        <p className="text-white">Loading...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-8 lg:gap-10 mt-5 no-scrollbar">
          {filteredUsers.map((user, index) => {
            const slicedUserId = `${user.userid.slice(0, 9)}...${user.userid.slice(-2)}` // Slice the user ID
            return (
              <div
                key={index}
                className="cursor-pointer"
                onClick={() => navigate(`/profile/${user.userid}`)} // Navigate to the user's profile page
              >
                <User
                  profilePic={user.image_url} // Assuming image_url is the resolved URL
                  name={user.name}
                  userId={slicedUserId} // Pass the sliced user ID
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Profile
