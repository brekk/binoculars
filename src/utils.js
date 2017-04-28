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
import assoc from 'ramda/src/assoc'
import dissoc from 'ramda/src/dissoc'
import identity from 'ramda/src/identity'
import map from 'ramda/src/map'
// import partition from 'ramda/src/partition'

import getImportsAndExports from 'get-es-imports-exports'

const R__ = {
  [`@@functional/placeholder`]: true
}

export const xtrace = curry(
  (l, a, z, y) => {
    l(a, z(y)) // eslint-disable-line
    return y
  }
)
export const peek = xtrace(console.log)
export const trace = xtrace(console.log, R__, identity, R__)

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
  map,
  pipe,
  toPairs,
  uniq
}

// screw promises, Futures are the future
const getImportsAndExportsF = F.fromPromise(getImportsAndExports)

/**
 * @name flobby
 * @description it wraps `globby` behavior with absolute globs and returns a Future
 * @signature flobby :: Array(String) -> Future(Array(String))
 */
export const flobby = R.pipe(
  // trace(`inputs`),
  map(absolutify),
  // trace(`absolute paths`),
  F.fromPromise(globby)
)

/**
 * @name lookUpDependencies
 * @param {array} files - a list of files
 * @returns {Future} Future(Object) - a future list of import / exports
 * @signature lookUpDependencies :: Array(string) -> Future(Object)
 */
export const lookUpDependencies = (files) => {
  // trace(`looking up files:`, files)
  return getImportsAndExportsF({
    exclude: builtIns,
    files
  })
}

/**
 * @name collectKeys
 * @param {string} pathing - some path to grab keys of
 * @param {object} data - the data we're consuming (last param)
 * @returns {object} object
 * @signature collectKeys :: String -> Object -> Object
 */
export const collectKeys = R.curry(
  (pathing, data) => R.pipe(
    L.collect([pathing, keys]),
    R.head
  )(data)
)

const NODE_MODULES = `node_modules/`
export const sliceNodeModules = R.map(
  (m) => {
    const match = m.indexOf(NODE_MODULES)
    if (match > -1) {
      const l = m.slice(
        match + NODE_MODULES.length
      )
      return l.slice(0, l.indexOf(`/`))
    }
    return m
  }
)

export const stripStats = R.dissoc(`stats`)
export const testStringForModules = R.filter(
  (s) => (
    typeof s === `string` && (
      s.indexOf(`node_modules`) > -1 || builtIns.includes(s)
    )
  )
)
export const findModules = R.pipe(
  collectKeys(`imports`),
  testStringForModules,
  sliceNodeModules,
  R.uniq
)
export const makeRelativeConditionally = R.curry(
  (condition, a, b) => (
    condition ? path.relative(a, b) : b
  )
)

export const relativeKeys = R.curry((condition, rel, obj) => R.pipe(
  R.toPairs,
  R.map(([k, v]) => ([
    makeRelativeConditionally(condition, rel, k),
    v
  ])),
  R.fromPairs
)(obj))

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
