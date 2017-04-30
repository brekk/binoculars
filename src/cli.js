import process from 'process'
import cli from 'commander'
import curry from 'ramda/src/curry'
import pipe from 'ramda/src/pipe'
// import {version} from '../package.json'
import {binoculars} from './binoculars'

const log = console.log.bind(console)
const fail = (e) => log(`ERROR`, e)
const json = curry((indent, x) => JSON.stringify(x, null, indent))
const j2 = pipe(
  json(2),
  log
)

const reference = cli
  .description(`A tool for understanding how files are consumed`)
  .version(`1.0.0`)
  .option(`-a, --absolute`, `Use absolute paths`)
  .option(`-v, --verbose`, `Log status`)
  .option(`-m, --multiple`, `Return data as a map array`)
  .parse(process.argv)

const cwd = process.cwd()

// eslint-disable-next-line fp/no-unused-expression
binoculars({}, cwd, reference).fork(fail, j2)
