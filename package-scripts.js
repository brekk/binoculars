const curry = require(`ramda/src/curry`)
const utils = require(`nps-utils`)
const SHEBANG = `#!/usr/bin/env node`
const prepend = curry((toPrepend, file) => `echo "${toPrepend}\n$(cat ${file})" > ${file}`)
const append = curry((toAppend, file) => `echo "${toAppend}" >> ${file}`)
const createWithText = curry((text, file) => `echo "${text}" > ${file}`)
const chmod = curry((permissions, file) => `chmod ${permissions} ${file}`)
const makeExecutable = chmod(`755`)
const {
  concurrent: all,
  series
} = utils
const {
  nps: allNPS
} = all
const COSTFILE = `./costs`
const EXECUTABLE = `./bin/binoculars.js`
// const DISTRIBUTABLE = `./dist/binoculars.js`
/* eslint-disable max-len */
module.exports = {
  scripts: {
    build: {
      description: `do a per file conversion from /src to /lib`,
      files: {
        description: `convert files`,
        script: `babel src -d bin --ignore *.spec.js`
      },
      script: utils.series(
        `nps build.files`,
        makeExecutable(EXECUTABLE),
        prepend(SHEBANG, EXECUTABLE)
      )
    },
    // buildWithRollup: {
    //   description: `generate executable`,
    //   script: series(
    //     `rollup -c config/cli.js`,
    //     makeExecutable(EXECUTABLE)
    //   )
    // },
    cost: {
      description: `regenerate the costfile`,
      script: series(
        createWithText(`neuron cost`, COSTFILE),
        append(`cost-of-modules --no-install --yarn`, COSTFILE),
        `cat ./costs`
      )
    },
    dist: {
      description: `generate files`,
      script: `nps build`
    },
    lint: {
      description: `lint the javascript files`,
      script: `eslint src/**`
    },
    meta: {
      auto: {
        description: `regenerate the tool and then run it on itself`,
        script: series(`nps build`, `nps meta`)
      },
      description: `run the tool on itself`,
      script: `${EXECUTABLE} -s ./src/binoculars.js -c ./src`
    },
    mkdir: {
      coverage: `mkdirp coverage`,
      description: `generate a coverage directory`
    },
    precommit: {
      description: `the tasks auto-run before commits`,
      script: allNPS(`dist`, `test`, `cost`)
    },
    publish: {
      description: `the tasks to run at publish-time`,
      script: `npm run build`
    },
    test: {
      covered: {
        description: `run covered tests`,
        script: `nyc ava --verbose`
      },
      description: `run lint and tests`,
      log: {
        description: `run tests and save logfile`,
        script: `npm run test:covered > test-output.log`
      },
      script: allNPS(`lint`, `test.covered`)
    }
  }
}
/* eslint-enable max-len */
