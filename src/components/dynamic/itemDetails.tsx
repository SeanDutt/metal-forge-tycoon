import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PlayerContext } from "../../data/playerContext.tsx";
import {
  getItemById,
  getRecipeForItemId,
  getRecipesByItemId,
} from "../../firebase.ts";
import Card from "../card.tsx";
import { Recipe } from "../../data/recipe.ts";
import { Item } from "../../data/items.ts";

const ItemDetails = () => {
  const { itemId } = useParams<{ itemId: string }>();

  const playerData = useContext(PlayerContext);

  const [itemDetails, setItemDetails] = useState<Item>();
  const [recipeToCreate, setRecipeToCreate] = useState<Recipe | null>(null);
  const [usedInRecipes, setUsedInRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const loadItemDetails = async () => {
      if (itemId) {
        const hasItemDetails = await getItemById(itemId);
        hasItemDetails && setItemDetails(hasItemDetails);

        const hasRecipeForItem = await getRecipeForItemId(itemId);
        hasRecipeForItem && setRecipeToCreate(hasRecipeForItem);

        const hasRecipesUsingItem = await getRecipesByItemId(itemId);
        hasRecipesUsingItem && setUsedInRecipes(hasRecipesUsingItem);
      }
    };
    loadItemDetails();
  }, [itemId]);

  const itemsOnHand = playerData?.inventory[itemId ?? ""]?.ownedCurrent || 0;
  const itemsLifetime = playerData?.inventory[itemId ?? ""]?.ownedLifetime || 0;

  return (
    <div key={itemId}>
      <h1>{itemId}</h1>
      <h2>Item Details</h2>
      {itemDetails && (
        <div className="img-container">
          <img
            src={require(`../../data/itemIcons/${itemDetails.imageUrl}`)}
            alt={`${itemDetails.name} icon`}
            style={{ width: "75vw" }}
          />
        </div>
      )}
      <Card primaryText={`Currently owned: ${itemsOnHand}`} />
      <Card primaryText={`All-time owned: ${itemsLifetime}`} />
      {recipeToCreate && (
        <>
          <p>Crafting recipe:</p>
          {recipeToCreate.requiredItems.map((item, index) => (
            <Card
              key={index}
              icon={require(`../../data/itemIcons/${
                item.imageUrl || "noIcon.png"
              }`)}
              primaryText={item.item}
              rightElement={`${item.quantity}x`}
              link={`/item/${item.item}`}
            />
          ))}
        </>
      )}
      {usedInRecipes.length > 0 && (
        <>
          <p>Used in recipes:</p>
          {usedInRecipes.map((recipe, index) => (
            <Card
              key={index}
              icon={require(`../../data/itemIcons/${
                recipe.grantedItem.imageUrl || "noIcon.png"
              }`)}
              primaryText={recipe.grantedItem.item}
              link={`/item/${recipe.grantedItem.item}`}
              secondaryText={recipe.requiredItems.map(
                (itemObj) => `${itemObj.quantity}x ${itemObj.item}`
              )}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default ItemDetails;
