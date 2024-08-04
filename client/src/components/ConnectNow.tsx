import React from "react"
import Logo from "./Logo"

const ConnectNow = () => {
  return (
    <div className="w-full h-screen bg-black bg-opacity-90 flex items-center justify-center flex-col">
      <div className="flex items-center justify-center flex-col border-white border-2 p-8 rounded-lg">
        <h1 className="text-3xl text-white flex flex-row items-center gap-4 p-4">
          Connect Your Wallet to Use
          <span className="dancing-script-500 text-gradient font-bold text-xl sm:text-4xl mb-1">
            Enigma
          </span>
        </h1>
        <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-300">
          Connect
        </button>
      </div>
    </div>
  )
}

export default ConnectNow
