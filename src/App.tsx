import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import HomeScreen from "./components/pages/homeScreen.tsx";
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
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase.ts";
import AuthComponent from "./components/pages/registration.tsx";

const App: React.FC = () => {
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user.uid);
        setPlayerId(user.uid);
      } else {
        setPlayerId(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (playerId === null) {
    // User not logged in
    return (
      <Router>
        <Routes>
          <Route path="/" element={<AuthComponent />} />
        </Routes>
      </Router>
    );
  }

  return (
    <PlayerProvider playerId={playerId}>
      <Router>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/workshop" element={<Workshop />} />
          <Route path="/inventory" element={<Inventory />} />

          <Route path="/buildings" element={<ProductionBuildings />} />
          <Route path="/buildings/:buildingId" element={<BuildingDetails />} />

          <Route path="/item/:itemId" element={<ItemDetails />} />

          <Route path="/explore" element={<Explore />} />
          <Route path="/explore/:location" element={<LocationDetails />} />

          <Route path="/requests" element={<NPCRequests />} />
          <Route
            path="/requests/:npcRequestId"
            element={<NPCRequestDetails />}
          />
          {/* <Route path="/admin" element={<AdminPage />} /> */}
        </Routes>
        <Footer />
      </Router>
    </PlayerProvider>
  );
};

export default App;
