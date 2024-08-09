import React from "react"
import { NavLink } from "react-router-dom"
import {
  FaShoppingCart,
  FaDollarSign,
  FaUserCircle,
  FaPlusCircle,
} from "react-icons/fa"

const SideMenu: React.FC = () => {
  return (
    <div className="fixed top-56 right-0 border-white border-2 h-auto gap-8 rounded-lg w-16 bg-zinc-950 flex flex-col items-center py-4 shadow-lg">
      <NavLink
        to="/shop/buy-nft"
        className={({ isActive }) =>
          `sidebar-item mb-4 gap-1 flex-col flex items-center justify-center ${
            isActive ? "text-green-500" : "text-white"
          } hover:text-teal-400`
        }
      >
        <FaShoppingCart size={24} />
        <span className="sidebar-text">Buy</span>
      </NavLink>
      <NavLink
        to="/shop/my-nft"
        className={({ isActive }) =>
          `sidebar-item mb-4 p-1 gap-1 flex-col flex items-center justify-center ${
            isActive ? "text-green-500" : "text-white"
          } hover:text-teal-400`
        }
      >
        <FaUserCircle size={24} />
        <span className="sidebar-text text-center">My NFT</span>
      </NavLink>
      <NavLink
        to="/shop/create-nft"
        className={({ isActive }) =>
          `sidebar-item gap-1 p-1 flex-col flex items-center justify-center ${
            isActive ? "text-green-500" : "text-white"
          } hover:text-teal-400`
        }
      >
        <FaPlusCircle size={24} />
        <span className="sidebar-text">Create</span>
      </NavLink>
    </div>
  )
}

export default SideMenu
