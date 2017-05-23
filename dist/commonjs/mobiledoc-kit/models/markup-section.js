'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x4, _x5, _x6) { var _again = true; _function: while (_again) { var object = _x4, property = _x5, receiver = _x6; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x4 = parent; _x5 = property; _x6 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _markerable = require('./_markerable');

var _utilsDomUtils = require('../utils/dom-utils');

var _utilsArrayUtils = require('../utils/array-utils');

var _types = require('./types');

// valid values of `tagName` for a MarkupSection
var VALID_MARKUP_SECTION_TAGNAMES = ['p', 'h4', 'h3', 'h2', 'h1', 'header1-left', 'header1-center', 'header1-right', 'header2-left', 'header2-center', 'header2-right', 'header3-left', 'header3-center', 'header3-right', 'header4-left', 'header4-center', 'header4-right', 'header5-center', 'header6-left', 'header6-center', 'header6-right', 'subheader1-left', 'subheader1-center', 'subheader1-right', 'subheader2-left', 'subheader2-center', 'subheader2-right', 'subheader3-left', 'subheader3-center', 'subheader3-right', 'subheader4-center', 'body1-left', 'body1-right', 'body1-center', 'body2-left', 'body2-right', 'body2-center', 'body3-left', 'body3-right', 'body3-center', 'body4-left', 'body4-right', 'body4-center', 'header1', 'header2', 'header3', 'header4', 'header5', 'header6', 'subheader1', 'subheader2', 'subheader3', 'subheader4', 'body1', 'body2', 'body3', 'body4', 'blockquote1-left', 'blockquote1-right', 'blockquote1-center', 'blockquote2-left', 'blockquote2-right', 'blockquote2-center', 'blockquote1', 'blockquote2', 'blockquote', 'pull-quote'].map(_utilsDomUtils.normalizeTagName);

exports.VALID_MARKUP_SECTION_TAGNAMES = VALID_MARKUP_SECTION_TAGNAMES;
// valid element names for a MarkupSection. A MarkupSection with a tagName
// not in this will be rendered as a div with a className matching the
// tagName
var MARKUP_SECTION_ELEMENT_NAMES = ['p', 'h4', 'h3', 'h2', 'h1', 'header1-left', 'header1-center', 'header1-right', 'header2-left', 'header2-center', 'header2-right', 'header3-left', 'header3-center', 'header3-right', 'header4-left', 'header4-center', 'header4-right', 'header5-center', 'header6-left', 'header6-center', 'header6-right', 'subheader1-left', 'subheader1-center', 'subheader1-right', 'subheader2-left', 'subheader2-center', 'subheader2-right', 'subheader3-left', 'subheader3-center', 'subheader3-right', 'subheader4-center', 'body1-left', 'body1-right', 'body1-center', 'body2-left', 'body2-right', 'body2-center', 'body3-left', 'body3-right', 'body3-center', 'body4-left', 'body4-right', 'body4-center', 'header1', 'header2', 'header3', 'header4', 'header5', 'header6', 'subheader1', 'subheader2', 'subheader3', 'subheader4', 'body1', 'body2', 'body3', 'body4', 'blockquote1-left', 'blockquote1-right', 'blockquote1-center', 'blockquote2-left', 'blockquote2-right', 'blockquote2-center', 'blockquote1', 'blockquote2', 'blockquote', 'pull-quote'].map(_utilsDomUtils.normalizeTagName);
exports.MARKUP_SECTION_ELEMENT_NAMES = MARKUP_SECTION_ELEMENT_NAMES;
var DEFAULT_TAG_NAME = VALID_MARKUP_SECTION_TAGNAMES[0];

exports.DEFAULT_TAG_NAME = DEFAULT_TAG_NAME;
var MarkupSection = (function (_Markerable) {
  _inherits(MarkupSection, _Markerable);

  function MarkupSection() {
    var tagName = arguments.length <= 0 || arguments[0] === undefined ? DEFAULT_TAG_NAME : arguments[0];
    var markers = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

    _classCallCheck(this, MarkupSection);

    _get(Object.getPrototypeOf(MarkupSection.prototype), 'constructor', this).call(this, _types.MARKUP_SECTION_TYPE, tagName, markers);
    this.isMarkupSection = true;
  }

  _createClass(MarkupSection, [{
    key: 'isValidTagName',
    value: function isValidTagName(normalizedTagName) {
      return (0, _utilsArrayUtils.contains)(VALID_MARKUP_SECTION_TAGNAMES, normalizedTagName);
    }
  }, {
    key: 'splitAtMarker',
    value: function splitAtMarker(marker) {
      var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
      var beforeSection = this.builder.createMarkupSection(this.tagName, []);
      var afterSection = this.builder.createMarkupSection();

      return this._redistributeMarkers(beforeSection, afterSection, marker, offset);
    }
  }]);

  return MarkupSection;
})(_markerable['default']);

exports['default'] = MarkupSection;