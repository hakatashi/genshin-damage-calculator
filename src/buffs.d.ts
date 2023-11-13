/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * The buffs that apply to the character itself.
 */
export type Character = Lisa | Eula | Kaeya | Klee | Amber | TravelerAnemo;

/**
 * Buffs that apply to the character. The buffs are applied after the calculations of character properties.
 */
export interface Buffs {
  character?: Character;
  team_characters?: TeamCharacter;
  [k: string]: unknown;
}
export interface Lisa {
  lisa: Lisa1;
}
export interface Lisa1 {
  c2?: ElectromagneticField;
}
/**
 * Holding <span style="color:#FFD780FF">Violet Arc</span> has the following effects:
 * ·Increases DEF by 25%.
 * ·Increases Lisa's resistance to interruption.
 */
export interface ElectromagneticField {
  /**
   * Whether the effect is enabled.
   */
  enabled: boolean;
  [k: string]: unknown;
}
export interface Eula {
  eula: Eula1;
}
export interface Eula1 {
  c1?: TidalIllusion;
  c5?: ChivalricQuality;
}
/**
 * Every time <span style="color:#FFD780FF">Icetide Vortex</span>'s Grimheart stacks are consumed, Eula's Physical DMG is increased by 30% for 6s.
 * Each stack consumed will increase the duration of this effect by 6s up to a maximum of 18s.
 */
export interface TidalIllusion {
  /**
   * Whether the effect is enabled.
   */
  enabled: boolean;
  [k: string]: unknown;
}
/**
 * Increases the Level of <span style="color:#FFD780FF">Icetide Vortex</span> by 3.
 * Maximum upgrade level is 15.
 */
export interface ChivalricQuality {
  /**
   * Whether the effect is enabled.
   */
  enabled: boolean;
  [k: string]: unknown;
}
export interface Kaeya {
  kaeya: Kaeya1;
}
export interface Kaeya1 {
  c1?: ExcellentBlood;
}
/**
 * The CRIT Rate of Kaeya's Normal and Charge Attacks against opponents affected by <span style="color:#99FFFFFF">Cryo</span> is increased by 15%.
 */
export interface ExcellentBlood {
  /**
   * Whether the effect is enabled.
   */
  enabled: boolean;
  [k: string]: unknown;
}
export interface Klee {
  klee: Klee1;
}
export interface Klee1 {
  a1?: PoundingSurprise;
}
/**
 * When <span style="color:#FFD780FF">Jumpy Dumpty</span> and Normal Attacks deal DMG, Klee has a 50% chance to obtain an Explosive Spark.
 * This Explosive Spark is consumed by the next Charged Attack, which costs no Stamina and deals 50% increased DMG.
 */
export interface PoundingSurprise {
  /**
   * Whether the effect is enabled.
   */
  enabled: boolean;
  [k: string]: unknown;
}
export interface Amber {
  amber: Amber1;
}
export interface Amber1 {
  a1?: EveryArrowFindsItsTarget;
  a4?: PreciseShot;
  c2?: BunnyTriggered;
}
/**
 * Increases the CRIT Rate of <span style="color:#FFD780FF">Fiery Rain</span> by 10% and widens its AoE by 30%.
 */
export interface EveryArrowFindsItsTarget {
  /**
   * Whether the effect is enabled.
   */
  enabled: boolean;
  [k: string]: unknown;
}
/**
 * Aimed Shot hits on weak points increase ATK by 15% for 10s.
 */
export interface PreciseShot {
  /**
   * Whether the effect is enabled.
   */
  enabled: boolean;
  [k: string]: unknown;
}
/**
 * Baron Bunny, new and improved! Hitting Baron Bunny's foot with a fully-charged Aimed Shot manually detonates it.
 * Explosion via manual detonation deals 200% additional DMG.
 */
export interface BunnyTriggered {
  /**
   * Whether the effect is enabled.
   */
  enabled: boolean;
  [k: string]: unknown;
}
export interface TravelerAnemo {
  traveler_anemo: TravelerAnemo1;
}
export interface TravelerAnemo1 {}
/**
 * The buffs that apply to the team characters.
 */
export interface TeamCharacter {
  lisa?: Lisa2;
  eula?: Eula2;
  kaeya?: Kaeya2;
  klee?: Klee2;
  amber?: Amber2;
  traveler_anemo?: TravelerAnemo2;
  [k: string]: unknown;
}
/**
 * Lisa
 */
export interface Lisa2 {
  a4?: StaticElectricityField;
}
/**
 * Opponents hit by <span style="color:#FFD780FF">Lightning Rose</span> have their DEF decreased by 15% for 10s.
 */
export interface StaticElectricityField {
  /**
   * Whether the effect is enabled.
   */
  enabled: boolean;
  [k: string]: unknown;
}
/**
 * Eula
 */
export interface Eula2 {}
/**
 * Kaeya
 */
export interface Kaeya2 {}
/**
 * Klee
 */
export interface Klee2 {
  c2?: ExplosiveFrags;
  c6?: BlazingDelight;
}
/**
 * Being hit by <span style="color:#FFD780FF">Jumpy Dumpty</span>'s mines decreases opponents' DEF by 23% for 10s.
 */
export interface ExplosiveFrags {
  /**
   * Whether the effect is enabled.
   */
  enabled: boolean;
  [k: string]: unknown;
}
/**
 * While under the effects of <span style="color:#FFD780FF">Sparks 'n' Splash</span>, Klee will regenerate 3 Energy for all members of the party (excluding Klee) every 3s.
 * When <span style="color:#FFD780FF">Sparks 'n' Splash</span> is used, all party members will gain a 10% <span style="color:#FF9999FF">Pyro DMG Bonus</span> for 25s.
 */
export interface BlazingDelight {
  /**
   * Whether the effect is enabled.
   */
  enabled: boolean;
  [k: string]: unknown;
}
/**
 * Amber
 */
export interface Amber2 {
  c6?: Wildfire;
}
/**
 * <span style="color:#FFD780FF">Fiery Rain</span> increases all party members' Movement SPD by 15% and ATK by 15% for 10s.
 */
export interface Wildfire {
  /**
   * Whether the effect is enabled.
   */
  enabled: boolean;
  [k: string]: unknown;
}
/**
 * Traveler (Anemo)
 */
export interface TravelerAnemo2 {
  c6?: IntertwinedWinds;
}
/**
 * Targets who take DMG from <span style="color:#FFD780FF">Gust Surge</span> have their <span style="color:#80FFD7FF">Anemo RES</span> decreased by 20%.
 * If an Elemental Absorption occurred, then their RES towards the corresponding Element is also decreased by 20%.
 */
export interface IntertwinedWinds {
  /**
   * The element of the buff. If the buff is not elemental, this property should be null.
   */
  element: null | "anemo" | "pyro" | "cyro" | "hydro" | "electro";
  [k: string]: unknown;
}
