import { Item } from "./item";

export interface Recipe {
    input: { [itemName: string]: number };
    output: Item;
    skillRequirements: { [skillName: string]: number };
}