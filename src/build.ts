import yaml from 'js-yaml';
import fs from 'fs/promises';
import path from 'path';
import {fileURLToPath} from 'url';
import Ajv from 'ajv/dist/2020.js';
import {compile as compileToTs} from 'json-schema-to-typescript'

const toAbsolute = (p: string) => path.resolve(fileURLToPath(import.meta.url), '..', p);

const conditionYaml = await fs.readFile(toAbsolute('condition.schema.yml'), 'utf8');
const conditionSchema = yaml.load(conditionYaml);

await fs.writeFile(toAbsolute('condition.schema.json'), JSON.stringify(conditionSchema, null, 2));

const ts = await compileToTs(conditionSchema, 'Condition');
await fs.writeFile(toAbsolute('condition.d.ts'), ts);

// @ts-expect-error: ???
const validate = new Ajv().compile(conditionSchema);

console.log(validate.errors);
