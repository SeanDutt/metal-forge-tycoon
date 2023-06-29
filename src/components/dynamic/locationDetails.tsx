import { doc, getDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PlayerContext } from "../../data/playerContext.tsx";
import { db } from "../../firebase.ts";
import { addToInventory } from "../../utils/inventoryUtils.tsx";
import Card from "../card.tsx";
import { ExploreLocation } from "../pages/explore.tsx";

interface LootPoolItem {
  itemName: string;
  probability: number;
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
        const lootPool = await Promise.all(
          Object.entries(lootPoolItems).map(async ([itemName, probability]) => {
            return {
              itemName,
              probability,
            };
          })
        );

        setLootPool(lootPool);
      }
    };

    fetchLootPoolItems();
  }, [locationData]);

  const handleExplore = async () => {
    // Randomly select items from the loot pool
    const obtainedItems = lootPool.filter(
      (item) => Math.random() < item.probability
    );

    if (obtainedItems.length > 0 && player?.id) {
      await addToInventory(player.id, obtainedItems);
      setLastObtainedItems(obtainedItems.map((item) => item.itemName));
    } else {
      setLastObtainedItems(["nothing!"]);
    }
  };

  // Render loading state if data is not yet fetched
  if (!locationData || lootPool.length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {locationData.name && (
        <div className="img-container">
          <img
            src={require(`../../data/exploreIcons/${locationData.name}.png`)}
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
              item.itemName ? require(`../../data/itemIcons/${item.itemName}.png`) : null
            }
            primaryText={item.itemName}
            link={`/item/${item.itemName}`}
          />
        ))}
    </div>
  );
};

export default LocationDetails;
