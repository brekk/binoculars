const progress = require(`rollup-plugin-progress`)
const commonjs = require(`rollup-plugin-commonjs`)
const shebang = require(`rollup-plugin-shebang`)
const resolve = require(`rollup-plugin-node-resolve`)
const buble = require(`rollup-plugin-buble`)
const json = require(`rollup-plugin-json`)
const pkg = require(`../package.json`)
const external = Object.keys(pkg.dependencies)
console.log(`external`, external)

module.exports = {
  exports: `named`,
  external,
  globals: {
    [`babel-register`]: `register`,
    commander: `commander`,
    fluture: `Future`,
    [`neuron/dist/types`]: `join`,
    [`ramda/src/map`]: `map`,
    [`sanctuary-def`]: `$`
  },
  moduleName: pkg.name,
  plugins: [
    progress(),
    commonjs({
      extensions: [`.js`],
      include: `node_modules/**`
    }),
    resolve({
      jsnext: true,
      main: true
    }),
    json(),
    buble(),
    shebang()
  ],
  sourceMap: true
}
