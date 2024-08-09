import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { ThirdwebProvider, ConnectButton, darkTheme } from "thirdweb/react";
import { useSocialTokenContext } from "../context/context";
import Balance from "./Balance";
import { readContract} from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { download } from "thirdweb/storage";

// Define the User type
interface User {
  username: string;
  profilePic: string;
  userId: string;
}

const TopBar: React.FC = () => {
  const { client, wallets, SocialContract } = useSocialTokenContext();
  const [user, setUser] = useState<User | null>(null);
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
          const response = await download({
            client,
            uri: `${data.image_hash}`,
          });

          const fileBlob = await response.blob();
          const fileUrl = URL.createObjectURL(fileBlob);

          // Update user state with fetched data
          setUser({
            username: data.name,
            profilePic: fileUrl, // Set the blob URL
            userId: data.userid,
          });
        } catch (error) {
          console.error("Failed to fetch user data", error);
        }
      }
    };

    fetchUserData();
  }, [address, SocialContract, client]);

  // Function to slice userId
  const formatUserId = (userId: string | undefined) => {
    if (!userId) return "";
    return `${userId.slice(0, 2)}...${userId.slice(-2)}`;
  };

  return (
    <div
      className="w-full h-16 bg-zinc-950 shadow-sm text-white flex items-center
     justify-between px-4 shadow-white fixed top-0 z-40"
    >
      {/* Profile section */}
      <div className="ml-12 hidden sm:block">
        {user ? (
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
              <div className="text-sm text-gray-400">
                @{formatUserId(user.userId)}
              </div>
            </div>
          </NavLink>
        ) : (
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-gray-500"></div>
            <div>
              <div className="text-md font-semibold"></div>
              <div className="text-sm text-gray-400">No data to show</div>
            </div>
          </div>
        )}
      </div>
      <div>
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
  );
};

export default TopBar;
