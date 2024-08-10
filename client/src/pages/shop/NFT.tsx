import React, { useEffect, useState } from "react";
import { prepareContractCall, readContract, sendTransaction } from "thirdweb";
import { useSocialTokenContext } from "../../context/context";
import { download } from "thirdweb/storage";
import { useActiveAccount } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";

interface NFTProps {
  creatorName: string;
  profilePic: string;
  creatorAddress: string;
  sellerAddress:string;
  price: number;
  uri: string;
  tokenId: number;
}

const NFT: React.FC<NFTProps> = ({
  creatorName,
  profilePic,
  creatorAddress,
  sellerAddress,
  price,
  uri,
  tokenId,
}) => {
  const [image, setImage] = useState("");
  const [profile, setProfile] = useState("");
  const { MarketContract, ICSContract, client } =
    useSocialTokenContext();
  const activeAccountAddress = useActiveAccount()?.address;

  useEffect(() => {
    const fetchImage = async () => {
      // Fetch the token URI and convert to image URL
      const data = await readContract({
        contract: MarketContract,
        method: "function tokenURI(uint256 tokenId) view returns (string)",
        params: [BigInt(tokenId)],
      });
      const response = await download({
        client,
        uri: `${data}`, // Ensure IPFS URI format
      });
      const fileBlob = await response.blob();
      const fileUrl = URL.createObjectURL(fileBlob);
      setImage(fileUrl);

      // Fetch the profile picture from IPFS
      const response1 = await download({
        client,
        uri: `${profilePic}`, // Ensure IPFS URI format
      });
      const fileBlob1 = await response1.blob();
      const fileUrl1 = URL.createObjectURL(fileBlob1);
      setProfile(fileUrl1);
    };

    fetchImage();
  }, [uri, client, tokenId, MarketContract, profilePic]); // Updated dependency array

  const approve = async (price: number) => {
    const spender = import.meta.env.VITE_CONTRACT_ADDRESS_3;
    if (spender) {
      const wallet = createWallet("io.metamask")
      const account = await wallet.connect({ client })

      const transaction = await prepareContractCall({
        contract: ICSContract,
        method:
          "function approve(address spender, uint256 value) returns (bool)",
        params: [spender, BigInt(price * 1e18)],
      });
      const { transactionHash } = await sendTransaction({
        transaction,
        account,
      });
      console.log("Approval successful:", transactionHash);
    }
  };

  const buyNFTs = async (tokenId: number, price: number) => {
    try {
      await approve(price);
      const wallet = createWallet("io.metamask")
      const account = await wallet.connect({ client })

      const transaction = await prepareContractCall({
        contract: MarketContract,
        method: "function sellNFT(uint256 _tokenId, uint256 tokenValue)",
        params: [BigInt(tokenId), BigInt(price)],
      });
      const { transactionHash } = await sendTransaction({
        transaction,
        account,
      });
      console.log("Transaction successful:", transactionHash);
    } catch (error) {
      console.error("Failed to buy NFT:", error);
    }
  };

  return (
    <div className="w-full max-w-xs mx-auto bg-zinc-950 p-4 border-2 border-white rounded-lg shadow-lg text-white">
      <div>
        <img src={image} alt={`nft`} className="w-full rounded-md" />
      </div>
      <div className="flex items-center mb-4 mt-2 border-y-2 p-2 border-white">
        <img
          className="h-12 w-12 border border-white rounded-full"
          src={profile}
          alt={`${creatorName}'s profile`}
        />
        <div className="ml-4">
          <h2 className="text-lg font-semibold">{creatorName}</h2>
          <p className="text-sm text-gray-400">
            {sellerAddress.slice(0, 6) + "..." + sellerAddress.slice(-4)}
          </p>
        </div>
      </div>
      <div className="flex gap-2 items-center justify-between">
        <div className="flex flex-row">
          <h3 className="text-xl font-bold">Price:</h3>
          <p className="text-xl font-bold text-blue-400">{price / 1e18} ICS</p>
        </div>
        { sellerAddress !== activeAccountAddress && (
          <button
            className="buy-now-button"
            onClick={() => buyNFTs(tokenId, price)} // Wrap the function call in an anonymous function
          >
            Buy Now
          </button>
        )}
      </div>
    </div>
  );
};

export default NFT;
