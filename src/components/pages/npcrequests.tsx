import React, { useContext, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase.ts";
import Card from "../card.tsx";
import { PlayerContext } from "../../data/playerContext.tsx";
import { NpcRequest } from "../../data/npcRequest.ts";
import { doesPlayerMeetRequirements } from "../../utils/requirements.tsx";

const NpcRequests = () => {
  const player = useContext(PlayerContext);
  const [requests, setRequests] = useState<NpcRequest[]>([]);

  const getRequestIndexInChain = (requestChainId: string): number => {
    const chainData = player.completedRequests?.[requestChainId];

    if (chainData && chainData.requests) {
      return chainData.requests.length;
    }

    return 0;
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const requestsCollection = collection(db, "npcrequests");
        const requestsSnapshot = await getDocs(requestsCollection);

        const requestChains: NpcRequest[][] = [];

        for (const doc of requestsSnapshot.docs) {
          const requestChainData = doc.data();
          const requestChain: NpcRequest[] = requestChainData.requests || [];
          const requestChainId = doc.id;

          const playerCompletedRequests =
            getRequestIndexInChain(requestChainId);

          if (
            requestChain[playerCompletedRequests] &&
            (!requestChain[playerCompletedRequests].requirements ||
              doesPlayerMeetRequirements(
                player,
                requestChain[playerCompletedRequests].requirements
              ))
          ) {
            // If the player meets the requirements of the next request or no requirements exist, add it to the chain
            requestChains.push([requestChain[playerCompletedRequests]]);
          }
        }
        console.log(requestChains.flat())
        setRequests(requestChains.flat());
      } catch (error) {
        console.error("Error fetching request chains:", error);
      }
    };
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player]);

  return (
    <div>
      <h1>Requests</h1>
      {requests.map((request) => (
        <Card
          key={request.name}
          icon={require(`../../data/requestIcons/${request.imageUrl}`)}
          primaryText={request.name}
          secondaryText={[`Request from ${request.from}`]}
          link={`/Requests/${request.name}`}
        />
      ))}
    </div>
  );
};

export default NpcRequests;
