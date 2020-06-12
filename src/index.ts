import {
  combineSchemaDefinitions,
  makeExecutableSchema,
  SchemaDefinition
} from 'create-root-schema';
import { GraphQLSchema } from 'graphql';
import { setRequestOptions, wpFetch } from './api';
import * as dateTimeType from './datetime';
import * as filterableTypes from './filterable-types';
import * as wordpress from './wordpress';

function createUncompiledSchema(options = {}): SchemaDefinition {
  setRequestOptions(options);
  return combineSchemaDefinitions([dateTimeType, filterableTypes, wordpress]);
}

function createSchema(options = {}): GraphQLSchema {
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
