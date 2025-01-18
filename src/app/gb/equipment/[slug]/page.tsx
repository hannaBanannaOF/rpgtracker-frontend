import { EquipmentDetails } from "./details";

export default async function EquipmentDetailsPage({params} : {params : Promise<{ slug : string }>}) {
    const {slug} = await params;
    return <EquipmentDetails slug={slug} />
}