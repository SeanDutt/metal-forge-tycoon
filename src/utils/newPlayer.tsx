import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase.ts";

export async function createPlayer(uid: string, displayName: string): Promise<void> {
    try {
      const playerDocRef = doc(db, "players", uid);
  
      await setDoc(playerDocRef, {
        id: uid,
        displayName: displayName,
      });
  
      const buildingDataColRef = collection(playerDocRef, "buildingData");
      await addDoc(buildingDataColRef, {});
  
      const completedRequestsColRef = collection(playerDocRef, "completedRequests");
      await addDoc(completedRequestsColRef, {});
  
      const inventoryColRef = collection(playerDocRef, "inventory");
      await addDoc(inventoryColRef, {});
    } catch (error) {
      console.error("Error creating player:", error);
      throw error;
    }
  }
  
  
