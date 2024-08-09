import React, { useState, useEffect } from "react";
import { prepareContractCall, readContract, sendTransaction } from "thirdweb";
import { useSocialTokenContext } from "../context/context";
import { useActiveAccount } from "thirdweb/react";

interface FollowButtonProps {
  userId: string;
}

const FollowButton: React.FC<FollowButtonProps> = ({ userId }) => {
  const {account, SocialContract } = useSocialTokenContext();
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
  const { address } = useActiveAccount() || {}; // Ensure correct type

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (SocialContract && address) {
        try {
          // Fetch the list of followers for the given user
          const followersReadonly: readonly string[] = await readContract({
            contract: SocialContract,
            method: "function getFollowers(address _creator) view returns (address[])",
            params: [userId],
          });

          // Convert readonly array to mutable array
          const followers: string[] = [...followersReadonly];

          // Check if the current user is in the list of followers
          const isUserFollowing = followers.includes(address);
          setIsFollowing(isUserFollowing);
        } catch (error) {
          console.error("Failed to check follow status", error);
        }
      }
    };

    checkFollowStatus();
  }, [SocialContract, userId, address]);

  const handleFollowClick = async () => {
    if (!SocialContract || !address) return;

    try {
      const method = isFollowing ? "unfollow" : "follow";
      const transaction = await prepareContractCall({
        contract: SocialContract,
        method: `function ${method}(address _user)`,
        params: [userId],
      });

      const { transactionHash } = await sendTransaction({
        transaction,
        account, // Ensure `account` is of type `Account`
      });

      console.log(`${method.charAt(0).toUpperCase() + method.slice(1)} successful`, transactionHash);
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error(`Failed to ${isFollowing ? "unfollow" : "follow"}`, error);
    }
  };

  return (
    <button
      onClick={handleFollowClick}
      className={`px-4 py-2 rounded ${isFollowing ? "bg-white-800 text-blue" : "bg-blue-500 text-white"}`}
    >
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
};

export default FollowButton;
