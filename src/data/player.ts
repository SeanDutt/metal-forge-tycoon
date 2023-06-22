export interface Player {
    displayName: string;
    id: string;
    inventory: Record<string, { ownedCurrent: number; ownedLifetime: number }>;
    skillLevels: Record<string, number>;
    completedRequests: { requestChain?: string, completed?: [{questId: string; completionDate: string}] };
}