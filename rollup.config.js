import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import pkg from './package.json';

const entry = './src/index.ts';
const extensions = ['.js', '.jsx', '.ts', '.tsx'];

const externals = [
  ...Object.keys(pkg.dependencies ?? []),
  ...Object.keys(pkg.peerDependencies ?? [])
];

const commonPlugins = [
  // Allows node_modules resolution
  resolve({ extensions, mainFields: ['module', 'browser', 'main'] }),

  // Allow bundling cjs modules. Rollup doesn't understand cjs
  commonjs()
];

export default {
  // Don't bundle packages marked as external
  external: externals,

  input: entry,

  output: [
    {
      exports: 'named',
      file: pkg.main,
      format: 'commonjs'
    },
    {
      file: pkg.module,
      format: 'esm'
    }
  ],

  plugins: [
    ...commonPlugins,

    // Compile TypeScript/JavaScript files
    babel({ babelHelpers: 'bundled', extensions, include: ['src/**/*'] })
  ]
};
