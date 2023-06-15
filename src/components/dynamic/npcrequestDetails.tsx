import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import React from 'react';
import { NPCRequest } from '../pages/npcrequests.tsx';
import { db } from '../../firebase.ts';
import Card from '../card.tsx';

const NPCRequestDetails = () => {
  const { npcRequestId } = useParams();
  const [npcRequest, setNpcRequest] = useState<NPCRequest>();
  const [itemImageUrls, setItemImageUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchNpcRequest = async () => {
      try {
        const npcRequestDocRef = doc(db, 'npcrequests', npcRequestId ?? '');
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

    const fetchItemData = async () => {
      try {
        const itemsCollectionRef = collection(db, 'items');
        const requestedItemNames = Object.keys(npcRequest?.requestedItems || {});
        const grantedItemNames = Object.keys(npcRequest?.grantedItems || {});
        const allItemNames = [...requestedItemNames, ...grantedItemNames];
        const itemQuery = query(itemsCollectionRef, where('name', 'in', allItemNames));
        const itemQuerySnapshot = await getDocs(itemQuery);
        const itemImageUrls: Record<string, string> = {};
        itemQuerySnapshot.forEach((itemDoc) => {
          const itemData = itemDoc.data();
          itemImageUrls[itemData.name] = itemData.imageUrl;
        });
        setItemImageUrls(itemImageUrls);
      } catch (error) {
        console.error('Error fetching item data:', error);
      }
    };
    

    fetchNpcRequest();
    fetchItemData();
  }, [npcRequest?.grantedItems, npcRequest?.requestedItems, npcRequestId]);

  if (!npcRequest) {
    return <p>Loading...</p>;
  }

  const requestedItems: Record<string, number> = npcRequest.requestedItems as Record<string, number>;
  const grantedItems: Record<string, number> = npcRequest.grantedItems as Record<string, number>;

  return (
    <div>
      {npcRequest.imageUrl && 
        <img src={require(`../../data/requestIcons/${npcRequest.imageUrl}`)} alt="NPC Icon" />}

      <h2>{npcRequestId}</h2>
      <p>{npcRequest.description}</p>
      <span>{npcRequest.from} requests that you bring:</span>
      {renderItems(requestedItems, itemImageUrls)}

      <span>You will be rewarded with:</span>
      {renderItems(grantedItems, itemImageUrls)}
    </div>
  );
};

const renderItems = (
  items: Record<string, number>,
  itemImageUrls: Record<string, string>
) => {
  return Object.entries(items).map(([item, quantity]) => (
    <Card
      key={item}
      icon={itemImageUrls[item] ? require(`../../data/itemIcons/${itemImageUrls[item]}`) : null}
      primaryText={item}
      rightElement={<p>{quantity}x</p>}
      link={`/item/${item}`}
    />
  ));
};

export default NPCRequestDetails;
