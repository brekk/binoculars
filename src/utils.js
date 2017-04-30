import path from 'path'

import globby from 'globby'
import absolutify from 'to-absolute-glob'
import builtIns from 'builtin-modules'

import * as L from 'partial.lenses'
import F from 'fluture'

import curry from 'ramda/src/curry'
import filter from 'ramda/src/filter'
import toPairs from 'ramda/src/toPairs'
import fromPairs from 'ramda/src/fromPairs'
import pipe from 'ramda/src/pipe'
import uniq from 'ramda/src/uniq'
import head from 'ramda/src/head'
import prop from 'ramda/src/prop'
import assoc from 'ramda/src/assoc'
import dissoc from 'ramda/src/dissoc'
import identity from 'ramda/src/identity'
import map from 'ramda/src/map'

import getImportsAndExports from 'get-es-imports-exports'
import bug from 'debug'

const __placeholder__ = {
  [`@@functional/placeholder`]: true
}
const NODE_MODULES = `node_modules/`

const {
  keys
} = Object

const R = {
  assoc,
  curry,
  dissoc,
  filter,
  fromPairs,
  head,
  identity,
  map,
  pipe,
  prop,
  toPairs,
  uniq
}

export const xtrace = R.curry(
  (l, a, z, y) => {
    l(a, z(y)) // eslint-disable-line
    return y
  }
)

const debuggables = [
  `binoculars:0`,
  `binoculars:1`,
  `binoculars:2`
]

/* eslint-disable no-unused-vars */
const [base__, detail__, minutiae__] = R.pipe(
  R.map(bug),
  R.map(xtrace)
)(debuggables)
/* eslint-enable no-unused-vars */

const [__base, __detail, __minutiae] = R.pipe(
  R.map(bug),
  R.map((s) => xtrace(s, __placeholder__, R.identity, __placeholder__))
)(debuggables)

// screw promises, Futures are the future
const getImportsAndExportsF = F.fromPromise(getImportsAndExports)

/**
 * @name flobby
 * @description it wraps `globby` behavior with absolute globs and returns a Future
 * @param {string} glob - a glob string
 * @returns {Future} Future(Array) - a future wrapped list of file paths
 * @signature flobby :: Array(String) -> Future(Array(String))
 */
export const flobby = R.pipe(
  __base(`inputs`),
  map(absolutify),
  __detail(`absolute paths`),
  F.fromPromise(globby)
)

/**
 * @name lookUpDependencies
 * @param {array} files - a list of files
 * @returns {Future} Future(Object) - a future list of import / exports
 * @signature lookUpDependencies :: Array(string) -> Future(Object)
 */
export const lookUpDependencies = R.pipe(
  __detail(`files`),
  (files) => ({
    exclude: [...builtIns, `*.scss`, `*.json`],
    files,
    parser: `babel-eslint`,
    parserOptions: {
      experimentalObjectRestSpread: true,
      jsx: true
    }
  }),
  detail__(`excluded`, R.prop(`exclude`)),
  getImportsAndExportsF
)

/**
 * @name collectKeys
 * @param {string} pathing - some path to grab keys of
 * @param {object} data - the data we're consuming (last param)
 * @returns {object} object
 * @signature collectKeys :: String -> Object -> Object
 */
export const collectKeys = R.curry(
  (pathing, data) => R.pipe(
    __base(`collectKeys`),
    L.collect([pathing, keys]),
    __detail(`collected`),
    R.head
  )(data)
)

/**
 * @name sliceNodeModules
 * @param {array} ofStrings - an array of strings
 * @returns {array} modifiedArray
 * @signature sliceNodeModules :: Array(String) -> Array(String)
 */
export const sliceNodeModules = R.map(
  (m) => {
    const match = m.indexOf(NODE_MODULES)
    if (match > -1) {
      const l = m.slice(
        match + NODE_MODULES.length
      )
      return __minutiae(
        `found node_modules`,
        l.slice(0, l.indexOf(`/`))
      )
    }
    return m
  }
)

export const stripStats = R.dissoc(`stats`)

/**
 * @name testStringForModules
 * @param {array} ofStrings - an array of strings
 * @returns {array} filteredArray
 * @signature testStringForModules :: Array(String) -> Array(String)
 */
export const testStringForModules = R.filter(
  (s) => (
    typeof s === `string` && (
      s.indexOf(`node_modules`) > -1 || builtIns.includes(s)
    )
  )
)

/**
 * @name findModules
 * @param {object} obj - object whose keys are paths
 * @returns {array} modules - a list of modules
 * @signature findModules :: Object -> Array(String)
 */
export const findModules = R.pipe(
  __base(`findModules`),
  collectKeys(`imports`),
  __detail(`collected`),
  testStringForModules,
  sliceNodeModules,
  R.uniq,
  __minutiae(`modules`)
)

/**
 * @name makeRelativeConditionally
 * @param {boolean} condition - something truthy or falsy
 * @param {string} a - some path
 * @param {string} b - some other path
 * @returns {string} identity or relative path
 * @signature makeRelativeConditionally :: Boolean -> String -> String -> String
 */
export const makeRelativeConditionally = R.curry(
  (condition, a, b) => (
    condition ? path.relative(a, b) : b
  )
)

/**
 * @name relativeKeys
 * @param {boolean} condition - something boolean-y
 * @param {string} rel - relative path
 * @param {object} obj - an object whose keys are paths
 * @returns {object} altered - an object whose keys may have been altered
 * @signature relativeKeys :: Boolean -> String -> Object -> Object
 */
export const relativeKeys = R.curry((condition, rel, obj) => R.pipe(
  R.toPairs,
  R.map(([k, v]) => ([
    makeRelativeConditionally(condition, rel, k),
    v
  ])),
  detail__(`adjusted`, R.map(([k]) => k)),
  R.fromPairs
)(obj))

/**
 * @name generateRelativePaths
 * @param {boolean} isRelative - a truthy value
 * @param {string} rel - some path
 * @param {object} data - the main file structure we're understanding
 * @signature generateRelativePaths :: Boolean -> String -> Object -> Object
 */
export const generateRelativePaths = R.curry((isRelative, rel, data) => {
  const {
    directory,
    exports: e,
    imports: i,
    modules,
    loadedFiles = []
  } = data
  const [imports, exports] = R.map(relativeKeys(isRelative, rel), [i, e])
  const files = R.map(makeRelativeConditionally(isRelative, rel), loadedFiles)
  return {
    directory,
    exports,
    files,
    imports,
    modules
  }
})

// final pipeline piece, add modules, remove stats and optionally make things relative
export const relativizeDataPaths = R.curry(
  (isRelative, rel, data) => R.pipe(
    (y) => R.assoc(`modules`, findModules(y), y),
    stripStats,
    generateRelativePaths(isRelative, rel)
  )(data)
)
