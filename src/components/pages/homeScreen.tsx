import React from "react";
import Card from "../card.tsx";
import inventoryIcon from "../../data/buildingIcons/inventory.png";
import workshopIcon from "../../data/buildingIcons/workshop.png";
import exploreIcon from "../../data/exploreIcons/forest.png";
import requestIcon from "../../data/requestIcons/woody.png";
import buildingIcon from "../../data/buildingIcons/tree farm.png";

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
  return (
    <div>
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
