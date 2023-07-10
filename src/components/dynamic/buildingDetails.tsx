import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PlayerContext } from "../../data/playerContext";
import {
  addToInventory,
  removeFromInventory,
} from "../../utils/inventoryUtils";
import Card from "../card";
import {
  Timestamp,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { doesPlayerMeetRequirements } from "../../utils/requirements";

interface PlayerBuildingData {
  autoCollect: boolean;
  itemLimit: number;
  lastRetrieved: Timestamp | null;
  level: number;
  produced: number;
  lifetimeProduced: number;
}

interface BuildingData {
  id: string;
  imageUrl: string;
  name: string;
  baseUpgradeCost: Record<string, number>;
  upgradeCostScaling: boolean;
  productionRate: number;
  itemProduced: string;
  // Add other relevant fields for the building
}

const BuildingDetails = () => {
  const { buildingId } = useParams<{ buildingId: string }>();
  const [playerBuildingData, setPlayerBuildingData] =
    useState<PlayerBuildingData>();
  const [collectedProduct, setCollectedProduct] = useState(0);
  const [buildingData, setBuildingData] = useState<BuildingData>();
  const playerData = useContext(PlayerContext);

  useEffect(() => {
    const fetchBuildingData = async () => {
      // Create a reference to the player's building document

      const playerBuildingRef = doc(
        collection(db, "players", playerData.id, "buildingData"),
        buildingId
      );

      try {
        // Get the player's building data
        const playerBuildingSnapshot = await getDoc(playerBuildingRef);

        if (!playerBuildingSnapshot.exists()) {
          // Player's building data not found, add default data
          const defaultBuildingData = {
            level: 0,
            lastRetrieved: null, // Set the initial last retrieved time to null
            itemLimit: 0, // Set the desired item limit
            autoCollect: false, // Set the desired auto collect value
            produced: 0,
            lifetimeProduced: 0,
            // Add any other default fields specific to the building
          };

          // Add the default building data to the player's buildingData
          await setDoc(playerBuildingRef, defaultBuildingData);

          // Set the fetched building data to the default data
          setPlayerBuildingData(defaultBuildingData);
        } else {
          // Player's building data exists, set it to the state
          setPlayerBuildingData(
            playerBuildingSnapshot.data() as PlayerBuildingData
          );
        }
        if (playerBuildingData) {
          // Retrieve the Timestamp object from Firestore
          const lastRetrieved = playerBuildingData.lastRetrieved;
          const lastRetrievedTime = lastRetrieved
            ? lastRetrieved.toDate()
            : null;
          const currentTime = Timestamp.now().toDate();

          const minutesSinceRetrieval = lastRetrievedTime
            ? Math.floor(
                (currentTime.getTime() - lastRetrievedTime.getTime()) /
                  (1000 * 60)
              )
            : 0;

          const productProduced = lastRetrievedTime
            ? minutesSinceRetrieval * playerBuildingData.level
            : 0;

          const productLimited = Math.min(
            productProduced,
            playerBuildingData.itemLimit
          );

          setCollectedProduct(productLimited);
        }

        // Create a reference to the tree farm building document in the "buildings" collection
        const buildingRef = doc(collection(db, "buildings"), buildingId);

        // Get the global data for the building from the "buildings" collection
        const buildingSnapshot = await getDoc(buildingRef);

        if (buildingSnapshot.exists()) {
          // Set the fetched building data to the state
          setBuildingData(buildingSnapshot.data() as BuildingData);
        }
      } catch (error) {
        console.error("Error fetching building data:", error);
      }
    };

    fetchBuildingData();
  }, [buildingId, playerBuildingData, playerData.id]);

  const calculateUpgradeCost = () => {
    const { level } = playerBuildingData || {};
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
    const playerBuildingRef = doc(
      collection(db, "players", playerData.id, "buildingData"),
      buildingId
    );

    // Check if the player has enough resources to perform the upgrade
    const canUpgrade = doesPlayerMeetRequirements(playerData, upgradeCost);

    if (canUpgrade && playerBuildingData) {
      try {
        // Remove the required items from the player's inventory
        const removedItems = Object.entries(upgradeCost).map(
          ([item, cost]) => ({
            itemName: item,
            quantity: cost,
          })
        );

        await removeFromInventory(playerData.id, removedItems);

        // Update the player's building level
        const updatedLevel = playerBuildingData.level + 1;
        await updateDoc(playerBuildingRef, { level: updatedLevel });

        // Show success message or perform any other actions
        calculateUpgradeCost();
      } catch (error) {
        console.error("Upgrade failed:", error);
      }
    } else {
    }
  };

  const handleCollect = async () => {
    if (buildingId && buildingData && playerBuildingData) {
      try {
        const currentTime = Timestamp.now();

        // Update the last retrieved time to the current time
        const playerBuildingRef = doc(
          db,
          "players",
          playerData.id,
          "buildingData",
          buildingId
        );
        await updateDoc(playerBuildingRef, {
          produced: 0,
          lifetimeProduced:
            playerBuildingData?.lifetimeProduced + collectedProduct,
          lastRetrieved: currentTime,
        });

        // Create the inventory object with the collected product
        const inventoryItem = {
          itemName: buildingData.itemProduced,
          quantity: collectedProduct,
        };

        addToInventory(playerData.id, [inventoryItem]);

        // Reset the collected product state
        setCollectedProduct(0);
      } catch (error) {
        console.error("Error collecting product:", error);
      }
    }
  };

  if (!buildingData || !playerBuildingData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {buildingData.name && (
        <div className="img-container">
          <img
            src={require(`../../data/buildingIcons/${buildingData.imageUrl}`)}
            alt={`${buildingData.name} icon`}
          />
        </div>
      )}
      <h2>{buildingData.name}</h2>
      <Card
        primaryText={`Currently producing ${playerBuildingData.level} ${buildingData.itemProduced} every ${buildingData.productionRate} minutes.`}
      />
      <Card
        primaryText={`Automatic Collection: ${
          playerBuildingData.autoCollect ? "Yes" : "No"
        }`}
      />
      <Card
        primaryText="Upgrade Wood Production"
        secondaryText={[
          Object.entries(upgradeCost)
            .map(([item, cost]) => `${item}: ${cost}`)
            .join(", "),
        ]}
        rightElement={
          <button
            disabled={!doesPlayerMeetRequirements(playerData, upgradeCost)}
            onClick={handleUpgrade}
          >
            Upgrade
          </button>
        }
      />
      <Card
        primaryText={`Storage: ${collectedProduct}/${playerBuildingData.itemLimit}`}
        rightElement={
          !playerBuildingData?.autoCollect && (
            <button disabled={collectedProduct === 0} onClick={handleCollect}>
              Collect
            </button>
          )
        }
      />
      {/* Render additional components or functionality for the building */}
    </div>
  );
};

export default BuildingDetails;
