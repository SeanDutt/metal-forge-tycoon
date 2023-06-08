import { doc, setDoc } from "firebase/firestore";
import { Player } from "../data/player";
import { db } from "../firebase";

export async function createPlayer(uid: string, displayName: string): Promise<void> {
    const newPlayer: Player = {
        id: uid,
        displayName: displayName,
        inventory: {},
        skillLevels: {}
    }
    try {
    const playerDocRef = doc(db, "players", uid);

    await setDoc(playerDocRef, newPlayer);
    } catch (error) {
    console.error("Error creating player:", error);
    }
}
