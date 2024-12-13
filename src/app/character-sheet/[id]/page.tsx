import { BaseCharacterSheetInfo } from "./baseinfo";

export default async function CharacterSheetDetailPage({params} : {params : Promise<{ slug : string }>}) {
    const {slug} = await params;
    return <BaseCharacterSheetInfo slug={slug} />
}