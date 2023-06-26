import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  collection,
  getDocs,
  setDoc,
  arrayUnion,
} from "firebase/firestore";
import React from "react";
import { db } from "../../firebase.ts";
import Card from "../card.tsx";
import { NpcRequest } from "../../data/npcRequest.ts";
import { Player } from "../../data/player.ts";
import { doesPlayerHaveResources } from "../../utils/requirements.tsx";
import { PlayerContext } from "../../data/playerContext.tsx";
import {
  addToInventory,
  removeFromInventory,
} from "../../utils/inventoryUtils.tsx";

async function completeRequest(
  player: Player,
  npcRequestChainName: string,
  npcRequestName: string,
  requestedItems: object,
  grantedItems: object
): Promise<void> {
  const completionDate = new Date().toISOString();

  // Remove the requested items from the player's inventory
  await removeFromInventory(player.id, [requestedItems]);

  // Add the granted items to the player's inventory
  await addToInventory(player.id, [grantedItems]);

  // Get the document reference for the completedRequests chain
  const completedRequestsDocRef = doc(
    db,
    "players",
    player.id,
    "completedRequests",
    npcRequestChainName
  );

  // Update the completedRequests document by adding the completed request
  await setDoc(
    completedRequestsDocRef,
    {
      requests: arrayUnion({
        name: npcRequestName,
        completionDate,
      }),
    },
    { merge: true }
  );
}

const NPCRequestDetails = () => {
  const player = useContext(PlayerContext);
  const { npcRequestId } = useParams();
  const [npcRequest, setNpcRequest] = useState<NpcRequest>();
  const [requestChainId, setRequestChainId] = useState<string>("");

  useEffect(() => {
    const fetchNpcRequest = async () => {
      try {
        const requestsCollectionRef = collection(db, "npcrequests");
        const querySnapshot = await getDocs(requestsCollectionRef);

        querySnapshot.forEach((chainDoc) => {
          const requestChainData = chainDoc.data();
          const requestChain = requestChainData.requests || [];
          const request = requestChain.find(
            (request: { name: string }) => request.name === npcRequestId
          );

          if (request) {
            setNpcRequest(request);
            setRequestChainId(chainDoc.id); // Set the request chain ID
            // Break the loop since we found the request
            throw new Error("Request found");
          }
        });

        console.log("NPC Request not found.");
      } catch (error) {
        console.error("Error fetching NPC request:", error);
      }
    };

    fetchNpcRequest();
  }, [npcRequestId]);

  const renderItems = (items: Record<string, number>) => {
    return Object.entries(items).map(([item, quantity]) => (
      <Card
        key={item}
        icon={(() => {
          try {
            return require(`../../data/itemIcons/${item}.png`);
          } catch (error) {
            console.error(error);
            return require(`../../data/itemIcons/NoIcon.png`);
          }
        })()}
        primaryText={item}
        rightElement={<p>{quantity}x</p>}
        link={`/item/${item}`}
      />
    ));
  };

  if (!npcRequest) {
    return <p>Loading...</p>;
  }

  const requestedItems: Record<string, number> =
    npcRequest.requestedItems as Record<string, number>;
  const grantedItems: Record<string, number> =
    npcRequest.grantedItems as Record<string, number>;

  console.log(npcRequest.requestedItems);

  return (
    <div>
      <Card
        primaryText={npcRequestId || ""}
        icon={(() => {
          try {
            return require(`../../data/requestIcons/${npcRequest.from}.png`);
          } catch (error) {
            console.error(error);
            return require(`../../data/itemIcons/NoIcon.png`);
          }
        })()}
      />
      <p dangerouslySetInnerHTML={{ __html: npcRequest.description }}></p>
      {doesPlayerHaveResources(player, npcRequest.requestedItems) && (
        <p>
          <button
            onClick={() =>
              completeRequest(
                player,
                requestChainId,
                npcRequest.name,
                npcRequest.requestedItems,
                npcRequest.grantedItems
              )
            }
          >
            Complete Request
          </button>
        </p>
      )}

      {Object.values(npcRequest.requestedItems).length > 0 && (
        <>
          <span>{npcRequest.from} requests that you bring:</span>
          {renderItems(requestedItems)}
        </>
      )}

      {Object.values(npcRequest.grantedItems).length > 0 && (
        <>
          <span>You will be rewarded with:</span>
          {renderItems(grantedItems)}
        </>
      )}
    </div>
  );
};

export default NPCRequestDetails;
