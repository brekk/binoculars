/* eslint-disable fp/no-unused-expression */
/* eslint-disable sort-keys */
/* eslint-disable max-len */

export const relative = {
  directory: `binoculars`,
  exports:
  {
    'src/binoculars.js': [ `binoculars` ],
    'src/utils.js':
    [ `collectKeys`,
      `findModules`,
      `flobby`,
      `generateRelativePaths`,
      `lookUpDependencies`,
      `makeRelativeConditionally`,
      `peek`,
      `relativeKeys`,
      `relativizeDataPaths`,
      `sliceNodeModules`,
      `stripStats`,
      `testStringForModules`,
      `trace`,
      `xtrace` ],
    'src/cli.js': [],
    'src/utils.spec.js': []
  },
  loadedFiles:
  [ `src/binoculars.js`,
    `src/utils.js`,
    `src/cli.js`,
    `src/utils.spec.js` ],
  imports:
  {
    'node_modules/ava/index.js': [ `default` ],
    'node_modules/ramda/src/map.js': [ `default` ],
    'src/utils.js':
    [ `collectKeys`,
      `findModules`,
      `flobby`,
      `generateRelativePaths`,
      `lookUpDependencies`,
      `makeRelativeConditionally`,
      `relativizeDataPaths`,
      `testStringForModules` ],
    '../node_modules/process/index.js': [ `default` ],
    'node_modules/commander/index.js': [ `default` ],
    'src/binoculars.js': [ `binoculars` ],
    path: [ `default` ],
    'node_modules/globby/index.js': [ `default` ],
    'node_modules/to-absolute-glob/index.js': [ `default` ],
    'node_modules/builtin-modules/index.js': [ `default` ],
    'node_modules/partial.lenses/dist/partial.lenses.cjs.js': [ `*` ],
    'node_modules/fluture/fluture.js': [ `default` ],
    'node_modules/ramda/src/curry.js': [ `default` ],
    'node_modules/ramda/src/filter.js': [ `default` ],
    'node_modules/ramda/src/toPairs.js': [ `default` ],
    'node_modules/ramda/src/fromPairs.js': [ `default` ],
    'node_modules/ramda/src/pipe.js': [ `default` ],
    'node_modules/ramda/src/uniq.js': [ `default` ],
    'node_modules/ramda/src/head.js': [ `default` ],
    'node_modules/ramda/src/assoc.js': [ `default` ],
    'node_modules/ramda/src/dissoc.js': [ `default` ],
    'node_modules/get-es-imports-exports/index.js': [ `default` ]
  },
  modules:
  [ `ava`,
    `ramda`,
    `process`,
    `commander`,
    `path`,
    `globby`,
    `to-absolute-glob`,
    `builtin-modules`,
    `partial.lenses`,
    `fluture`,
    `get-es-imports-exports` ]
}

export const absolute = {
  imports:
  {
    path: [ `default` ],
    '/binoculars/node_modules/globby/index.js': [ `default` ],
    '/binoculars/node_modules/to-absolute-glob/index.js': [ `default` ],
    '/binoculars/node_modules/builtin-modules/index.js': [ `default` ],
    '/binoculars/node_modules/partial.lenses/dist/partial.lenses.cjs.js': [ `*` ],
    '/binoculars/node_modules/fluture/fluture.js': [ `default` ],
    '/binoculars/node_modules/ramda/src/curry.js': [ `default` ],
    '/binoculars/node_modules/ramda/src/filter.js': [ `default` ],
    '/binoculars/node_modules/ramda/src/toPairs.js': [ `default` ],
    '/binoculars/node_modules/ramda/src/fromPairs.js': [ `default` ],
    '/binoculars/node_modules/ramda/src/pipe.js': [ `default` ],
    '/binoculars/node_modules/ramda/src/uniq.js': [ `default` ],
    '/binoculars/node_modules/ramda/src/head.js': [ `default` ],
    '/binoculars/node_modules/ramda/src/assoc.js': [ `default` ],
    '/binoculars/node_modules/ramda/src/dissoc.js': [ `default` ],
    '/binoculars/node_modules/ramda/src/map.js': [ `default` ],
    '/binoculars/node_modules/get-es-imports-exports/index.js': [ `default` ],
    '/binoculars/node_modules/ava/index.js': [ `default` ],
    '/binoculars/src/utils.js': [ `lookUpDependencies` ]
  },
  exports:
  {
    '/binoculars/src/utils-real-fs.spec.js': [],
    '/binoculars/src/utils.js':
    [ `collectKeys`,
      `findModules`,
      `flobby`,
      `generateRelativePaths`,
      `lookUpDependencies`,
      `makeRelativeConditionally`,
      `peek`,
      `relativeKeys`,
      `relativizeDataPaths`,
      `sliceNodeModules`,
      `stripStats`,
      `testStringForModules`,
      `trace`,
      `xtrace` ]
  },
  loadedFiles:
  [ `/binoculars/src/utils-real-fs.spec.js`,
    `/binoculars/src/utils.js` ],
  stats: []
}

export const absolutePathedObject = {
  [`absolute/paths/to/the/edge/of/the/world.js`]: `a`,
  [`barrels/of/hilarity/whatever/whatever.js`]: `b`
}

/* eslint-enable sort-keys */
/* eslint-enable max-len */
/* eslint-enable fp/no-unused-expression */
