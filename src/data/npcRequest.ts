export type NpcRequest = {
    name: string; // The title displayed
    description: string; // The flavor text
    from: string; // The NPC or entity providing the request
    grantedItems: Object; // The items the player will receive as a reward for completing the request
    requestedItems: Object; // The items the player needs to fulfill the request
    requirements: {
      skills: {
        [skillName: string]: number; // Skill requirements and their corresponding levels
      };
      quests: string[]; // Quests that need to be completed as requirements
      items: {
        [itemName: string]: number; // Item requirements and their quantities
      };
    };
  };