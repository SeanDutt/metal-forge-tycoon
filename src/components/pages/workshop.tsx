import React, { useContext, useEffect, useState } from "react";
import { PlayerContext } from "../../data/playerContext.tsx";
import { Recipe } from "../../data/recipe.tsx";
import { addToInventory } from "../../utils/inventoryUtils.tsx";
import Card from "../card.tsx";
import { getAllRecipesWithOutputImageUrls } from "../../firebase.ts";

const Workshop: React.FC = () => {
  const playerData = useContext(PlayerContext);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    async function fetchRecipesData() {
      const fetchedRecipes = await getAllRecipesWithOutputImageUrls();
      setRecipes(fetchedRecipes);
    }
    fetchRecipesData();
  }, []);

  const handleCraft = async (recipe: Recipe) => {
    const { requiredItems, grantedItem } = recipe;

    const hasRequiredItems = requiredItems.every((requiredItem) => {
      const inventoryItem = playerData?.inventory?.[requiredItem.item];
      return (
        inventoryItem &&
        typeof inventoryItem.ownedCurrent === "number" &&
        inventoryItem.ownedCurrent >= requiredItem.quantity
      );
    });

    if (hasRequiredItems) {
      const itemsToUpdate = requiredItems.map((requiredItem) => ({
        itemName: requiredItem.item,
        quantity: -requiredItem.quantity,
      }));

      itemsToUpdate.push({ itemName: grantedItem.item, quantity: 1 });

      await addToInventory(playerData?.id, itemsToUpdate);
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
            <button onClick={() => handleCraft(recipe)}>Craft</button>
          }
        />
      ))}
    </div>
  );
};

export default Workshop;
