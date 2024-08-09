import React, { useState, useEffect } from "react"
import Rings from "../components/Rings"
import RegisterUser from "../components/RegisterUser"
import { Navigate } from "react-router-dom"
import { useActiveAccount } from "thirdweb/react"
import { readContract } from "thirdweb"
import { useSocialTokenContext } from "../context/context"
import TopBar from "../components/Header" // Import the TopBar component

const Login: React.FC = () => {
  const [registered, setRegistered] = useState(false)
  const address = useActiveAccount()?.address
  const { SocialContract } = useSocialTokenContext()

  useEffect(() => {
    const checkUserStatus = async () => {
      if (address) {
        try {
          const response = await readContract({
            contract: SocialContract,
            method: "function isAUser(address) view returns (bool)",
            params: [address],
          })
          setRegistered(response)
        } catch (error) {
          console.error("Failed to check user status", error)
        }
      }
    }

    checkUserStatus()
  }, [address, SocialContract])

  if (registered) {
    return <Navigate to="/" />
  }

  return (
    <div className="relative w-screen h-screen flex flex-col">
      {/* Include the TopBar at the top */}
      <TopBar />
      <div className="relative w-full h-full flex flex-1">
        <div className="absolute top-0 left-0 w-full h-full z-0">
          <Rings />
        </div>
        <div className="absolute top-0 left-0 w-full h-full z-5 bg-black bg-opacity-50"></div>
        <div className="relative w-full h-full flex items-center justify-start z-20 p-4">
          <div className="w-full max-w-md md:ml-40 flex items-center justify-center">
            <RegisterUser />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
