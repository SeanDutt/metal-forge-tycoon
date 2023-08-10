import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  Unsubscribe,
} from "firebase/firestore";
import React, { createContext, ReactNode, useEffect, useState } from "react";
import { db } from "../firebase.ts";
import { Player } from "./player.tsx";

type PlayerProviderProps = {
  children: ReactNode;
  playerId: string;
};

const defaultPlayer: Player = {
  displayName: "",
  id: "",
  inventory: {},
  skillLevels: {},
  completedRequests: {},
};

export const PlayerContext = createContext<Player>(defaultPlayer);

export const PlayerProvider: React.FC<PlayerProviderProps> = ({
  children,
  playerId,
}) => {
  const [playerData, setPlayerData] = useState<Player>(defaultPlayer);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const playerDocRef = doc(db, "players", playerId);
    const inventoryRef = collection(playerDocRef, "inventory");
    const completedRequestsRef = collection(playerDocRef, "completedRequests");

    const getPlayerData = async () => {
      try {
        const playerSnapshot = await getDoc(playerDocRef);

        if (playerSnapshot.exists()) {
          const playerData = playerSnapshot.data();

          // Fetch inventory data
          const inventorySnapshot = await getDocs(inventoryRef);
          const inventoryData: Record<string, any> = {};
          inventorySnapshot.forEach((doc) => {
            inventoryData[doc.id] = doc.data();
          });

          // Fetch completedRequests data
          const completedRequestsSnapshot = await getDocs(completedRequestsRef);
          const completedRequestsData: Record<string, any> = {};
          completedRequestsSnapshot.forEach((doc) => {
            completedRequestsData[doc.id] = doc.data();
          });

          setPlayerData(
            (prevPlayerData) =>
              ({
                ...prevPlayerData,
                ...playerData,
                inventory: inventoryData,
                completedRequests: completedRequestsData, // Add completedRequests data
              } as Player)
          );
        } else {
          setPlayerData(defaultPlayer);
        }
      } catch (error) {
        console.error("Error fetching player data:", error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe: Unsubscribe = onSnapshot(playerDocRef, (snapshot) => {
      // Trigger the fetch of player data only if the document exists
      if (snapshot.exists()) {
        getPlayerData();
      } else {
        setPlayerData(defaultPlayer);
      }
    });

    return () => unsubscribe();
  }, [playerData, playerId]);

  if (loading) {
    // Show a loading indicator or component while player data is being fetched
    return <div>Loading...</div>;
  }

  return (
    <PlayerContext.Provider value={playerData}>
      {children}
    </PlayerContext.Provider>
  );
};
