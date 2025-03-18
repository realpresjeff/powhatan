import { Spell } from './models';

const resurrectWithBones: Spell = {
    name: "Resurrect with Bones",
    element: "Dark",
    type: "Summon",
    effect: "Summons a temporary skeletal ally using bones from dead creatures.",
    chargeEffect: "Stronger allies with more health can be summoned depending on charge.",
    drain: 15
};

export const necromancy = {
    resurrectWithBones
}