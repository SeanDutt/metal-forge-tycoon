import { Requirement } from "./recipe";

export type NpcRequest = {
    from: string; // The NPC or entity providing the request
    name: string; // The title displayed
    description: string; // The flavor text
    imageUrl: string; // The imageUrl of the NPC or entity

    grantedItems: string[]; // The items the player will receive as a reward for completing the request
    grantedQuantity: number[];

    requestedItems: string[]; // The items the player needs to fulfill the request
    requestedQuantity: number[];

    requirements: Requirement[];
};