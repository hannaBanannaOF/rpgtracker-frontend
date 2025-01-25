type BasicCharacterSheetInfo = {
    id: number;
    slug: string;
    characterName: string;
    system: TRpgKind;
    played: boolean;
}

type GbCharacterSheetInfo = {
    brains: number;
    muscle: number;
    moves: number;
    cool: number;
    brainsTalent: string;
    muscleTalent: string;
    movesTalent: string;
    coolTalent: string;
    browniePoints: number
    goal: string;
    residence: string;
    phone: string;
    coreCharacterSheetId: number;
    id: number;
}