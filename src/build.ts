import yaml from 'js-yaml';
import fs from 'fs/promises';
import path from 'path';
import {fileURLToPath} from 'url';
import Ajv from 'ajv/dist/2020.js';
import {compile as compileToTs} from 'json-schema-to-typescript'
import storage from 'node-persist';
import axios from 'axios';
import type CharacterProperties from './data/characterProperties.js';

interface Module {
  id: string,
  components: {
    component_id: string,
    data: string,
  }[],
}

const toAbsolute = (p: string) => path.resolve(fileURLToPath(import.meta.url), '..', p);

await storage.init({dir: toAbsolute('.cache')});

const getWikiData = async (id: string, lang: string) => {
  const cacheId = `hoyowiki-${id}-${lang}`;
  const cached = await storage.getItem(cacheId);

  if (cached) {
    return cached;
  }

  await new Promise((resolve) => setTimeout(resolve, 5000));

  const res = await axios.get('https://sg-wiki-api-static.hoyolab.com/hoyowiki/genshin/wapi/entry_page', {
    params: {
      entry_page_id: id,
    },
    headers: {
      'x-rpc-language': lang,
      'x-rpc-wiki_app': 'genshin',
    },
  });

  if (res.status !== 200 || !res.data?.data) {
    throw new Error(`Failed to fetch data for ${id} (lang = ${lang})`);
  }

  await storage.setItem(cacheId, res.data?.data);

  return res.data?.data;
};

const toPascalCase = (s: string) => (
  s.replaceAll(/(?:[^a-z]+)([a-z])/ig, (_, c) => c.toUpperCase())
    .replaceAll(/[^a-z]/ig, '')
);

const getBuffProperties = (buff: any, title: string, description: string) => {
  if (buff.type === 'boolean') {
    return {
      type: 'object',
      title,
      description,
      properties: {
        enabled: {
          type: 'boolean',
          default: false,
          description: 'Whether the effect is enabled.',
        },
      },
      required: ['enabled'],
    };
  }

  if (buff.type === 'stacks') {
    return {
      type: 'object',
      title,
      description,
      properties: {
        stacks: {
          type: 'integer',
          default: 0,
          maximum: buff.max_stacks,
          description: 'The number of stacks.',
        },
      },
      required: ['stacks'],
    };
  }

  if (buff.type === 'element') {
    return {
      type: 'object',
      title,
      description,
      properties: {
        element: {
          enum: buff.elements,
          description: 'The element of the buff. If the buff is not elemental, this property should be null.',
        },
      },
      required: ['element'],
    }
  }

  throw new Error(`Unknown buff type ${buff.type}`);
};

const characterProperties: CharacterProperties = yaml.load(
  await fs.readFile(toAbsolute('data/characterProperties.yml'), 'utf8'),
);

const characterBuffs: any[] = [];
const teamCharacterBuffs: {[k: string]: any} = {};

for (const character of characterProperties) {
  const data = await getWikiData(character.hoyowiki_id, 'en-us');

  const buffProperties: {[k: string]: any} = {};

  const buff = {
    type: 'object',
    title: data.page.name,
    properties: {
      [toPascalCase(data.page.name)]: {
        type: 'object',
        properties: buffProperties,
        additionalProperties: false,
      },
    },
    required: [toPascalCase(data.page.name)],
    additionalProperties: false,
  };

  const teamBuffProperties: {[k: string]: any} = {};

  const teamBuff = {
    type: 'object',
    title: data.page.name,
    description: data.page.name,
    properties: teamBuffProperties,
    additionalProperties: false,
  };

  const modules: Module[] = data?.page?.modules ?? [];

  const ascentModule = modules.find((m) => m.id === '2');
  const ascentionData = (ascentModule?.components ?? []).find((c) => c.component_id === 'ascension')?.data;
  const ascention = JSON.parse(ascentionData ?? '{}');

  console.log(ascention);

  const talentsModule = modules.find((m) => m.id === '4');
  const talentsData = (talentsModule?.components ?? []).find((c) => c.component_id === 'talent')?.data;
  const talents = JSON.parse(talentsData ?? '{}');

  console.log(talents);

  const constellationsModule = modules.find((m) => m.id === '5');
  const constellationsData = (constellationsModule?.components ?? []).find((c) => c.component_id === 'summaryList')?.data;
  const constellations = JSON.parse(constellationsData ?? '{}');

  console.log(constellations);

  const talentNameData: ['a1' | 'a4', string][] = [
    ['a1', 'const_talent_0'],
    ['a4', 'const_talent_1'],
  ];

  for (const [talentName, iconUrlId] of talentNameData) {
    const characterTalent = character[talentName];
    if (characterTalent !== undefined) {
      const talent = talents.list.find((t: any) => t.icon_url.includes(iconUrlId));
      if (!talent) {
        throw new Error(`Failed to find ${talentName} talent for character id ${character.hoyowiki_id}`);
      }

      for (const buff of characterTalent) {
        if (buff.target === 'self') {
          buffProperties[talentName] = getBuffProperties(buff, talent.title, talent.desc);
        } else if (buff.target === 'team' || buff.target === 'enemy') {
          teamBuffProperties[talentName] = getBuffProperties(buff, talent.title, talent.desc);
        }
      }
    }
  }

  const constellationNameData: ['c1' | 'c2' | 'c3' | 'c4' | 'c5' | 'c6', number][] = [
    ['c1', 0],
    ['c2', 1],
    ['c3', 2],
    ['c4', 3],
    ['c5', 4],
    ['c6', 5],
  ];

  for (const [constellationName, index] of constellationNameData) {
    const characterConstellation = character[constellationName];
    if (characterConstellation !== undefined) {
      const constellation = constellations.list[index];
      if (!constellation) {
        throw new Error(`Failed to find constellation ${index + 1} for character id ${character.hoyowiki_id}`);
      }

      for (const buff of characterConstellation) {
        if (buff.target === 'self') {
          buffProperties.c1 = getBuffProperties(buff, constellation.name, constellation.desc);
        } else if (buff.target === 'team' || buff.target === 'enemy') {
          teamBuffProperties.c1 = getBuffProperties(buff, constellation.name, constellation.desc);
        }
      }
    }
  }

  characterBuffs.push(buff);
  teamCharacterBuffs[toPascalCase(data.page.name)] = teamBuff;
}

const conditionYaml = await fs.readFile(toAbsolute('condition.schema.yml'), 'utf8');
const conditionSchema = yaml.load(conditionYaml);

await fs.writeFile(toAbsolute('condition.schema.json'), JSON.stringify(conditionSchema, null, 2));

const ts = await compileToTs(conditionSchema, 'Condition');
await fs.writeFile(toAbsolute('condition.d.ts'), ts);

const buffsYaml = await fs.readFile(toAbsolute('buffs.schema.yml'), 'utf8');
const buffsSchema = yaml.load(buffsYaml);
buffsSchema.properties.character.oneOf = characterBuffs;
buffsSchema.properties.teamCharacters.properties = teamCharacterBuffs;

await fs.writeFile(toAbsolute('buffs.schema.json'), JSON.stringify(buffsSchema, null, 2));

const buffsTs = await compileToTs(buffsSchema, 'Buffs');
await fs.writeFile(toAbsolute('buffs.d.ts'), buffsTs);

// @ts-expect-error: ???
const validate = new Ajv().compile(conditionSchema);

console.log(validate.errors);