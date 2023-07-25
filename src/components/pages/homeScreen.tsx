import React, { useContext } from "react";
import Card from "../card.tsx";
import inventoryIcon from "../../data/homeIcons/inventory.png";
import workshopIcon from "../../data/homeIcons/workshop.png";
import exploreIcon from "../../data/homeIcons/forest.png";
import requestIcon from "../../data/homeIcons/eamon.png";
import { PlayerContext } from "../../data/playerContext.tsx";
import buildingIcon from "../../data/homeIcons/treefarm.png";

export interface HomeScreenComponent {
  name: string;
  text: string;
  imageUrl?: string;
}

const components: HomeScreenComponent[] = [
  {
    name: "Inventory",
    text: "All your stuff.",
    imageUrl: inventoryIcon,
  },
  {
    name: "Workshop",
    text: "Craft things here!",
    imageUrl: workshopIcon,
  },
  {
    name: "Explore",
    text: "Go on a resource run!",
    imageUrl: exploreIcon,
  },
  {
    name: "Requests",
    text: "What do you want?",
    imageUrl: requestIcon,
  },
  {
    name: "Buildings",
    text: "Manage automatic resources.",
    imageUrl: buildingIcon,
  },
  // { name: 'Admin', text: 'Create things' },
  // { name: 'Register', text: '' },
  // Add more components to the array
];

function HomeScreen() {
  const playerData = useContext(PlayerContext);
  return (
    <div>
      <h2>{playerData.displayName}</h2>
      {components.map((component, index: number) => (
        <Card
          key={index}
          icon={component.imageUrl}
          primaryText={component.name}
          secondaryText={[component.text] || ""}
          link={`/${component.name}`}
        />
      ))}
    </div>
  );
}

export default HomeScreen;
