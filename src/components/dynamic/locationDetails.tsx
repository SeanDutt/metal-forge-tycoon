import { doc, getDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PlayerContext } from "../../data/playerContext";
import { db } from '../../firebase';
import { addToInventory } from "../../utils/inventoryUtils";
import Card from '../card';
import { ExploreLocation } from '../pages/explore';

interface LootPoolItem {
  itemName: string,
  probability: number
}

const LocationDetails = () => {
  const { location } = useParams();
  const player = useContext(PlayerContext);
  const [locationData, setLocationData] = useState<ExploreLocation>();
  const [lootPool, setLootPool] = useState<LootPoolItem[]>([]);

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const locationDocRef = doc(db, 'locations', location);
        const locationDocSnapshot = await getDoc(locationDocRef);

        if (locationDocSnapshot.exists()) {
          const locationData = locationDocSnapshot.data();
          setLocationData(locationData as ExploreLocation);

          const lootPoolItems = locationData.lootPool || {};
          const lootPool = Object.entries(lootPoolItems).map(([itemName, probability]) => ({
            itemName,
            probability,
          }));
          setLootPool(lootPool as LootPoolItem[]);
        } else {
          console.log('Location document does not exist.');
        }
      } catch (error) {
        console.error('Error fetching location data:', error);
      }
    };
    location && fetchLocationData();
  }, [location]);

  const handleExplore = async () => {
    // Randomly select items from the loot pool
    const obtainedItems = lootPool.filter((item) => Math.random() < item.probability);

    if (obtainedItems.length > 0) {
      await addToInventory(player?.id, obtainedItems);
      console.log('Items added to player\'s inventory:', obtainedItems);
    } else {
      console.log('No items obtained from exploring.');
    }
  };

  // Render loading state if data is not yet fetched
  if (!locationData || lootPool.length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{location}</h1>
      <Card
        primaryText="Explore"
        rightElement={<button onClick={handleExplore}>Explore</button>}
      />
      <h2>Available loot:</h2>
      {lootPool.map((item) => (
        <Card
          key={item.itemName}
          primaryText={item.itemName}
          link={`/item/${item.itemName}`}
        />
      ))}
    </div>
  );
};
  
export default LocationDetails