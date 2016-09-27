import Markerable from './_markerable';
import { normalizeTagName } from '../utils/dom-utils';
import { contains } from '../utils/array-utils';
import { MARKUP_SECTION_TYPE } from './types';

// valid values of `tagName` for a MarkupSection
export const VALID_MARKUP_SECTION_TAGNAMES = [
            'p', 'h3', 'h2', 'h1',
            'header1Left', 'header1Center', 'header1Right',
            'header2Left', 'header2Center', 'header2Right',
            'header3Left', 'header3Center', 'header3Right',
            'header4Left', 'header4Center', 'header4Right',
            'header5Center',
            'header6Left', 'header6Center', 'header6Right',
            'subheader1Left', 'subheader1Center', 'subheader1Right',
            'subheader2Left', 'subheader2Center', 'subheader2Right',
            'subheader3Left', 'subheader3Center', 'subheader3Right',
            'subheader4Center',
            'body1Left', 'body1Right', 'body1Center',
            'body2Left', 'body2Right', 'body2Center',
            'body3Left', 'body3Right', 'body3Center',
            'body4Left', 'body4Right', 'body4Center',
            'blockquote1', 'blockquote2', 'blockquote', 'pull-quote'
].map(normalizeTagName);

// valid element names for a MarkupSection. A MarkupSection with a tagName
// not in this will be rendered as a div with a className matching the
// tagName
export const MARKUP_SECTION_ELEMENT_NAMES = [
            'p', 'h3', 'h2', 'h1',
            'header1Left', 'header1Center', 'header1Right',
            'header2Left', 'header2Center', 'header2Right',
            'header3Left', 'header3Center', 'header3Right',
            'header4Left', 'header4Center', 'header4Right',
            'header5Center',
            'header6Left', 'header6Center', 'header6Right',
            'subheader1Left', 'subheader1Center', 'subheader1Right',
            'subheader2Left', 'subheader2Center', 'subheader2Right',
            'subheader3Left', 'subheader3Center', 'subheader3Right',
            'subheader4Center',
            'body1Left', 'body1Right', 'body1Center',
            'body2Left', 'body2Right', 'body2Center',
            'body3Left', 'body3Right', 'body3Center',
            'body4Left', 'body4Right', 'body4Center',
            'blockquote1', 'blockquote2', 'blockquote', 'pull-quote'
].map(normalizeTagName);
export const DEFAULT_TAG_NAME = VALID_MARKUP_SECTION_TAGNAMES[0];

const MarkupSection = class MarkupSection extends Markerable {
  constructor(tagName=DEFAULT_TAG_NAME, markers=[]) {
    super(MARKUP_SECTION_TYPE, tagName, markers);
    this.isMarkupSection = true;
  }

  isValidTagName(normalizedTagName) {
    return contains(VALID_MARKUP_SECTION_TAGNAMES, normalizedTagName);
  }

  splitAtMarker(marker, offset=0) {
    let [beforeSection, afterSection] = [
      this.builder.createMarkupSection(this.tagName, []),
      this.builder.createMarkupSection()
    ];

    return this._redistributeMarkers(beforeSection, afterSection, marker, offset);
  }
};

export default MarkupSection;
