import { ItemWithQuantity } from "./items";

export interface Recipe {
    requiredItems: ItemWithQuantity[];
    grantedItem: ItemWithQuantity;
    requirements: Requirement[];
}
  
export type Requirement =
    | SkillRequirement
    | ItemRequirement
    | RequestCompletionRequirement;

export interface SkillRequirement {
    type: 'skill';
    skill: string;
    level: number;
}

export interface ItemRequirement {
    type: 'item';
    itemId: string;
    quantity: number;
}

export interface RequestCompletionRequirement {
    type: 'requestCompletion';
    requestId: string;
}