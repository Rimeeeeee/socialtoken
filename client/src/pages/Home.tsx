import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useActiveAccount } from "thirdweb/react"
import { useSocialTokenContext } from "../context/context"
import { readContract } from "thirdweb"

const Home = () => {
  const [registered, setRegistered] = useState<boolean | null>(null)
  const { SocialContract } = useSocialTokenContext()
  const activeAccount = useActiveAccount()
  const address = activeAccount?.address
  const navigate = useNavigate() // Use useNavigate hook instead of Navigate component

  useEffect(() => {
    const checkUserRegistration = async () => {
      if (address) {
        const data = await readContract({
          contract: SocialContract,
          method: "function isAUser(address) view returns (bool)",
          params: [address],
        })
        setRegistered(data)
      }
    }
    checkUserRegistration()
  }, [SocialContract, address])

  // Handle redirection after the hook has been executed
  useEffect(() => {
    if (registered === false) {
      navigate("/login") // Navigate programmatically
    }
  }, [registered, navigate])

  // Handle loading state
  if (registered === null) {
    return <div>Loading...</div>
  }

  return (
    <div className="h-screen text-primary">
      <div className="flex justify-center items-center h-full text-center">
        <div className="m-4 mr-2">
          <h1 className="sm:text-7xl text-2xl font-bold">
            Welcome to{" "}
            <span className="dancing-script-500 text-gradient font-bold text-3xl sm:text-8xl">
              SocialT
            </span>
          </h1>
          <p className="mt-4 text-xl sm:text-6xl">
            Decentralized, Tokenized Social Media
          </p>
          <div className="mt-8 mx-2">
            <Link to="/explore" className="button-p">
              Explore Posts
            </Link>
            <Link to={`/profile/${address}`} className="button-p">
              Your Profile
            </Link>
            <Link to="/shop" className="button-p">
              NFT Market
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home