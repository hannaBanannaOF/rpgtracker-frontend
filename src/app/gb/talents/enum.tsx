export enum TalentTrait {
    brains = 'BRAINS',
    muscle = 'MUSCLE',
    moves = "MOVES",
    cool = 'COOL'
}
  
export namespace TalentTrait {
    export function getLabel(trait: TalentTrait) {
        switch (trait) {
            case TalentTrait.brains:
            return 'Brains'
            case TalentTrait.muscle:
            return 'Muscle'
            case TalentTrait.moves:
            return 'Moves'
            case TalentTrait.cool:
            return 'Cool'
            default:
            return '';
        }
    }

    export function getSelectvalues() {
        return [
            { value: TalentTrait.brains, label: getLabel(TalentTrait.brains) },
            { value: TalentTrait.muscle, label: getLabel(TalentTrait.muscle) },
            { value: TalentTrait.moves, label: getLabel(TalentTrait.moves) },
            { value: TalentTrait.cool, label: getLabel(TalentTrait.cool) }
        ]
    }
}