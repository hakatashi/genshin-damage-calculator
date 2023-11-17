import type { Buffs } from './buffs.js';
import type { Catalyze, Condition, Melt, Vaporize } from './condition.js';
import { characterLevelMultipliers } from './data/levelMultipliers.js';

const getVaporizeBonus = (vaporize: Vaporize, elementalMastery: number) => {
	if (vaporize === null) {
		return 1;
	}

	const vaporizeMultiplier = vaporize.trigger_element === 'pyro' ? 2 : 1.5;
	const elementalMasteryBonus =
		(2.78 * elementalMastery) / (elementalMastery + 1400);

	return vaporizeMultiplier * (1 + elementalMasteryBonus);
};

const getMeltBonus = (melt: Melt, elementalMastery: number) => {
	if (melt === null) {
		return 1;
	}

	const meltMultiplier = melt.trigger_element === 'pyro' ? 1.5 : 2;
	const elementalMasteryBonus =
		(2.78 * elementalMastery) / (elementalMastery + 1400);

	return meltMultiplier * (1 + elementalMasteryBonus);
};

const getCatalyzeDamage = (
	catalyze: Catalyze,
	level: number,
	elementalMastery: number,
) => {
	if (catalyze === null) {
		return 0;
	}

	const catalyzeMultiplier = catalyze.type === 'aggravate' ? 1.15 : 1.25;
	const levelMultiplier = characterLevelMultipliers[level - 1];
	const elementalMasteryBonus =
		(5 * elementalMastery) / (elementalMastery + 1200);

	return (
		catalyzeMultiplier *
		levelMultiplier *
		(1 + elementalMasteryBonus + (catalyze.bonus ?? 0))
	);
};

const getResMultiplier = (res: number) => {
	if (res < 0) {
		return 1 - res / 2;
	}

	if (res < 0.75) {
		return 1 - res;
	}

	return 1 / (4 * res + 1);
};

export const calculateDamage = (condition: Condition) => {
	// Apply defaults
	const {
		level = 90,
		atk = 0,
		def = 0,
		hp = 0,
		is_crit = false,
		crit_dmg = 0,
		elemental_mastery = 0,
		base_atk_ability = 0,
		base_def_ability = 0,
		base_hp_ability = 0,
		base_elemental_mastery_ability = 0,
		base_damage_bonus = 0,
		additive_base_damage_atk_multiplier = 0,
		additive_base_damage_def_multiplier = 0,
		additive_base_damage_hp_multiplier = 0,
		additive_base_damage_elemental_mastery_multiplier = 0,
		damage_bonus = 0,
		enemy_level = 90,
		def_reduction = 0,
		def_ignored = 0,
		base_res = 0,
		res_bonus = 0,
		res_debuffs = 0,
		vaporize = null,
		melt = null,
		catalyze = null,
	} = condition;

	const atkDamage = atk * base_atk_ability;
	const defDamage = def * base_def_ability;
	const hpDamage = hp * base_hp_ability;
	const elementalMasteryDamage =
		elemental_mastery * base_elemental_mastery_ability;

	const baseDamage = atkDamage + defDamage + hpDamage + elementalMasteryDamage;

	const catalyzeDamage = getCatalyzeDamage(catalyze, level, elemental_mastery);

	const additiveBaseDamage =
		atk * additive_base_damage_atk_multiplier +
		def * additive_base_damage_def_multiplier +
		hp * additive_base_damage_hp_multiplier +
		elemental_mastery * additive_base_damage_elemental_mastery_multiplier +
		catalyzeDamage;

	const finalBaseDamage =
		baseDamage * (1 + base_damage_bonus) + additiveBaseDamage;

	const damageBonus = 1 + damage_bonus;

	const critBonus = is_crit ? 1 + crit_dmg : 1;

	const vaporizeBonus = getVaporizeBonus(vaporize, elemental_mastery);

	const meltBonus = getMeltBonus(melt, elemental_mastery);

	const defMultiplier =
		(level + 100) /
		((enemy_level + 100) * (1 - def_reduction) * (1 - def_ignored) +
			level +
			100);

	const resMultiplier = getResMultiplier(base_res + res_bonus - res_debuffs);

	const damage =
		finalBaseDamage *
		damageBonus *
		critBonus *
		vaporizeBonus *
		meltBonus *
		defMultiplier *
		resMultiplier;

	return {damage};
};

export const calculateCondition = (buffs: Buffs) => {
	if ('venti' in buffs.character) {
		console.log(buffs.character.venti.c2);
	}
}

export * from './condition.js';
export * from './data/levelMultipliers.js';