import { Item } from "./item";

export interface Recipe {
    input: { [itemName: string]: number };
    imageUrl?: string;
    output: Item;
    skillRequirements: { [skillName: string]: number };
}