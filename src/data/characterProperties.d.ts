import type {JSONSchema7Definition} from 'json-schema';

type Element = 'anemo' | 'cryo' | 'dendro' | 'electro' | 'geo' | 'hydro' | 'pyro';

interface Buff {
  param: string,
  value: number,
  is_absolute?: boolean,
  type: 'burst' | 'skill' | 'status',
  attack_name?: string,
}

interface BaseEffect {
  description?: string,
  target: 'self' | 'self_persist' | 'team' | 'team_excluding_self' | 'enemy',
  buffs: Buff[],
}

interface BooleanEffect extends BaseEffect {
  type: 'boolean',
}

interface StackEffect extends BaseEffect {
  type: 'stacks',
  max_stacks: number,
}

interface ElementEffect extends BaseEffect {
  type: 'element',
  elements: (Element | null)[],
}

interface CustomEffect extends BaseEffect {
  type: 'custom',
  properties: {
    [key: string]: JSONSchema7Definition,
  },
}

export type Effect = BooleanEffect | StackEffect | ElementEffect | CustomEffect;

export interface EffectObject {
  [key: string]: Effect,
}

export interface CharacterProperty {
  hoyowiki_id: string,
  skill?: EffectObject,
  burst?: EffectObject,
  a1?: EffectObject,
  a4?: EffectObject,
  c1?: EffectObject,
  c2?: EffectObject,
  c3?: EffectObject,
  c4?: EffectObject,
  c5?: EffectObject,
  c6?: EffectObject,
}

type CharacterProperties = CharacterProperty[];

export default CharacterProperties;
