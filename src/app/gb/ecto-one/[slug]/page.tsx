import { EctoOneDetails } from "./details";

export default async function EctoOneDetailsPage({params} : {params : Promise<{ slug : string }>}) {
    const {slug} = await params;
    return <EctoOneDetails slug={slug} />
}