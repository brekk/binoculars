import F from 'fluture'
import assoc from 'ramda/src/assoc'
import pipe from 'ramda/src/pipe'
import map from 'ramda/src/map'
import curry from 'ramda/src/curry'
import {
  merge,
  relativizeDataPaths,
  flobby,
  lookUpDependencies,
  lookUpAllDependencies
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

const ternary = R.curry((x, a, b) => x ? a : b)

export const binoculars = R.curry((config, workingDir, exe) => {
  const {
    absolute,
    args,
    multiple
  } = defaultConfig(exe)
  const swap = ternary(multiple)
  const lookup = swap(lookUpAllDependencies, lookUpDependencies)
  // const swapAndMap = (a) => swap(R.map(a), a)
  const addWorkingDirectory = addDirectory(workingDir)
  // const directorize = swapAndMap(addWorkingDirectory)
  const relate = relativizeDataPaths(!absolute, workingDir)
  // const relative = swapAndMap(relate)
  return F.of(args)
    .chain(flobby)
    .chain(lookup(config))
    .map(addWorkingDirectory)
    // .map(directorize)
    .map(relate)
    // .map(relative)
})

// export const binoculars = R.curry((config, workingDir, exe) => {
//   const {
//     absolute,
//     args
//   } = defaultConfig(exe)
//   return F.of(args)
//     .chain(flobby)
//     .chain(lookUpAllDependencies(config))
//     .map(addDirectory(workingDir))
//     .map(relativizeDataPaths(!absolute, workingDir))
// })
