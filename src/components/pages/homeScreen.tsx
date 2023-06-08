import React from "react";
import Card from "../card";

function HomeScreen({ components }) {
    return (
      <div>
        <h1>Home Screen</h1>
          {components.map((component, index) => (
            <Card 
              key={index}
              primaryText={component.name}
              secondaryText={[component.text]}
              link={`/${component.name}`}
            />
          ))}
      </div>
    );
  }

  export default HomeScreen