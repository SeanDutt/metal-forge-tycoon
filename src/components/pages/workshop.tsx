import React, { useContext, useEffect, useState } from "react";
import { PlayerContext } from "../../data/playerContext.tsx";
import { Recipe } from "../../data/recipe.tsx";
import {
  addToInventory,
  removeFromInventory,
} from "../../utils/inventoryUtils.tsx";
import Card from "../card.tsx";
import { getAllRecipesWithOutputImageUrls } from "../../firebase.ts";
import { doesPlayerHaveResources } from "../../utils/requirements.tsx";

const Workshop: React.FC = () => {
  const playerData = useContext(PlayerContext);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    async function fetchRecipesData() {
      const fetchedRecipes = await getAllRecipesWithOutputImageUrls();
      setRecipes(fetchedRecipes);
    }
    fetchRecipesData();
  }, [playerData.inventory]);

  const handleCraft = async (recipe: Recipe) => {
    const { requiredItems, grantedItem } = recipe;

    try {
      await removeFromInventory(playerData.id, requiredItems).then(async () => {
        await addToInventory(playerData.id, [
          { item: grantedItem.item, quantity: grantedItem.quantity },
        ]);
      });
      console.log("crafting");
    } catch (error) {
      console.error("Crafting failed:", error);
      // Handle any error during crafting if necessary
      // For example, show an error message to the player
    }
  };

  return (
    <div>
      <h2>Workshop</h2>
      {recipes.map((recipe, index) => (
        <Card
          key={index}
          icon={require(`../../data/itemIcons/${recipe.grantedItem.imageUrl}`)}
          primaryText={recipe.grantedItem.item}
          secondaryText={recipe.requiredItems.map(
            (requiredItem) =>
              `${requiredItem.item}: ${
                playerData?.inventory[requiredItem.item]?.ownedCurrent || 0
              } / ${requiredItem.quantity}`
          )}
          rightElement={
            <button
              disabled={!doesPlayerHaveResources(
                playerData,
                recipe.requiredItems
              )}
              onClick={() => handleCraft(recipe)}
            >
              Craft
            </button>
          }
        />
      ))}
    </div>
  );
};

export default Workshop;
