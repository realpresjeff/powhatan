export interface Spell {
    name: string;
    element: string;
    type: string;
    effect: string;
    statusEffects?: string[];
    description?: string;
    elementalInteractions?: {
        [key: string]: {
            description: string;
            fn: Function;
        };
    };
    chargeEffect?: string;
    drain: number;
    cooldown?: number;
    duration?: number;
    chargeable?: boolean;
    charge_levels?: {
        [key: string]: {
            damage: number;
            burn_effect?: number;
            burn_duration?: number;
            stun_duration?: number;
            shock_effect?: boolean;
        };
    };
    charge_consumption?: {
        [key: string]: number;
    };
    special_attack_bar?: boolean;
    status_effects?: string[];
    aoe?: boolean;
    elemental_interactions?: {
        [key: string]: {
            effect: string;
            function: string;
        };
    };
}

export interface ElementalSummonSpell extends Spell {
    resourceType: string; // Wood, Water, Fire, Bones, etc.
    resourceCost: number; // How many units of resource to summon
}