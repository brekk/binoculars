import fs from 'fs'
import path from 'path'
import process from 'process'

import register from 'babel-register'
import * as L from 'partial.lenses'
import cli from 'commander'
import F from 'fluture'
// import R from 'ramda'
import curry from 'ramda/src/curry'
import pipe from 'ramda/src/pipe'
import assoc from 'ramda/src/assoc'
import precinct from 'precinct'
import map from 'ramda/src/map'

import {version} from '../package.json'
import {trace, peek} from './utils.js'

register() // eslint-disable-line

const R = {
  assoc,
  curry,
  map,
  pipe
}

// eslint-disable-next-line fp/no-unused-expression
register()

const log = console.log.bind(console)

// eslint-disable-next-line fp/no-unused-expression
const fail = (e) => log(`ERROR`, e)

const commanderF = () => F.of(
  cli.description(`A tool for understanding how files are consumed`)
  .version(version)
  .option(`-s, --start <s>`, `A file to start looking at`)
  .option(`-c, --context <c>`, `A directory to relate to the file you want to look at`)
  .parse(process.argv)
)

// const namespace = [pkg.name, `cli`]

const getUserInput = (program) => {
  const {
    context,
    start
  } = program
  return {
    files: [
      {
        raw: context
      },
      {
        raw: start
      }
    ]
  }
}

const pathRelative = R.curry((a, b) => path.relative(a, b))

const absolutifyPaths = R.curry(
  (relative, data) => {
    const relativize = pathRelative(relative)
    const modified = L.modify(
      [`files`, L.elems],
      (x) => R.assoc(`relative`, relativize(x.raw), x),
      data
    )
    console.log(`MODIFIED`, modified, relative)
    return modified
  }
)

const getPathing = (file) => F.node(
  (done) => fs.readFile(file, `utf8`, done)
).chain(F.encase(precinct))

const chainF = R.curry((fn, future) => future.chain(fn))
const forkF = R.curry((bad, good, future) => future.fork(bad, good))

const sleuth = (data) => R.pipe(
  L.foldl((xs, x) => xs.concat(x), [], [`files`, L.elems, `relative`]),
  R.map(getPathing),
  F.parallel(2),
  forkF(fail, (x) => x),
  (list) => ({
    ...data,
    list
  }),
)(data)

const binoculars = () => commanderF()
  .map(getUserInput)
  .map(absolutifyPaths(process.cwd()))
  .map(sleuth)

// eslint-disable-next-line fp/no-unused-expression
binoculars().fork(fail, console.log)
