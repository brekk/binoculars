import F from 'fluture'
import chalk from 'chalk'
import assoc from 'ramda/src/assoc'
import pipe from 'ramda/src/pipe'
import map from 'ramda/src/map'
import curry from 'ramda/src/curry'
import {
  merge,
  relativizeDataPaths,
  flobby,
  lookUpDependencies,
  __base, // eslint-disable-line
  __detail, // eslint-disable-line
  __minutiae // eslint-disable-line
} from './utils'

const R = {
  assoc,
  curry,
  map,
  pipe
}

const defaultConfig = merge({
  absolute: false,
  args: ``,
  multiple: false
})

const addDirectory = R.assoc(`directory`)

const echo = R.curry((log, fn, a, b) => {
  log(fn(a), b && b.value ? b.value : b) // eslint-disable-line
  return b
})
const hook = echo(console.log)
const no = hook(chalk.red) // eslint-disable-line
const yes = hook(chalk.green) // eslint-disable-line

export const monocle = R.curry((config, workingDir, absolute, args) => {
  const addWorkingDirectory = addDirectory(workingDir)
  const relate = relativizeDataPaths(!absolute, workingDir)
  return F.of(args)
    .chain(flobby)
    .bimap(no(`! glob error`), yes(`files`))
    .chain(lookUpDependencies(config))
    .bimap(no(`lookup`), yes(`dependencies added`))
    .map(addWorkingDirectory)
    .bimap(no(`adding directory failed`), yes(`add directory clause`))
    .map(relate)
    .bimap(no(`relative`), yes(`out!`))
})

export const binoculars = R.curry((config, workingDir, exe) => {
  return R.pipe(
    defaultConfig,
    // __base(`>>>>`)
    ({
      absolute, multiple, args
    }) => {
      const focus = monocle(config, workingDir, absolute)
      return (
        multiple ?
        R.pipe(
          R.map(focus),
          F.parallel(10)
        ) :
        focus
      )(args)
    }
  )(exe)
})
