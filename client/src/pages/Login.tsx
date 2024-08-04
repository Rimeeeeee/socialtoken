import React, { useState } from "react"
import Vanta from "../components/Vanta"
import Rings from "../components/Rings"
import RegisterUser from "../components/RegisterUser"
import { Navigate } from "react-router-dom"
import ConnectNow from "../components/ConnectNow"

const Login: React.FC = () => {
  const [registered, setRegistered] = useState(false)
  const [connected, setConnected] = useState(true)

  if (registered) {
    return <Navigate to="/" />
  }

  return (
    <div className="relative w-screen h-screen flex">
      {/* ConnectNow takes full width if not connected */}
      {!connected && (
        <div className="absolute top-0 left-0 w-full h-full z-40">
          <ConnectNow />
        </div>
      )}
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
  )
}

export default Login
