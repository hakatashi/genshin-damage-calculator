# genshin-damage-calculator

JavaScript library for calculating damage of Genshin Impact

[![TypeScript version][ts-badge]][typescript-5-1]
[![Node.js version][nodejs-badge]][nodejs]
[![APLv2][license-badge]][license]
[![Build Status - GitHub Actions][gha-badge]][gha-ci]

## Usage

```javascript
import {calculateDamage} from 'genshin-damage-calculator';

calculateDamage({
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
}); //=> 52247
```

## Concept

```
             ┌──────────────────────────┐
             │* Character Name          │
             │* Character Level         │
             │* Weapon                  │
        ┌────┤* Artifacts               │
        │    │* Artifact Buffs          │
        │    │  (Always triggered)      │
        │    └──────────────────────────┘
        ▼
┌─────────────────────┐
│Base Character Status│
└───────┬─────────────┘
        │
        │    ┌──────────────────────────┐
        │    │* Elemental Resonance     │
        │    │* Artifact Buffs triggered│
        │◄───┤* Talent Buffs triggered  │
        │    │* Weapons Buffs triggered │
        │    │* Lay Line Disorder  etc. │
        │    └──────────────────────────┘
        │
        ▼
┌───────────────────────┐
│Buffed Character Status│
└───────┬───────────────┘
        │
        │    ┌──────────────────────────┐
        │    │* Whether it's critical   │
        │    │* Elemental Reactions     │
        │    │* Attack-specific Buffs   │
        │◄───┤  triggered               │
        │    │* Damage Bonus            │
        │    │* Enemy Level             │
        │    │* Enemy's RES         etc.│
        │    └──────────────────────────┘
        │
        ▼
   ┌─────────┐       ┌────────────┐
   │Condition├──────►│Final Damage│
   └─────────┘       └────────────┘
```

## License

Licensed under the Apache License 2.0. See the [LICENSE](https://github.com/hakatashi/genshin-damage-calculator/blob/main/LICENSE) file for details.

[ts-badge]: https://img.shields.io/badge/TypeScript-5.1-blue.svg
[nodejs-badge]: https://img.shields.io/badge/Node.js->=%2018.12-blue.svg
[nodejs]: https://nodejs.org/dist/latest-v18.x/docs/api/
[gha-badge]: https://github.com/hakatashi/genshin-damage-calculator/actions/workflows/nodejs.yml/badge.svg
[gha-ci]: https://github.com/hakatashi/genshin-damage-calculator/actions/workflows/nodejs.yml
[typescript]: https://www.typescriptlang.org/
[typescript-5-1]: https://devblogs.microsoft.com/typescript/announcing-typescript-5-1/
[license-badge]: https://img.shields.io/badge/license-Apache2.0-blue.svg
[license]: https://github.com/hakatashi/genshin-damage-calculator/blob/main/LICENSE
[sponsor-badge]: https://img.shields.io/badge/♥-Sponsor-fc0fb5.svg
[sponsor]: https://github.com/sponsors/jsynowiec
[jest]: https://facebook.github.io/jest/
[eslint]: https://github.com/eslint/eslint
[wiki-js-tests]: https://github.com/hakatashi/genshin-damage-calculator/wiki/Unit-tests-in-plain-JavaScript
[prettier]: https://prettier.io
[volta]: https://volta.sh
[volta-getting-started]: https://docs.volta.sh/guide/getting-started
[volta-tomdale]: https://twitter.com/tomdale/status/1162017336699838467?s=20
[gh-actions]: https://github.com/features/actions
[repo-template-action]: https://github.com/hakatashi/genshin-damage-calculator/generate
[esm]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
[sindresorhus-esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c
[nodejs-esm]: https://nodejs.org/docs/latest-v16.x/api/esm.html
[ts47-esm]: https://devblogs.microsoft.com/typescript/announcing-typescript-5-1/#esm-nodejs
[editorconfig]: https://editorconfig.org
