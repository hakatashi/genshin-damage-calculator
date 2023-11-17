import fs from 'fs/promises';
import path from 'path';
import {fileURLToPath} from 'url';
import Ajv from 'ajv/dist/2020.js';
import axios from 'axios';
import yaml from 'js-yaml';
import type { JSONSchema7, JSONSchema7Definition} from 'json-schema';
import {compile as compileToTs} from 'json-schema-to-typescript'
import storage from 'node-persist';
import type CharacterProperties from './data/characterProperties.js';
import { Effect, EffectObject } from './data/characterProperties.js';

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

	await new Promise((resolve) => {setTimeout(resolve, 5000)});

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

const toSnakeCase = (s: string) => { 
	const words = s.split(/[^a-z]+/ig).filter((w) => w.length > 0);
	return words.map((w) => w.toLowerCase()).join('_');
};

const getEffectSchema = (effect: Effect): JSONSchema7Definition => {
	if (effect.type === 'boolean') {
		return {
			type: 'boolean',
			default: false,
			description: effect.description ?? 'Whether the effect is activated.',
		};
	}

	if (effect.type === 'stacks') {
		return {
			type: 'integer',
			default: 0,
			maximum: effect.max_stacks,
			description: effect.description ?? 'The number of stacks.',
		};
	}

	if (effect.type === 'element') {
		return {
			enum: effect.elements,
			description: effect.description ?? 'The element of the buff. If the buff is not elemental, this property should be null.',
		}
	}

	if (effect.type === 'custom') {
		return {
			type: 'object',
			description: effect.description,
			properties: effect.properties,
			required: Object.keys(effect.properties),
		};
	}

	throw new Error('Unknown buff type');
};

const characterProperties: CharacterProperties = yaml.load(
	await fs.readFile(toAbsolute('data/characterProperties.yml'), 'utf8'),
);

const characterBuffs: JSONSchema7[] = [];
const teamCharacterBuffs: {[k: string]: JSONSchema7} = {};

for (const character of characterProperties) {
	const data = await getWikiData(character.hoyowiki_id, 'en-us');

	const buffProperties: {[k: string]: JSONSchema7} = {};

	const buffObject: JSONSchema7 = {
		type: 'object',
		title: data.page.name,
		properties: {
			[toSnakeCase(data.page.name)]: {
				type: 'object',
				title: data.page.name,
				properties: buffProperties,
				additionalProperties: false,
			},
		},
		required: [toSnakeCase(data.page.name)],
		additionalProperties: false,
	};

	const teamBuffProperties: {[k: string]: any} = {};

	const teamBuffObject: JSONSchema7 = {
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

	const populateBuffProperties = (effectObject: EffectObject, id: string, effectTitle: string, effectDescription: string) => {
		const normalizedDescription = effectDescription.replaceAll('<br/>', '\n');

		const buffSchema: JSONSchema7 = {
			type: 'object',
			title: effectTitle,
			description: normalizedDescription,
			properties: {},
		};

		const teamBuffSchema: JSONSchema7 = {
			type: 'object',
			title: effectTitle,
			description: normalizedDescription,
			properties: {},
		};

		for (const [key, effect] of Object.entries(effectObject)) {
			if (effect.target === 'self') {
				buffSchema.properties![key] = getEffectSchema(effect);
			} else if (effect.target === 'team' || effect.target === 'team_excluding_self' || effect.target === 'enemy') {
				teamBuffSchema.properties![key] = getEffectSchema(effect);
			}
		}

		buffProperties[id] = buffSchema;
		teamBuffProperties[id] = teamBuffSchema;
	};

	const talentNameData: ['a1' | 'a4' | 'skill' | 'burst', string][] = [
		['skill', 'battle_talent_1'],
		['burst', 'battle_talent_2'],
		['a1', 'const_talent_0'],
		['a4', 'const_talent_1'],
	];

	for (const [talentId, iconUrlId] of talentNameData) {
		const characterTalent = character[talentId];
		if (characterTalent !== undefined) {
			const talent = talents.list.find((t: any) => t.icon_url.includes(iconUrlId));
			if (!talent) {
				throw new Error(`Failed to find ${talentId} talent for character id ${character.hoyowiki_id}`);
			}
			populateBuffProperties(characterTalent, talentId, talent.title, talent.desc);
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
			populateBuffProperties(characterConstellation, constellationName, constellation.name, constellation.desc);
		}
	}

	characterBuffs.push(buffObject);
	teamCharacterBuffs[toSnakeCase(data.page.name)] = teamBuffObject;
}

const conditionYaml = await fs.readFile(toAbsolute('condition.schema.yml'), 'utf8');
const conditionSchema = yaml.load(conditionYaml);

await fs.writeFile(toAbsolute('condition.schema.json'), JSON.stringify(conditionSchema, null, 2));

const ts = await compileToTs(conditionSchema, 'Condition');
await fs.writeFile(toAbsolute('condition.d.ts'), ts);

const buffsYaml = await fs.readFile(toAbsolute('buffs.schema.yml'), 'utf8');
const buffsSchema = yaml.load(buffsYaml);
buffsSchema.properties.character.oneOf = characterBuffs;
buffsSchema.properties.team_characters.properties = teamCharacterBuffs;

await fs.writeFile(toAbsolute('buffs.schema.json'), JSON.stringify(buffsSchema, null, 2));

const buffsTs = await compileToTs(buffsSchema, 'Buffs');
await fs.writeFile(toAbsolute('buffs.d.ts'), buffsTs);

// @ts-expect-error: ???
const validate = new Ajv().compile(conditionSchema);

console.log(validate.errors);