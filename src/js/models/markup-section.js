import Markerable from './_markerable';
import { normalizeTagName } from '../utils/dom-utils';
import { contains } from '../utils/array-utils';
import { MARKUP_SECTION_TYPE } from './types';

// valid values of `tagName` for a MarkupSection
export const VALID_MARKUP_SECTION_TAGNAMES = [
            'p', 'h3', 'h2', 'h1',
            'header1left', 'header1center', 'header1right',
            'header2left', 'header2center', 'header2right',
            'header3left', 'header3center', 'header3right',
            'header4left', 'header4center', 'header4right',
            'header5center',
            'header6left', 'header6center', 'header6right',
            'subheader1left', 'subheader1center', 'subheader1right',
            'subheader2left', 'subheader2center', 'subheader2right',
            'subheader3left', 'subheader3center', 'subheader3right',
            'subheader4center',
            'body1left', 'body1right', 'body1center',
            'body2left', 'body2right', 'body2center',
            'body3left', 'body3right', 'body3center',
            'body4left', 'body4right', 'body4center',
            'blockquote1', 'blockquote2', 'blockquote', 'pull-quote'
].map(normalizeTagName);

// valid element names for a MarkupSection. A MarkupSection with a tagName
// not in this will be rendered as a div with a className matching the
// tagName
export const MARKUP_SECTION_ELEMENT_NAMES = [
            'p', 'h3', 'h2', 'h1',
            'header1left', 'header1center', 'header1right',
            'header2left', 'header2center', 'header2right',
            'header3left', 'header3center', 'header3right',
            'header4left', 'header4center', 'header4right',
            'header5center',
            'header6left', 'header6center', 'header6right',
            'subheader1left', 'subheader1center', 'subheader1right',
            'subheader2left', 'subheader2center', 'subheader2right',
            'subheader3left', 'subheader3center', 'subheader3right',
            'subheader4center',
            'body1left', 'body1right', 'body1center',
            'body2left', 'body2right', 'body2center',
            'body3left', 'body3right', 'body3center',
            'body4left', 'body4right', 'body4center',
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
