type Equipment = {
    name: string;
    cost: number; 
    weight: number; 
    description: string;
    slug?: string;
    availableUpgrades?: ListItem[];
    canChange?: boolean;
}