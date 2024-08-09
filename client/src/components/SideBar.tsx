import React, { useState, useEffect } from "react";
import {
  FaHome,
  FaCompass,
  FaUsers,
  FaShoppingCart,
  FaClipboardList,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { FaCalendarCheck } from "react-icons/fa";
import { MdAddAPhoto } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { useSocialTokenContext } from "../context/context";
import { download } from "thirdweb/storage";
import { useActiveAccount } from "thirdweb/react";
import { readContract } from "thirdweb";

const SideBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [user, setUser] = useState<any>(null); // Replace `any` with a proper type if available
  const { SocialContract, client } = useSocialTokenContext();
  const address = useActiveAccount()?.address;

  useEffect(() => {
    const fetchUserData = async () => {
      if (address && SocialContract) {
        try {
          const data = await readContract({
            contract: SocialContract,
            method: "function getUserById(address _user) view returns ((uint256 uid, address userid, string name, string bio, string image_hash, string caption, uint256 dailylikes, uint256 dailyshares, uint256 dailycheckin, uint256[] dailycheckins, uint256[] dailylikestamp, uint256[] dailysharestamp, uint256[] pid, address[] followers, address[] following, (uint256 pid, address creator, string image_hash, string title, string description, string videos, uint256 likes, uint256 shares, string tags)[] content, uint256 token))",
            params: [address],
          });

          // Fetch the image
          if (data.image_hash) {
            const response = await download({
              client,
              uri: data.image_hash,
            });
            const fileBlob = await response.blob();
            const fileUrl = URL.createObjectURL(fileBlob);
            setUser({
              username: data.name,
              profilePic: fileUrl,
              userId: data.userid,
            });
          }
        } catch (error) {
          console.error("Failed to fetch user data", error);
        }
      }
    };

    fetchUserData();
  }, [address, SocialContract, client]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Function to slice the userId
  const sliceUserId = (userId: string) => {
    if (userId.length > 11) {
      return `${userId.slice(0, 9)}...${userId.slice(-2)}`;
    }
    return userId;
  };

  return (
    <div
      className={`fixed h-screen ${isOpen ? "sm:w-64 w-52" : "w-0"} bg-zinc-950 text-white gap-4 flex flex-col transition-all duration-300 z-50`}
    >
      <div className="flex flex-col mr-12">
        {/* Header with profile */}
        <div
          className={`p-2 text-2xl font-semibold flex flex-col items-center ${!isOpen && "hidden"}`}
        >
          {user ? (
            <NavLink
              to={`/profile/${user.userId}`}
              className="flex items-center space-x-2 mt-8"
            >
              <img
                src={user.profilePic}
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <div className="text-lg text-wrap">{user.username}</div>
                <div className="text-sm text-gray-700">
                  @{sliceUserId(user.userId)}
                </div>
              </div>
            </NavLink>
          ) : (
            <div className="flex items-center space-x-2 mt-8">
              <div className="w-10 h-10 rounded-full bg-gray-500"></div>
              <div>
                <div className="text-lg text-wrap">Loading...</div>
                <div className="text-sm text-gray-700">Loading...</div>
              </div>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="text-4xl mt-7 ml-1 absolute top-4 right-4"
          >
            <FaTimes />
          </button>
        </div>
        {/* Navigation links */}
        <div
          className={`flex flex-col space-y-4 gap-8 p-4 ${!isOpen && "hidden"}`}
        >
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "flex group items-center space-x-2 p-2 bg-blue-500 rounded-md"
                : "flex items-center space-x-2 p-2 hover:bg-blue-500 rounded-md"
            }
          >
            <FaHome className="text-xl group-hover:text-white" />
            <span className="group-hover:text-white">Home</span>
          </NavLink>
          <NavLink
            to="/dailylogin"
            className={({ isActive }) =>
              isActive
                ? "flex group items-center space-x-2 p-2 bg-blue-500 rounded-md"
                : "flex items-center space-x-2 p-2 hover:bg-blue-500 rounded-md"
            }
          >
            <FaCalendarCheck className="text-xl group-hover:text-white" />
            <span className="group-hover:text-white">Daily Check-in</span>
          </NavLink>
          <NavLink
            to="/explore"
            className={({ isActive }) =>
              isActive
                ? "flex items-center space-x-2 p-2 bg-blue-500 rounded-md"
                : "flex items-center space-x-2 p-2 hover:bg-blue-500 rounded-md"
            }
          >
            <FaCompass className="text-xl" />
            <span>Explore</span>
          </NavLink>
          <NavLink
            to="/people"
            className={({ isActive }) =>
              isActive
                ? "flex items-center space-x-2 p-2 bg-blue-500 rounded-md"
                : "flex items-center space-x-2 p-2 hover:bg-blue-500 rounded-md"
            }
          >
            <FaUsers className="text-xl" />
            <span>People</span>
          </NavLink>
          <NavLink
            to="/shop"
            className={({ isActive }) =>
              isActive
                ? "flex items-center space-x-2 p-2 bg-blue-500 rounded-md"
                : "flex items-center space-x-2 p-2 hover:bg-blue-500 rounded-md"
            }
          >
            <FaShoppingCart className="text-xl" />
            <span>Shop</span>
          </NavLink>
          <NavLink
            to="/create"
            className={({ isActive }) =>
              isActive
                ? "flex items-center space-x-2 p-2 bg-blue-500 rounded-md"
                : "flex items-center space-x-2 p-2 hover:bg-blue-500 rounded-md"
            }
          >
            <MdAddAPhoto className="text-xl mb-1" />
            <span>Create Post</span>
          </NavLink>
        </div>
      </div>
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="text-2xl p-2 bg-black text-white fixed top-4 left-4 z-50 mb-2"
        >
          <FaBars />
        </button>
      )}
    </div>
  );
};

export default SideBar;
