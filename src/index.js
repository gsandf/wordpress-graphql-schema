import { combineSchemaDefinitions } from 'create-root-schema';
import { setRequestOptions } from './api.js';
import * as dateTimeType from './datetime/index.js';
import * as filterableTypes from './filterable-types.js';
import * as wordpress from './wordpress/index.js';

export const createSchema = (options = {}) => {
  setRequestOptions(options);
  return combineSchemaDefinitions([dateTimeType, filterableTypes, wordpress]);
};

export const postFields = wordpress.postFields;
export const postFilterFields = wordpress.postFilterFields;

export default createSchema;
