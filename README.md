```
  ____ ___ _   _  ___   ____ _   _ _        _    ____  ____  
 | __ )_ _| \ | |/ _ \ / ___| | | | |      / \  |  _ \/ ___|
 |  _ \| ||  \| | | | | |   | | | | |     / _ \ | |_) \___ \
 | |_) | || |\  | |_| | |___| |_| | |___ / ___ \|  _ < ___) |
 |____/___|_| \_|\___/ \____|\___/|_____/_/   \_\_| \_\____/
```

A tool for drawing relationships between source code files.

*Disclaimer*: _This is very much a work-in-progress tool._ Apologies in advance.

#### Scripts

* `npm run build` - do a per file conversion from /src to /lib
* `npm run build.cli` - convert cli
* `npm run build.source` - convert files
* `npm run cost` - regenerate the costfile
* `npm run dist` - generate files
* `npm run lint` - lint the javascript files
* `npm run meta` - run the tool on itself
* `npm run meta.auto` - regenerate the tool and then run it on itself
* `npm run meta.debug` - run the meta calls with DEBUG=binoculars:*
* `npm run meta.debug.multi` - run the meta.multi call with DEBUG=binoculars:*
* `npm run meta.debug.single` - run the meta.single call with DEBUG=binoculars:*
* `npm run meta.multi` - run a multi meta call
* `npm run meta.single` - run a single meta call
* `npm run mkdir.coverage` - mkdirp coverage
* `npm run precommit` - the tasks auto-run before commits dist' 'nps test' 'nps cost'
* `npm run publish` - the tasks to run at publish-time
* `npm run test` - run lint and tests
* `npm run test.covered` - run covered tests
* `npm run test.log` - run tests and save logfile
* `npm run test.watch` - run your tests continuously
