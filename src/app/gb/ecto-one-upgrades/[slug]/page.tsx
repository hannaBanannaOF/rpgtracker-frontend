import { EctoOneUpgradeDetails } from "./details";

export default async function EctoOneUpgradeDetailsPage({params} : {params : Promise<{ slug : string }>}) {
    const {slug} = await params;
    return <EctoOneUpgradeDetails slug={slug} />
}