import React from "react"
import Vanta from "../components/Vanta"
import Rings from "../components/Rings"
import RegisterUser from "../components/RegisterUser"

const Login: React.FC = () => {
  return (
    <div className="relative w-screen h-screen flex">
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <Rings />
      </div>
      <div className="absolute top-0 left-0 w-full h-full z-5 bg-black bg-opacity-50 "></div>
      <div className="relative w-full h-full flex items-center justify-start z-10 p-4">
        <div className="w-full max-w-md md:ml-40">
          <RegisterUser />
        </div>
      </div>
    </div>
  )
}

export default Login
