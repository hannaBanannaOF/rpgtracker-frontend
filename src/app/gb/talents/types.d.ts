import { TalentTrait } from "./enum";

type Talent = {
    name: string;
    trait: TalentTrait;
    slug?: string;
    canChange?: boolean
}