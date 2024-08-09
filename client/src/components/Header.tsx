import React from "react"
import { NavLink } from "react-router-dom"
import { FaUserCircle, FaUserPlus } from "react-icons/fa"
import { ThirdwebProvider, ConnectButton, darkTheme } from "thirdweb/react"
import { createWallet, walletConnect } from "thirdweb/wallets"
import { useSocialTokenContext } from "../context/context"
import Balance from "./Balance"

// Dummy user data for demonstration purposes
const user = {
  username: "John Doe",
  profilePic: "https://via.placeholder.com/40",
  userId: "john_doe",
}

const TopBar = () => {
  const { client, wallets } = useSocialTokenContext()
  return (
    <div
      className="w-full h-16 bg-zinc-950 shadow-sm text-white flex items-center
     justify-between px-4 shadow-white fixed top-0 z-40"
    >
      {/* Profile section */}
      <div className="ml-12 hidden sm:block">
        <NavLink
          to={`/profile/${user.userId}`}
          className="flex items-center space-x-2"
        >
          <img
            src={user.profilePic}
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <div className="text-md font-semibold">{user.username}</div>
            <div className="text-sm text-gray-400">@{user.userId}</div>
          </div>
        </NavLink>
      </div>
      <div>
        {" "}
        <span className="dancing-script-500 text-gradient font-bold text-xl sm:text-4xl ml-14 sm:ml-0">
          Enigma
        </span>
      </div>
      {/* Connect button */}
      <div className="flex flex-row gap-1">
        <div className="hidden sm:block">
          <Balance />
        </div>
        <ConnectButton
          client={client}
          wallets={wallets}
          theme={darkTheme({})}
          connectModal={{ size: "compact" }}
        />
      </div>
    </div>
  )
}

export default TopBar
