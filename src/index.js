import {
  combineSchemaDefinitions,
  makeExecutableSchema
} from 'create-root-schema';
import { setRequestOptions, wpFetch } from './api.js';
import * as dateTimeType from './datetime/index.js';
import * as filterableTypes from './filterable-types.js';
import * as wordpress from './wordpress/index.js';

function createUncompiledSchema(options = {}) {
  setRequestOptions(options);
  return combineSchemaDefinitions([dateTimeType, filterableTypes, wordpress]);
}

function createSchema(options = {}) {
  setRequestOptions(options);
  return makeExecutableSchema([dateTimeType, filterableTypes, wordpress]);
}

const postFields = wordpress.postFields;
const postFilterFields = wordpress.postFilterFields;

export {
  createSchema,
  createUncompiledSchema,
  postFields,
  postFilterFields,
  wpFetch
};

export default createSchema;
