import path from 'path'

import globby from 'globby'
import absolutify from 'to-absolute-glob'
import builtIns from 'builtin-modules'

import * as L from 'partial.lenses'
import F from 'fluture'

import λcurry from 'ramda/src/curry'
import λfilter from 'ramda/src/filter'
import λtoPairs from 'ramda/src/toPairs'
import λfromPairs from 'ramda/src/fromPairs'
import λpipe from 'ramda/src/pipe'
import λuniq from 'ramda/src/uniq'
import λhead from 'ramda/src/head'
import λassoc from 'ramda/src/assoc'
import λdissoc from 'ramda/src/dissoc'
import λidentity from 'ramda/src/identity'
import λmap from 'ramda/src/map'

import getImportsAndExports from 'get-es-imports-exports'

import {__base, __detail} from './debug'

const __placeholder__ = {
  [`@@functional/placeholder`]: true
}
const NODE_MODULES = `node_modules/`

const {
  assign,
  keys
} = Object

// binary enforcement of Object.assign
export const merge = λcurry((a, b) => assign(a, b))

const alterPairs = λcurry(
  (fnValue, fnKey, list) => λmap(([k, v]) => ([
    fnKey(k),
    fnValue(v)
  ]), list)
)
const alterPairKey = alterPairs(λidentity)
// const alterPairValue = alterPairs(__placeholder__, identity)

// screw promises, Futures are the future
const getImportsAndExportsF = F.fromPromise(getImportsAndExports)

/**
 * @name flobby
 * @description it wraps `globby` behavior with absolute globs and returns a Future
 * @param {string} glob - a glob string
 * @returns {Future} Future(Array) - a future wrapped list of file paths
 * @signature flobby :: Array(String) -> Future(Array(String))
 */
export const flobby = λpipe(
  λmap(absolutify),
  F.fromPromise(globby)
)
const defaultConfig = (config) => {
  const {
    exclude = [],
    parserOptions = {}
  } = config
  return assign({
    exclude: [...builtIns, `*.scss`, `*.json`, ...exclude],
    parser: `babel-eslint`,
    parserOptions: assign({
      experimentalObjectRestSpread: true,
      jsx: true
    }, parserOptions)
  }, config)
}

/**
 * @name lookUpDependencies
 * @param {object} config - a configuration object
 * @param {array} files - a list of files
 * @returns {Future} Future(Object) - a future list of import / exports
 * @signature lookUpDependencies :: Object -> Array(string) -> Future(Object)
 */
export const lookUpDependencies = λcurry(
  (config, fileMatches) => λpipe(
    (files) => ({
      files
    }),
    __base(`@@ lookUp A Dependency`),
    merge(defaultConfig(config)),
    __detail(`----------------------`),
    getImportsAndExportsF
  )(fileMatches)
)

/**
 * @name collectKeys
 * @param {string} pathing - some path to grab keys of
 * @param {object} data - the data we're consuming (last param)
 * @returns {object} object
 * @signature collectKeys :: String -> Object -> Object
 */
export const collectKeys = λcurry(
  (pathing, data) => λpipe(
    L.collect([pathing, keys]),
    λhead
  )(data)
)

const indexOf = λcurry((thing, src) => src.indexOf(thing))
const indexOfNodeModules = indexOf(NODE_MODULES)

const truncateNodeModules = (m) => {
  const match = indexOfNodeModules(m)
  return (
    match > -1 ?
    m.slice(
      match + NODE_MODULES.length
    ) :
    m
  )
}
const removeNodeModules = (m) => {
  const match = indexOfNodeModules(m)
  if (match > -1) {
    const l = m.slice(
      match + NODE_MODULES.length
    )
    const out = l.slice(0, l.indexOf(`/`))
    return out
  }
  return m
}

/**
 * @name sliceNodeModules
 * @param {array} ofStrings - an array of strings
 * @returns {array} modifiedArray
 * @signature sliceNodeModules :: Array(String) -> Array(String)
 */
export const sliceNodeModules = λmap(removeNodeModules)

export const stripStats = λdissoc(`stats`)

/**
 * @name testStringForModules
 * @param {array} ofStrings - an array of strings
 * @returns {array} filteredArray
 * @signature testStringForModules :: Array(String) -> Array(String)
 */
export const testStringForModules = λfilter(
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
export const findModules = λpipe(
  collectKeys(`imports`),
  testStringForModules,
  sliceNodeModules,
  λuniq
)

/**
 * @name makeRelativeConditionally
 * @param {boolean} condition - something truthy or falsy
 * @param {string} a - some path
 * @param {string} b - some other path
 * @returns {string} identity or relative path
 * @signature makeRelativeConditionally :: Boolean -> String -> String -> String
 */
export const makeRelativeConditionally = λcurry(
  (condition, a, b) => (
    condition ? path.relative(a, b) : b
  )
)

export const alterLocalKey = λcurry((condition, k) => (
  testStringForModules(k) && condition ?
  truncateNodeModules(k) :
  k
))

export const fixLocalKeys = λcurry((condition, list) => alterPairKey(
  alterLocalKey(condition),
  list
))

/**
 * @name relativeKeys
 * @param {boolean} condition - something boolean-y
 * @param {string} rel - relative path
 * @param {object} obj - an object whose keys are paths
 * @returns {object} altered - an object whose keys may have been altered
 * @signature relativeKeys :: Boolean -> String -> Object -> Object
 */
export const relativeKeys = λcurry((condition, rel, obj) => λpipe(
  λtoPairs,
  // let's find a way to collapse these two maps things into a single pipe, if we can
  alterPairKey(makeRelativeConditionally(condition, rel)),
  fixLocalKeys(condition),
  λfromPairs
)(obj))

/**
 * @name generateRelativePaths
 * @param {boolean} isRelative - a truthy value
 * @param {string} rel - some path
 * @param {object} data - the main file structure we're understanding
 * @signature generateRelativePaths :: Boolean -> String -> Object -> Object
 */
export const generateRelativePaths = λcurry((isRelative, rel, data) => {
  const {
    directory,
    exports: e,
    imports: i,
    modules,
    loadedFiles = []
  } = data
  const [imports, exports] = λmap(relativeKeys(isRelative, rel), [i, e])
  const files = λmap(makeRelativeConditionally(isRelative, rel), loadedFiles)
  return {
    directory,
    exports,
    files,
    imports,
    modules
  }
})

export const addModules = (y) => λassoc(`modules`, findModules(y), y)

// final pipeline piece, add modules, remove stats and optionally make things relative
export const relativizeDataPaths = λcurry(
  (isRelative, rel, data) => λpipe(
    addModules,
    stripStats,
    generateRelativePaths(isRelative, rel)
  )(data)
)
