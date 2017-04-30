import process from 'process'
import cli from 'commander'
// import {version} from '../package.json'
import {binoculars} from './binoculars'

const log = console.log.bind(console)
const fail = (e) => log(`ERROR`, e)

const reference = cli
  .description(`A tool for understanding how files are consumed`)
  .version(`1.0.0`)
  .option(`-a, --absolute`, `Use absolute paths`)
  .option(`-v, --verbose`, `Log status`)
  .option(`-m, --map`, `Return data as a map array`)
  .parse(process.argv)

const cwd = process.cwd()

// eslint-disable-next-line fp/no-unused-expression
binoculars({}, cwd, reference).fork(fail, console.log)
