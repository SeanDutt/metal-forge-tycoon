export interface ProductionBuilding {
    name: string;
    baseUpgradeCost: {
        [itemName: string]: number;
    };
    productionRate: number;
    autoCollect: boolean;
    itemLimit?: number;
    upgradeCostScaling: number;
}

