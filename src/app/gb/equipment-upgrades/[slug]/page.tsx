import { EquipmentUpgradeDetails } from "./details";

export default async function EquipmentUpgradeDetailsPage({params} : {params : Promise<{ slug : string }>}) {
    const {slug} = await params;
    return <EquipmentUpgradeDetails slug={slug} />
}