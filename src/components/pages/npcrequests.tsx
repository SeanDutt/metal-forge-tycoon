import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { db } from "../../firebase.ts";
import Card from "../card.tsx";
import { PlayerContext } from "../../data/playerContext.tsx";
import { NpcRequest } from "../../data/npcRequest.ts";

const NpcRequests = () => {
  const player = useContext(PlayerContext);
  const [requests, setRequests] = useState<NpcRequest[]>([]);
  const [playerCompletedRequests, setPlayerCompletedRequests] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const requestsCollectionRef = collection(db, "npcrequests");
        const requestsQuerySnapshot = await getDocs(requestsCollectionRef);

        const requestChains: NpcRequest[][] = [];

        for (const doc of requestsQuerySnapshot.docs) {
          const requestChainData = doc.data();
          const requestChain: NpcRequest[] = requestChainData.requests || [];
          requestChains.push(requestChain);
        }

        setRequests(requestChains.flat());
      } catch (error) {
        console.error("Error fetching request chains:", error);
      }
    };

    const fetchPlayerCompletedRequests = async () => {
      try {
        const playerId = player.id;
        const playerDocRef = doc(db, "players", playerId);
        const playerDocSnapshot = await getDoc(playerDocRef);

        if (playerDocSnapshot.exists()) {
          const playerData = playerDocSnapshot.data();
          const completedRequests = playerData?.completedRequests || {};
          setPlayerCompletedRequests(completedRequests);
        }
      } catch (error) {
        console.error("Error fetching player's completed requests:", error);
      }
    };

    fetchRequests();
    fetchPlayerCompletedRequests();
  }, []);

  console.log(requests, playerCompletedRequests)

  return (
    <div>
      <h1>Quests</h1>
      {requests.map((request) => (
        <Card
          key={request.name}
          // icon={
          //   request.from
          //     ? require(`../../data/requestIcons/${request.from}`)
          //     : null
          // }
          primaryText={request.name}
          secondaryText={[`Request from ${request.from}`]}
          link={`/Requests/${request.name}`}
        />
      ))}
    </div>
  );
};

export default NpcRequests;
