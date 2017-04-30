import F from 'fluture'
import assoc from 'ramda/src/assoc'
import pipe from 'ramda/src/pipe'
import curry from 'ramda/src/curry'
import {
  relativizeDataPaths,
  flobby,
  lookUpDependencies
} from './utils'

const R = {
  assoc,
  curry,
  pipe
}

export const binoculars = R.curry((workingDir, exe) => {
  const {
    absolute = false,
    args = ``
  } = exe
  const config = {}
  return F.of(args)
    .chain(flobby)
    .chain(lookUpDependencies(config))
    .map(R.assoc(`directory`, workingDir))
    .map(relativizeDataPaths(!absolute, workingDir))
})
