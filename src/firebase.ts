// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  DocumentData,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { Recipe, Requirement } from "./data/recipe";
import { Player } from "./data/player";
import { Item, ItemWithQuantity } from "./data/items";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAlsGfHozBXBGPRK7fColC8FRNfsPPgKIE",
  authDomain: "metalty-da486.firebaseapp.com",
  projectId: "metalty-da486",
  storageBucket: "metalty-da486.appspot.com",
  messagingSenderId: "317221911839",
  appId: "1:317221911839:web:8139689c26a68e1a6f042a",
  measurementId: "G-80WD7YSH9W",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export async function getItemById(itemId: string): Promise<Item | null> {
  try {
    const itemDocRef = doc(db, "items", itemId);
    const itemDocSnap = await getDoc(itemDocRef);

    if (itemDocSnap.exists()) {
      const itemData = itemDocSnap.data();
      // Assuming itemData is an object that represents the item properties
      // You can modify this part based on your actual data structure

      // Create an Item object based on the fetched data
      const item: Item = {
        name: itemData.name,
        description: itemData.itemDescription || "",
        imageUrl: itemData.imageUrl,
        // Include other properties based on your Item interface
      };

      return item;
    }

    return null; // Item not found
  } catch (error) {
    console.error("Error fetching item:", error);
    return null;
  }
}

// Recipe helpers...

// Gets all recipes from firestore DB
export async function getAllRecipes() {
  try {
    const recipeCollection = collection(db, "recipes");
    const recipeSnapshot = await getDocs(recipeCollection);

    // Transform the recipe snapshot data into an array of recipes
    const recipes = recipeSnapshot.docs.map((doc) => {
      // Access the recipe document data
      const recipeData = doc.data();
      // Extract the necessary fields and return a recipe object
      return {
        input: recipeData.input,
        output: doc.id,
        skillRequirements: recipeData.skillRequirements,
      };
    });
    recipes.sort((a, b) => a.output.localeCompare(b.output));

    return recipes;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
}

// Gets all recipes, then filters them down to what skillReqs are met in the playerSkills
// export async function getRecipesBySkill(playerData: Player): Promise<Recipe[]> {
//   try {
//     const recipeCollection = collection(db, "recipes");
//     const recipeSnapshot = await getDocs(recipeCollection);

//     // Transform the recipe snapshot data into an array of promises
//     const recipePromises = recipeSnapshot.docs.flatMap(async (doc) => {
//       const recipeData = doc.data();
//       const hasSkillRequirements = recipeData.skillRequirements && Object.keys(recipeData.skillRequirements).length > 0;

//       if (!hasSkillRequirements || Object.keys(recipeData.skillRequirements).every(
//         (skill) => playerData.skillLevels[skill] >= recipeData.skillRequirements[skill]
//       )) {
//         const outputItemPromise = getItemById(recipeData.grantedItems);
//         const outputItem = await outputItemPromise;

//         if (outputItem) {
//           return {
//             requiredItems: recipeData.requiredItems,
//             grantedItems: recipeData.grantedItems,
//           } as Recipe;
//         }
//       }

//       return null;
//     });

//     // Wait for all recipe promises to resolve
//     const recipeResults = await Promise.all(recipePromises);

//     // Filter out null values (recipes that didn't meet the requirements)
//     const availableRecipes = recipeResults.filter((recipe): recipe is Recipe => recipe !== null);

//     return availableRecipes;
//   } catch (error) {
//     console.error("Error fetching available recipes:", error);
//     return [];
//   }
// }

// Takes in an itemId and tries to return an array of recipes that item is used in
export async function getRecipesByItemId(itemId: string): Promise<Recipe[]> {
  try {
    const recipeCollection = collection(db, "recipes");
    const querySnapshot = await getDocs(
      query(recipeCollection, where("requiredItems", "array-contains", itemId))
    );

    const recipes = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const recipeData = doc.data();
        const requiredItems = recipeData.requiredItems.map(
          (itemName: string, index: number) => {
            return {
              item: itemName,
              quantity: recipeData.quantityRequired[index],
            } as ItemWithQuantity;
          }
        );

        const grantedItem = await getItemById(recipeData.grantedItem.item);
        const imageUrl = grantedItem ? grantedItem.imageUrl : "";

        return {
          requiredItems,
          grantedItem: {
            item: recipeData.grantedItem.item,
            quantity: recipeData.grantedItem.quantity,
            imageUrl,
          },
          requirements: recipeData.requirements,
        } as Recipe;
      })
    );

    return recipes;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
}

// Takes in an itemId and tries to return a recipe for that item
export async function getRecipeForItemId(
  itemId: string
): Promise<Recipe | null> {
  try {
    const recipeDocRef = doc(db, "recipes", itemId);
    const recipeDocSnapshot = await getDoc(recipeDocRef);

    if (!recipeDocSnapshot.exists()) {
      return null; // No recipe found for the specified output item
    }

    const recipeData = recipeDocSnapshot.data();

    // Get the image URLs for required items
    const requiredItems: ItemWithQuantity[] = await Promise.all(
      recipeData.requiredItems.map(
        async (itemRequired: string, index: number) => {
          const item = await getItemById(itemRequired);
          if (item) {
            return {
              item: item.name,
              itemDoc: item,
              quantity: recipeData.quantityRequired[index],
              imageUrl: item.imageUrl,
            };
          }
          return null;
        }
      )
    );

    // Filter out any null values from requiredItems
    const filteredRequiredItems = requiredItems.filter(
      (requiredItem): requiredItem is ItemWithQuantity => requiredItem !== null
    );

    return {
      requiredItems: filteredRequiredItems,
      grantedItem: recipeData.grantedItem,
      requirements: recipeData.requirements,
    };
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return null;
  }
}

// Gets all recipes, and returns them with imageUrls for the output item.
export async function getAllRecipesWithOutputImageUrls(): Promise<Recipe[]> {
  try {
    const recipeCollectionRef = collection(db, "recipes");
    const querySnapshot = await getDocs(recipeCollectionRef);

    const fetchedRecipes: Recipe[] = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const recipeData = doc.data();

        // Retrieve the output item's imageUrl
        const outputItem = await getItemById(recipeData.grantedItem.item);
        const imageUrl = outputItem ? outputItem.imageUrl : "";

        // Construct the grantedItem with the imageUrl
        const grantedItem: ItemWithQuantity = {
          item: recipeData.grantedItem.item,
          imageUrl,
          quantity: recipeData.grantedItem.quantity,
        };
        console.log("required:", recipeData.requiredItems);
        // Construct the requiredItems without retrieving the detailed item document
        const requiredItems: ItemWithQuantity[] = recipeData.requiredItems.map(
          (itemRequired: string, index: number) => {
            return {
              item: itemRequired,
              quantity: recipeData.quantityRequired[index],
            };
          }
        );

        // Construct the requirements
        const requirements: Requirement[] = recipeData.requirements;

        return {
          requiredItems,
          grantedItem,
          requirements,
        };
      })
    );

    return fetchedRecipes;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
}

const transformPlayerData = (data: DocumentData) => {
  const displayName = data.displayName || "";
  const skillLevels = data.skillLevels || {};
  const inventory = data.inventory || {};
  const id = data.id || "";

  return {
    displayName,
    skillLevels,
    inventory,
    id,
  };
};

// This function takes in a playerId and returns that player's data.
const getPlayerById = async (playerID: string) => {
  const playerRef = doc(db, "players", playerID);
  const playerSnapshot = await getDoc(playerRef);

  if (playerSnapshot.exists()) {
    const transformedData = transformPlayerData(playerSnapshot.data());
    return transformedData as Player;
  }

  return "Player not found";
};

// export async function fetchItemWithImageUrls(items: ItemWithQuantity[]): Promise<ItemWithQuantity[]> {
//   const itemPromises = items.map(async (item) => {
//     const itemRef = doc(db, 'items', item);
//     const itemSnapshot = await getDoc(itemRef);

//     if (itemSnapshot.exists()) {
//       const itemData = itemSnapshot.data();
//       const imageUrl = itemData.imageUrl;
//       return { ...item, imageUrl };
//     } else {
//       return item;
//     }
//   });

//   return Promise.all(itemPromises);
// }

export { auth, app, db, transformPlayerData, getPlayerById };
