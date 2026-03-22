const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');
const webpack = require('webpack');

/**
 * NestJS optional peer-deps that are not installed and would cause
 * webpack to fail when bundling everything (externalDependencies:'none').
 * These features are never used in this app; silencing them is safe.
 */
const NESTJS_OPTIONAL_LAZY_IMPORTS = new Set([
  '@nestjs/microservices',
  '@nestjs/microservices/microservices-module',
  '@nestjs/websockets/socket-module',
  'class-transformer',
  'class-validator',
]);

module.exports = {
  output: {
    path: join(__dirname, 'dist'),
    clean: true,
    ...(process.env.NODE_ENV !== 'production' && {
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    }),
  },
  resolve: {
    // Use the TypeScript source for @org/* workspace libs via the
    // custom "@org/source" exports condition defined in each lib's
    // package.json — no separate lib build step needed for local dev.
    conditionNames: ['@org/source', 'require', 'node', 'default'],
    // NodeNext TS uses explicit .js extensions in imports; teach webpack
    // to resolve those to their .ts counterparts.
    extensionAlias: {
      '.js': ['.ts', '.js'],
      '.mjs': ['.mts', '.mjs'],
    },
  },
  plugins: [
    // Silence optional NestJS deps that aren't installed
    new webpack.IgnorePlugin({
      checkResource: (resource) => NESTJS_OPTIONAL_LAZY_IMPORTS.has(resource),
    }),
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets'],
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: false,
      sourceMap: true,
      // Bundle everything (including @org/* workspace libs from source).
      // Avoids the "cannot find module dist/**/*.d.ts" error that occurs
      // when the nx:node executor's require-override tries to resolve a
      // workspace lib that has never been built.
      externalDependencies: 'none',
    }),
  ],
};
