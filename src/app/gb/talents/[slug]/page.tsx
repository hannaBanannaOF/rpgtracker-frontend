import { TalentDetails } from "./details";

export default async function TalentDetailsPage({params} : {params : Promise<{ slug : string }>}) {
    const {slug} = await params;
    return <TalentDetails slug={slug} />
}