// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { collection, doc, getDoc, getDocs, getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { Recipe } from "./data/recipe";
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
  measurementId: "G-80WD7YSH9W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

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

    return recipes;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
}

export async function getRecipesBySkill(playerData) {
  try {
    const recipeCollection = collection(db, "recipes");
    const recipeSnapshot = await getDocs(recipeCollection);

    // Transform the recipe snapshot data into an array of recipes
    const recipes = recipeSnapshot.docs.map((doc) => {
      // Access the recipe document data
      const recipeData = doc.data();
      // Check if the recipe has skill requirements defined
      const hasSkillRequirements = recipeData.skillRequirements && Object.keys(recipeData.skillRequirements).length > 0;
      // If the recipe has no skill requirements or the player meets the requirements, include the recipe
      if (!hasSkillRequirements || Object.keys(recipeData.skillRequirements).every(
        (skill) => playerData.skillLevels[skill] >= recipeData.skillRequirements[skill]
      )) {
        // Extract the necessary fields and return a recipe object
        return {
          input: recipeData.input,
          output: doc.id,
          skillRequirements: recipeData.skillRequirements,
        };
      }
      // Exclude the recipe
      return null;
    });

    // Filter out null values (recipes that didn't meet the requirements)
    const availableRecipes = recipes.filter((recipe) => recipe !== null);

    return availableRecipes;
  } catch (error) {
    console.error("Error fetching available recipes:", error);
    return [];
  }
}

export async function getRecipesByItemId(itemId) {
  try {
    const recipeCollection = collection(db, "recipes");
    const recipeSnapshot = await getDocs(recipeCollection);

    // Transform the recipe snapshot data into an array of recipes
    const recipes = recipeSnapshot.docs
      .map((doc) => {
        // Access the recipe document data
        const recipeData = doc.data();
        // Extract the necessary fields and return a recipe object
        return {
          input: recipeData.input,
          output: doc.id,
          skillRequirements: recipeData.skillRequirements,
        };
      })
      .filter((recipe) => {
        // Check if the itemId is included in the input items or the output item of the recipe
        return (
          recipe.input.hasOwnProperty(itemId)
        );
      });

    return recipes;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
}

export async function getRecipeForItemId(itemId: string): Promise<Recipe | null> {
  try {
    const recipeDocRef = doc(db, "recipes", itemId);
    const recipeDocSnapshot = await getDoc(recipeDocRef);

    if (!recipeDocSnapshot.exists()) {
      return null; // No recipe found for the specified output item
    }

    const recipeData = recipeDocSnapshot.data();

    return {
      input: recipeData.input,
      output: itemId,
      skillRequirements: recipeData.skillRequirements,
    };
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return null;
  }
}

const transformPlayerData = (data) => {
  const displayName = data.displayName || '';
  const skillLevels = data.skillLevels || {};
  const inventory = data.inventory || {};
  const id = data.id || '';

  return {
    displayName,
    skillLevels,
    inventory,
    id
  };
};

const getPlayerById = async (playerID) => {
  const playerRef = doc(db, "players", playerID);
  const playerSnapshot = await getDoc(playerRef);

  if (playerSnapshot.exists()) {
    const transformedData = transformPlayerData(playerSnapshot.data());
    return transformedData;
  }

  return 'Player not found';
};

export { auth, app, db, transformPlayerData, getPlayerById };