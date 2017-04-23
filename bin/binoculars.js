#!/usr/bin/env node
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
// import R from 'ramda'


var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _process = require('process');

var _process2 = _interopRequireDefault(_process);

var _babelRegister = require('babel-register');

var _babelRegister2 = _interopRequireDefault(_babelRegister);

var _partial = require('partial.lenses');

var L = _interopRequireWildcard(_partial);

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _fluture = require('fluture');

var _fluture2 = _interopRequireDefault(_fluture);

var _curry = require('ramda/src/curry');

var _curry2 = _interopRequireDefault(_curry);

var _pipe = require('ramda/src/pipe');

var _pipe2 = _interopRequireDefault(_pipe);

var _assoc = require('ramda/src/assoc');

var _assoc2 = _interopRequireDefault(_assoc);

var _precinct = require('precinct');

var _precinct2 = _interopRequireDefault(_precinct);

var _map = require('ramda/src/map');

var _map2 = _interopRequireDefault(_map);

var _package = require('../package.json');

var _utils = require('./utils.js');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _babelRegister2.default)(); // eslint-disable-line

var R = {
  assoc: _assoc2.default,
  curry: _curry2.default,
  map: _map2.default,
  pipe: _pipe2.default
};

// eslint-disable-next-line fp/no-unused-expression
(0, _babelRegister2.default)();

var log = console.log.bind(console);

// eslint-disable-next-line fp/no-unused-expression
var fail = function fail(e) {
  return log('ERROR', e);
};

var commanderF = function commanderF() {
  return _fluture2.default.of(_commander2.default.description('A tool for understanding how files are consumed').version(_package.version).option('-s, --start <s>', 'A file to start looking at').option('-c, --context <c>', 'A directory to relate to the file you want to look at').parse(_process2.default.argv));
};

// const namespace = [pkg.name, `cli`]

var getUserInput = function getUserInput(program) {
  var context = program.context,
      start = program.start;

  return {
    files: [{
      raw: context
    }, {
      raw: start
    }]
  };
};

var pathRelative = R.curry(function (a, b) {
  return _path2.default.relative(a, b);
});

var absolutifyPaths = R.curry(function (relative, data) {
  var relativize = pathRelative(relative);
  var modified = L.modify(['files', L.elems], function (x) {
    return R.assoc('relative', relativize(x.raw), x);
  }, data);
  console.log('MODIFIED', modified, relative);
  return modified;
});

var getPathing = function getPathing(file) {
  return _fluture2.default.node(function (done) {
    return _fs2.default.readFile(file, 'utf8', done);
  }).chain(_fluture2.default.encase(_precinct2.default));
};

var chainF = R.curry(function (fn, future) {
  return future.chain(fn);
});
var forkF = R.curry(function (bad, good, future) {
  return future.fork(bad, good);
});

var sleuth = function sleuth(data) {
  return R.pipe(L.foldl(function (xs, x) {
    return xs.concat(x);
  }, [], ['files', L.elems, 'relative']), R.map(getPathing), _fluture2.default.parallel(2), forkF(fail, function (x) {
    return x;
  }), function (list) {
    return _extends({}, data, {
      list: list
    });
  })(data);
};

var binoculars = function binoculars() {
  return commanderF().map(getUserInput).map(absolutifyPaths(_process2.default.cwd())).map(sleuth);
};

// eslint-disable-next-line fp/no-unused-expression
binoculars().fork(fail, console.log);
