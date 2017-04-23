import curry from 'ramda/src/curry'

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
export const trace = xtrace(console.log, R__, (x) => x, R__)
