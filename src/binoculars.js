import F from 'fluture'
import chalk from 'chalk'
import λassoc from 'ramda/src/assoc'
import λpipe from 'ramda/src/pipe'
import λmap from 'ramda/src/map'
import λcurry from 'ramda/src/curry'
import {
  merge,
  relativizeDataPaths,
  flobby,
  lookUpDependencies
} from './utils'
import {
  __base
} from './debug'

const defaultConfig = merge({
  absolute: false,
  args: ``,
  multiple: false
})

const addDirectory = λassoc(`directory`)

const prepend = λcurry((b, a) => b + a)

const bar = λcurry(
  (color, pre, value) => λpipe(
    prepend(pre),
    (x) => `\n=============== ${x} ================\n`,
    color
  )(value)
)

const echo = λcurry((log, fn, a, b) => {
  const bValue = b && b.value ? b.value : b
  const highlightedBar = bar(fn)
  const before = highlightedBar(`START `)
  const end = highlightedBar(`END `)
  log(before(a), bValue, end(a)) // eslint-disable-line
  return b
})
const hook = echo(__base)
const no = hook(chalk.red) // eslint-disable-line
const yes = hook(chalk.green) // eslint-disable-line

export const monocle = λcurry((config, workingDir, absolute, args) => {
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

export const binoculars = λcurry(
  (config, workingDir, exe) => λpipe(
    defaultConfig,
    (raw) => {
      const {
        absolute, multiple, args
      } = raw
      const focus = monocle(config, workingDir, absolute)
      // we need to box the inputs, b/c the raw files need to be arrays when in multiple mode
      const box = (b) => ([b])
      const multifocus = λpipe(
        λmap(λpipe(box, focus)),
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
