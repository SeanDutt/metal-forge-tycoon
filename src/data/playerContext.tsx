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
  completedRequests: {},
};

export const PlayerContext = createContext<Player>(defaultPlayer);

export const PlayerProvider: React.FC<PlayerProviderProps> = ({ children, playerId }) => {
  const [playerData, setPlayerData] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);

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
            inventory: inventoryData,
          }) as Player);
          
        } else {
          setPlayerData(defaultPlayer);
        }
      } catch (error) {
        console.error('Error fetching player data:', error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onSnapshot(playerDocRef, (snapshot) => {
      // Trigger the fetch of player data only if the document exists
      if (snapshot.exists()) {
        getPlayerData();
      } else {
        setPlayerData(defaultPlayer);
      }
    });

    return () => unsubscribe();
  }, [playerId]);

  if (loading) {
    // Show a loading indicator or component while player data is being fetched
    return <div>Loading...</div>;
  }

  console.log(playerData);

  return (
    <PlayerContext.Provider value={playerData || defaultPlayer}>
      {children}
    </PlayerContext.Provider>
  );
};
