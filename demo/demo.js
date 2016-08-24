/* global Mobiledoc */
'use strict';

var editor;

function renderSection(section) {
  return '[Section: tagName ' + section.tagName + ' type: ' + section.type + ' isNested? ' + section.isNested + ' Markers: ' + section.markers.length + ']';
}

function renderPosition(pos) {
  if (pos.isBlank) {
    return '[Blank Position]';
  }
  return '[Position: ' + pos.leafSectionIndex + ':' + pos.offset + '. Section ' + renderSection(pos.section) + ']';
}

function updateCursor() {
  var range = editor.range;

  var head = renderPosition(range.head);
  var tail = renderPosition(range.tail);
  var html = 'Head ' + head + '<br>Tail ' + tail;

  $('#cursor').html(html);
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

function updateButtons() {
  let activeSectionTagNames = editor.activeSections.map(section => {
    return section.tagName;
  });
  let activeMarkupTagNames = editor.activeMarkups.map(markup => markup.tagName);

  $('#toolbar button').each(function() {
    let toggle = $(this).data('toggle');

    let hasSection = false, hasMarkup = false;
    if (activeSectionTagNames.indexOf(toggle) !== -1) {
      hasSection = true;
    }
    if (activeMarkupTagNames.indexOf(toggle) !== -1) {
      hasMarkup = true;
    }
    if (hasSection || hasMarkup) {
      $(this).addClass('active');
    } else {
      $(this).removeClass('active');
    }
  });
}

let mentionAtom = {
  name: 'mention',
  type: 'dom',
  render({value}) {
    let el = $(`<span>@${value}</span>`)[0];
    return el;
  }
};

$(function () {
  var el = $('#editor')[0];
  editor = new Mobiledoc.Editor({
    placeholder: 'write something',
    autofocus: true,
    atoms: [mentionAtom]
  });

  editor.cursorDidChange(updateCursor);
  editor.postDidChange(updatePost);
  editor.inputModeDidChange(updateInputMode);

  editor.inputModeDidChange(updateButtons);

  editor.render(el);

  $('#toolbar button.toggle').click(function() {
    let action = $(this).data('action');
    let toggle = $(this).data('toggle');

    editor[action](toggle);
  });

  $('#toolbar button.insert').click(function() {
    editor.insertAtom('mention', 'bantic');
  });
});
