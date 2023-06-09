import React from "react";
import Card from "../card.tsx";

export interface HomeScreenComponent {
  name: string;
  text: string;
}

interface HomeScreenProps {
  components: HomeScreenComponent[];
}

function HomeScreen({ components }: HomeScreenProps ) {
    return (
      <div>
        <h1>Home Screen</h1>
          {components.map((component, index: number) => (
            <Card 
              key={index}
              primaryText={component.name}
              secondaryText={[component.text] || ''}
              link={`/${component.name}`}
            />
          ))}
      </div>
    );
  }

  export default HomeScreen