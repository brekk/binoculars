import bug from 'debug'
import λcurry from 'ramda/src/curry'
import λidentity from 'ramda/src/identity'
import λmap from 'ramda/src/map'
import λpipe from 'ramda/src/pipe'

const __placeholder__ = {
  [`@@functional/placeholder`]: true
}

export const xtrace = λcurry(
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
const [b__, d__, m__] = λpipe(
  λmap(bug),
  λmap(xtrace)
)(debuggables)
/* eslint-enable no-unused-vars */

export const base__ = b__
export const detail__ = d__
export const minutiae__ = m__

const [__b, __d, __m] = λpipe(
  λmap(bug),
  λmap((s) => xtrace(s, __placeholder__, λidentity, __placeholder__))
)(debuggables)

export const __base = __b
export const __detail = __d
export const __minutiae = __m
