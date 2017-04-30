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
  lookUpDependencies({}, files).fork(t.end, (results) => {
    // console.log(`results`, fixIt(results))
    t.deepEqual(fixIt(results), {
      imports:
      {
        'binoculars/path': [ `default` ],
        'globby/index.js': [ `default` ],
        'to-absolute-glob/index.js': [ `default` ],
        'builtin-modules/index.js': [ `default` ],
        'partial.lenses/dist/partial.lenses.cjs.js': [ `*` ],
        'debug/src/index.js': [ `default` ],
        'fluture/fluture.js': [ `default` ],
        'ramda/src/curry.js': [ `default` ],
        'ramda/src/filter.js': [ `default` ],
        'ramda/src/toPairs.js': [ `default` ],
        'ramda/src/fromPairs.js': [ `default` ],
        'ramda/src/pipe.js': [ `default` ],
        'ramda/src/prop.js': [ `default` ],
        'ramda/src/uniq.js': [ `default` ],
        'ramda/src/head.js': [ `default` ],
        'ramda/src/identity.js': [ `default` ],
        'ramda/src/assoc.js': [ `default` ],
        'ramda/src/dissoc.js': [ `default` ],
        'ramda/src/map.js': [ `default` ],
        'get-es-imports-exports/index.js': [ `default` ],
        'ava/index.js': [ `default` ],
        'ramda/index.js': [ `fromPairs`, `map`, `pipe`, `toPairs` ],
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
          `relativeKeys`,
          `relativizeDataPaths`,
          `sliceNodeModules`,
          `stripStats`,
          `testStringForModules`,
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
