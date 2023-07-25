/* eslint-disable @typescript-eslint/no-unused-vars */
import { addDoc, collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import React from "react";
import { db } from "../../firebase.ts";
import "./adminPage.css";
import { ItemWithQuantity } from "../../data/items.ts";


const createRecipe = async (
  outputItem: string,
  skillRequirements = {},
  inputItems: Object
  ) => {
  try {
    // Check if the output item exists in the "items" collection
    const outputItemDocRef = doc(db, 'items', outputItem);
    const outputItemDocSnapshot = await getDoc(outputItemDocRef);

    if (!outputItemDocSnapshot.exists()) {
      // Output item does not exist, create it using the createItem function
      await createItem(undefined, outputItem, undefined);
    }

    // Check if the input items exist in the "items" collection
    for (const [itemName, quantity] of Object.entries(inputItems)) {
      const inputItemDocRef = doc(db, 'items', itemName);
      const inputItemDocSnapshot = await getDoc(inputItemDocRef);

      if (!inputItemDocSnapshot.exists()) {
        // Input item does not exist, create it using the createItem function
        await createItem(undefined, itemName, undefined);
      }
    }
    // Create a new recipe document with the provided input and skill requirements
    await setDoc(doc(db,"recipes",outputItem), {
      requiredItems: inputItems,
      requirements: skillRequirements,
      grantedItem: outputItem
    });
  } catch (error) {
    console.error("Error creating recipe:", error);
  }
};

const createItem = async (
  imageUrl: string = '',
  itemName: string,
  itemDescription: string = ''
) => {
  try {
    // Create a new recipe document with the provided input and skill requirements
    await setDoc(doc(db,"items",itemName), {
      name: itemName,
      imageUrl: imageUrl,
      itemDescription: itemDescription
    });
  } catch (error) {
    console.error("Error creating item:", error);
  }
};

const createLocation = async (
  locationName: string,
  description: string = '',
  lootPoolItems: Object
) => {
  try {
    await setDoc(doc(db,"locations",locationName), {
      name: locationName,
      description: description,
      lootPool: lootPoolItems
    });
    console.log("Location document and loot pool items created successfully!");
  } catch (error) {
    console.error("Error creating location document and loot pool items:", error);
  }
};

const createRequestInChain = async (questChainId: string, request: NpcRequest) => {
  try {
    // Retrieve the quest chain document
    const questChainRef = doc(db, "npcrequests", questChainId);
    const questChainDoc = await getDoc(questChainRef);

    if (questChainDoc.exists()) {
      // Get the existing requests array or initialize an empty array if it doesn't exist
      const requests = questChainDoc.data()?.requests || [];

      // Add the new request to the requests array
      requests.push(request);

      // Update the quest chain document with the modified requests array
      await updateDoc(questChainRef, { requests });

      console.log("Request created successfully");
    } else {
      console.log("Quest chain document does not exist");
    }
  } catch (error) {
    console.error("Error creating request:", error);
  }
};


type NpcRequest = {
  name: string; // The title displayed
  description: string; // The flavor text
  from: string; // The NPC or entity providing the request
  imageUrl: string; // The image to display as the icon
  grantedItems: ItemWithQuantity[]; // The items the player will receive as a reward for completing the request

  requestedItems: string[]; // The items the player needs to fulfill the request
  requestedQuantity: number[] // The amount of items requested. 
  
  requirements: {
    skills: {
      [skillName: string]: number; // Skill requirements and their corresponding levels
    };
    quests: string[]; // Quests that need to be completed as requirements
    items: ItemWithQuantity[];
  };
};

const currentChains = ["Jeremy's Awakening", "Woody Wants Wood"]

const quest: NpcRequest = {
  name: "Jeremy's Disappointing Disheartenment",
  description: "",
  from: "Jeremy",
  imageUrl: "jeremy.png",
  grantedItems: [{item: "Ale", quantity: 1}],
  requestedItems: ["Ale"],
  requestedQuantity: [6],
  requirements: {skills: {}, quests:[], items:[]}
};

//createRequestInChain(currentChains[0], quest);

// outputItem: string, skillRequirementsTemp = {}, inputItems: Object

// createRecipe("Soil", undefined, {"Dirt":3, "Bone":1});

// imageUrl: string = '', itemName: string, itemDescription: string = ''

//createItem('ash.png', "Ash", "")

// locationName: string, description: string = '', lootPoolItems: Object

//createLocation("Scrapyard", "A junk heap.", {"Scrap Metal":.5})


export const AdminPage = () => {
  return <div>Creating...</div>
}