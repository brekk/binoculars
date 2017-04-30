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
  series,
  rimraf: rm
} = utils
const {
  nps: allNPS
} = all
const COSTFILE = `./costs`
const BINARY_DIR = `./bin`
const EXECUTABLE = `${BINARY_DIR}/cli.js`
// const DISTRIBUTABLE = `./dist/binoculars.js`
/* eslint-disable max-len */
module.exports = {
  scripts: {
    build: {
      cli: {
        description: `convert cli`,
        script: `babel src --ignore *.spec.js,*.fixture.js -d bin`
      },
      description: `do a per file conversion from /src to /lib`,
      script: utils.series(
        `nps build.source`,
        `mkdirp bin`,
        `nps build.cli`,
        makeExecutable(EXECUTABLE),
        // makeExecutable(EXECUTABLE2),
        prepend(SHEBANG, EXECUTABLE)
        // prepend(SHEBANG, EXECUTABLE2)
      ),
      source: {
        description: `convert files`,
        script: `babel src -d dist --ignore *.spec.js,*.fixture.js,cli.js`
      }
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
        createWithText(`binoculars cost`, COSTFILE),
        append(`\`cost-of-modules --no-install --yarn\``, COSTFILE),
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
        script: series(
          rm(BINARY_DIR),
          `nps build`,
          `${EXECUTABLE} ./tests/**/*`,
          `DEBUG=binoculars:* ${EXECUTABLE} ./src/*.js`
        )
      },
      description: `run the tool on itself`,
      script: `nps meta.auto`
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
        script: `cross-env NODE_ENV=test nyc ava --verbose src/*.spec.js`
      },
      description: `run lint and tests`,
      log: {
        description: `run tests and save logfile`,
        script: `npm run test:covered > test-output.log`
      },
      script: allNPS(`lint`, `test.covered`),
      watch: {
        description: `run your tests continuously`,
        script: `ava --watch`
      }
    }
  }
}
/* eslint-enable max-len */
