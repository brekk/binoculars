import {
  resolve as r
} from 'path'
import {chdir} from 'process'

import curry from 'ramda/src/curry'
import dissoc from 'ramda/src/dissoc'

import test from 'ava'

import {
  binoculars
  // monocle
} from './binoculars'

const resolve = curry((a, b) => r(b, a))

const here = __dirname

const sources = {
  everything: `cases/*.js`,
  src: [`src/*.js`]
}

/* eslint-disable fp/no-unused-expression */
/* eslint-disable sort-keys */

const starting = resolve(`..`, here)
chdir(starting)

test.cb(`running the tool against its source results in a combined blob of info`, (t) => {
  t.plan(2)
  t.is(typeof binoculars, `function`)
  const config = {}
  const dir = starting
  const exe = {
    absolute: false,
    args: sources.src,
    multiple: false
  }
  const expected = {
    exports:
    {
      'src/binoculars.js': [ `binoculars`, `monocle` ],
      'src/binoculars.spec.js': [],
      'src/utils.js':
      [ `addModules`,
        `alterLocalKey`,
        `collectKeys`,
        `findModules`,
        `fixLocalKeys`,
        `flobby`,
        `generateRelativePaths`,
        `lookUpDependencies`,
        `makeRelativeConditionally`,
        `merge`,
        `relativeKeys`,
        `relativizeDataPaths`,
        `sliceNodeModules`,
        `stripStats`,
        `testStringForModules` ],
      'src/debug.js':
      [ `__base`,
        `__detail`,
        `__minutiae`,
        `base__`,
        `detail__`,
        `minutiae__`,
        `xtrace` ],
      'src/cli.js': [],
      'src/utils-real-fs.spec.js': [],
      'src/utils.fixture.js': [ `absolute`, `absolutePathedObject`, `relative` ],
      'src/utils.spec.js': []
    },
    files:
    [ `src/binoculars.js`,
      `src/utils.js`,
      `src/debug.js`,
      `src/binoculars.spec.js`,
      `src/cli.js`,
      `src/utils-real-fs.spec.js`,
      `src/utils.fixture.js`,
      `src/utils.spec.js` ],
    imports:
    {
      'ava/index.js': [ `default` ],
      'ramda/src/map.js': [ `default` ],
      'src/utils.js':
      [ `addModules`,
        `alterLocalKey`,
        `collectKeys`,
        `findModules`,
        `flobby`,
        `generateRelativePaths`,
        `lookUpDependencies`,
        `makeRelativeConditionally`,
        `merge`,
        `relativeKeys`,
        `relativizeDataPaths`,
        `testStringForModules` ],
      'src/debug.js': [ `__base`, `__detail`, `xtrace` ],
      'src/utils.fixture.js': [ `absolutePathedObject`, `relative` ],
      'ramda/index.js': [ `fromPairs`, `map`, `pipe`, `toPairs` ],
      'process/index.js': [ `chdir`, `default` ],
      'commander/index.js': [ `default` ],
      'ramda/src/curry.js': [ `default` ],
      'ramda/src/pipe.js': [ `default` ],
      'src/binoculars.js': [ `binoculars` ],
      'debug/src/index.js': [ `default` ],
      'ramda/src/identity.js': [ `default` ],
      path: [ `default`, `resolve` ],
      'globby/index.js': [ `default` ],
      'to-absolute-glob/index.js': [ `default` ],
      'builtin-modules/index.js': [ `default` ],
      'partial.lenses/dist/partial.lenses.cjs.js': [ `*` ],
      'fluture/fluture.js': [ `default` ],
      'ramda/src/filter.js': [ `default` ],
      'ramda/src/toPairs.js': [ `default` ],
      'ramda/src/fromPairs.js': [ `default` ],
      'ramda/src/uniq.js': [ `default` ],
      'ramda/src/head.js': [ `default` ],
      'ramda/src/assoc.js': [ `default` ],
      'ramda/src/dissoc.js': [ `default` ],
      'get-es-imports-exports/index.js': [ `default` ],
      'chalk/index.js': [ `default` ]
    },
    modules:
    [ `ava`,
      `ramda`,
      `process`,
      `commander`,
      `path`,
      `debug`,
      `globby`,
      `to-absolute-glob`,
      `builtin-modules`,
      `partial.lenses`,
      `fluture`,
      `get-es-imports-exports`,
      `chalk` ]
  }
  binoculars(config, dir, exe).fork(t.fail, (blob) => {
    t.deepEqual(dissoc(`directory`, blob), expected)
    t.end()
  })
})
/* eslint-enable fp/no-unused-expression */
/* eslint-enable sort-keys */
