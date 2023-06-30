import React from "react";
import Card from "../card.tsx";

export interface HomeScreenComponent {
  name: string;
  text: string;
  imageUrl?: string;
}

const components: HomeScreenComponent[] = [
  {
    name: "Inventory",
    text: "All your stuff.",
    imageUrl: "buildingIcons/inventory.png",
  },
  {
    name: "Workshop",
    text: "Craft things here!",
    imageUrl: "buildingIcons/workshop.png",
  },
  {
    name: "Explore",
    text: "Go on a resource run!",
    imageUrl: "exploreIcons/Forest.png",
  },
  {
    name: "Requests",
    text: "What do you want?",
    imageUrl: "requestIcons/Woody.png",
  },
  {
    name: "Buildings",
    text: "Manage automatic resources.",
    imageUrl: "buildingIcons/Tree Farm.png",
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
          icon={
            component.imageUrl
              ? require(`../../data/${component.imageUrl}`)
              : null
          }
          primaryText={component.name}
          secondaryText={[component.text] || ""}
          link={`/${component.name}`}
        />
      ))}
    </div>
  );
}

export default HomeScreen;
