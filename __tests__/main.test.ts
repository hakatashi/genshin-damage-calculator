import {calculateDamage} from '../src/main.js';

describe('calculateDamage function', () => {
  // Example calculation taken from
  // https://genshin-impact.fandom.com/wiki/Damage#Sample_Calculation
  it('calculates damages', () => {
    const result = calculateDamage({
      level: 70,
      atk: 1500,
      base_atk_ability: 6.19,
      elemental_mastery: 150,
      is_crit: true,
      crit_dmg: 0.8,
      damage_bonus: 0.4 + 0.52,
      enemy_level: 75,
      base_res: 0.1,
      res_debuffs: 0.4,
      def_reduction: 0.23,
      vaporize: {
        trigger_element: 'pyro',
      },
    });

    expect(result.damage).toBeCloseTo(52247, 0);
  });

  // Example calculation taken from
  // https://genshin-impact.fandom.com/wiki/Damage#Sample_Calculation
  it('calculates damages on', () => {
    const result = calculateDamage({
      level: 90,
      atk: 1500,
      base_atk_ability: 6.19,
      elemental_mastery: 150,
      is_crit: true,
      crit_dmg: 0.8,
      damage_bonus: 0.4 + 0.52,
      enemy_level: 75,
      base_res: 0.1,
      res_debuffs: 0.4,
      def_reduction: 0.23,
      vaporize: {
        trigger_element: 'pyro',
      },
    });

    expect(result.damage).toBeCloseTo(52247, 0);
  });
});
