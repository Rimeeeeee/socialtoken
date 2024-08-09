import React from "react"
import { Route, Routes } from "react-router-dom"
import BuyNFT from "./shop/BuyNFT"
import MyNFT from "./shop/MyNFT"
import CreateNFT from "./shop/CreateNFT"
import SideMenu from "./shop/SideMenu"

const Shop: React.FC = () => {
  return (
    <div className="flex h-screen bg-black">
      <SideMenu />
      <div className="flex-grow flex items-center justify-center">
        <Routes>
          <Route path="buy-nft" element={<BuyNFT />} />
          <Route path="my-nft" element={<MyNFT />} />
          <Route path="create-nft" element={<CreateNFT />} />
        </Routes>
      </div>
    </div>
  )
}

export default Shop
