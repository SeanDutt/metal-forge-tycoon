export interface Item {
    name: string
    description?: string
    imageUrl?: string
}

export interface InventoryItem extends Item {
    ownedCurrent?: number;
    ownedLifetime?: number;
}