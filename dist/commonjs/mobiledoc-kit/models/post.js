'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _types = require('./types');

var _utilsLinkedList = require('../utils/linked-list');

var _utilsArrayUtils = require('../utils/array-utils');

var _utilsSet = require('../utils/set');

var _utilsCursorPosition = require('../utils/cursor/position');

/**
 * The Post is an in-memory representation of an editor's document.
 * An editor always has a single post. The post is organized into a list of
 * sections. Each section may be markerable (contains "markers", aka editable
 * text) or non-markerable (e.g., a card).
 * When persisting a post, it must first be serialized (loss-lessly) into
 * mobiledoc using {@link Editor#serialize}.
 */

var Post = (function () {
  /**
   * @private
   */

  function Post() {
    var _this = this;

    _classCallCheck(this, Post);

    this.type = _types.POST_TYPE;
    this.sections = new _utilsLinkedList['default']({
      adoptItem: function adoptItem(s) {
        return s.post = s.parent = _this;
      },
      freeItem: function freeItem(s) {
        return s.post = s.parent = null;
      }
    });
  }

  /**
   * @return {Position} The position at the start of the post (will be a {@link BlankPosition}
   * if the post is blank)
   * @public
   */

  _createClass(Post, [{
    key: 'headPosition',
    value: function headPosition() {
      if (this.isBlank) {
        return _utilsCursorPosition['default'].blankPosition();
      } else {
        return this.sections.head.headPosition();
      }
    }

    /**
     * @return {Position} The position at the end of the post (will be a {@link BlankPosition}
     * if the post is blank)
     * @public
     */
  }, {
    key: 'tailPosition',
    value: function tailPosition() {
      if (this.isBlank) {
        return _utilsCursorPosition['default'].blankPosition();
      } else {
        return this.sections.tail.tailPosition();
      }
    }

    /**
     * @return {Range} A range encompassing the entire post
     * @public
     */
  }, {
    key: 'toRange',
    value: function toRange() {
      return this.headPosition().toRange(this.tailPosition());
    }
  }, {
    key: 'markersContainedByRange',

    /**
     * @param {Range} range
     * @return {Array} markers that are completely contained by the range
     */
    value: function markersContainedByRange(range) {
      var markers = [];

      this.walkMarkerableSections(range, function (section) {
        section._markersInRange(range.trimTo(section), function (m, _ref) {
          var isContained = _ref.isContained;
          if (isContained) {
            markers.push(m);
          }
        });
      });

      return markers;
    }
  }, {
    key: 'cutMarkers',
    value: function cutMarkers(markers) {
      var firstSection = markers.length && markers[0].section,
          lastSection = markers.length && markers[markers.length - 1].section;

      var currentSection = firstSection;
      var removedSections = [],
          changedSections = (0, _utilsArrayUtils.compact)([firstSection, lastSection]);

      if (markers.length !== 0) {
        markers.forEach(function (marker) {
          if (marker.section !== currentSection) {
            // this marker is in a section we haven't seen yet
            if (marker.section !== firstSection && marker.section !== lastSection) {
              // section is wholly contained by markers, and can be removed
              removedSections.push(marker.section);
            }
          }

          currentSection = marker.section;
          currentSection.markers.remove(marker);
        });

        if (firstSection !== lastSection) {
          firstSection.join(lastSection);
          removedSections.push(lastSection);
        }
      }

      return { changedSections: changedSections, removedSections: removedSections };
    }

    /**
     * Invoke `callbackFn` for all markers between the headMarker and tailMarker (inclusive),
     * across sections
     * @private
     */
  }, {
    key: 'markersFrom',
    value: function markersFrom(headMarker, tailMarker, callbackFn) {
      var currentMarker = headMarker;
      while (currentMarker) {
        callbackFn(currentMarker);

        if (currentMarker === tailMarker) {
          currentMarker = null;
        } else if (currentMarker.next) {
          currentMarker = currentMarker.next;
        } else {
          var nextSection = this._nextMarkerableSection(currentMarker.section);
          // FIXME: This will fail across cards
          currentMarker = nextSection && nextSection.markers.head;
        }
      }
    }
  }, {
    key: 'markupsInRange',
    value: function markupsInRange(range) {
      var markups = new _utilsSet['default']();

      if (range.isCollapsed) {
        var pos = range.head;
        if (pos.isMarkerable) {
          var back = pos.markerIn(-1);
          var forward = pos.markerIn(1);

          if (back && forward && back === forward) {
            back.markups.forEach(function (m) {
              return markups.add(m);
            });
          } else {
            (back && back.markups || []).forEach(function (m) {
              if (m.isForwardInclusive()) {
                markups.add(m);
              }
            });
            (forward && forward.markups || []).forEach(function (m) {
              if (m.isBackwardInclusive()) {
                markups.add(m);
              }
            });
          }
        }
      } else {
        this.walkMarkerableSections(range, function (section) {
          (0, _utilsArrayUtils.forEach)(section.markupsInRange(range.trimTo(section)), function (m) {
            return markups.add(m);
          });
        });
      }

      return markups.toArray();
    }
  }, {
    key: 'walkAllLeafSections',
    value: function walkAllLeafSections(callback) {
      var range = this.headPosition().toRange(this.tailPosition());
      return this.walkLeafSections(range, callback);
    }
  }, {
    key: 'walkLeafSections',
    value: function walkLeafSections(range, callback) {
      var head = range.head;
      var tail = range.tail;

      var index = 0;
      var nextSection = undefined,
          shouldStop = undefined;
      var currentSection = head.section;

      while (currentSection) {
        nextSection = this._nextLeafSection(currentSection);
        shouldStop = currentSection === tail.section;

        callback(currentSection, index);
        index++;

        if (shouldStop) {
          break;
        } else {
          currentSection = nextSection;
        }
      }
    }
  }, {
    key: 'walkMarkerableSections',
    value: function walkMarkerableSections(range, callback) {
      this.walkLeafSections(range, function (section) {
        if (section.isMarkerable) {
          callback(section);
        }
      });
    }
  }, {
    key: '_nextMarkerableSection',
    value: function _nextMarkerableSection(section) {
      var nextSection = this._nextLeafSection(section);

      while (nextSection && !nextSection.isMarkerable) {
        nextSection = this._nextLeafSection(nextSection);
      }

      return nextSection;
    }

    // return the next section that has markers after this one,
    // possibly skipping non-markerable sections
  }, {
    key: '_nextLeafSection',
    value: function _nextLeafSection(section) {
      if (!section) {
        return null;
      }
      var hasChildren = function hasChildren(s) {
        return !!s.items;
      };
      var firstChild = function firstChild(s) {
        return s.items.head;
      };

      // FIXME this can be refactored to use `isLeafSection`
      var next = section.next;
      if (next) {
        if (hasChildren(next)) {
          // e.g. a ListSection
          return firstChild(next);
        } else {
          return next;
        }
      } else if (section.isNested) {
        // if there is no section after this, but this section is a child
        // (e.g. a ListItem inside a ListSection), check for a markerable
        // section after its parent
        return this._nextLeafSection(section.parent);
      }
    }

    /**
     * @param {Range} range
     * @return {Post} A new post, constrained to {range}
     */
  }, {
    key: 'trimTo',
    value: function trimTo(range) {
      var post = this.builder.createPost();
      var builder = this.builder;

      var sectionParent = post,
          listParent = null;
      this.walkLeafSections(range, function (section) {
        var newSection = undefined;
        if (section.isMarkerable) {
          if (section.isListItem) {
            if (listParent) {
              sectionParent = null;
            } else {
              listParent = builder.createListSection(section.parent.tagName);
              post.sections.append(listParent);
              sectionParent = null;
            }
            newSection = builder.createListItem();
            listParent.items.append(newSection);
          } else {
            listParent = null;
            sectionParent = post;
            newSection = builder.createMarkupSection(section.tagName);
          }

          var currentRange = range.trimTo(section);
          (0, _utilsArrayUtils.forEach)(section.markersFor(currentRange.headSectionOffset, currentRange.tailSectionOffset), function (m) {
            return newSection.markers.append(m);
          });
        } else {
          newSection = section.clone();
        }
        if (sectionParent) {
          sectionParent.sections.append(newSection);
        }
      });
      return post;
    }
  }, {
    key: 'isBlank',
    get: function get() {
      return this.sections.isEmpty;
    }

    /**
     * If the post has no sections, or only has one, blank section, then it does
     * not have content and this method returns false. Otherwise it is true.
     * @return {Boolean}
     * @public
     */
  }, {
    key: 'hasContent',
    get: function get() {
      if (this.sections.length > 1 || this.sections.length === 1 && !this.sections.head.isBlank) {
        return true;
      } else {
        return false;
      }
    }
  }]);

  return Post;
})();

exports['default'] = Post;