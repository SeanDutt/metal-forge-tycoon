import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PlayerContext } from "../../data/playerContext";
import { getRecipeForItemId, getRecipesByItemId } from "../../firebase";
import Card from "../card";

const ItemDetails = () => {
  const { itemId } = useParams(); // Retrieve the itemId from the URL parameter
  const playerData = useContext(PlayerContext); // Access the player data from the context
  const [recipeToCreate, setRecipeToCreate] = useState(null)
  const [usedInRecipes, setUsedInRecipes] = useState([]);

  const loadItemDetails = async () => {
    const recipeToCreateItem = await getRecipeForItemId(itemId);
    const recipesUsingItem = await getRecipesByItemId(itemId);
    setRecipeToCreate(recipeToCreateItem)
    setUsedInRecipes(recipesUsingItem)
  };

  useEffect(() => {
    loadItemDetails();
}, [itemId]);

  // Retrieve the item quantity from the player's inventory data
  const itemsOnHand = playerData?.inventory[itemId]?.ownedCurrent || 0;
  const itemsLifetime = playerData?.inventory[itemId]?.ownedLifetime || 0;

  return (
    <div>
        <h1>{itemId}</h1>
        <h2>Item Details</h2>
        <Card primaryText={`Currently owned: ${itemsOnHand}`}/>
        <Card primaryText={`All-time owned: ${itemsLifetime}`}/>
        {recipeToCreate?.skillRequirements !== undefined && (
          <>
            <p>Skill requirements:</p>
            {Object.keys(recipeToCreate.skillRequirements).length > 0 && (
              <>
                {Object.entries(recipeToCreate.skillRequirements)
                  .map(([skillName, level]) => (
                    <Card 
                      key={`${skillName}`}
                      primaryText={`Requires ${skillName} level ${level}`}
                    />
                ))}
              </>
            )}
          </>
        )}
        {recipeToCreate && 
          <p>Crafting recipe: 
            {Object.entries(recipeToCreate.input)
              .map(([itemName, quantity]) => (
                <Card 
                  key={itemName}
                  primaryText={itemName}
                  rightElement={`${quantity}x`}
                  link={`/item/${itemName}`}
                />
            ))}
          </p>
        }
        {usedInRecipes.length > 0 && (
          <>
            <p>Used in recipes:</p>
            {usedInRecipes.map((recipe, index) => (
              <Card 
                key={index}
                primaryText={recipe.output}
                link={`/item/${recipe.output}`}
                secondaryText={Object.entries(recipe.input)
                  .map(([itemName, quantity]) => (`${quantity}x ${itemName}`))}
              />
            ))}
          </>
        )}
    </div>
  );
};

export default ItemDetails;
