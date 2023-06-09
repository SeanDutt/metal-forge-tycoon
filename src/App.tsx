import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen, { HomeScreenComponent } from './components/pages/homeScreen.tsx';
import ItemDetails from './components/dynamic/itemDetails.tsx';
import AuthComponent from './components/pages/registration.tsx';
import './components/card.css';
import Workshop from './components/pages/workshop.tsx';
import { PlayerProvider } from './data/playerContext.tsx';
import Inventory from './components/pages/inventory.tsx';
import Footer from './components/footer.tsx';
import Explore from './components/pages/explore.tsx';
import LocationDetails from './components/dynamic/locationDetails.tsx';
import { AdminPage } from './components/pages/adminPage.tsx';
import NPCRequests from './components/pages/npcrequests.tsx';
import NPCRequestDetails from './components/dynamic/npcrequestDetails.tsx';

const playerId = 'mw0fv8p34Deta2SOLqetLkYeisF3';

const App: React.FC = () => {
  
  const components: HomeScreenComponent[] = [
    { name: 'Inventory', text: '' },
    { name: 'Workshop', text: 'Craft things here!' },
    { name: 'Explore', text: 'Go on a resource run!' },
    { name: 'Requests', text: 'What do you want?' },
    // { name: 'Admin', text: 'Create things' },
    { name: 'Register', text: '' },
    // Add more components to the array
  ];

  return (
    <PlayerProvider playerId={playerId}>
      <Router>
        <Routes>
          {/* Redirect to login page if not authenticated */}
            <Route path="/" element={<HomeScreen components={components} />} />
            <Route path="/workshop" element={<Workshop />} />
            
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/item/:itemId" element={<ItemDetails />} /> {/* Dynamic route for item details */}

            <Route path="/explore" element={<Explore />} />
            <Route path="/explore/:location" element={<LocationDetails />} /> {/* Dynamic route for location details */}
            
            <Route path="/requests" element={<NPCRequests />} />
            <Route path="/requests/:npcRequestId" element={<NPCRequestDetails />} />

            {/* <Route path="/admin" element={<AdminPage />} /> */}
            <Route path="/register" element={<AuthComponent />} />
        </Routes>
        <Footer />
      </Router>
    </PlayerProvider>
  );
}

export default App;