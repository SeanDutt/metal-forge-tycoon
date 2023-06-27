import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { db } from "../../firebase.ts";
import Card from "../card.tsx";
import { PlayerContext } from "../../data/playerContext.tsx";
import { NpcRequest } from "../../data/npcRequest.ts";
import { doesPlayerMeetRequirements } from "../../utils/requirements.tsx";

const getCompletedRequestsInChain = async (
  playerId: string,
  requestChain: string
): Promise<number> => {
  try {
    const completedRequestsDocRef = doc(
      db,
      "players",
      playerId,
      "completedRequests",
      requestChain
    );

    const playerDocSnapshot = await getDoc(completedRequestsDocRef);

    if (playerDocSnapshot.exists()) {
      const playerData = playerDocSnapshot.data();
      const completedRequests = playerData?.requests || [];
      return completedRequests.length;
    }
  } catch (error) {
    console.error("Error fetching player's completed requests:", error);
  }
  return 0;
};

const NpcRequests = () => {
  const player = useContext(PlayerContext);
  const [requests, setRequests] = useState<NpcRequest[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const requestsCollectionRef = collection(db, "npcrequests");
        const requestsQuerySnapshot = await getDocs(requestsCollectionRef);

        const requestChains: NpcRequest[][] = [];

        for (const doc of requestsQuerySnapshot.docs) {
          const requestChainData = doc.data();
          const requestChain: NpcRequest[] = requestChainData.requests || [];
          const requestChainId = doc.id; // Retrieve the ID of the request chain document

          const playerCompletedRequests = await getCompletedRequestsInChain(
            player.id,
            requestChainId // Pass the request chain ID to getCompletedRequestsInChain
          );

          if (
            requestChain[playerCompletedRequests]?.requirements &&
            doesPlayerMeetRequirements(
              player,
              requestChain[playerCompletedRequests].requirements
            )
          ) {
            // If the player meets the requirements of the next request, add it to the chain
            requestChains.push([requestChain[playerCompletedRequests]]);
          } else {
            requestChains.push([requestChain[playerCompletedRequests]]);
          }
        }

        setRequests(requestChains.flat());
      } catch (error) {
        console.error("Error fetching request chains:", error);
      }
    };

    fetchRequests();
  }, [player]);

  return (
    <div>
      <h1>Requests</h1>
      {requests.map((request) => (
        <Card
          key={request.name}
          icon={
            request.from
              ? require(`../../data/requestIcons/${request.from}.png`)
              : null
          }
          primaryText={request.name}
          secondaryText={[`Request from ${request.from}`]}
          link={`/Requests/${request.name}`}
        />
      ))}
    </div>
  );
};

export default NpcRequests;
