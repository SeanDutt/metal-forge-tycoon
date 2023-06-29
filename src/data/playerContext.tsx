import { collection, doc, getDocs, onSnapshot } from 'firebase/firestore';
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { db } from '../firebase.ts';
import { Player } from './player.tsx';

type PlayerProviderProps = {
  children: ReactNode;
  playerId: string;
};

const defaultPlayer: Player = {
  displayName: '',
  id: '',
  inventory: {},
  skillLevels: {},
  completedRequests: {}
};

export const PlayerContext = createContext<Player>(defaultPlayer);

export const PlayerProvider: React.FC<PlayerProviderProps> = ({ children, playerId }) => {
  
  const [playerData, setPlayerData] = useState<Player>({ ...defaultPlayer, inventory: {} });

  useEffect(() => {
    // Get the player document reference
    const playerDocRef = doc(db, "players", playerId);
  
    // Attach the real-time listener to the player document
    const unsubscribe = onSnapshot(playerDocRef, (snapshot) => {
      const data = snapshot.data();
      if (data) {
        // Fetch the player's inventory subcollection
        const inventoryRef = collection(playerDocRef, "inventory");
        const inventoryData: Record<string, any> = {};
  
        // Retrieve the inventory documents in the subcollection
        getDocs(inventoryRef)
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              inventoryData[doc.id] = doc.data();
            });
            // Update the player data with the retrieved inventory
            setPlayerData((prevPlayerData) => ({
              ...prevPlayerData,
              ...data,
              inventory: inventoryData
            }));
          })
          .catch((error) => {
            console.error("Error fetching player inventory:", error);
          });
      } else {
        setPlayerData(defaultPlayer);
      }
    });
  
    // Clean up the listener when the component unmounts or the user logs out
    return () => unsubscribe();
  }, [playerId]);

  return (
    <PlayerContext.Provider value={playerData}>
      {children}
    </PlayerContext.Provider>
  );
};

