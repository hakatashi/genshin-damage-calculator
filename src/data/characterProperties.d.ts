type Element = 'anemo' | 'cryo' | 'dendro' | 'electro' | 'geo' | 'hydro' | 'pyro';

interface Buff {
  param: string,
  value: number,
  type: 'burst' | 'skill' | 'status',
  attack_name?: string,
}

interface Effect {
  target: 'self' | 'self_persist' | 'team' | 'enemy',
  type: 'boolean' | 'stacks' | 'element',
  buffs: Buff[],
  elements?: (Element | null)[],
  max_stacks?: number,
}

interface CharacterProperty {
  hoyowiki_id: string,
  a1?: Effect[],
  a4?: Effect[],
  c1?: Effect[],
  c2?: Effect[],
  c3?: Effect[],
  c4?: Effect[],
  c5?: Effect[],
  c6?: Effect[],
}

type CharacterProperties = CharacterProperty[];

export default CharacterProperties;
