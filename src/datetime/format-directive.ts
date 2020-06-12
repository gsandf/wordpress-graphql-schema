import { format, formatDistanceToNow, parseISO } from 'date-fns';
import {
  defaultFieldResolver,
  GraphQLBoolean,
  GraphQLField,
  GraphQLString
} from 'graphql';
import { SchemaDirectiveVisitor } from 'graphql-tools';
import { serialize } from './parser';

const formatDate = (date: string, formatString: string) =>
  format(parseISO(date), formatString);

class FormattableDateDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field: GraphQLField<any, any>): void {
    const { defaultFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSxxx" } = this.args;

    field.args.push({
      astNode: undefined,
      defaultValue: undefined,
      description: 'Format a date using the given format string',
      extensions: undefined,
      name: 'format',
      type: GraphQLString
    });

    field.args.push({
      astNode: undefined,
      defaultValue: undefined,
      description: 'Format a date as relative to now (e.g. "5 minutes ago")',
      extensions: undefined,
      name: 'formatRelative',
      type: GraphQLBoolean
    });

    field.resolve = async function _resolve(
      source,
      { format, formatRelative, ...otherArgs },
      context,
      info
    ) {
      const value = await (field.resolve ?? defaultFieldResolver).call(
        this,
        source,
        otherArgs,
        context,
        info
      );

      const date = serialize(value);

      if (formatRelative) {
        return formatDistanceToNow(new Date(date), { addSuffix: true });
      }

      // If a format argument was not provided, default to the optional
      // defaultFormat argument taken by the @date directive:
      return formatDate(date, format || defaultFormat);
    };

    field.type = GraphQLString;
  }
}

export { FormattableDateDirective };
