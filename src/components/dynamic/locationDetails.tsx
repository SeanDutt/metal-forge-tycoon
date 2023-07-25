import { doc, getDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PlayerContext } from "../../data/playerContext.tsx";
import { db } from "../../firebase.ts";
import {
  addToInventory,
  fetchItemDocuments,
} from "../../utils/inventoryUtils.tsx";
import Card from "../card.tsx";
import { ExploreLocation } from "../pages/explore.tsx";
import { ItemWithQuantity } from "../../data/items.ts";

interface LootPoolItem {
  itemName: string;
  probability: number;
  imageUrl: string;
}

const LocationDetails = () => {
  const { location } = useParams();
  const player = useContext(PlayerContext);
  const [locationData, setLocationData] = useState<ExploreLocation | null>(
    null
  );
  const [lootPool, setLootPool] = useState<LootPoolItem[]>([]);
  const [lastObtainedItems, setLastObtainedItems] = useState<string[]>([]);

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const locationDocRef = doc(db, "locations", location ?? "");
        const locationDocSnapshot = await getDoc(locationDocRef);

        if (locationDocSnapshot.exists()) {
          const locationData = locationDocSnapshot.data();
          setLocationData(locationData as ExploreLocation);
        } else {
          console.log("Location document does not exist.");
        }
      } catch (error) {
        console.error("Error fetching location data:", error);
      }
    };
    location && fetchLocationData();
  }, [location]);

  useEffect(() => {
    const fetchLootPoolItems = async () => {
      if (locationData) {
        const lootPoolItems = locationData.lootPool || {};
        const itemNames = Object.keys(lootPoolItems);

        // Fetch the item documents based on their names
        const itemDocuments = await fetchItemDocuments(itemNames);

        // Map the fetched item documents to the loot pool items
        const lootPool = itemDocuments.map((itemDoc) => {
          const itemName = itemDoc.name;
          const imageUrl = itemDoc.imageUrl;
          const probability = lootPoolItems[itemName];
          return { itemName, probability, imageUrl };
        });

        setLootPool(lootPool);
      }
    };

    fetchLootPoolItems();
  }, [locationData]);

  const handleExplore = async () => {
    // Randomly select items from the loot pool
    const obtainedItems: ItemWithQuantity[] = lootPool
      .filter((item) => Math.random() < item.probability)
      .map((lootItem: LootPoolItem) => ({
        item: lootItem.itemName, // Assuming lootItem has an "itemName" property
        quantity: 1, // You can adjust the quantity as needed
      }));
  
    console.log("Obtained Items:", obtainedItems);
    console.log("Player ID:", player?.id);
  
    if (obtainedItems.length > 0 && player?.id) {
      await addToInventory(player.id, obtainedItems);
      setLastObtainedItems(obtainedItems.map((item) => item.item));
    } else {
      setLastObtainedItems(["Nothing!"]);
    }
  };

  // Render loading state if data is not yet fetched
  if (!locationData || lootPool.length === 0) {
    return <p>Loading...</p>;
  }

  console.log(lastObtainedItems);

  return (
    <div>
      {locationData.name && (
        <div className="img-container">
          <img
            src={require(`../../data/exploreIcons/${locationData.imageUrl}`)}
            alt="Explore location icon"
          />
        </div>
      )}
      <Card
        primaryText={`You enter the ${locationData.name}.`}
        rightElement={<button onClick={handleExplore}>Explore</button>}
      />
      {lastObtainedItems.length > 0 && (
        <p>You found: {lastObtainedItems.join(", ")}</p>
      )}
      <h2>Available loot:</h2>
      {lootPool
        .sort((a, b) => b.probability - a.probability) // Sort by probability in descending order
        .map((item) => (
          <Card
            key={item.itemName}
            icon={
              item.itemName
                ? require(`../../data/itemIcons/${item.imageUrl}`)
                : null
            }
            primaryText={item.itemName}
            link={`/item/${item.itemName}`}
          />
        ))}
    </div>
  );
};

export default LocationDetails;
