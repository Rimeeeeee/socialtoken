import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { readContract } from "thirdweb";
import { download } from "thirdweb/storage";

interface Follower {
  address: string;
  name: string;
  image_url: string;
}

const FollowersPage: React.FC<{ contract: any }> = ({ contract }) => {
  const { creatorAddress } = useParams<{ creatorAddress: string }>();
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFollowers = async () => {
      if (!creatorAddress) return;

      try {
        // Fetch follower addresses
        const response = await readContract({
          contract,
          method: "function getFollowers(address _creator) view returns (address[])",
          params: [creatorAddress],
        });

        // Fetch detailed info for each follower
        const followersData = await Promise.all(
          response.map(async (followerAddress: string) => {
            const userInfo = await readContract({
              contract,
              method: "function getUserById(address _user) view returns ((uint256 uid, address userid, string name, string bio, string image_hash, string caption, uint256 dailylikes, uint256 dailyshares, uint256 dailycheckin, uint256[] dailycheckins, uint256[] dailylikestamp, uint256[] dailysharestamp, uint256[] pid, address[] followers, address[] following, (uint256 pid, address creator, string image_hash, string title, string description, string videos, uint256 likes, uint256 shares, string tags)[] content, uint256 token))",
              params: [followerAddress],
            });

            // Fetch image using the IPFS URI and convert to a blob URL
            const response = await download({
              client: contract.client,
              uri: `ipfs://${userInfo.image_hash}`, // Using the IPFS URI format
            });
            const fileBlob = await response.blob();
            const imageUrl = URL.createObjectURL(fileBlob);

            return {
              address: userInfo.userid,
              name: userInfo.name,
              image_url: imageUrl,
            };
          })
        );

        setFollowers(followersData);
        setLoading(false);
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchFollowers();
  }, [contract, creatorAddress]);

  return (
    <div className="container mx-auto mt-8 px-4">
      <h1 className="text-3xl font-bold mb-4">Followers of {creatorAddress}</h1>

      {/* Loading state */}
      {loading && <p className="text-gray-500">Loading followers...</p>}

      {/* Error state */}
      {error && <p className="text-red-500">Error: {error}</p>}

      {/* Display followers */}
      {!loading && !error && (
        <ul>
          {followers.length === 0 ? (
            <p className="text-gray-500">No followers found.</p>
          ) : (
            followers.map((follower, index) => (
              <li key={index} className="flex items-center space-x-4 mb-4">
                <img
                  src={follower.image_url}
                  alt={follower.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <Link to={`/profile/${follower.address}`}>
                    <p className="text-cream-500 font-bold hover:none">
                      {follower.name}
                    </p>
                  </Link>
                  <p className="text-gray-500 text-sm">{follower.address}</p>
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default FollowersPage;
