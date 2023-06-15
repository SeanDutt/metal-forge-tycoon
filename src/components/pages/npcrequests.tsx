import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase.ts';
import Card from '../card.tsx';

export interface NPCRequest {
  description: string;
  id: string;
  from: string;
  requestedItems: object;
  grantedItems: object;
  skillRequirements?: object;
  imageUrl?: string;
}

const NPCRequests = () => {
  const [requests, setRequests] = useState<NPCRequest[]>([]);

  useEffect(() => {
    const fetchQuests = async () => {
      try {
        const requestsCollectionRef = collection(db, 'npcrequests');
        const requestsQuerySnapshot = await getDocs(requestsCollectionRef);
        const requestsData = requestsQuerySnapshot.docs.map((doc) => {
            const requestData = doc.data() as NPCRequest;
            return { ...requestData, id: doc.id };
        });;
        setRequests(requestsData);
      } catch (error) {
        console.error('Error fetching quests:', error);
      }
    };

    fetchQuests();
  }, []);

  return (
    <div>
      <h1>Quests</h1>
      {requests.map((request) => (
        <Card
          key={request.id}
          icon={request.imageUrl ? require(`../../data/requestIcons/${request.imageUrl}`) : null}
          primaryText={request.id}
          secondaryText={[`Request from ${request.from}`]}
          link={`/Requests/${request.id}`}
        />
      ))}
    </div>
  );
};

export default NPCRequests;
