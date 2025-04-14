import ajv from 'ajv'
import addFormats from 'ajv-formats'

const validator = addFormats(new ajv())

import schema from './schema.json'

export const validate = validator.compile(schema)
const valid = validate({ foo: 'bar' })
console.log({ valid, errors: validate.errors })
