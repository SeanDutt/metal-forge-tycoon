import { doc, onSnapshot } from 'firebase/firestore';
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
  completedQuests: []
};

export const PlayerContext = createContext<Player>(defaultPlayer);

export const PlayerProvider: React.FC<PlayerProviderProps> = ({ children, playerId }) => {
  const [playerData, setPlayerData] = useState<Player>(defaultPlayer);

  useEffect(() => {
    // Get the player document reference
    const playerDocRef = doc(db, "players", playerId);

    // Attach the real-time listener to the player's inventory document
    const unsubscribe = onSnapshot(playerDocRef, (snapshot) => {
      const data = snapshot.data();
      data && setPlayerData(data as Player);
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
