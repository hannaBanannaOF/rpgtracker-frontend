type Headquarters = {
    name: string;
    description: string;
    cost: number; 
    inventorySize: number; 
    containmentGridCapacity: number; 
    garageSize: number; 
    slug?: string;
    canChange?:boolean;
}