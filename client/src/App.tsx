import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import {
  Explore,
  Home,
  Login,
  Profile,
  Shop,
  CreatePost,
  DailyLogin,
} from "./pages/index";
import SideBar from "./components/SideBar";
import Header from "./components/Header";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ViewProfile from "./pages/ViewProfile";
import FollowersPage from "./components/Followers"; // Import the FollowersPage component
import { useSocialTokenContext } from "./context/context"; // Assuming you have context for contract
import FollowingPage from "./components/Following";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div>
      {!isLoginPage && <SideBar />}
      {!isLoginPage && <Header />}
      <div className="flex-grow">{children}</div>
    </div>
  );
};

const App: React.FC = () => {
  const { SocialContract } = useSocialTokenContext(); // Assuming you have a context hook for SocialContract

  return (
    <Router>
      <DndProvider backend={HTML5Backend}>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Home />
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
            path="/dailylogin"
            element={
              <Layout>
                <DailyLogin />
              </Layout>
            }
          />
          <Route
            path="/shop/*"
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
                <ViewProfile />
              </Layout>
            }
          />
          <Route
            path="/followers/:creatorAddress"
            element={
              <Layout>
                <FollowersPage contract={SocialContract} />
              </Layout>
            }
          />
           <Route
            path="/following/:creatorAddress"
            element={
              <Layout>
                <FollowingPage contract={SocialContract} />
              </Layout>
            }
          />
        </Routes>
      </DndProvider>
    </Router>
  );
};

export default App;
