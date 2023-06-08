export interface Recipe {
    input: { [itemName: string]: number }[];
    output: string;
    skillRequirements: { [skillName: string]: number }[];
}