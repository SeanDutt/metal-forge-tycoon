import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import React from "react";
import { db } from "../../firebase.ts";
import Card from "../card.tsx";
import { NpcRequest } from "../../data/npcRequest.ts";

const NPCRequestDetails = () => {
  const { npcRequestId } = useParams();
  const [npcRequest, setNpcRequest] = useState<NpcRequest>();

  useEffect(() => {
    const fetchNpcRequest = async () => {
      try {
        const chainsCollectionRef = collection(db, "npcrequests");
        const chainsQuerySnapshot = await getDocs(chainsCollectionRef);
  
        chainsQuerySnapshot.forEach((chainDoc) => {
          const chainData = chainDoc.data();
          const requests = chainData?.requests;
          const request = requests.find((req: NpcRequest) => req.name === npcRequestId);
          if (request) {
            setNpcRequest(request);
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
  

  if (!npcRequest) {
    return <p>Loading...</p>;
  }

  const requestedItems: Record<string, number> =
    npcRequest.requestedItems as Record<string, number>;
  const grantedItems: Record<string, number> =
    npcRequest.grantedItems as Record<string, number>;


  return (
    <div>
      {npcRequest.from && (
        <img
          // src={require(`../../data/requestIcons/${npcRequest.from}.png`) || null}
          alt="NPC Icon"
        />
      )}
      <h2>{npcRequestId}</h2>
      <p dangerouslySetInnerHTML={{__html: npcRequest.description}}></p>
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

const renderItems = (items: Record<string, number>) => {
  return Object.entries(items).map(([item, quantity]) => (
    <Card
      key={item}
      // icon={item ? require(`../../data/itemIcons/${item}.png`) : null}
      primaryText={item}
      rightElement={<p>{quantity}x</p>}
      link={`/item/${item}`}
    />
  ));
};

export default NPCRequestDetails;
