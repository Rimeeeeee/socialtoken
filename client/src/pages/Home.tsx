import React, { useState } from "react"
import { Link, Navigate } from "react-router-dom"

const Home = () => {
  const [registered, setRegistered] = useState(true)

  if (!registered) {
    return <Navigate to="/login" />
  }

  return (
    <div className="h-screen text-primary">
      <div className="flex justify-center items-center h-full text-center">
        <div className="m-4 mr-2">
          <h1 className="sm:text-7xl text-2xl font-bold">
            Welcome to{" "}
            <span className="dancing-script-500 text-gradient font-bold text-3xl sm:text-8xl">
              Enigma
            </span>
          </h1>
          <p className="mt-4 text-xl sm:text-6xl">
            Decentralized, Tokenized Social Media
          </p>
          <div className="mt-8 mx-2">
            <Link to="/explore" className="button-p">
              Explore Posts
            </Link>
            <Link to="/profile/:userId" className="button-p">
              Your Profile
            </Link>
            <Link to="/shop" className="button-p">
              NFT Market
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home