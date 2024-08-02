import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import {
  Explore,
  Home,
  Login,
  Profile,
  Shop,
  CreatePost,
  CurrentUser,
} from "./pages/index"
import SideBar from "./components/SideBar"
import Header from "./components/Header"

const App = () => {
  return (
    <Router>
      <div className="">
        <SideBar />
        <Header />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/people" element={<Profile />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/profile/:userId" element={<CurrentUser />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
