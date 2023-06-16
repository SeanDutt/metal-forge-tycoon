import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PlayerContext } from "../../data/playerContext.tsx";
import { getItemById, getRecipeForItemId, getRecipesByItemId } from "../../firebase.ts";
import Card from "../card.tsx";
import { Recipe } from "../../data/recipe.ts";
import { Item } from "../../data/item.ts";

const ItemDetails = () => {
  const { itemId } = useParams<{ itemId: string }>(); // Retrieve the itemId from the URL parameter
  
  const playerData = useContext(PlayerContext); // Access the player data from the context

  const [itemDetails, setItemDetails] = useState<Item>()
  const [recipeToCreate, setRecipeToCreate] = useState<Recipe>()
  const [usedInRecipes, setUsedInRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const loadItemDetails = async () => {
      const itemFound = await getItemById(itemId ?? '');
      if (itemFound) {
        setItemDetails(itemFound);
      }
  
      const recipeToCreateItem = await getRecipeForItemId(itemId ?? '');
      recipeToCreateItem && setRecipeToCreate(recipeToCreateItem);
  
      const recipesUsingItem = await getRecipesByItemId(itemId ?? '');
      const updatedRecipes = recipesUsingItem.map((recipe) => ({
        ...recipe,
        output: {
          name: recipe.output,
        },
      }));
      setUsedInRecipes(updatedRecipes);
    };
  
    loadItemDetails();
  }, [itemId]); // Add itemId as a dependency to the useEffect dependency array
  

  // Retrieve the item quantity from the player's inventory data
  const itemsOnHand = playerData?.inventory[itemId ?? '']?.ownedCurrent || 0;
  const itemsLifetime = playerData?.inventory[itemId ?? '']?.ownedLifetime || 0;

  return (
    <div>
        <h1>{itemId}</h1>
        <h2>Item Details</h2>
        {itemDetails?.imageUrl && 
          <img src={require(`../../data/itemIcons/${itemDetails.imageUrl}`)} 
            alt="" 
            style={{ width: '100vw' }} />}
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
                primaryText={recipe.output.name}
                link={`/item/${recipe.output.name}`}
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
