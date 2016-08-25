// from lodash
'use strict';

exports.convertExpansiontoHandler = convertExpansiontoHandler;
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g,
    reHasRegExpChar = new RegExp(reRegExpChar.source);

// from lodash
function escapeForRegex(string) {
  return string && reHasRegExpChar.test(string) ? string.replace(reRegExpChar, '\\$&') : string;
}

function convertExpansiontoHandler(expansion) {
  var originalRun = expansion.run;
  var text = expansion.text;
  var trigger = expansion.trigger;

  if (!!trigger) {
    text = text + String.fromCharCode(trigger);
  }
  var match = new RegExp('^' + escapeForRegex(text) + '$');
  var run = function run(editor) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var head = editor.range.head;

    if (head.isTail()) {
      originalRun.apply(undefined, [editor].concat(args));
    }
  };

  return { match: match, run: run };
}