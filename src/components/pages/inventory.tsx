import React, { useContext } from 'react';
import { PlayerContext } from '../../data/playerContext';
import Card from '../card';

const Inventory = () => {
  const player = useContext(PlayerContext);

  if (!player) {
    // Handle case when player data is not available
    return <div>Loading...</div>;
  }

  const renderInventoryItems = () => {
    return Object.entries(player.inventory).map(([itemName, itemData]) => (
      <Card 
        key={itemName} 
        primaryText={itemName} 
        rightElement={`${itemData.ownedCurrent}`} 
        link={`/item/${itemName}`}
      />
    ));
  };

  return (
    <div>
      <h2>Inventory</h2>
      {Object.keys(player.inventory).length > 0 ? (
        renderInventoryItems()
      ) : (
        <p>No items in inventory.</p>
      )}
    </div>
  );
};

export default Inventory;
