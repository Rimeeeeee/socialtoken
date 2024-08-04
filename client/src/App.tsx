import React from "react"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom"
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
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

interface LayoutProps {
  children: React.ReactNode
}

// Component to conditionally render SideBar and Header
const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation()
  const isLoginPage = location.pathname === "/login"

  return (
    <div className="">
      {!isLoginPage && <SideBar />}
      {!isLoginPage && <Header />}
      <div className="flex-grow">{children}</div>
    </div>
  )
}

const App: React.FC = () => {
  return (
    <Router>
      <DndProvider backend={HTML5Backend}>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Home />{" "}
              </Layout>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route
            path="/explore"
            element={
              <Layout>
                <Explore />
              </Layout>
            }
          />
          <Route
            path="/people"
            element={
              <Layout>
                <Profile />
              </Layout>
            }
          />
          <Route
            path="/shop"
            element={
              <Layout>
                <Shop />
              </Layout>
            }
          />
          <Route
            path="/create"
            element={
              <Layout>
                <CreatePost />
              </Layout>
            }
          />
          <Route
            path="/profile/:userId"
            element={
              <Layout>
                <CurrentUser />
              </Layout>
            }
          />
        </Routes>
      </DndProvider>
    </Router>
  )
}

export default App
