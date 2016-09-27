import Markerable from './_markerable';
import { normalizeTagName } from '../utils/dom-utils';
import { contains } from '../utils/array-utils';
import { MARKUP_SECTION_TYPE } from './types';

// valid values of `tagName` for a MarkupSection
export const VALID_MARKUP_SECTION_TAGNAMES = [
            'p', 'h3', 'h2', 'h1',
            'header1-left', 'header1-center', 'header1-right',
            'header2-left', 'header2-center', 'header2-right',
            'header3-left', 'header3-center', 'header3-right',
            'header4-left', 'header4-center', 'header4-right',
            'header5-center',
            'header6-left', 'header6-center', 'header6-right',
            'subheader1-left', 'subheader1-center', 'subheader1-right',
            'subheader2-left', 'subheader2-center', 'subheader2-right',
            'subheader3-left', 'subheader3-center', 'subheader3-right',
            'subheader4-center',
            'body1-left', 'body1-right', 'body1-center',
            'body2-left', 'body2-right', 'body2-center',
            'body3-left', 'body3-right', 'body3-center',
            'body4-left', 'body4-right', 'body4-center',
            'blockquote1', 'blockquote2', 'blockquote', 'pull-quote'
].map(normalizeTagName);

// valid element names for a MarkupSection. A MarkupSection with a tagName
// not in this will be rendered as a div with a className matching the
// tagName
export const MARKUP_SECTION_ELEMENT_NAMES = [
            'p', 'h3', 'h2', 'h1',
            'header1-left', 'header1-center', 'header1-right',
            'header2-left', 'header2-center', 'header2-right',
            'header3-left', 'header3-center', 'header3-right',
            'header4-left', 'header4-center', 'header4-right',
            'header5-center',
            'header6-left', 'header6-center', 'header6-right',
            'subheader1-left', 'subheader1-center', 'subheader1-right',
            'subheader2-left', 'subheader2-center', 'subheader2-right',
            'subheader3-left', 'subheader3-center', 'subheader3-right',
            'subheader4-center',
            'body1-left', 'body1-right', 'body1-center',
            'body2-left', 'body2-right', 'body2-center',
            'body3-left', 'body3-right', 'body3-center',
            'body4-left', 'body4-right', 'body4-center',
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
