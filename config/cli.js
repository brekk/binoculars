const base = require(`./rollup.config.base`)
/* eslint-disable fp/no-mutating-assign */
module.exports = Object.assign(base, {
  dest: `bin/binoculars.js`,
  entry: `src/binoculars.js`,
  format: `cjs`
})
/* eslint-enable fp/no-mutating-assign */
