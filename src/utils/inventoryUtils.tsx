import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase.ts";
import { Item } from "../data/items.ts";

export const addToInventory = async (
  playerId: string,
  obtainedItems: any[]
) => {
  // Retrieve the player's document from the Firestore database
  const playerDocRef = doc(db, "players", playerId);
  const playerDocSnapshot = await getDoc(playerDocRef);

  if (playerDocSnapshot.exists()) {
    const inventoryColRef = collection(playerDocRef, "inventory");

    obtainedItems.forEach(async (item) => {
      const itemName = item.itemName;
      const ownedCurrent = item.quantity || 1;
      const ownedLifetime = item.quantity || 1;

      const itemDocRef = doc(inventoryColRef, itemName);
      const itemDocSnapshot = await getDoc(itemDocRef);

      const batch = writeBatch(db);

      if (itemDocSnapshot.exists()) {
        // Item already exists in inventory, update quantity
        const currentOwnedCurrent = itemDocSnapshot.data().ownedCurrent || 0;
        const currentOwnedLifetime = itemDocSnapshot.data().ownedLifetime || 0;
        batch.update(itemDocRef, {
          ownedCurrent: currentOwnedCurrent + ownedCurrent,
          ownedLifetime: currentOwnedLifetime + ownedLifetime,
        });
      } else {
        // Item doesn't exist in inventory, add it
        batch.set(itemDocRef, {
          itemName: itemName,
          ownedCurrent: ownedCurrent,
          ownedLifetime: ownedLifetime,
        });
      }

      await batch.commit();
    });
  }
};

export const removeFromInventory = async (
  playerId: string,
  removedItems: any[]
) => {
  // Retrieve the player's document from the Firestore database
  const playerDocRef = doc(db, "players", playerId);
  const playerDocSnapshot = await getDoc(playerDocRef);

  if (playerDocSnapshot.exists()) {
    const inventoryColRef = collection(playerDocRef, "inventory");

    removedItems.forEach(async (item) => {
      const itemName = item.itemName;
      const quantity = item.quantity || 1;

      const querySnapshot = await getDocs(
        query(
          inventoryColRef,
          where("itemName", "==", itemName),
          limit(quantity)
        )
      );
      const itemDocs = querySnapshot.docs;

      itemDocs.forEach(async (itemDoc) => {
        await deleteDoc(itemDoc.ref);
      });
    });
  }
};

export const fetchItemDocuments = async (itemNames: string[]): Promise<Item[]> => {
  const itemDocs: Item[] = [];
  const itemsCollectionRef = collection(db, 'items');

  // Create a query to fetch the item documents based on their names
  const itemQuery = query(itemsCollectionRef, where('__name__', 'in', itemNames));

  // Fetch the item documents
  const querySnapshot = await getDocs(itemQuery);

  // Iterate through the query snapshot and push each item document to the array
  querySnapshot.forEach((doc) => {
    itemDocs.push(doc.data() as Item);
  });

  return itemDocs;
};