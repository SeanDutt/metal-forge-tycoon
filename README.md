---

# 🛠️ Player Progression & Quest System – Firestore-Powered Game Backend

Welcome to my personal game backend project! This is a passion project I’ve been building using **React**, **Firebase**, and **Firestore**, with a focus on designing a flexible **quest system**, **inventory management**, and **player progression** architecture. It’s designed with scalability and clarity in mind, and it's been a great learning experience.

---

## 🌟 Project Overview

This project provides the data-driven backend and admin tooling for a resource-focused game. The core components include:

* 🔁 **Quest Chains** with requirements and branching logic
* 📦 **Inventory System** using Firestore subcollections
* 🧑‍🌾 **Resource Gathering & Crafting Mechanics**
* 🎯 **Player Progression Tracking** (skills, quests, and unlocks)
* 🔥 Real-time syncing via `onSnapshot` and React `Context`

---

## 🎯 Goals

* ✅ Build a reusable quest system driven by Firestore data
* ✅ Enable conditional quest progression with resource and skill checks
* ✅ Sync player data live in the app using Firestore subscriptions
* ✅ Create robust crafting and gathering systems with dynamic feedback
* 🚧 Upcoming: NPC dialog trees and world event systems

---

## 🧱 Core Data Structures

### `Player`

```ts
interface Player {
  displayName: string;
  id: string;
  inventory: Record<string, { ownedCurrent: number; ownedLifetime: number }>;
  skillLevels: Record<string, number>;
  completedRequests: Record<string, { requests: CompletedRequest[] }>;
}
```

### `ItemWithQuantity`

```ts
interface ItemWithQuantity {
  item: string;
  imageUrl?: string;
  itemDoc?: Item;
  quantity: number;
}
```

### `Recipe`

```ts
interface Recipe {
  requiredItems: ItemWithQuantity[];
  grantedItem: ItemWithQuantity;
}
```

### `NpcRequest`

```ts
interface NpcRequest {
  name: string;
  from: string;
  description: string;
  imageUrl: string;
  requestedItems: string[];
  requestedQuantity: number[];
  grantedItems: string[];
  grantedQuantity: number[];
  requirements?: Record<string, number>;
}
```

---

## 🧩 Challenges & Solutions

### ✅ **Problem: Inventory Not Updating in Real-Time**

Initially, player inventory wasn't reactive. The UI only updated on page reload.

**Solution**: Refactored the `PlayerContext` to subscribe to Firestore using `onSnapshot`, tracking both the main player document and its subcollections like `inventory` and `completedRequests`.

---

### ✅ **Problem: Type Mismatches from Firestore Shape**

Firestore responses didn’t match the expected TypeScript structures (e.g., `completedRequests` nested under a document ID).

**Solution**: Updated Firestore documents to follow a consistent shape and wrote transform utilities to parse data into usable formats, aligning with TypeScript interfaces.

---

### ✅ **Problem: Difficulty Tracking Quest Progress**

Tracking a player’s location in a quest chain was unclear and cumbersome.

**Solution**: Added a helper function `getRequestIndexInChain()` that reads from `player.completedRequests` to determine the current quest index, allowing clean branching logic in the UI.

---

## ⚙️ Technologies Used

* ⚛️ **React** – For the front-end UI
* 🔥 **Firebase Firestore** – For real-time data and subcollection structure
* 🧪 **TypeScript** – Strong typing for clarity and safety
* 🎮 **Custom Game Logic** – Resource processing, quest validation, inventory systems

---

## 🔧 Future Features

* 🧙 NPC dialog interactions (with branching and history)
* 🗺️ World state progression by player actions
* 🔄 Server-side automation with Firebase Cloud Functions (e.g., auto-granting rewards)
* 💾 Admin dashboard for live quest editing and player inventory management

---

## 💬 Why I Built This

I wanted to attempt building a game using purely AI prompts, in order to practice my prompt engineering while also seeing what AI could do.
All prompts for this game were written by me. I prompted ChatGPT to write all the code in the game, including HTML/CSS/TypeScript. I prompted a self-hosted Stable Diffusion for all art in the game.

---

## 📷 Screenshots

![image](https://github.com/user-attachments/assets/d683019d-00b8-4e45-9150-e17f6e677743)
![image](https://github.com/user-attachments/assets/e4a10d61-dadc-40bb-88cf-6bbc98750299)
![image](https://github.com/user-attachments/assets/bc9419ea-3a32-46d0-b9b6-d9559536b3df)


---

## 🤝 Contributing

If you're a friend, employer, or fellow dev who wants to contribute or give feedback—thank you! Feel free to open issues, fork the repo, or just reach out to me directly.

---

## 🧠 Learnings

* Firebase’s subcollection model works great for isolated player data, but requires careful type handling.
* Writing reusable state-based logic (like `doesPlayerHaveResources`) keeps UI clean and decisions consistent.
* Watching Firestore with `onSnapshot` is powerful but needs debounce handling and cleanup logic to prevent over-rendering.

---

## 📫 Contact

Have questions or want to collaborate?
Feel free to reach out via [GitHub Issues](https://github.com/your-repo/issues) or shoot me a message directly!

---

Let me know if you’d like me to help generate any badges, add deploy instructions, or clean up commit history for this project.
