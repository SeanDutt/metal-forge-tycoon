import { Player } from "../data/player";

// export function doesPlayerMeetRequirements(
//   player: Player,
//   requirements: Record<string, any>
// ): boolean {
//   for (const attribute in requirements) {
//     const requirement = requirements[attribute];

//     if (typeof requirement === "number") {
//       if (player.skillLevels[attribute] < requirement) {
//         return false;
//       }
//     } else if (typeof requirement === "string") {
//       const questId = requirement;
//       if (!player.completedRequests.some((quest) => quest.questId === questId)) {
//         return false;
//       }
//     }
//   }

//   return true;
// }

export function doesPlayerMeetInventoryRequirements(
  player: Player,
  requirements: Record<string, number>
): boolean {
  for (const itemName in requirements) {
    const requiredQuantity = requirements[itemName];
    const itemData = player.inventory[itemName];

    if (
      !itemData ||
      (itemData.ownedLifetime < requiredQuantity)
    ) {
      return false;
    }
  }
  return true;
}
