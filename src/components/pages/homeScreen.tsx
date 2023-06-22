import React from "react";
import Card from "../card.tsx";

export interface HomeScreenComponent {
  name: string;
  text: string;
  imageUrl?: string;
}

interface HomeScreenProps {
  components: HomeScreenComponent[];
}

function HomeScreen({ components }: HomeScreenProps) {
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
