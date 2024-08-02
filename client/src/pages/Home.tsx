import React, { useState } from "react"
import { Navigate } from "react-router-dom"

const Home = () => {
  const [registered, setRegistered] = useState(true)

  if (!registered) {
    return <Navigate to="/login" />
  }

  return <div className="h-screen"></div>
}

export default Home
