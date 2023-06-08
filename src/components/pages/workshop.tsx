import React, { useContext, useEffect, useState } from "react";
import { PlayerContext } from "../../data/playerContext";
import { Recipe } from "../../data/recipe";
import { getRecipesBySkill } from "../../firebase";
import { addToInventory } from "../../utils/inventoryUtils";
import Card from "../card";

const Workshop: React.FC = () => {
  // store all of our unlocked recipes
  const [recipes, setRecipes] = useState<(Recipe | null)[]>([]);

  // store the search terms used
  //const [searchTerm, setSearchTerm ] = useState('');

  // store the checkbox value
  //const [ hasAllIngredients, setHasAllIngredients ] = useState(false);

  // store player data
  const playerData = useContext(PlayerContext);

  // Access the crafting skill level
  const craftingSkillLevel = playerData?.skillLevels["crafting"] || 0;

  useEffect(() => {
    async function fetchRecipesData() {
      const fetchedRecipes = await getRecipesBySkill(playerData);
      setRecipes(fetchedRecipes);
    }

    fetchRecipesData();
  }, [playerData]);

  const handleCraft = async (recipe) => {
    const { input, output } = recipe;

    // Check if the player has all the required items in the inventory
    const hasRequiredItems = Object.entries(input).every(([item, quantity]) => {
      const inventoryItem = playerData?.inventory[item];
      return (
        inventoryItem && inventoryItem.ownedCurrent >= (quantity as number)
      );
    });

    if (hasRequiredItems) {
      const itemsToUpdate = Object.entries(input).map(([item, quantity]) => {
        const updatedQuantity = -(quantity as number); // Use type assertion to cast to number
        return { itemName: item, quantity: updatedQuantity };
      });

      itemsToUpdate.push({ itemName: output, quantity: 1 });

      await addToInventory(playerData?.id, itemsToUpdate);
    }
  };

  //   const filteredRecipes = recipes.filter((recipe) => {
  //     // Filter based on skill requirements
  //     const hasSkillRequirement = recipe.skillRequired.every(
  //       (skill) => craftingSkillLevel >= skill["Crafting"]
  //     );

  //     // Filter based on ingredients
  //     const hasIngredients = hasAllIngredients || recipe.inputs.every((input) => {
  //         const ingredient = Object.keys(input)[0];
  //         const requiredAmount = input[ingredient];
  //         const ownedAmount = 12;
  //         // playerData.inventory.find(
  //         //     (ingredient) => ingredient[ingredient]) ||0;
  //         return ownedAmount >= requiredAmount;
  //     });

  //     // Filter based on recipe name
  //     const matchesSearchTerm =
  //       recipe.name.toLowerCase().includes(searchTerm.toLowerCase());

  //     return hasSkillRequirement && hasIngredients && matchesSearchTerm;
  //   });

  return (
    <div>
      <h2>Workshop</h2>
      <h3>{`Crafting skill: ${craftingSkillLevel}`}</h3>
      {recipes.map((recipe, index) => (
        <Card
          key={`${recipe?.output}`}
          primaryText={`${recipe?.output}`}
          secondaryText={
            recipe?.input &&
            Object.entries(recipe.input).map(
              ([item, amount]) =>
                `${item}: ${
                  playerData?.inventory[item]?.ownedCurrent || 0
                } / ${amount}`
            )
          }
          rightElement={
            <button onClick={() => handleCraft(recipe)}>Craft</button>
          }
        />
      ))}
    </div>
  );
};

export default Workshop;
