import { HeadquartersDetails } from "./details";

export default async function HeadquartersDetailsPage({params} : {params : Promise<{ slug : string }>}) {
    const {slug} = await params;
    return <HeadquartersDetails slug={slug} />
}