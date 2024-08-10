import React, { useEffect, useState } from "react";
import NFT from "./NFT";
import { readContract } from "thirdweb";
import { useSocialTokenContext } from "../../context/context";
import { useActiveAccount } from "thirdweb/react";

const MyNFT: React.FC = () => {
  const { MarketContract, SocialContract } = useSocialTokenContext();
  const address = useActiveAccount()?.address;
  const [nfts, setNfts] = useState<any[]>([]);

  useEffect(() => {
    const getAllNFT = async () => {
      const nftData = await readContract({
        contract: MarketContract,
        method:
          "function getAllNFTs() view returns ((uint256 tokenId, address owner, address seller, uint256 price, bool currentlyListed)[])",
        params: [],
      });
      console.log(nftData);

      // Map over the array of NFTs and fetch user details for each owner
      const detailedNFTs = await Promise.all(
        nftData.map(async (nft: any) => {
          const userData = await readContract({
            contract: SocialContract,
            method:
              "function getUserById(address _user) view returns ((uint256 uid, address userid, string name, string bio, string image_hash, string caption, uint256 dailylikes, uint256 dailyshares, uint256 dailycheckin, uint256[] dailycheckins, uint256[] dailylikestamp, uint256[] dailysharestamp, uint256[] pid, address[] followers, address[] following, (uint256 pid, address creator, string image_hash, string title, string description, string videos, uint256 likes, uint256 shares, string tags)[] content, uint256 token))",
            params: [nft.seller],
          });
          return {
            ...nft,
            userData, // Include user data along with NFT data
          };
        })
      );

      setNfts(detailedNFTs);
    };

    getAllNFT();
  }, [MarketContract, SocialContract, address]);

  return (
    <div className="h-screen p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 p-4 overflow-y-auto no-scrollbar mt-12">
        {nfts
          .filter((nft) => nft.seller === address) // Filter NFTs to only show those owned by the active account
          .map((nft) => (
            <NFT
              key={nft.tokenId}
              creatorName={nft.userData.name}
              profilePic={`${nft.userData.image_hash}`}
              creatorAddress={nft.owner}
              sellerAddress={nft.seller}
              price={Number(nft.price)}
              uri={`${nft.userData.image_hash}`}
              tokenId={Number(nft.tokenId)}
            />
          ))}
      </div>
    </div>
  );
};

export default MyNFT;
