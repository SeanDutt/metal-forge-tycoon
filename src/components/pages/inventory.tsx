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
        const inventoryItems = Object.entries(player.inventory);

        const itemCardPromises = inventoryItems.map(
          async ([itemName, itemData]) => {
            const item = await getItemById(itemName);

            return (
              <Card
                key={itemName}
                icon={item ? require(`../../data/itemIcons/${itemName}.png`) : null}
                primaryText={itemName}
                rightElement={`${itemData.ownedCurrent}`}
                link={`/item/${itemName}`}
              />
            );
          }
        );

        const resolvedItemCards = await Promise.all(itemCardPromises);
        setItemCards(resolvedItemCards);
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
      {Object.keys(player.inventory).length > 0 ? (
        <div>{itemCards}</div>
      ) : (
        <p>No items in inventory.</p>
      )}
    </div>
  );
};

export default Inventory;
