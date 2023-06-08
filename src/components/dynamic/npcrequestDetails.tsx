import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebase';
import Card from '../card';
import { NPCRequest } from '../pages/npcrequests';

const NPCRequestDetails = () => {
  const { npcRequestId } = useParams();
  const [npcRequest, setNpcRequest] = useState<NPCRequest>();

  useEffect(() => {
    const fetchNpcRequest = async () => {
      try {
        const npcRequestDocRef = doc(db, 'npcrequests', npcRequestId);
        const npcRequestDocSnapshot = await getDoc(npcRequestDocRef);
        if (npcRequestDocSnapshot.exists()) {
          const npcRequestData = npcRequestDocSnapshot.data();
          setNpcRequest(npcRequestData as NPCRequest);
        } else {
          console.log('NPC Request document does not exist.');
        }
      } catch (error) {
        console.error('Error fetching NPC request:', error);
      }
    };
    fetchNpcRequest();
  }, [npcRequestId]);

  if (!npcRequest) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>{npcRequestId}</h2>
      <p>{npcRequest.description}</p>
      <span>{npcRequest.from} requests that you bring:</span>
      {Object.entries(npcRequest.requestedItems).map(([item, quantity]) => (
        <Card
          primaryText={item}
          rightElement={<p>{quantity}x</p>}
          link={`/item/${item}`}
        />
      ))}

      <span>You will be rewarded with:</span>
      {Object.entries(npcRequest.grantedItems).map(([item, quantity]) => (
        <Card
          primaryText={item}
          rightElement={<p>{quantity}x</p>}
          link={`/item/${item}`}
        />
      ))}
    </div>
  );
};

export default NPCRequestDetails;
