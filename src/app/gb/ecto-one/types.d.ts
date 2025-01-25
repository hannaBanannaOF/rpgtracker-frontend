type EctoOne = {
    name: string;
    description: string;
    cost: number; 
    carryWeight: number; 
    seats: number; 
    slug?: string;
    availableUpgrades?: ListItem[];
    canChange?:boolean;
}