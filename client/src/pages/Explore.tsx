import React, { useEffect, useState } from "react"
import { FaSearch, FaFilter, FaArrowUp, FaArrowDown } from "react-icons/fa"
import Post from "../components/Post"
import { useSocialTokenContext } from "../context/context"
import { readContract } from "thirdweb"

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

const Explore: React.FC = () => {
  const [posts, setPosts] = useState<PostData[]>([])
  const [page, setPage] = useState<number>(0)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [sortByLikes, setSortByLikes] = useState<boolean>(true) // State for sorting order
  const [searchTags, setSearchTags] = useState<string>("")
  const [minLikes, setMinLikes] = useState<number>(0)
  const { SocialContract } = useSocialTokenContext()

  const loadPosts = async () => {
    try {
      const readonlyData = await readContract({
        contract: SocialContract,
        method:
          "function viewAllPosts() view returns ((uint256 pid, address creator, string image_hash, string title, string description, string videos, uint256 likes, uint256 shares, string tags)[])",
        params: [],
      })

      // Convert readonly data to mutable data
      const data: PostData[] = [...readonlyData]

      // Filter and search logic
      const filteredData = data.filter((post) => {
        const tagsMatch = post.tags
          .toLowerCase()
          .includes(searchTags.toLowerCase())
        const likesMatch = post.likes >= BigInt(minLikes)
        return tagsMatch && likesMatch
      })

      // Sort data by likes
      const sortedData = filteredData.sort(
        (a, b) =>
          sortByLikes
            ? Number(b.likes) - Number(a.likes) // Descending order
            : Number(a.likes) - Number(b.likes), // Ascending order
      )

      // Reverse and slice data for pagination (10 posts per page)
      const reversedData = sortedData.reverse()
      const newPosts = reversedData.slice(page * 10, (page + 1) * 10)

      // Avoid appending duplicate posts
      setPosts((prevPosts) => {
        const combinedPosts = [...prevPosts, ...newPosts]
        const uniquePosts = Array.from(
          new Map(
            combinedPosts.map((post) => [post.pid.toString(), post]),
          ).values(),
        )
        return uniquePosts
      })

      setHasMore(newPosts.length === 10)
    } catch (error) {
      console.error("Error fetching posts:", error)
    }
  }

  useEffect(() => {
    loadPosts()
    // Trigger loadPosts when the page changes
  }, [page, SocialContract, searchTags, minLikes, sortByLikes])

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    if (scrollTop + clientHeight >= scrollHeight - 10 && hasMore) {
      setPage((prevPage) => prevPage + 1)
    }
  }

  return (
    <div className="pb-20">
      <div className="h-screen flex flex-col pt-2">
        <div className="mt-16 flex flex-col space-y-4 no-scrollbar overflow-y-scroll snap-y snap-mandatory">
          {posts.map((post) => (
            <div
              key={post.pid.toString()}
              className="snap-start w-full flex justify-center"
            >
              <Post pid={Number(post.pid)} />
            </div>
          ))}
          {!hasMore && (
            <div className="flex justify-center mt-4">
              <p className="text-white">No more posts to display.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Explore
