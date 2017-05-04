const curry = require(`ramda/src/curry`)
const utils = require(`nps-utils`)
const SHEBANG = `#!/usr/bin/env node`
const prepend = curry((toPrepend, file) => `echo "${toPrepend}\n$(cat ${file})" > ${file}`)
const append = curry((toAppend, file) => `echo "${toAppend}" >> ${file}`)
const createWithText = curry((text, file) => `echo "${text}" > ${file}`)
const chmod = curry((permissions, file) => `chmod ${permissions} ${file}`)
const makeExecutable = chmod(`755`)
const { concurrent: all, series, rimraf: rm } = utils
const { nps: allNPS } = all
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
      script: series(
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
      script: allNPS(`lint.eslint`, `lint.prettier`),
      eslint: {
        description: `run eslint`,
        script: `eslint src/**`
      },
      prettier: {
        description: `lint the javascript files on git stage`,
        script: `prettier --no-semi --print-width=100 src/*.js`
      }
    },
    meta: {
      auto: {
        description: `regenerate the tool and then run it on itself`,
        script: series(rm(BINARY_DIR), `nps build`, `nps meta.single`, `sleep 5`, `nps meta.multi`)
      },
      debug: {
        description: `run the meta calls with DEBUG=binoculars:*`,
        multi: {
          description: `run the meta.multi call with DEBUG=binoculars:*`,
          script: `DEBUG=binoculars:* nps meta.multi`
        },
        script: `DEBUG=binoculars:* nps meta.auto`,
        single: {
          description: `run the meta.single call with DEBUG=binoculars:*`,
          script: `DEBUG=binoculars:* nps meta.single`
        }
      },
      description: `run the tool on itself`,
      multi: {
        description: `run a multi meta call`,
        script: series(
          `echo "multiple run ============================================="`,
          `${EXECUTABLE} --multiple ./src/*.js`
        )
      },
      script: `nps meta.auto`,
      single: {
        description: `run a single meta call`,
        script: series(
          `echo "regular run ============================================="`,
          `${EXECUTABLE} ./src/*.js`
        )
      }
    },
    mkdir: {
      coverage: `mkdirp coverage`,
      description: `generate a coverage directory`
    },
    precommit: {
      description: `the tasks auto-run before commits`,
      script: series(allNPS(`dist`, `test`, `cost`), `lint-staged`)
    },
    publish: {
      description: `the tasks to run at publish-time`,
      script: `npm run build`
    },
    test: {
      covered: {
        description: `run covered tests`,
        script: `cross-env NODE_ENV=test nyc ava src/*.spec.js`
      },
      description: `run lint and tests`,
      integration: {
        description: `run integration tests`,
        script: series(`nps dist`, `ava --verbose tests/integration.js`)
      },
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
