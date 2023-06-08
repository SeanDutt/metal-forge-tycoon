import { doc, onSnapshot } from 'firebase/firestore';
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { db } from '../firebase';
import { Player } from './player';

type PlayerProviderProps = {
  children: ReactNode;
  playerId: string;
};

export const PlayerContext = createContext<Player | null>(null);

export const PlayerProvider: React.FC<PlayerProviderProps> = ({ children, playerId }) => {
  const [playerData, setPlayerData] = useState(null);

  useEffect(() => {
    // Get the player document reference
    const playerDocRef = doc(db, "players", playerId);

    // Attach the real-time listener to the player's inventory document
    const unsubscribe = onSnapshot(playerDocRef, (snapshot) => {
      const data = snapshot.data();
      setPlayerData(data);
    });

    // Clean up the listener when the component unmounts or the user logs out
    return () => unsubscribe();
  }, []);

  return (
    <PlayerContext.Provider value={playerData}>
      {children}
    </PlayerContext.Provider>
  );
};
