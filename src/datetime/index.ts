import { GraphQLScalarType, IntValueNode, StringValueNode } from 'graphql';
import { FormattableDateDirective } from './format-directive';
import { coerceToDate, serialize } from './parser';

export const DateTimeType = new GraphQLScalarType({
  description: 'Date time type',
  name: 'DateTime',
  parseLiteral: ({ kind, value }: IntValueNode | StringValueNode) =>
    coerceToDate(kind === 'StringValue' ? value : parseInt(value)),
  parseValue: coerceToDate,
  serialize
});

export const resolvers = {
  DateTime: DateTimeType
};

export const schemaDirectives = {
  formatDate: FormattableDateDirective
};

export const typeDefs = /* GraphQL */ `
  directive @formatDate(defaultFormat: String) on FIELD_DEFINITION

  scalar DateTime
`;
