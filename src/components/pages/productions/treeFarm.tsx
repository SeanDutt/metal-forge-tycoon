import React, { useContext, useEffect, useState } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import Card from "../../card";
import { PlayerContext } from "../../../data/playerContext";
import { removeFromInventory } from "../../../utils/inventoryUtils";

// Define the type/interface for the tree farm data
interface TreeFarmData {
  name: string;
  imageUrl: string;
  baseUpgradeCost: Record<string, number>;
  upgradeCostScaling: number;
  productionRate: number;
}

interface PlayerBuildingData {
  autoCollect: boolean;
  itemLimit: number;
  lastRetrieved: string;
  level: number;
}

const TreeFarm = () => {
  const [playerTreeFarmData, setPlayerTreeFarmData] =
    useState<PlayerBuildingData>();
  const [buildingData, setBuildingData] = useState<TreeFarmData>();
  const playerData = useContext(PlayerContext);

  useEffect(() => {
    const fetchTreeFarmData = async () => {
      // Create a reference to the player's tree farm document
      const playerTreeFarmRef = doc(
        db,
        "players",
        playerData.id,
        "buildingData",
        "treeFarm"
      );

      // Create a reference to the tree farm building document in the "buildings" collection
      const buildingRef = doc(db, "buildings", "treeFarm");

      try {
        // Get the player's tree farm data
        const playerTreeFarmSnapshot = await getDoc(playerTreeFarmRef);

        if (!playerTreeFarmSnapshot.exists()) {
          // Player's tree farm data not found, add default data
          const defaultTreeFarmData = {
            level: 0,
            lastRetrieved: "", // Set the initial last retrieved time to null
            itemLimit: 20, // Set the desired item limit
            autoCollect: false, // Set the desired auto collect value
            // Add any other default fields specific to the tree farm
          };

          // Add the default tree farm data to the player's buildingData
          await setDoc(playerTreeFarmRef, defaultTreeFarmData);

          // Set the fetched tree farm data to the default data
          setPlayerTreeFarmData(defaultTreeFarmData);
        } else {
          // Player's tree farm data exists, set it to the state
          setPlayerTreeFarmData(
            playerTreeFarmSnapshot.data() as PlayerBuildingData
          );
        }

        // Get the global data for the building from the "buildings" collection
        const buildingSnapshot = await getDoc(buildingRef);

        if (buildingSnapshot.exists()) {
          // Set the fetched building data to the state
          setBuildingData(buildingSnapshot.data() as TreeFarmData);
        }
      } catch (error) {
        console.error("Error fetching tree farm data:", error);
      }
    };

    fetchTreeFarmData();
  }, [playerData.id, playerTreeFarmData]);

  const calculateUpgradeCost = () => {
    const { level } = playerTreeFarmData || {};
    const { baseUpgradeCost, upgradeCostScaling } = buildingData || {};

    const upgradeCost: Record<string, number> = {};

    upgradeCostScaling &&
      Object.entries(baseUpgradeCost || {})
        .sort(([itemA], [itemB]) => itemA.localeCompare(itemB)) // Sort the entries alphabetically by item name
        .forEach(([item, amount]) => {
          // Multiply the base upgrade cost by the player's level if available
          const cost = level ? amount * level : amount;

          // Round up the cost to the nearest whole number
          const roundedCost = Math.ceil(cost);

          upgradeCost[item] = roundedCost;
        });

    return upgradeCost;
  };

  // Get the upgrade cost
  const upgradeCost = calculateUpgradeCost();

  const handleUpgrade = async () => {
    const upgradeCost = calculateUpgradeCost();
    const playerTreeFarmRef = doc(
      db,
      "players",
      playerData.id,
      "buildingData",
      "treeFarm"
    );

    // Check if the player has enough resources to perform the upgrade
    const canUpgrade = Object.entries(upgradeCost).every(([item, cost]) => {
      const playerInventoryItem = playerData?.inventory[item];
      return playerInventoryItem && playerInventoryItem.ownedCurrent >= cost;
    });

    if (canUpgrade && playerTreeFarmData) {
      try {
        // Remove the required items from the player's inventory
        const removedItems = Object.entries(upgradeCost).map(
          ([item, cost]) => ({
            itemName: item,
            quantity: cost,
          })
        );

        await removeFromInventory(playerData.id, removedItems);

        // Update the player's tree farm level
        const updatedLevel = (playerTreeFarmData?.level || 1) + 1;
        await updateDoc(playerTreeFarmRef, { level: updatedLevel });

        // Show success message or perform any other actions
        calculateUpgradeCost();
      } catch (error) {
        console.error("Upgrade failed:", error);
      }
    }
  };

  if (!buildingData || !buildingData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{buildingData.name}</h2>
      {buildingData.imageUrl && (
        <img
          src={require(`../../../data/buildingIcons/${buildingData.imageUrl}`)}
          alt="Tree farm icon"
        />
      )}
      <Card
        primaryText={`Currently producing ${playerTreeFarmData?.level} wood every ${buildingData.productionRate} minute(s)`}
      />
      <Card
        primaryText={`Automatic Collection: ${
          playerTreeFarmData?.autoCollect ? "Yes" : "No"
        }`}
      />
      <Card
        primaryText="Upgrade Wood Production"
        secondaryText={[
          Object.entries(upgradeCost)
            .map(([item, cost]) => `${item}: ${cost}`)
            .join(", "),
        ]}
        rightElement={<button onClick={handleUpgrade}>Upgrade</button>}
      />
      <Card primaryText={`Maximum storage: ${playerTreeFarmData?.itemLimit}`} />
      {/* Render additional components or functionality for the tree farm */}
    </div>
  );
};

export default TreeFarm;
