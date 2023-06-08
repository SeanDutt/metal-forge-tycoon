import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export const addToInventory = async (playerId, obtainedItems) => {
    // Retrieve the player's document from the Firestore database
    const playerDocRef = doc(db, "players", playerId);
    const playerDocSnapshot = await getDoc(playerDocRef);

    if (playerDocSnapshot.exists()) {
        const playerData = playerDocSnapshot.data();
        // Check if the player's document has an inventory field
        let inventory = playerData.inventory || {};

        obtainedItems.forEach((item) => {
            const itemName = item.itemName;
            const quantity = item.quantity || 1;

            if (inventory.hasOwnProperty(itemName)) {
                // Item already exists in inventory, update quantity
                inventory[itemName].ownedCurrent += quantity;
                inventory[itemName].ownedLifetime += quantity;
            } else {
                // Item doesn't exist in inventory, add it
                inventory[itemName] = {
                ownedCurrent: quantity,
                ownedLifetime: quantity,
                };
            }
        });

        // Update the player's document with the modified inventory
        await updateDoc(playerDocRef, {
        inventory: inventory,
        });
    }
};
