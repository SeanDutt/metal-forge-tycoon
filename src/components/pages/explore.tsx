import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import Card from "../card.tsx";
import React from "react";
import { db } from "../../firebase.ts";

export interface ExploreLocation {
  imageUrl: string;
  name: string;
  description: string;
  lootPool: Record<string, number>;
}

const Explore = () => {
  const [locations, setLocations] = useState<ExploreLocation[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locationsCollection = collection(db, "locations");
        const locationsSnapshot = await getDocs(locationsCollection);
        const locationsData = locationsSnapshot.docs.map((doc) => doc.data());
        setLocations(locationsData as ExploreLocation[]);
      } catch (error) {
        console.error("Error fetching explore locations:", error);
      }
    };

    fetchLocations();
  }, []);

  return (
    <div>
      <h2>Explore Locations</h2>
      {locations.map((location) => (
        <Card
          key={location.name}
          icon={
            location.name
              ? require(`../../data/exploreIcons/${location.imageUrl}`)
              : undefined
          }
          primaryText={location.name}
          secondaryText={[location.description]}
          link={`/Explore/${location.name}`}
        />
      ))}
    </div>
  );
};

export default Explore;
