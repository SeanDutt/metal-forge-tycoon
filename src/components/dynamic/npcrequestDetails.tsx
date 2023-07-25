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
import { db, getItemById } from "../../firebase.ts";
import Card from "../card.tsx";
import { NpcRequest } from "../../data/npcRequest.ts";
import { Player } from "../../data/player.ts";
import { doesPlayerHaveResources } from "../../utils/requirements.tsx";
import { PlayerContext } from "../../data/playerContext.tsx";
import {
  addToInventory,
  removeFromInventory,
} from "../../utils/inventoryUtils.tsx";
import { Item, ItemWithQuantity } from "../../data/items.ts";

async function completeRequest(
  player: Player,
  npcRequestChainName: string,
  npcRequestName: string,
  requestedItems: ItemWithQuantity[],
  grantedItems: ItemWithQuantity[]
): Promise<void> {
  const completionDate = new Date().toISOString();

  // Remove the requested items from the player's inventory
  await removeFromInventory(player.id, requestedItems);

  // Add the granted items to the player's inventory
  await addToInventory(player.id, grantedItems);

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
  const [requestedItems, setRequestedItems] = useState<ItemWithQuantity[]>([]);
  const [grantedItems, setGrantedItems] = useState<ItemWithQuantity[]>([]);

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
      } catch (error) {
        console.error("Error fetching NPC request:", error);
      }
    };

    fetchNpcRequest();
  }, [npcRequestId]);

  useEffect(() => {
    const fetchRequest = async () => {
      if (
        npcRequest &&
        npcRequest.requestedItems &&
        npcRequest.requestedQuantity
      ) {
        const fetchItems = async () => {
          const requestedItemsWithDetails = await Promise.all(
            npcRequest.requestedItems.map(async (itemName, index) => {
              const item = await getItemById(itemName);
              if (item) {
                return {
                  item: item.name,
                  imageUrl: item.imageUrl || "",
                  itemDoc: item,
                  quantity: npcRequest.requestedQuantity[index],
                };
              }
              return null;
            })
          );

          const filteredRequestedItems = requestedItemsWithDetails.filter(
            (
              item
            ): item is {
              item: string;
              imageUrl: string;
              itemDoc: Item;
              quantity: number;
            } => item !== null
          );

          setRequestedItems(filteredRequestedItems as ItemWithQuantity[]);
        };

        fetchItems();
      }

      if (npcRequest && npcRequest.grantedItems && npcRequest.grantedQuantity) {
        const fetchItems = async () => {
          const grantedItemsWithDetails = await Promise.all(
            npcRequest.grantedItems.map(async (itemName, index) => {
              const item = await getItemById(itemName);
              if (item) {
                return {
                  item: item.name,
                  imageUrl: item.imageUrl || "",
                  itemDoc: item,
                  quantity: npcRequest.grantedQuantity[index],
                };
              }
              return null;
            })
          );

          const filteredGrantedItems = grantedItemsWithDetails.filter(
            (
              item
            ): item is {
              item: string;
              imageUrl: string;
              itemDoc: Item;
              quantity: number;
            } => item !== null
          );

          setGrantedItems(filteredGrantedItems as ItemWithQuantity[]);
        };

        fetchItems();
      }
    };
    fetchRequest();
  }, [npcRequest]);

  if (!npcRequest) {
    return <p>Loading...</p>;
  }

  console.log(requestedItems, grantedItems, npcRequest);

  return (
    <div>
      <Card
        primaryText={npcRequestId || ""}
        icon={(() => {
          try {
            return require(`../../data/requestIcons/${npcRequest.imageUrl}`);
          } catch (error) {
            console.error(error);
            return require(`../../data/itemIcons/noIcon.png`);
          }
        })()}
      />
      <p dangerouslySetInnerHTML={{ __html: npcRequest.description }}></p>
      {doesPlayerHaveResources(player, requestedItems) && (
        <p>
          <button
            onClick={() =>
              completeRequest(
                player,
                requestChainId,
                npcRequest.name,
                requestedItems,
                grantedItems
              )
            }
          >
            Complete Request
          </button>
        </p>
      )}

      {requestedItems.length > 0 && (
        <>
          <p>{npcRequest.from} requests that you bring:</p>
          {requestedItems.map((item, index) => {
            return (
              <Card
                key={index}
                icon={require(`../../data/itemIcons/${
                  item.imageUrl || "noIcon.png"
                }`)}
                primaryText={item.item}
                rightElement={`${item.quantity}x`}
                link={`/item/${item.item}`}
              />
            );
          })}
        </>
      )}

      {grantedItems.length > 0 && (
        <>
          <p>You will be rewarded with:</p>
          {grantedItems.map((item, index) => {
            return (
              <Card
                key={index}
                icon={require(`../../data/itemIcons/${
                  item.imageUrl || "noIcon.png"
                }`)}
                primaryText={item.item}
                rightElement={`${item.quantity}x`}
                link={`/item/${item.item}`}
              />
            );
          })}
        </>
      )}
    </div>
  );
};

export default NPCRequestDetails;
