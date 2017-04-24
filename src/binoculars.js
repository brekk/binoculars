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
  return F.of(args)
    .chain(flobby)
    .chain(lookUpDependencies)
    .map(R.assoc(`directory`, workingDir))
    .map(relativizeDataPaths(!absolute, workingDir))
})
