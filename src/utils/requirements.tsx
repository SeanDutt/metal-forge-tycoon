import { ItemWithQuantity } from "../data/items";
import { Player } from "../data/player";

export function doesPlayerMeetRequirements(player: Player, requirements: Record<string, any>): boolean {
  const skillRequirements = requirements.skills || {};
  const itemRequirements = requirements.items || {};
  // const requestRequirements = requirements.requests || {};

  for (const skillName in skillRequirements) {
    const requiredSkillLevel = skillRequirements[skillName];
    const playerSkillLevel = player.skillLevels[skillName];

    if (!playerSkillLevel || playerSkillLevel < requiredSkillLevel) {
      return false;
    }
  }

  for (const itemName in itemRequirements) {
    const requiredQuantity = itemRequirements[itemName];
    const itemData = player.inventory[itemName];

    if (!itemData || itemData.ownedLifetime < requiredQuantity) {
      return false;
    }
  }

  // Additional logic for checking request requirements goes here

  return true;
}

export function doesPlayerHaveResources(player: Player, requirements: ItemWithQuantity[]): boolean {
  for (const requiredItem of requirements) {
    const itemName = requiredItem.item;
    const requiredQuantity = requiredItem.quantity;
    const itemData = player.inventory[itemName];

    if (!itemData || itemData.ownedCurrent < requiredQuantity) {
      return false;
    }
  }

  return true;
}
