import test from 'ava'
import map from 'ramda/src/map'
import {
  collectKeys,
  findModules,
  flobby,
  generateRelativePaths,
  makeRelativeConditionally,
  relativeKeys,
  // sliceNodeModules,
  // stripStats,
  testStringForModules,
  xtrace
} from './utils'

import {relative as fixture, absolutePathedObject} from './utils.fixture'

// so absolute paths are useful, but we will never be able to test cross computer
const truncate = map((x) => {
  return x.split(`/`).slice(-2).join(`/`)
})

/* eslint-disable fp/no-unused-expression */

test(`collectKeys`, (t) => {
  t.plan(3)
  t.is(typeof collectKeys, `function`)
  const data = {
    yahh: {
      a: 1,
      b: 2,
      c: 3
    }
  }
  const out = collectKeys(`yahh`, data)
  const expected = `abc`.split(``)
  t.deepEqual(out, expected)
  t.throws(
    () => collectKeys(`butts`, data),
    `Cannot convert undefined or null to object`
  )
})
test(`findModules`, (t) => {
  t.plan(2)
  t.is(typeof findModules, `function`)
  const fixed = findModules(fixture)
  t.deepEqual(fixed, [
    `ava`,
    `ramda`,
    `process`,
    `commander`,
    `path`,
    `globby`,
    `to-absolute-glob`,
    `builtin-modules`,
    `partial.lenses`,
    `fluture`,
    `get-es-imports-exports`
  ])
})
test(`testStringForModules`, (t) => {
  t.plan(2)
  t.is(typeof testStringForModules, `function`)
  t.deepEqual(testStringForModules([
    false,
    true,
    -1,
    0,
    1,
    `yah`,
    `./haha/node_modules/love/index.js`,
    `path`,
    `process`,
    `fs`
  ]), [
    `./haha/node_modules/love/index.js`,
    `path`,
    `process`,
    `fs`
  ])
})
test.cb(`flobby`, (t) => {
  t.plan(2)
  t.is(typeof flobby, `function`)
  const inputs = [`./src/*.js`, `./test/**/*.js`]
  const expected = truncate([
    `src/binoculars.js`,
    `src/cli.js`,
    `src/utils-real-fs.spec.js`,
    `src/utils.fixture.js`,
    `src/utils.js`,
    `src/utils.spec.js`
  ])
  flobby(inputs).fork(
    t.end,
    (output) => {
      t.deepEqual(truncate(output), expected)
      t.end()
    }
  )
})
test(`generateRelativePaths`, (t) => {
  t.plan(2)
  t.is(typeof generateRelativePaths, `function`)
  const output = generateRelativePaths(true, __dirname, fixture)
  t.deepEqual(output, {
    directory: `binoculars`,
    exports: {
      "binoculars.js": [
        `binoculars`
      ],
      "cli.js": [],
      "utils.js": [
        `collectKeys`,
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
        `xtrace`
      ],
      "utils.spec.js": []
    },
    files: [
      `binoculars.js`,
      `utils.js`,
      `cli.js`,
      `utils.spec.js`
    ],
    imports: {
      "../../node_modules/process/index.js": [
        `default`
      ],
      "../node_modules/ava/index.js": [
        `default`
      ],
      "../node_modules/builtin-modules/index.js": [
        `default`
      ],
      "../node_modules/commander/index.js": [
        `default`
      ],
      "../node_modules/fluture/fluture.js": [
        `default`
      ],
      "../node_modules/get-es-imports-exports/index.js": [
        `default`
      ],
      "../node_modules/globby/index.js": [
        `default`
      ],
      "../node_modules/partial.lenses/dist/partial.lenses.cjs.js": [
        `*`
      ],
      "../node_modules/ramda/src/assoc.js": [
        `default`
      ],
      "../node_modules/ramda/src/curry.js": [
        `default`
      ],
      "../node_modules/ramda/src/dissoc.js": [
        `default`
      ],
      "../node_modules/ramda/src/filter.js": [
        `default`
      ],
      "../node_modules/ramda/src/fromPairs.js": [
        `default`
      ],
      "../node_modules/ramda/src/head.js": [
        `default`
      ],
      "../node_modules/ramda/src/map.js": [
        `default`
      ],
      "../node_modules/ramda/src/pipe.js": [
        `default`
      ],
      "../node_modules/ramda/src/toPairs.js": [
        `default`
      ],
      "../node_modules/ramda/src/uniq.js": [
        `default`
      ],
      "../node_modules/to-absolute-glob/index.js": [
        `default`
      ],
      "../path": [
        `default`
      ],
      "binoculars.js": [
        `binoculars`
      ],
      "utils.js": [
        `collectKeys`,
        `findModules`,
        `flobby`,
        `generateRelativePaths`,
        `lookUpDependencies`,
        `makeRelativeConditionally`,
        `relativizeDataPaths`,
        `testStringForModules`
      ]
    },
    modules: [
      `ava`,
      `ramda`,
      `process`,
      `commander`,
      `path`,
      `globby`,
      `to-absolute-glob`,
      `builtin-modules`,
      `partial.lenses`,
      `fluture`,
      `get-es-imports-exports`
    ]
  })
})
test(`makeRelativeConditionally`, (t) => {
  t.plan(3)
  t.is(typeof makeRelativeConditionally, `function`)
  const a = `./path/whatever/cool/dot/com/science.js`
  const b = `../../yeah/what.js`
  const out1 = makeRelativeConditionally(true, a, b)
  const out2 = makeRelativeConditionally(false, a, b)
  t.is(out1, `../../../../../../../../yeah/what.js`)
  t.is(out2, `../../yeah/what.js`)
})
test(`relativeKeys`, (t) => {
  t.plan(2)
  t.is(typeof relativeKeys, `function`)
  const out = relativeKeys(true, `coolpants/dot/com`, absolutePathedObject)
  const expected = {
    [`../../../absolute/paths/to/the/edge/of/the/world.js`]: `a`,
    [`../../../barrels/of/hilarity/whatever/whatever.js`]: `b`
  }
  t.deepEqual(out, expected)
})
test(`xtrace`, (t) => {
  t.plan(2)
  t.is(typeof xtrace, `function`)
  const two = xtrace((x) => x, `1`, (x) => x, `2`)
  t.is(two, `2`)
})
