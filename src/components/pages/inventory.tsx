import React, { useContext, useEffect, useState } from "react";
import { PlayerContext } from "../../data/playerContext.tsx";
import Card from "../card.tsx";
import { getItemById } from "../../firebase.ts";

const Inventory = () => {
  const player = useContext(PlayerContext);
  const [itemCards, setItemCards] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    const fetchInventoryItems = async () => {
      if (player) {
        try {
          const inventoryItems = player.inventory;

          const itemCardPromises = Object.entries(inventoryItems).map(
            async ([itemName, itemData]) => {
              const item = await getItemById(itemName);

              return (
                <Card
                  key={itemName}
                  icon={
                    item
                      ? require(`../../data/itemIcons/${item.imageUrl}`)
                      : require(`../../data/itemIcons/noIcon.png`)
                  }
                  primaryText={itemName}
                  rightElement={`${itemData.ownedCurrent}`}
                  link={`/item/${itemName}`}
                />
              );
            }
          );

          const resolvedItemCards = await Promise.all(itemCardPromises);
          setItemCards(resolvedItemCards);
        } catch (error) {
          console.error("Error fetching inventory items:", error);
        }
      }
    };

    fetchInventoryItems();
  }, [player]);

  if (!player) {
    // Handle case when player data is not available
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Inventory</h2>
      {itemCards.length > 0 ? (
        <div>{itemCards}</div>
      ) : (
        <p>No items in inventory.</p>
      )}
    </div>
  );
};

export default Inventory;
