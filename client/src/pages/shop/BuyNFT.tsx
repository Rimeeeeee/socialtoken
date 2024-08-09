import React from "react"
import NFT from "./NFT"

const BuyNFT: React.FC = () => {
  return (
    <div className="h-screen p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 p-4 overflow-y-auto no-scrollbar mt-12">
        <NFT
          creatorName="Creator 1"
          profilePic="path_to_image"
          creatorAddress="0x1234...5678"
          price={100}
          uri="path_to_nft"
          tokenId={1}
        />
        <NFT
          creatorName="Creator 2"
          profilePic="path_to_image"
          creatorAddress="0x1234...5678"
          price={200}
          uri="path_to_nft"
          tokenId={2}
        />
        <NFT
          creatorName="Creator 3"
          profilePic="path_to_image"
          creatorAddress="0x1234...5678"
          price={300}
          uri="path_to_nft"
          tokenId={3}
        />
        <NFT
          creatorName="Creator 3"
          profilePic="path_to_image"
          creatorAddress="0x1234...5678"
          price={300}
          uri="path_to_nft"
          tokenId={4}
        />
        {/* Add more NFTs as needed */}
      </div>
    </div>
  )
}

export default BuyNFT
