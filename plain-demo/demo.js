'use strict';

var editor;

$(function () {
  var el = $('#editor')[0];
  editor = new Mobiledoc.Editor({ placeholder: 'write something', autofocus: true });

  editor.cursorDidChange(function () {
    updateCursor();
  });

  editor.postDidChange(function () {
    updatePost();
  });

  editor.inputModeDidChange(function () {
    updateInputMode();
  });

  editor.render(el);
});

function renderPosition(pos) {
  if (pos.isBlank) {
    return '[Blank Position]';
  }
  return '[Position: ' + pos.leafSectionIndex + ':' + pos.offset + '. Section ' + renderSection(pos.section) + ']';
}

function renderSection(section) {
  return '[Section: tagName ' + section.tagName + ' type: ' + section.type + ' isNested? ' + section.isNested + ' Markers: ' + section.markers.length + ']';
}

function renderMarkup(markup) {
  function renderAttrs(obj) {
    var str = Object.keys(obj).reduce(function (memo, key) {
      memo += key + ': ' + obj[key];
      return memo;
    }, '{');
    str += '}';
    return str;
  }
  return '[' + markup.type + ' tagName <b>' + markup.tagName + '</b> attrs: ' + renderAttrs(markup.attributes) + ']';
}

function updateCursor() {
  var range = editor.range;

  var head = renderPosition(range.head);
  var tail = renderPosition(range.tail);
  var html = 'Head ' + head + '<br>Tail ' + tail;

  $('#cursor').html(html);
}

function updatePost() {
  var serialized = editor.serialize();
  $('#post').html(JSON.stringify(serialized));
}

function updateInputMode() {
  var activeMarkups = editor.activeMarkups.map(renderMarkup).join(',');
  var activeSections = editor.activeSections.map(renderSection).join(',');
  var html = 'Active Markups: ' + activeMarkups + '<br>Active Sections: ' + activeSections;
  $('#input-mode').html(html);
}

