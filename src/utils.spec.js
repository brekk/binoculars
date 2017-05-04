import test from "ava"
import map from "ramda/src/map"
import {
  addModules,
  collectKeys,
  findModules,
  generateRelativePaths,
  makeRelativeConditionally,
  relativeKeys,
  alterLocalKey,
  // sliceNodeModules,
  // stripStats,
  testStringForModules
} from "./utils"
import { xtrace } from "./debug"

import { relative as fixture, absolutePathedObject } from "./utils.fixture"

/* eslint-disable fp/no-unused-expression */
/* eslint-disable better/explicit-return */

test(`collectKeys`, t => {
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
  t.throws(() => collectKeys(`butts`, data), `Cannot convert undefined or null to object`)
})
test(`findModules`, t => {
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
test(`testStringForModules`, t => {
  t.plan(2)
  t.is(typeof testStringForModules, `function`)
  t.deepEqual(
    testStringForModules([
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
    ]),
    [`./haha/node_modules/love/index.js`, `path`, `process`, `fs`]
  )
})

test(`generateRelativePaths`, t => {
  t.plan(2)
  t.is(typeof generateRelativePaths, `function`)
  const output = generateRelativePaths(true, __dirname, fixture)
  t.deepEqual(output, {
    directory: `binoculars`,
    exports: {
      "binoculars.js": [`binoculars`],
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
    files: [`binoculars.js`, `utils.js`, `cli.js`, `utils.spec.js`],
    imports: {
      "../path": [`default`],
      "ava/index.js": [`default`],
      "binoculars.js": [`binoculars`],
      "builtin-modules/index.js": [`default`],
      "commander/index.js": [`default`],
      "fluture/fluture.js": [`default`],
      "get-es-imports-exports/index.js": [`default`],
      "globby/index.js": [`default`],
      "partial.lenses/dist/partial.lenses.cjs.js": [`*`],
      "process/index.js": [`default`],
      "ramda/src/assoc.js": [`default`],
      "ramda/src/curry.js": [`default`],
      "ramda/src/dissoc.js": [`default`],
      "ramda/src/filter.js": [`default`],
      "ramda/src/fromPairs.js": [`default`],
      "ramda/src/head.js": [`default`],
      "ramda/src/map.js": [`default`],
      "ramda/src/pipe.js": [`default`],
      "ramda/src/toPairs.js": [`default`],
      "ramda/src/uniq.js": [`default`],
      "to-absolute-glob/index.js": [`default`],
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
test(`makeRelativeConditionally`, t => {
  t.plan(3)
  t.is(typeof makeRelativeConditionally, `function`)
  const a = `./path/whatever/cool/dot/com/science.js`
  const b = `../../yeah/what.js`
  const out1 = makeRelativeConditionally(true, a, b)
  const out2 = makeRelativeConditionally(false, a, b)
  t.is(out1, `../../../../../../../../yeah/what.js`)
  t.is(out2, `../../yeah/what.js`)
})
test(`relativeKeys`, t => {
  t.plan(2)
  t.is(typeof relativeKeys, `function`)
  const out = relativeKeys(true, `coolpants/dot/com`, absolutePathedObject)
  const expected = {
    [`../../../absolute/paths/to/the/edge/of/the/world.js`]: `a`,
    [`../../../barrels/of/hilarity/whatever/whatever.js`]: `b`,
    [`ploplop/index.js`]: [`default`]
  }
  t.deepEqual(out, expected)
})
test(`xtrace`, t => {
  t.plan(2)
  t.is(typeof xtrace, `function`)
  const two = xtrace(x => x, `1`, x => x, `2`)
  t.is(two, `2`)
})
test(`alterLocalKey`, t => {
  t.plan(2)
  const input = [
    `a`,
    `whatever/a/b/c/index.js`,
    `path/node_modules/cool/funtimes/index.js`,
    `./shit/cool/node_modules/butts/index.js`
  ]
  const falseOutputs = map(alterLocalKey(false), input)
  const trueOutputs = map(alterLocalKey(true), input)
  t.deepEqual(trueOutputs, [
    `a`,
    `whatever/a/b/c/index.js`,
    `cool/funtimes/index.js`,
    `butts/index.js`
  ])
  t.deepEqual(falseOutputs, input)
})
test(`addModules`, t => {
  t.plan(2)
  t.is(typeof addModules, `function`)
  const output = addModules(fixture)
  /* eslint-disable sort-keys */
  const expected = {
    directory: `binoculars`,
    exports: {
      "src/binoculars.js": [`binoculars`],
      "src/utils.js": [
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
      "src/cli.js": [],
      "src/utils.spec.js": []
    },
    loadedFiles: [`src/binoculars.js`, `src/utils.js`, `src/cli.js`, `src/utils.spec.js`],
    imports: {
      "node_modules/ava/index.js": [`default`],
      "node_modules/ramda/src/map.js": [`default`],
      "src/utils.js": [
        `collectKeys`,
        `findModules`,
        `flobby`,
        `generateRelativePaths`,
        `lookUpDependencies`,
        `makeRelativeConditionally`,
        `relativizeDataPaths`,
        `testStringForModules`
      ],
      "../node_modules/process/index.js": [`default`],
      "node_modules/commander/index.js": [`default`],
      "src/binoculars.js": [`binoculars`],
      path: [`default`],
      "node_modules/globby/index.js": [`default`],
      "node_modules/to-absolute-glob/index.js": [`default`],
      "node_modules/builtin-modules/index.js": [`default`],
      "node_modules/partial.lenses/dist/partial.lenses.cjs.js": [`*`],
      "node_modules/fluture/fluture.js": [`default`],
      "node_modules/ramda/src/curry.js": [`default`],
      "node_modules/ramda/src/filter.js": [`default`],
      "node_modules/ramda/src/toPairs.js": [`default`],
      "node_modules/ramda/src/fromPairs.js": [`default`],
      "node_modules/ramda/src/pipe.js": [`default`],
      "node_modules/ramda/src/uniq.js": [`default`],
      "node_modules/ramda/src/head.js": [`default`],
      "node_modules/ramda/src/assoc.js": [`default`],
      "node_modules/ramda/src/dissoc.js": [`default`],
      "node_modules/get-es-imports-exports/index.js": [`default`]
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
  }
  /* eslint-enable sort-keys */
  t.deepEqual(output, expected)
})
/* eslint-enable better/explicit-return */
