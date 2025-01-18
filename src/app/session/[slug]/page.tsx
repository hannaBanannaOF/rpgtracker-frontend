import { SessionInfo } from "./baseinfo";

export default async function SessionInfoPage({params} : {params : Promise<{ slug : string }>}) {
    const {slug} = await params;
    return <SessionInfo slug={slug} />
}