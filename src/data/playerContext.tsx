import { collection, doc, getDoc, getDocs, onSnapshot } from 'firebase/firestore';
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
    const playerDocRef = doc(db, 'players', playerId);
    const inventoryRef = collection(playerDocRef, 'inventory');
    
    const getPlayerData = async () => {
      try {
        const playerSnapshot = await getDoc(playerDocRef);
        
        if (playerSnapshot.exists()) {
          const playerData = playerSnapshot.data();
          const inventorySnapshot = await getDocs(inventoryRef);
          
          const inventoryData: Record<string, any> = {};
          inventorySnapshot.forEach((doc) => {
            inventoryData[doc.id] = doc.data();
          });
          
          setPlayerData((prevPlayerData) => ({
            ...prevPlayerData,
            ...playerData,
            inventory: inventoryData
          }));
        } else {
          setPlayerData(defaultPlayer);
        }
      } catch (error) {
        console.error('Error fetching player data:', error);
      }
    };
  
    const unsubscribe = onSnapshot(playerDocRef, () => {
      // Trigger the fetch of player data
      getPlayerData();
    });

    return () => unsubscribe();
  }, [playerId]);
  
  console.log(playerData);

  return (
    <PlayerContext.Provider value={playerData}>
      {children}
    </PlayerContext.Provider>
  );
};

