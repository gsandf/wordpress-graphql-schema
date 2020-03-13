# @gsandf/wordpress-graphql-schema

> 🤝 GraphQL schema for interacting with the WordPress API

⚠️ This is a work-in-progress. Until a major version number is met, expect
features to change. Also, only queries have been added right now.

Nearly all websites we make right now use React with server-side rendering. In
order to deliver projects quickly and cheaply, we often use WordPress as an
admin interface. This package is a work-in-progress to help communication
between the two.

## Usage

This creates a GraphQL server that fetches data from `https://example.com/wp-json`:

```js
import { createSchema } from '@gsandf/wordpress-graphql-schema';
import { GraphQLServer } from 'graphql-yoga';

const graphqlOptions = {
  endpoint: '/graphql',
  playground: '/graphql',
  port: process.env.PORT || 3000,
  subscriptions: '/graphql'
};

const wordPressOptions = {
  baseURL: 'https://example.com/wp-json'
};

const wordPressSchema = createSchema(wordPressOptions);
const server = new GraphQLServer({ ...wordPressSchema });

server.start(graphqlOptions, ({ playground, port }) => {
  console.log(` > Site @ http://localhost:${port}/`);
  console.log(` > Playground @ http://localhost:${port}${playground}`);
});
```

## API

### `createSchema(options)`

#### `options`

Type: `object`

Options are passed to axios. For details, see the [axios
docs](https://github.com/axios/axios#request-config).

Options with defaults already set are listed below:

#### `options.baseURL`

Type: `string`<br />
Default: `'localhost:8080/wp-json'`

#### `options.headers`

Type: `object`<br />
Default: `{ 'Content-Type': 'application/json' }`

## Install

Using [Yarn]:

```bash
$ yarn add @gsandf/wordpress-graphql-schema
```

…or using [npm]:

```bash
$ npm i --save @gsandf/wordpress-graphql-schema
```

## License

MIT

[npm]: https://www.npmjs.com/
[yarn]: https://yarnpkg.com/
