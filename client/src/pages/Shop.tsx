import React from "react"
import { Route, Routes, useLocation } from "react-router-dom"
import BuyNFT from "./shop/BuyNFT"
import MyNFT from "./shop/MyNFT"
import CreateNFT from "./shop/CreateNFT"
import SideMenu from "./shop/SideMenu"

const Shop: React.FC = () => {
  const location = useLocation() // Get the current route location

  // Check if the current path is one of the routes
  const isRouteMatched = [
    "/shop/buy-nft",
    "/shop/my-nft",
    "/shop/create-nft",
  ].includes(location.pathname)

  return (
    <div className="flex h-screen bg-black">
      <SideMenu />
      <div className="flex-grow flex items-center justify-center">
        <Routes>
          {/* <Route path="buy-nft" element={<BuyNFT />} /> */}
          <Route path="my-nft" element={<MyNFT />} />
          <Route path="create-nft" element={<CreateNFT />} />
        </Routes>

        {!isRouteMatched && ( // Render the home content only when no route is matched
          <div className="w-full flex justify-center items-center flex-col ">
            <h2 className="text-3xl sm:text-5xl font-bold text-primary text-gradient">
              Spend your ICS Tokens here!!!
            </h2>
            <p className="mt-20 text-blue-600">
              Note: The market has a small platform fee of
              <span className="text-primary text-xl text-teal-400 m-2">10</span>
              ICS Tokens
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Shop
