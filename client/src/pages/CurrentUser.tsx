import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSocialTokenContext } from "../context/context";
import {  download } from "thirdweb/storage"; // Import `download` for image retrieval
import { readContract } from "thirdweb";

const CurrentProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { SocialContract, client } = useSocialTokenContext();
  const [user, setUser] = useState<any>(null); // Replace `any` with a proper user type if available
  const [profilePic, setProfilePic] = useState<string>("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId && SocialContract) {
        try {
          // Fetch user data from the smart contract
          const data = await readContract({
            contract: SocialContract,
            method: "function getUserById(address _user) view returns ((uint256 uid, address userid, string name, string bio, string image_hash, string caption, uint256 dailylikes, uint256 dailyshares, uint256 dailycheckin, uint256[] dailycheckins, uint256[] dailylikestamp, uint256[] dailysharestamp, uint256[] pid, address[] followers, address[] following, (uint256 pid, address creator, string image_hash, string title, string description, string videos, uint256 likes, uint256 shares, string tags)[] content, uint256 token))",
            params: [userId],
          });

          // Fetch the image
          if (data.image_hash) {
            const response = await download({
              client,
              uri: data.image_hash,
            });
            const fileBlob = await response.blob();
            const fileUrl = URL.createObjectURL(fileBlob);
            setProfilePic(fileUrl);
          }

          // Update user state with fetched data
          setUser({
            username: data.name,
            profilePic: profilePic,
            userId: data.userid,
            bio: data.bio,
          });
        } catch (error) {
          console.error("Failed to fetch user data", error);
        }
      }
    };

    fetchUserData();
  }, [userId, SocialContract, client, profilePic]); // Add `profilePic` to the dependency array

  return (
    <div className="p-4">
      <div className="flex items-center space-x-4">
        <img
          src={user ? user.profilePic : "https://via.placeholder.com/150"}
          alt="Profile"
          className="w-20 h-20 rounded-full"
        />
        <div>
          <div className="text-2xl">{user ? user.username : "Loading..."}</div>
          <div className="text-gray-700">@{user ? user.userId : "Loading..."}</div>
        </div>
      </div>
      <div className="mt-4">
        <p>{user ? user.bio : "Loading..."}</p>
      </div>
    </div>
  );
};

export default CurrentProfile;
