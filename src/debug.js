import bug from 'debug'
import curry from 'ramda/src/curry'
import map from 'ramda/src/map'
import pipe from 'ramda/src/pipe'

const R = {
  curry,
  map,
  pipe
}

const __placeholder__ = {
  [`@@functional/placeholder`]: true
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
const [b__, d__, m__] = R.pipe(
  R.map(bug),
  R.map(xtrace)
)(debuggables)
/* eslint-enable no-unused-vars */

export const base__ = b__
export const detail__ = d__
export const minutiae__ = m__

const [__b, __d, __m] = R.pipe(
  R.map(bug),
  R.map((s) => xtrace(s, __placeholder__, R.identity, __placeholder__))
)(debuggables)

export const __base = __b
export const __detail = __d
export const __minutiae = __m
