import test from 'ava'
import {pipe, toPairs, fromPairs, map} from 'ramda'
import {
  lookUpDependencies,
  relativeKeys,
  relativizeDataPaths,
  makeRelativeConditionally
} from './utils'
import {absolutePathedObject} from './utils.fixture'

const thisFileIsh = `..`
const alter = relativeKeys(true, thisFileIsh)
const alter2 = makeRelativeConditionally(true, thisFileIsh)
const manipulateObjects = (x) => typeof x === `object` && !Array.isArray(x) ? alter(x) : x

const fixIt = pipe(
  toPairs,
  map(([k, v]) => [k, manipulateObjects(v)]),
  map(
    (raw) => {
      const [k, v] = raw
      if (k === `loadedFiles`) {
        return [k, map(alter2, v)]
      }
      return raw
    }
  ),
  fromPairs
)

/* eslint-disable fp/no-unused-expression */
/* eslint-disable sort-keys */
test.cb(`lookUpDependencies`, (t) => {
  t.plan(2)
  t.is(typeof lookUpDependencies, `function`)
  // console.log(`input`, file)
  const files = [__filename]
  lookUpDependencies(files).fork(t.end, (results) => {
    // console.log(`results`, fixIt(results))
    t.deepEqual(fixIt(results), {
      imports:
      {
        'binoculars/path': [ `default` ],
        'binoculars/node_modules/globby/index.js': [ `default` ],
        'binoculars/node_modules/to-absolute-glob/index.js': [ `default` ],
        'binoculars/node_modules/builtin-modules/index.js': [ `default` ],
        'binoculars/node_modules/partial.lenses/dist/partial.lenses.cjs.js': [ `*` ],
        'binoculars/node_modules/fluture/fluture.js': [ `default` ],
        'binoculars/node_modules/ramda/src/curry.js': [ `default` ],
        'binoculars/node_modules/ramda/src/filter.js': [ `default` ],
        'binoculars/node_modules/ramda/src/toPairs.js': [ `default` ],
        'binoculars/node_modules/ramda/src/fromPairs.js': [ `default` ],
        'binoculars/node_modules/ramda/src/pipe.js': [ `default` ],
        'binoculars/node_modules/ramda/src/uniq.js': [ `default` ],
        'binoculars/node_modules/ramda/src/head.js': [ `default` ],
        'binoculars/node_modules/ramda/src/identity.js': [ `default` ],
        'binoculars/node_modules/ramda/src/assoc.js': [ `default` ],
        'binoculars/node_modules/ramda/src/dissoc.js': [ `default` ],
        'binoculars/node_modules/ramda/src/map.js': [ `default` ],
        'binoculars/node_modules/get-es-imports-exports/index.js': [ `default` ],
        'binoculars/node_modules/ava/index.js': [ `default` ],
        'binoculars/node_modules/ramda/index.js': [ `fromPairs`, `map`, `pipe`, `toPairs` ],
        'binoculars/src/utils.js':
        [ `lookUpDependencies`,
          `makeRelativeConditionally`,
          `relativeKeys`,
          `relativizeDataPaths` ],
        'binoculars/src/utils.fixture.js': [ `absolutePathedObject` ]
      },
      exports:
      {
        'binoculars/src/utils-real-fs.spec.js': [],
        'binoculars/src/utils.js':
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
        'binoculars/src/utils.fixture.js': [ `absolute`, `absolutePathedObject`, `relative` ]
      },
      loadedFiles:
      [ `binoculars/src/utils-real-fs.spec.js`,
        `binoculars/src/utils.js`,
        `binoculars/src/utils.fixture.js` ],
      stats: []
    })
    t.end()
  })
})

test(`relativizeDataPaths`, (t) => {
  t.is(typeof relativizeDataPaths, `function`)
  const input = {
    directory: `yes`,
    exports: absolutePathedObject,
    imports: absolutePathedObject,
    stats: []
  }
  const output = relativizeDataPaths(true, `..`, input)
  t.deepEqual(output, {
    directory: `yes`,
    exports:
    {
      'binoculars/absolute/paths/to/the/edge/of/the/world.js': `a`,
      'binoculars/barrels/of/hilarity/whatever/whatever.js': `b`
    },
    files: [],
    imports:
    {
      'binoculars/absolute/paths/to/the/edge/of/the/world.js': `a`,
      'binoculars/barrels/of/hilarity/whatever/whatever.js': `b`
    },
    modules: []
  })
})
/* eslint-enable fp/no-unused-expression */
/* eslint-enable sort-keys */
