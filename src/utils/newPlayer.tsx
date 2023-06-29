import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase.ts";

export async function createPlayer(uid: string, displayName: string): Promise<void> {
  try {
    const playerDocRef = doc(db, "players", uid);

    await setDoc(playerDocRef, {
      id: uid,
      displayName: displayName,
    });
  } catch (error) {
    console.error("Error creating player:", error);
    throw error;
  }
}
