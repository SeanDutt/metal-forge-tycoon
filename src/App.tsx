import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './components/pages/homeScreen';
import ItemDetails from './components/dynamic/itemDetails';
import AuthComponent from './components/pages/registration';
import './components/card.css';
import Workshop from './components/pages/workshop';
import { PlayerProvider } from './data/playerContext';
import Inventory from './components/pages/inventory';
import Footer from './components/footer';
import Explore from './components/pages/explore';
import LocationDetails from './components/dynamic/locationDetails';
import { AdminPage } from './components/pages/adminPage';
import NPCRequests from './components/pages/npcrequests';
import NPCRequestDetails from './components/dynamic/npcrequestDetails';

const playerId = 'mw0fv8p34Deta2SOLqetLkYeisF3';

const App: React.FC = () => {
  
  const components = [
    { name: 'Inventory', },
    { name: 'Workshop', text: 'Craft things here!' },
    { name: 'Explore', text: 'Go on a resource run!'},
    { name: 'Requests', text: 'What do you want?'},
    { name: 'Admin', text: 'Create things' },
    { name: 'Register', },
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

            <Route path="/admin" element={<AdminPage />} />
            <Route path="/register" element={<AuthComponent />} />
        </Routes>
        <Footer />
      </Router>
    </PlayerProvider>
  );
}

export default App;