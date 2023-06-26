/* eslint-disable @typescript-eslint/no-unused-vars */
import { addDoc, collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import React from "react";
import { db } from "../../firebase.ts";
import "./adminPage.css";


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
      input: inputItems,
      skillRequirements: skillRequirements,
      output: outputItem
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

const questChainId = "Woody Wants Wood"; // This represents the document ID of the request chain
const quest: NpcRequest = {
  name: "Woody's Wooden Wonder",
  description: 
  "In the depths of the forest, Woody awaits, silently continuing his pursuit of wood. Having assisted him in expanding his timber trove, you have proven yourself as a trusted ally. Now, Woody seeks to put the collected wood to good use. Can you aid him in his newfound ambition of crafting wooden wonders?<br><br>Listen up, partner. Woody here. You've been a reliable help in gatherin' all that wood. It's time to put it to use. See, I got this itch to create somethin' out of these logs and planks. Got a few ideas swirlin' around in my head, and I reckon you might just have the skills to make 'em a reality.<br><br>But I ain't askin' you to do all the work. No, we'll be partners in this endeavor. I'll share my vision, and you'll help me bring it to life. Together, we'll craft masterpieces that'll make folks' jaws drop. Ready to get your hands dirty, partner?<br><br>Remember, partner, this ain't just about craftin' wood. It's about makin' a mark, leavin' behind somethin' that'll make folks remember. We'll be the talk of the town with our skills and creativity. Let's embark on this woodworkin' journey together.",
  from: "Woody",
  grantedItems: [],
  requestedItems: {"Tool":15,"Wood":400,"Oil":10},
  requirements: {skills: {}, quests:[], items:{}}
};

//createRequestInChain(questChainId, quest);




// outputItem: string, skillRequirementsTemp = {}, inputItems: Object

// createRecipe("Soil", undefined, {"Dirt":3, "Bone":1});

// imageUrl: string = '', itemName: string, itemDescription: string = ''

// createItem(undefined, "Dirt", "Gettin' dirty")

// locationName: string, description: string = '', lootPoolItems: Object

//createLocation("Scrapyard", "A junk heap.", {"Scrap Metal":.5})


export const AdminPage = () => {
  return <div>Creating...</div>
}