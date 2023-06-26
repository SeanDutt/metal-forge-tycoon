export type CompletedRequest = {
    name: string;
    completionDate: string;
  };

export interface Player {
    displayName: string;
    id: string;
    inventory: Record<string, { ownedCurrent: number; ownedLifetime: number }>;
    skillLevels: Record<string, number>;
    completedRequests: Record<string, CompletedRequest[]>;
}