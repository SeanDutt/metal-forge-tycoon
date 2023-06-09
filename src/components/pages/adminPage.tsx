/* eslint-disable @typescript-eslint/no-unused-vars */
import { doc, getDoc, setDoc } from "firebase/firestore";
import React from "react";
import { db } from "../../firebase.ts";
import "./adminPage.css";


const createRecipe = async (
  outputItem: string,
  skillRequirementsTemp = {},
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
      skillRequirements: skillRequirementsTemp,
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

const createNPCRequest = async (
  name: string,
  from: string= "",
  description: string,
  skillRequirements = {},
  grantedItems: Object,
  requestedItems: Object
  ) => {
  try {
    // Create a new recipe document with the provided input and skill requirements
    await setDoc(doc(db,"npcrequests",name), {
      requestedItems: requestedItems,
      skillRequirements: skillRequirements,
      grantedItems: grantedItems,
      description: description,
      from: from
    });
  } catch (error) {
    console.error("Error creating recipe:", error);
  }
};

// name: string, from: string= "", description: string, grantedItems: Object, skillRequirements = {}, requestedItems: Object
// createNPCRequest('Help out Woody', 'Woody', 'Woody need wood', undefined, {"Stone":200}, {"Wood":1000})


// outputItem: string, skillRequirementsTemp = {}, inputItems: Object

// createRecipe("Metal gear", undefined, {"Scrap Metal":10});


// imageUrl: string = '', itemName: string, itemDescription: string = ''

// createItem(undefined, "Dirt", "Gettin' dirty")


// locationName: string, description: string = '', lootPoolItems: Object

//createLocation("Scrapyard", "A junk heap.", {"Scrap Metal":.5})


export const AdminPage = () => {
  return <div>Creating...</div>
}