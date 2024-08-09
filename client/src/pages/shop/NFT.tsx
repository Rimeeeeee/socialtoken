import React from "react"
import ICS from "../../ICS.jpeg"

interface NFTProps {
  creatorName: string
  profilePic: string
  creatorAddress: string
  price: number
  uri: string
  tokenId: number
}

const NFT: React.FC<NFTProps> = ({
  creatorName,
  profilePic,
  creatorAddress,
  price,
  uri,
  tokenId,
}) => {
  return (
    <div className="w-full max-w-xs mx-auto bg-zinc-950 p-4 border-2 border-white rounded-lg shadow-lg text-white">
      <div>
        <img src={ICS} alt={`nft`} className="w-full rounded-md" />
      </div>
      <div className="flex items-center mb-4 mt-2 border-y-2 p-2 border-white">
        <img
          className="h-12 w-12 border border-white rounded-full"
          src={profilePic}
          alt={`${creatorName}'s profile`}
        />
        <div className="ml-4">
          <h2 className="text-lg font-semibold">{creatorName}</h2>
          <p className="text-sm text-gray-400">
            {creatorAddress.slice(0, 6) + "..." + creatorAddress.slice(-4)}
          </p>
        </div>
      </div>
      <div className="flex gap-2 items-center justify-between">
        <div className="flex flex-row">
          <h3 className="text-xl font-bold">Price:</h3>
          <p className="text-xl font-bold text-blue-400">{price} ICS</p>
        </div>
        <button className="buy-now-button">Buy Now</button>
      </div>
    </div>
  )
}

export default NFT