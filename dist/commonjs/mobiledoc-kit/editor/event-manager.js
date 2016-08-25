'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utilsAssert = require('../utils/assert');

var _utilsParseUtils = require('../utils/parse-utils');

var _utilsCursorRange = require('../utils/cursor/range');

var _utilsArrayUtils = require('../utils/array-utils');

var _utilsKey = require('../utils/key');

var _utilsCharacters = require('../utils/characters');

var _editorTextInputHandler = require('../editor/text-input-handler');

var ELEMENT_EVENT_TYPES = ['keydown', 'keyup', 'cut', 'copy', 'paste', 'keypress', 'drop'];
var DOCUMENT_EVENT_TYPES = ['mouseup'];

var EventManager = (function () {
  function EventManager(editor) {
    _classCallCheck(this, EventManager);

    this.editor = editor;
    this.logger = editor.loggerFor('event-manager');
    this._textInputHandler = new _editorTextInputHandler['default'](editor);
    this._listeners = [];
    this.isShift = false;
  }

  _createClass(EventManager, [{
    key: 'init',
    value: function init() {
      var _this = this;

      var element = this.editor.element;

      (0, _utilsAssert['default'])('Cannot init EventManager without element', !!element);

      ELEMENT_EVENT_TYPES.forEach(function (type) {
        _this._addListener(element, type);
      });

      DOCUMENT_EVENT_TYPES.forEach(function (type) {
        _this._addListener(document, type);
      });
    }
  }, {
    key: 'registerInputHandler',
    value: function registerInputHandler(inputHandler) {
      this._textInputHandler.register(inputHandler);
    }
  }, {
    key: '_addListener',
    value: function _addListener(context, type) {
      var _this2 = this;

      (0, _utilsAssert['default'])('Missing listener for ' + type, !!this[type]);

      var listener = function listener(event) {
        return _this2._handleEvent(type, event);
      };
      context.addEventListener(type, listener);
      this._listeners.push([context, type, listener]);
    }
  }, {
    key: '_removeListeners',
    value: function _removeListeners() {
      this._listeners.forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 3);

        var context = _ref2[0];
        var type = _ref2[1];
        var listener = _ref2[2];

        context.removeEventListener(type, listener);
      });
    }

    // This is primarily useful for programmatically simulating events on the
    // editor from the tests.
  }, {
    key: '_trigger',
    value: function _trigger(context, type, event) {
      (0, _utilsArrayUtils.forEach)((0, _utilsArrayUtils.filter)(this._listeners, function (_ref3) {
        var _ref32 = _slicedToArray(_ref3, 2);

        var _context = _ref32[0];
        var _type = _ref32[1];

        return _context === context && _type === type;
      }), function (_ref4) {
        var _ref42 = _slicedToArray(_ref4, 3);

        var context = _ref42[0];
        var type = _ref42[1];
        var listener = _ref42[2];

        listener.call(context, event);
      });
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this._textInputHandler.destroy();
      this._removeListeners();
      this._listeners = [];
    }
  }, {
    key: '_handleEvent',
    value: function _handleEvent(type, event) {
      var editor = this.editor;

      if ((0, _utilsArrayUtils.contains)(ELEMENT_EVENT_TYPES, type)) {
        var element = event.target;

        if (!editor.cursor.isAddressable(element)) {
          // abort handling this event
          return true;
        }
      }

      this[type](event);
    }
  }, {
    key: 'keypress',
    value: function keypress(event) {
      var editor = this.editor;
      var _textInputHandler = this._textInputHandler;

      if (!editor.hasCursor()) {
        return;
      }

      var key = _utilsKey['default'].fromEvent(event);
      if (!key.isPrintable()) {
        return;
      } else {
        event.preventDefault();
      }

      _textInputHandler.handle(key.toString());
    }
  }, {
    key: 'keydown',
    value: function keydown(event) {
      var editor = this.editor;

      if (!editor.hasCursor()) {
        return;
      }
      if (!editor.isEditable) {
        return;
      }

      var key = _utilsKey['default'].fromEvent(event);
      if (key.isShiftKey()) {
        this.isShift = true;
      }

      if (editor.handleKeyCommand(event)) {
        return;
      }

      if (editor.post.isBlank) {
        editor._insertEmptyMarkupSectionAtCursor();
      }

      var range = editor.range;

      switch (true) {
        case key.isHorizontalArrow():
          var newRange = undefined;
          if (key.isShift()) {
            newRange = range.extend(key.direction * 1);
          } else {
            newRange = range.move(key.direction);
          }

          editor.selectRange(newRange);
          event.preventDefault();
          break;
        case key.isDelete():
          editor.handleDeletion(event);
          event.preventDefault();
          break;
        case key.isEnter():
          editor.handleNewline(event);
          break;
        case key.isTab():
          event.preventDefault();
          editor.insertText(_utilsCharacters.TAB);
          break;
      }
    }
  }, {
    key: 'keyup',
    value: function keyup(event) {
      var _this3 = this;

      var editor = this.editor;

      if (!editor.hasCursor()) {
        return;
      }
      var key = _utilsKey['default'].fromEvent(event);
      if (key.isShiftKey()) {
        this.isShift = false;
      }

      // Only movement-related keys require re-checking the active range
      if (key.isMovement()) {
        setTimeout(function () {
          return _this3.editor._notifyRangeChange();
        });
      }
    }
  }, {
    key: 'cut',
    value: function cut(event) {
      event.preventDefault();

      this.copy(event);
      this.editor.handleDeletion();
    }
  }, {
    key: 'copy',
    value: function copy(event) {
      event.preventDefault();

      var editor = this.editor;
      var _editor = this.editor;
      var range = _editor.range;
      var post = _editor.post;

      post = post.trimTo(range);

      var data = {
        html: editor.serializePost(post, 'html'),
        text: editor.serializePost(post, 'text'),
        mobiledoc: editor.serializePost(post, 'mobiledoc')
      };

      (0, _utilsParseUtils.setClipboardData)(event, data, window);
    }
  }, {
    key: 'paste',
    value: function paste(event) {
      event.preventDefault();

      var editor = this.editor;

      var range = editor.range;

      if (!range.isCollapsed) {
        editor.handleDeletion();
      }
      var position = editor.range.head;
      var targetFormat = this.isShift ? 'text' : 'html';
      var pastedPost = (0, _utilsParseUtils.parsePostFromPaste)(event, editor, { targetFormat: targetFormat });

      editor.run(function (postEditor) {
        var nextPosition = postEditor.insertPost(position, pastedPost);
        postEditor.setRange(new _utilsCursorRange['default'](nextPosition));
      });
    }
  }, {
    key: 'mouseup',
    value: function mouseup() /* event */{
      var _this4 = this;

      // mouseup does not correctly report a selection until the next tick
      setTimeout(function () {
        return _this4.editor._notifyRangeChange();
      });
    }
  }, {
    key: 'drop',
    value: function drop(event) {
      event.preventDefault();

      var x = event.clientX;
      var y = event.clientY;
      var editor = this.editor;

      var position = editor.positionAtPoint(x, y);
      if (!position) {
        this.logger.log('Could not find drop position');
        return;
      }

      var post = (0, _utilsParseUtils.parsePostFromDrop)(event, editor, { logger: this.logger });
      if (!post) {
        this.logger.log('Could not determine post from drop event');
        return;
      }

      editor.run(function (postEditor) {
        var nextPosition = postEditor.insertPost(position, post);
        postEditor.setRange(new _utilsCursorRange['default'](nextPosition));
      });
    }
  }]);

  return EventManager;
})();

exports['default'] = EventManager;