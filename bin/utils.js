'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.trace = exports.peek = exports.xtrace = undefined;

var _curry = require('ramda/src/curry');

var _curry2 = _interopRequireDefault(_curry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var R__ = _defineProperty({}, '@@functional/placeholder', true);

var xtrace = exports.xtrace = (0, _curry2.default)(function (l, a, z, y) {
  l(a, z(y)); // eslint-disable-line
  return y;
});
var peek = exports.peek = xtrace(console.log);
var trace = exports.trace = xtrace(console.log, R__, function (x) {
  return x;
}, R__);