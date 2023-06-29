import React, { useContext, useEffect, useState } from "react";
import { PlayerContext } from "../../data/playerContext.tsx";
import { Recipe } from "../../data/recipe.tsx";
import { getRecipesBySkill } from "../../firebase.ts";
import { addToInventory } from "../../utils/inventoryUtils.tsx";
import Card from "../card.tsx";

const Workshop: React.FC = () => {
  // store all of our unlocked recipes
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  // store the search terms used
  //const [searchTerm, setSearchTerm ] = useState('');

  // store the checkbox value
  //const [ hasAllIngredients, setHasAllIngredients ] = useState(false);

  // store player data
  const playerData = useContext(PlayerContext);

  // Access the crafting skill level

  useEffect(() => {
    async function fetchRecipesData() {
      const fetchedRecipes = await getRecipesBySkill(playerData);
      console.log(fetchedRecipes)
      setRecipes(fetchedRecipes);
    }
    fetchRecipesData();
  }, [playerData]);

  const handleCraft = async (recipe: Recipe) => {
    const { input, output } = recipe;

    const hasRequiredItems = Object.entries(input).every(
      ([itemName, quantity]) => {
        const inventoryItem = playerData?.inventory?.[itemName];
        return (
          inventoryItem &&
          typeof inventoryItem.ownedCurrent === "number" &&
          inventoryItem.ownedCurrent >= quantity
        );
      }
    );

    if (hasRequiredItems) {
      const itemsToUpdate = Object.entries(input).map(
        ([itemName, quantity]) => {
          const updatedQuantity = -quantity;
          return { itemName, quantity: updatedQuantity };
        }
      );

      itemsToUpdate.push({ itemName: output.name, quantity: 1 });

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
      {/* <h3>{`Crafting skill: ${craftingSkillLevel}`}</h3> */}
      {recipes.map((recipe, index) => (
        <Card
          key={index}
          icon={(() => {
            try {
              return require(`../../data/itemIcons/${recipe.output.name}.png`);
            } catch (error) {
              console.error(error);
              return require(`../../data/itemIcons/NoIcon.png`);
            }
          })()}
          primaryText={`${recipe?.output.name}`}
          secondaryText={
            recipe?.input &&
            Object.entries(recipe.input)
              .sort(([itemA], [itemB]) => itemA.localeCompare(itemB)) // Sort the entries alphabetically
              .map(
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
