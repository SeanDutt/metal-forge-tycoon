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
  const [requestCards, setRequestCards] = useState<React.ReactNode[]>([]);

  const generateRequestCards = (preRequests: NpcRequest[]) => {
    const cards = preRequests.map((request) => {
      return (
        <Card
        key={request.name}
        icon={
          request
            ? require(`../../data/requestIcons/${request.imageUrl}`)
            : require(`../../data/itemIcons/noIcon.png`)
        }
        primaryText={request.name}
        secondaryText={[`Request from ${request.from}`]}
        link={`/Requests/${request.name}`}
      />
      )
    }) 
    setRequestCards(cards);
  }

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
    generateRequestCards(requests);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player]);

  if (!requestCards) {
    // Handle case when requests data is generating
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Inventory</h2>
      {requestCards.length > 0 ? (
        <div>{requestCards}</div>
      ) : (
        <p>No requests available.</p>
      )}
    </div>
  );
};

export default NpcRequests;
