import yaml from 'js-yaml';
import fs from 'fs/promises';
import path from 'path';
import {fileURLToPath} from 'url';
import Ajv from 'ajv/dist/2020';
import {compile as compileToTs} from 'json-schema-to-typescript'

const conditionYaml = await fs.readFile(
  path.resolve(
    fileURLToPath(import.meta.url),
    '../condition.schema.yml',
  ),
  'utf8',
);
const conditionSchema = yaml.load(conditionYaml);

const ts = await compileToTs(conditionSchema, 'Condition');
console.log(ts);

const validate = new Ajv().compile(conditionSchema);

const ret = validate({
  level: 10,
  character: {
    name: 'Traveller',
    attack: 100,
  },
});

console.log(validate.errors);