import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomeScreen, {
  HomeScreenComponent,
} from "./components/pages/homeScreen.tsx";
import ItemDetails from "./components/dynamic/itemDetails.tsx";
import "./components/card.css";
import "./App.css";
import Workshop from "./components/pages/workshop.tsx";
import { PlayerProvider } from "./data/playerContext.tsx";
import Inventory from "./components/pages/inventory.tsx";
import Footer from "./components/footer.tsx";
import Explore from "./components/pages/explore.tsx";
import LocationDetails from "./components/dynamic/locationDetails.tsx";
//import { AdminPage } from './components/pages/adminPage.tsx';
import NPCRequests from "./components/pages/npcrequests.tsx";
import NPCRequestDetails from "./components/dynamic/npcrequestDetails.tsx";
import ProductionBuildings from "./components/pages/production.tsx";
import BuildingDetails from "./components/dynamic/buildingDetails.tsx";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const App: React.FC = () => {
  const [playerId, setPlayerId] = useState<string>("");

  const checkAuthentication = (): Promise<string> => {
    const auth = getAuth();
    return new Promise((resolve, reject) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // Resolve with the player ID
          console.log(user.uid)
          resolve(user.uid);
        } else {
          reject(new Error("User not logged in"));
        }
      });
    });
  };
  
  useEffect(() => {
    checkAuthentication()
      .then((uid) => {
        setPlayerId(uid);
      })
      .catch((error) => {
        console.log("User not logged in:", error);
        Navigate({to: "/register"});
      });

  }, [playerId]);

  const components: HomeScreenComponent[] = [
    {
      name: "Inventory",
      text: "All your stuff.",
      imageUrl: "buildingIcons/inventory.png",
    },
    {
      name: "Workshop",
      text: "Craft things here!",
      imageUrl: "buildingIcons/workshop.png",
    },
    {
      name: "Explore",
      text: "Go on a resource run!",
      imageUrl: "exploreIcons/Forest.png",
    },
    {
      name: "Requests",
      text: "What do you want?",
      imageUrl: "requestIcons/Woody.png",
    },
    {
      name: "Buildings",
      text: "Manage automatic resources.",
      imageUrl: "buildingIcons/Tree Farm.png",
    },
    // { name: 'Admin', text: 'Create things' },
    // { name: 'Register', text: '' },
    // Add more components to the array
  ];

  if (!playerId) {
    // Handle case when player data is not available
    return <div>Loading...</div>;
  }

  return (
    <PlayerProvider playerId={playerId}>
      <Router>
        <Routes>
          {/* Redirect to login page if not authenticated */}
          <Route path="/" element={<HomeScreen components={components} />} />
          <Route path="/workshop" element={<Workshop />} />
          <Route path="/inventory" element={<Inventory />} />

          <Route path="/buildings" element={<ProductionBuildings />} />
          <Route path="/buildings/:buildingId" element={<BuildingDetails />} /> 
          
          <Route path="/item/:itemId" element={<ItemDetails />} />
          
          <Route path="/explore" element={<Explore />} />
          <Route path="/explore/:location" element={<LocationDetails />} />
          
          <Route path="/requests" element={<NPCRequests />} />
          <Route path="/requests/:npcRequestId" element={<NPCRequestDetails />} />
          {/* <Route path="/admin" element={<AdminPage />} />
          <Route path="/register" element={<AuthComponent />} /> */}
        </Routes>
        <Footer />
      </Router>
    </PlayerProvider>
  );
};

export default App;
