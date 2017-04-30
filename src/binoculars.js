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
  lookUpDependencies
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

const prepend = R.curry((b, a) => b + a)

const bar = R.curry(
  (color, pre, value) => R.pipe(
    prepend(pre),
    (x) => `\n=============== ${x} ================\n`,
    color
  )(value)
)

const echo = R.curry((log, fn, a, b) => {
  const bValue = b && b.value ? b.value : b
  const highlightedBar = bar(fn)
  const before = highlightedBar(`START `)
  const end = highlightedBar(`END `)
  log(before(a), bValue, end(a)) // eslint-disable-line
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

export const binoculars = R.curry(
  (config, workingDir, exe) => R.pipe(
    defaultConfig,
    ({
      absolute, multiple, args
    }) => {
      const box = (b) => ([b])
      const focus = monocle(config, workingDir, absolute)
      const multifocus = R.pipe(
        // we need to box the inputs, b/c the raw files need to be arrays
        R.map(R.pipe(box, focus)),
        F.parallel(Infinity)
      )
      return (
        multiple ?
        multifocus :
        focus
      )(args)
    }
  )(exe)
)
