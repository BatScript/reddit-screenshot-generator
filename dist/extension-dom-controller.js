/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/base64-js/index.js":
/*!*****************************************!*\
  !*** ./node_modules/base64-js/index.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(
      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
    ))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}


/***/ }),

/***/ "./node_modules/canvas/browser.js":
/*!****************************************!*\
  !*** ./node_modules/canvas/browser.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/* globals document, ImageData */

const parseFont = __webpack_require__(/*! ./lib/parse-font */ "./node_modules/canvas/lib/parse-font.js")

exports.parseFont = parseFont

exports.createCanvas = function (width, height) {
  return Object.assign(document.createElement('canvas'), { width: width, height: height })
}

exports.createImageData = function (array, width, height) {
  // Browser implementation of ImageData looks at the number of arguments passed
  switch (arguments.length) {
    case 0: return new ImageData()
    case 1: return new ImageData(array)
    case 2: return new ImageData(array, width)
    default: return new ImageData(array, width, height)
  }
}

exports.loadImage = function (src, options) {
  return new Promise(function (resolve, reject) {
    const image = Object.assign(document.createElement('img'), options)

    function cleanup () {
      image.onload = null
      image.onerror = null
    }

    image.onload = function () { cleanup(); resolve(image) }
    image.onerror = function () { cleanup(); reject(new Error('Failed to load the image "' + src + '"')) }

    image.src = src
  })
}


/***/ }),

/***/ "./node_modules/canvas/lib/parse-font.js":
/*!***********************************************!*\
  !*** ./node_modules/canvas/lib/parse-font.js ***!
  \***********************************************/
/***/ ((module) => {

"use strict";


/**
 * Font RegExp helpers.
 */

const weights = 'bold|bolder|lighter|[1-9]00'
const styles = 'italic|oblique'
const variants = 'small-caps'
const stretches = 'ultra-condensed|extra-condensed|condensed|semi-condensed|semi-expanded|expanded|extra-expanded|ultra-expanded'
const units = 'px|pt|pc|in|cm|mm|%|em|ex|ch|rem|q'
const string = '\'([^\']+)\'|"([^"]+)"|[\\w\\s-]+'

// [ [ <‘font-style’> || <font-variant-css21> || <‘font-weight’> || <‘font-stretch’> ]?
//    <‘font-size’> [ / <‘line-height’> ]? <‘font-family’> ]
// https://drafts.csswg.org/css-fonts-3/#font-prop
const weightRe = new RegExp(`(${weights}) +`, 'i')
const styleRe = new RegExp(`(${styles}) +`, 'i')
const variantRe = new RegExp(`(${variants}) +`, 'i')
const stretchRe = new RegExp(`(${stretches}) +`, 'i')
const sizeFamilyRe = new RegExp(
  `([\\d\\.]+)(${units}) *((?:${string})( *, *(?:${string}))*)`)

/**
 * Cache font parsing.
 */

const cache = {}

const defaultHeight = 16 // pt, common browser default

/**
 * Parse font `str`.
 *
 * @param {String} str
 * @return {Object} Parsed font. `size` is in device units. `unit` is the unit
 *   appearing in the input string.
 * @api private
 */

module.exports = str => {
  // Cached
  if (cache[str]) return cache[str]

  // Try for required properties first.
  const sizeFamily = sizeFamilyRe.exec(str)
  if (!sizeFamily) return // invalid

  // Default values and required properties
  const font = {
    weight: 'normal',
    style: 'normal',
    stretch: 'normal',
    variant: 'normal',
    size: parseFloat(sizeFamily[1]),
    unit: sizeFamily[2],
    family: sizeFamily[3].replace(/["']/g, '').replace(/ *, */g, ',')
  }

  // Optional, unordered properties.
  let weight, style, variant, stretch
  // Stop search at `sizeFamily.index`
  const substr = str.substring(0, sizeFamily.index)
  if ((weight = weightRe.exec(substr))) font.weight = weight[1]
  if ((style = styleRe.exec(substr))) font.style = style[1]
  if ((variant = variantRe.exec(substr))) font.variant = variant[1]
  if ((stretch = stretchRe.exec(substr))) font.stretch = stretch[1]

  // Convert to device units. (`font.unit` is the original unit)
  // TODO: ch, ex
  switch (font.unit) {
    case 'pt':
      font.size /= 0.75
      break
    case 'pc':
      font.size *= 16
      break
    case 'in':
      font.size *= 96
      break
    case 'cm':
      font.size *= 96.0 / 2.54
      break
    case 'mm':
      font.size *= 96.0 / 25.4
      break
    case '%':
      // TODO disabled because existing unit tests assume 100
      // font.size *= defaultHeight / 100 / 0.75
      break
    case 'em':
    case 'rem':
      font.size *= defaultHeight / 0.75
      break
    case 'q':
      font.size *= 96 / 25.4 / 4
      break
  }

  return (cache[str] = font)
}


/***/ }),

/***/ "./node_modules/linebreak-next/src/classes.js":
/*!****************************************************!*\
  !*** ./node_modules/linebreak-next/src/classes.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports) => {

// The following break classes are handled by the pair table

exports.OP = 0;   // Opening punctuation
exports.CL = 1;   // Closing punctuation
exports.CP = 2;   // Closing parenthesis
exports.QU = 3;   // Ambiguous quotation
exports.GL = 4;   // Glue
exports.NS = 5;   // Non-starters
exports.EX = 6;   // Exclamation/Interrogation
exports.SY = 7;   // Symbols allowing break after
exports.IS = 8;   // Infix separator
exports.PR = 9;   // Prefix
exports.PO = 10;  // Postfix
exports.NU = 11;  // Numeric
exports.AL = 12;  // Alphabetic
exports.HL = 13;  // Hebrew Letter
exports.ID = 14;  // Ideographic
exports.IN = 15;  // Inseparable characters
exports.HY = 16;  // Hyphen
exports.BA = 17;  // Break after
exports.BB = 18;  // Break before
exports.B2 = 19;  // Break on either side (but not pair)
exports.ZW = 20;  // Zero-width space
exports.CM = 21;  // Combining marks
exports.WJ = 22;  // Word joiner
exports.H2 = 23;  // Hangul LV
exports.H3 = 24;  // Hangul LVT
exports.JL = 25;  // Hangul L Jamo
exports.JV = 26;  // Hangul V Jamo
exports.JT = 27;  // Hangul T Jamo
exports.RI = 28;  // Regional Indicator

// The following break classes are not handled by the pair table
exports.AI = 29;  // Ambiguous (Alphabetic or Ideograph)
exports.BK = 30;  // Break (mandatory)
exports.CB = 31;  // Contingent break
exports.CJ = 32;  // Conditional Japanese Starter
exports.CR = 33;  // Carriage return
exports.LF = 34;  // Line feed
exports.NL = 35;  // Next line
exports.SA = 36;  // South-East Asian
exports.SG = 37;  // Surrogates
exports.SP = 38;  // Space
exports.XX = 39;  // Unknown


/***/ }),

/***/ "./node_modules/linebreak-next/src/linebreaker-browser.js":
/*!****************************************************************!*\
  !*** ./node_modules/linebreak-next/src/linebreaker-browser.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const base64 = __webpack_require__(/*! base64-js */ "./node_modules/base64-js/index.js");
const UnicodeTrie = __webpack_require__(/*! unicode-trie */ "./node_modules/unicode-trie/index.js");

const { BK, CR, LF, NL, SG, WJ, CB, SP, BA, NS, AI, AL, CJ, ID, SA, XX } = __webpack_require__(/*! ./classes */ "./node_modules/linebreak-next/src/classes.js");
const { DI_BRK, IN_BRK, CI_BRK, CP_BRK, PR_BRK, pairTable } = __webpack_require__(/*! ./pairs */ "./node_modules/linebreak-next/src/pairs.js");

const data = base64.toByteArray("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");

const classTrie = new UnicodeTrie(data);

const mapClass = function (c) {
  switch (c) {
    case AI:
      return AL;

    case SA:
    case SG:
    case XX:
      return AL;

    case CJ:
      return NS;

    default:
      return c;
  }
};

const mapFirst = function (c) {
  switch (c) {
    case LF:
    case NL:
      return BK;

    case CB:
      return BA;

    case SP:
      return WJ;

    default:
      return c;
  }
};

class Break {
  constructor(position, required = false) {
    this.position = position;
    this.required = required;
  }
}

class LineBreaker {
  constructor(string) {
    this.string = string;
    this.pos = 0;
    this.lastPos = 0;
    this.curClass = null;
    this.nextClass = null;
  }

  nextCodePoint() {
    const code = this.string.charCodeAt(this.pos++);
    const next = this.string.charCodeAt(this.pos);

    // If a surrogate pair
    if ((0xd800 <= code && code <= 0xdbff) && (0xdc00 <= next && next <= 0xdfff)) {
      this.pos++;
      return ((code - 0xd800) * 0x400) + (next - 0xdc00) + 0x10000;
    }

    return code;
  }

  nextCharClass() {
    return mapClass(classTrie.get(this.nextCodePoint()));
  }

  nextBreak() {
    // get the first char if we're at the beginning of the string
    if (this.curClass == null) {
      this.curClass = mapFirst(this.nextCharClass());
    }

    while (this.pos < this.string.length) {
      this.lastPos = this.pos;
      const lastClass = this.nextClass;
      this.nextClass = this.nextCharClass();

      // explicit newline
      if ((this.curClass === BK) || ((this.curClass === CR) && (this.nextClass !== LF))) {
        this.curClass = mapFirst(mapClass(this.nextClass));
        return new Break(this.lastPos, true);
      }

      // handle classes not handled by the pair table
      let cur;
      switch (this.nextClass) {
        case SP:
          cur = this.curClass;
          break;

        case BK:
        case LF:
        case NL:
          cur = BK;
          break;

        case CR:
          cur = CR;
          break;

        case CB:
          cur = BA;
          break;
      }

      if (cur != null) {
        this.curClass = cur;
        if (this.nextClass === CB) {
          return new Break(this.lastPos);
        }
        continue;
      }

      // if not handled already, use the pair table
      let shouldBreak = false;
      switch (pairTable[this.curClass][this.nextClass]) {
        case DI_BRK: // Direct break
          shouldBreak = true;
          break;

        case IN_BRK: // possible indirect break
          shouldBreak = lastClass === SP;
          break;

        case CI_BRK:
          shouldBreak = lastClass === SP;
          if (!shouldBreak) {
            continue;
          }
          break;

        case CP_BRK: // prohibited for combining marks
          if (lastClass !== SP) {
            continue;
          }
          break;
      }

      this.curClass = this.nextClass;
      if (shouldBreak) {
        return new Break(this.lastPos);
      }
    }

    if (this.pos >= this.string.length) {
      if (this.lastPos < this.string.length) {
        this.lastPos = this.string.length;
        return new Break(this.string.length);
      } else {
        return null;
      }
    }
  }
}

module.exports = LineBreaker;


/***/ }),

/***/ "./node_modules/linebreak-next/src/pairs.js":
/*!**************************************************!*\
  !*** ./node_modules/linebreak-next/src/pairs.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports) => {

let CI_BRK, CP_BRK, DI_BRK, IN_BRK, PR_BRK;
exports.DI_BRK = (DI_BRK = 0); // Direct break opportunity
exports.IN_BRK = (IN_BRK = 1); // Indirect break opportunity
exports.CI_BRK = (CI_BRK = 2); // Indirect break opportunity for combining marks
exports.CP_BRK = (CP_BRK = 3); // Prohibited break for combining marks
exports.PR_BRK = (PR_BRK = 4); // Prohibited break

// table generated from http://www.unicode.org/reports/tr14/#Table2
exports.pairTable = [
  [PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, CP_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK],
  [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK],
  [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK],
  [PR_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, CI_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK],
  [IN_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, CI_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK],
  [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK],
  [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK],
  [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, IN_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK],
  [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK],
  [IN_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK],
  [IN_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK],
  [IN_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK],
  [IN_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK],
  [IN_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK],
  [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, IN_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK],
  [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK],
  [DI_BRK, PR_BRK, PR_BRK, IN_BRK, DI_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, IN_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK],
  [DI_BRK, PR_BRK, PR_BRK, IN_BRK, DI_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK],
  [IN_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, CI_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK],
  [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK, PR_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK],
  [DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK],
  [IN_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK],
  [IN_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, CI_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK],
  [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, IN_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK],
  [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, IN_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, DI_BRK],
  [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, IN_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK],
  [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, IN_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK],
  [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, IN_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, DI_BRK],
  [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK]
];

/***/ }),

/***/ "./node_modules/once/once.js":
/*!***********************************!*\
  !*** ./node_modules/once/once.js ***!
  \***********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var wrappy = __webpack_require__(/*! wrappy */ "./node_modules/wrappy/wrappy.js")
module.exports = wrappy(once)
module.exports.strict = wrappy(onceStrict)

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })

  Object.defineProperty(Function.prototype, 'onceStrict', {
    value: function () {
      return onceStrict(this)
    },
    configurable: true
  })
})

function once (fn) {
  var f = function () {
    if (f.called) return f.value
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  f.called = false
  return f
}

function onceStrict (fn) {
  var f = function () {
    if (f.called)
      throw new Error(f.onceError)
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  var name = fn.name || 'Function wrapped with `once`'
  f.onceError = name + " shouldn't be called more than once"
  f.called = false
  return f
}


/***/ }),

/***/ "./node_modules/simple-concat/index.js":
/*!*********************************************!*\
  !*** ./node_modules/simple-concat/index.js ***!
  \*********************************************/
/***/ ((module) => {

/*! simple-concat. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
module.exports = function (stream, cb) {
  var chunks = []
  stream.on('data', function (chunk) {
    chunks.push(chunk)
  })
  stream.once('end', function () {
    if (cb) cb(null, Buffer.concat(chunks))
    cb = null
  })
  stream.once('error', function (err) {
    if (cb) cb(err)
    cb = null
  })
}


/***/ }),

/***/ "./node_modules/simple-get/index.js":
/*!******************************************!*\
  !*** ./node_modules/simple-get/index.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = simpleGet

const concat = __webpack_require__(/*! simple-concat */ "./node_modules/simple-concat/index.js")
const decompressResponse = __webpack_require__(/*! decompress-response */ "?45bd") // excluded from browser build
const http = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'http'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()))
const https = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'https'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()))
const once = __webpack_require__(/*! once */ "./node_modules/once/once.js")
const querystring = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'querystring'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()))
const url = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'url'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()))

const isStream = o => o !== null && typeof o === 'object' && typeof o.pipe === 'function'

function simpleGet (opts, cb) {
  opts = Object.assign({ maxRedirects: 10 }, typeof opts === 'string' ? { url: opts } : opts)
  cb = once(cb)

  if (opts.url) {
    const { hostname, port, protocol, auth, path } = url.parse(opts.url) // eslint-disable-line node/no-deprecated-api
    delete opts.url
    if (!hostname && !port && !protocol && !auth) opts.path = path // Relative redirect
    else Object.assign(opts, { hostname, port, protocol, auth, path }) // Absolute redirect
  }

  const headers = { 'accept-encoding': 'gzip, deflate' }
  if (opts.headers) Object.keys(opts.headers).forEach(k => (headers[k.toLowerCase()] = opts.headers[k]))
  opts.headers = headers

  let body
  if (opts.body) {
    body = opts.json && !isStream(opts.body) ? JSON.stringify(opts.body) : opts.body
  } else if (opts.form) {
    body = typeof opts.form === 'string' ? opts.form : querystring.stringify(opts.form)
    opts.headers['content-type'] = 'application/x-www-form-urlencoded'
  }

  if (body) {
    if (!opts.method) opts.method = 'POST'
    if (!isStream(body)) opts.headers['content-length'] = Buffer.byteLength(body)
    if (opts.json && !opts.form) opts.headers['content-type'] = 'application/json'
  }
  delete opts.body; delete opts.form

  if (opts.json) opts.headers.accept = 'application/json'
  if (opts.method) opts.method = opts.method.toUpperCase()

  const originalHost = opts.hostname // hostname before potential redirect
  const protocol = opts.protocol === 'https:' ? https : http // Support http/https urls
  const req = protocol.request(opts, res => {
    if (opts.followRedirects !== false && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      opts.url = res.headers.location // Follow 3xx redirects
      delete opts.headers.host // Discard `host` header on redirect (see #32)
      res.resume() // Discard response

      const redirectHost = url.parse(opts.url).hostname // eslint-disable-line node/no-deprecated-api
      // If redirected host is different than original host, drop headers to prevent cookie leak (#73)
      if (redirectHost !== null && redirectHost !== originalHost) {
        delete opts.headers.cookie
        delete opts.headers.authorization
      }

      if (opts.method === 'POST' && [301, 302].includes(res.statusCode)) {
        opts.method = 'GET' // On 301/302 redirect, change POST to GET (see #35)
        delete opts.headers['content-length']; delete opts.headers['content-type']
      }

      if (opts.maxRedirects-- === 0) return cb(new Error('too many redirects'))
      else return simpleGet(opts, cb)
    }

    const tryUnzip = typeof decompressResponse === 'function' && opts.method !== 'HEAD'
    cb(null, tryUnzip ? decompressResponse(res) : res)
  })
  req.on('timeout', () => {
    req.abort()
    cb(new Error('Request timed out'))
  })
  req.on('error', cb)

  if (isStream(body)) body.on('error', cb).pipe(req)
  else req.end(body)

  return req
}

simpleGet.concat = (opts, cb) => {
  return simpleGet(opts, (err, res) => {
    if (err) return cb(err)
    concat(res, (err, data) => {
      if (err) return cb(err)
      if (opts.json) {
        try {
          data = JSON.parse(data.toString())
        } catch (err) {
          return cb(err, res, data)
        }
      }
      cb(null, res, data)
    })
  })
}

;['get', 'post', 'put', 'patch', 'head', 'delete'].forEach(method => {
  simpleGet[method] = (opts, cb) => {
    if (typeof opts === 'string') opts = { url: opts }
    return simpleGet(Object.assign({ method: method.toUpperCase() }, opts), cb)
  }
})


/***/ }),

/***/ "./node_modules/tiny-inflate/index.js":
/*!********************************************!*\
  !*** ./node_modules/tiny-inflate/index.js ***!
  \********************************************/
/***/ ((module) => {

var TINF_OK = 0;
var TINF_DATA_ERROR = -3;

function Tree() {
  this.table = new Uint16Array(16);   /* table of code length counts */
  this.trans = new Uint16Array(288);  /* code -> symbol translation table */
}

function Data(source, dest) {
  this.source = source;
  this.sourceIndex = 0;
  this.tag = 0;
  this.bitcount = 0;
  
  this.dest = dest;
  this.destLen = 0;
  
  this.ltree = new Tree();  /* dynamic length/symbol tree */
  this.dtree = new Tree();  /* dynamic distance tree */
}

/* --------------------------------------------------- *
 * -- uninitialized global data (static structures) -- *
 * --------------------------------------------------- */

var sltree = new Tree();
var sdtree = new Tree();

/* extra bits and base tables for length codes */
var length_bits = new Uint8Array(30);
var length_base = new Uint16Array(30);

/* extra bits and base tables for distance codes */
var dist_bits = new Uint8Array(30);
var dist_base = new Uint16Array(30);

/* special ordering of code length codes */
var clcidx = new Uint8Array([
  16, 17, 18, 0, 8, 7, 9, 6,
  10, 5, 11, 4, 12, 3, 13, 2,
  14, 1, 15
]);

/* used by tinf_decode_trees, avoids allocations every call */
var code_tree = new Tree();
var lengths = new Uint8Array(288 + 32);

/* ----------------------- *
 * -- utility functions -- *
 * ----------------------- */

/* build extra bits and base tables */
function tinf_build_bits_base(bits, base, delta, first) {
  var i, sum;

  /* build bits table */
  for (i = 0; i < delta; ++i) bits[i] = 0;
  for (i = 0; i < 30 - delta; ++i) bits[i + delta] = i / delta | 0;

  /* build base table */
  for (sum = first, i = 0; i < 30; ++i) {
    base[i] = sum;
    sum += 1 << bits[i];
  }
}

/* build the fixed huffman trees */
function tinf_build_fixed_trees(lt, dt) {
  var i;

  /* build fixed length tree */
  for (i = 0; i < 7; ++i) lt.table[i] = 0;

  lt.table[7] = 24;
  lt.table[8] = 152;
  lt.table[9] = 112;

  for (i = 0; i < 24; ++i) lt.trans[i] = 256 + i;
  for (i = 0; i < 144; ++i) lt.trans[24 + i] = i;
  for (i = 0; i < 8; ++i) lt.trans[24 + 144 + i] = 280 + i;
  for (i = 0; i < 112; ++i) lt.trans[24 + 144 + 8 + i] = 144 + i;

  /* build fixed distance tree */
  for (i = 0; i < 5; ++i) dt.table[i] = 0;

  dt.table[5] = 32;

  for (i = 0; i < 32; ++i) dt.trans[i] = i;
}

/* given an array of code lengths, build a tree */
var offs = new Uint16Array(16);

function tinf_build_tree(t, lengths, off, num) {
  var i, sum;

  /* clear code length count table */
  for (i = 0; i < 16; ++i) t.table[i] = 0;

  /* scan symbol lengths, and sum code length counts */
  for (i = 0; i < num; ++i) t.table[lengths[off + i]]++;

  t.table[0] = 0;

  /* compute offset table for distribution sort */
  for (sum = 0, i = 0; i < 16; ++i) {
    offs[i] = sum;
    sum += t.table[i];
  }

  /* create code->symbol translation table (symbols sorted by code) */
  for (i = 0; i < num; ++i) {
    if (lengths[off + i]) t.trans[offs[lengths[off + i]]++] = i;
  }
}

/* ---------------------- *
 * -- decode functions -- *
 * ---------------------- */

/* get one bit from source stream */
function tinf_getbit(d) {
  /* check if tag is empty */
  if (!d.bitcount--) {
    /* load next tag */
    d.tag = d.source[d.sourceIndex++];
    d.bitcount = 7;
  }

  /* shift bit out of tag */
  var bit = d.tag & 1;
  d.tag >>>= 1;

  return bit;
}

/* read a num bit value from a stream and add base */
function tinf_read_bits(d, num, base) {
  if (!num)
    return base;

  while (d.bitcount < 24) {
    d.tag |= d.source[d.sourceIndex++] << d.bitcount;
    d.bitcount += 8;
  }

  var val = d.tag & (0xffff >>> (16 - num));
  d.tag >>>= num;
  d.bitcount -= num;
  return val + base;
}

/* given a data stream and a tree, decode a symbol */
function tinf_decode_symbol(d, t) {
  while (d.bitcount < 24) {
    d.tag |= d.source[d.sourceIndex++] << d.bitcount;
    d.bitcount += 8;
  }
  
  var sum = 0, cur = 0, len = 0;
  var tag = d.tag;

  /* get more bits while code value is above sum */
  do {
    cur = 2 * cur + (tag & 1);
    tag >>>= 1;
    ++len;

    sum += t.table[len];
    cur -= t.table[len];
  } while (cur >= 0);
  
  d.tag = tag;
  d.bitcount -= len;

  return t.trans[sum + cur];
}

/* given a data stream, decode dynamic trees from it */
function tinf_decode_trees(d, lt, dt) {
  var hlit, hdist, hclen;
  var i, num, length;

  /* get 5 bits HLIT (257-286) */
  hlit = tinf_read_bits(d, 5, 257);

  /* get 5 bits HDIST (1-32) */
  hdist = tinf_read_bits(d, 5, 1);

  /* get 4 bits HCLEN (4-19) */
  hclen = tinf_read_bits(d, 4, 4);

  for (i = 0; i < 19; ++i) lengths[i] = 0;

  /* read code lengths for code length alphabet */
  for (i = 0; i < hclen; ++i) {
    /* get 3 bits code length (0-7) */
    var clen = tinf_read_bits(d, 3, 0);
    lengths[clcidx[i]] = clen;
  }

  /* build code length tree */
  tinf_build_tree(code_tree, lengths, 0, 19);

  /* decode code lengths for the dynamic trees */
  for (num = 0; num < hlit + hdist;) {
    var sym = tinf_decode_symbol(d, code_tree);

    switch (sym) {
      case 16:
        /* copy previous code length 3-6 times (read 2 bits) */
        var prev = lengths[num - 1];
        for (length = tinf_read_bits(d, 2, 3); length; --length) {
          lengths[num++] = prev;
        }
        break;
      case 17:
        /* repeat code length 0 for 3-10 times (read 3 bits) */
        for (length = tinf_read_bits(d, 3, 3); length; --length) {
          lengths[num++] = 0;
        }
        break;
      case 18:
        /* repeat code length 0 for 11-138 times (read 7 bits) */
        for (length = tinf_read_bits(d, 7, 11); length; --length) {
          lengths[num++] = 0;
        }
        break;
      default:
        /* values 0-15 represent the actual code lengths */
        lengths[num++] = sym;
        break;
    }
  }

  /* build dynamic trees */
  tinf_build_tree(lt, lengths, 0, hlit);
  tinf_build_tree(dt, lengths, hlit, hdist);
}

/* ----------------------------- *
 * -- block inflate functions -- *
 * ----------------------------- */

/* given a stream and two trees, inflate a block of data */
function tinf_inflate_block_data(d, lt, dt) {
  while (1) {
    var sym = tinf_decode_symbol(d, lt);

    /* check for end of block */
    if (sym === 256) {
      return TINF_OK;
    }

    if (sym < 256) {
      d.dest[d.destLen++] = sym;
    } else {
      var length, dist, offs;
      var i;

      sym -= 257;

      /* possibly get more bits from length code */
      length = tinf_read_bits(d, length_bits[sym], length_base[sym]);

      dist = tinf_decode_symbol(d, dt);

      /* possibly get more bits from distance code */
      offs = d.destLen - tinf_read_bits(d, dist_bits[dist], dist_base[dist]);

      /* copy match */
      for (i = offs; i < offs + length; ++i) {
        d.dest[d.destLen++] = d.dest[i];
      }
    }
  }
}

/* inflate an uncompressed block of data */
function tinf_inflate_uncompressed_block(d) {
  var length, invlength;
  var i;
  
  /* unread from bitbuffer */
  while (d.bitcount > 8) {
    d.sourceIndex--;
    d.bitcount -= 8;
  }

  /* get length */
  length = d.source[d.sourceIndex + 1];
  length = 256 * length + d.source[d.sourceIndex];

  /* get one's complement of length */
  invlength = d.source[d.sourceIndex + 3];
  invlength = 256 * invlength + d.source[d.sourceIndex + 2];

  /* check length */
  if (length !== (~invlength & 0x0000ffff))
    return TINF_DATA_ERROR;

  d.sourceIndex += 4;

  /* copy block */
  for (i = length; i; --i)
    d.dest[d.destLen++] = d.source[d.sourceIndex++];

  /* make sure we start next block on a byte boundary */
  d.bitcount = 0;

  return TINF_OK;
}

/* inflate stream from source to dest */
function tinf_uncompress(source, dest) {
  var d = new Data(source, dest);
  var bfinal, btype, res;

  do {
    /* read final block flag */
    bfinal = tinf_getbit(d);

    /* read block type (2 bits) */
    btype = tinf_read_bits(d, 2, 0);

    /* decompress block */
    switch (btype) {
      case 0:
        /* decompress uncompressed block */
        res = tinf_inflate_uncompressed_block(d);
        break;
      case 1:
        /* decompress block with fixed huffman trees */
        res = tinf_inflate_block_data(d, sltree, sdtree);
        break;
      case 2:
        /* decompress block with dynamic huffman trees */
        tinf_decode_trees(d, d.ltree, d.dtree);
        res = tinf_inflate_block_data(d, d.ltree, d.dtree);
        break;
      default:
        res = TINF_DATA_ERROR;
    }

    if (res !== TINF_OK)
      throw new Error('Data error');

  } while (!bfinal);

  if (d.destLen < d.dest.length) {
    if (typeof d.dest.slice === 'function')
      return d.dest.slice(0, d.destLen);
    else
      return d.dest.subarray(0, d.destLen);
  }
  
  return d.dest;
}

/* -------------------- *
 * -- initialization -- *
 * -------------------- */

/* build fixed huffman trees */
tinf_build_fixed_trees(sltree, sdtree);

/* build extra bits and base tables */
tinf_build_bits_base(length_bits, length_base, 4, 3);
tinf_build_bits_base(dist_bits, dist_base, 2, 1);

/* fix a special case */
length_bits[28] = 0;
length_base[28] = 258;

module.exports = tinf_uncompress;


/***/ }),

/***/ "./node_modules/ultimate-text-to-image/build/BaseClass.js":
/*!****************************************************************!*\
  !*** ./node_modules/ultimate-text-to-image/build/BaseClass.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BaseClass = void 0;
const fs_1 = __importDefault(__webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'fs'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())));
const utils_1 = __webpack_require__(/*! ./utils */ "./node_modules/ultimate-text-to-image/build/utils/index.js");
class BaseClass {
    constructor() {
        this.options = {};
        this._renderedTime = 0;
        this._before = [0, 0];
    }
    get hasRendered() {
        return !!this._canvas;
    }
    get canvas() {
        this._checkHasRendered();
        return this._canvas;
    }
    get renderedTime() {
        this._checkHasRendered();
        return this._renderedTime;
    }
    get width() {
        this._checkHasRendered();
        return this.canvas.width;
    }
    get height() {
        this._checkHasRendered();
        return this.canvas.height;
    }
    render() {
        return this;
    }
    toDataUrl(mineType = "image/png", options) {
        this._checkHasRendered();
        if (mineType === "image/png") {
            return this.canvas.toDataURL("image/png");
        }
        else {
            return this.canvas.toDataURL("image/jpeg", options === null || options === void 0 ? void 0 : options.quality);
        }
    }
    toBuffer(mineType = "image/png", options) {
        this._checkHasRendered();
        if (mineType === "image/png") {
            return this.canvas.toBuffer("image/png", options);
        }
        else {
            return this.canvas.toBuffer("image/jpeg", options);
        }
    }
    toFile(filename, mineType = "", options) {
        this._checkHasRendered();
        if (!mineType) {
            if (filename.match(/\.jpg$|\.jpeg$/i)) {
                mineType = "image/jpeg";
            }
            else {
                mineType = "image/png";
            }
        }
        const buffer = this.toBuffer(mineType, options);
        fs_1.default.writeFileSync(filename, buffer);
    }
    toStream(mineType = "image/png", options) {
        this._checkHasRendered();
        if (mineType === "image/png") {
            return this.canvas.createPNGStream(options);
        }
        else {
            return this.canvas.createJPEGStream(options);
        }
    }
    _checkHasRendered() {
        if (!this.hasRendered) {
            throw new Error(`Please run render() first!`);
        }
    }
    _startTimer() {
        this._before = (0, utils_1.hrtime)();
    }
    _endTimer() {
        const diff = (0, utils_1.hrtime)(this._before);
        this._renderedTime = diff[0] * 1000 + (diff[1] / 1000000);
    }
}
exports.BaseClass = BaseClass;


/***/ }),

/***/ "./node_modules/ultimate-text-to-image/build/HorizontalImage.js":
/*!**********************************************************************!*\
  !*** ./node_modules/ultimate-text-to-image/build/HorizontalImage.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HorizontalImage = void 0;
const canvas_1 = __webpack_require__(/*! canvas */ "./node_modules/canvas/browser.js");
const BaseClass_1 = __webpack_require__(/*! ./BaseClass */ "./node_modules/ultimate-text-to-image/build/BaseClass.js");
const canvas_2 = __webpack_require__(/*! ./utils/canvas */ "./node_modules/ultimate-text-to-image/build/utils/canvas.js");
class HorizontalImage extends BaseClass_1.BaseClass {
    constructor(ultimateTextToImages, options = {}, renderOptions = {}) {
        super();
        this.ultimateTextToImages = ultimateTextToImages;
        this.options = options;
        this.renderOptions = renderOptions;
    }
    render() {
        this._startTimer();
        const { backgroundColor } = this.options;
        const margin = this.options.margin || 0;
        for (const ultimateTextToImage of this.ultimateTextToImages) {
            ultimateTextToImage.render();
        }
        const width = this.ultimateTextToImages.reduce((a, b) => a + b.width, 0) + margin * 2;
        const height = this.ultimateTextToImages
            .reduce((a, b) => Math.max(a, b.height), 0) + margin * 2;
        this._canvas = new canvas_1.Canvas(width, height);
        const ctx = this._canvas.getContext("2d");
        // hook
        (0, canvas_2.renderHook)(this._canvas, this.renderOptions.preRender);
        // draw background
        (0, canvas_2.drawBackgroundColor)(ctx, { color: backgroundColor });
        let x = margin;
        let y = 0;
        for (const ultimateTextToImage of this.ultimateTextToImages) {
            let valign = this.options.valign;
            if (ultimateTextToImage.options.nestedValign) {
                valign = ultimateTextToImage.options.nestedValign;
            }
            if (valign === "bottom") {
                y = height - ultimateTextToImage.height - margin;
            }
            else if (valign === "middle") {
                y = (height - ultimateTextToImage.height) / 2;
            }
            else {
                y = margin;
            }
            ctx.drawImage(ultimateTextToImage.canvas, x, y);
            x += ultimateTextToImage.width;
        }
        // hook
        (0, canvas_2.renderHook)(this._canvas, this.renderOptions.posRender);
        this._endTimer();
        return this;
    }
}
exports.HorizontalImage = HorizontalImage;


/***/ }),

/***/ "./node_modules/ultimate-text-to-image/build/Measurable.js":
/*!*****************************************************************!*\
  !*** ./node_modules/ultimate-text-to-image/build/Measurable.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Measurable = void 0;
const canvas_1 = __webpack_require__(/*! canvas */ "./node_modules/canvas/browser.js");
const UnicodeLineBreak_1 = __webpack_require__(/*! ./UnicodeLineBreak */ "./node_modules/ultimate-text-to-image/build/UnicodeLineBreak.js");
const utils_1 = __webpack_require__(/*! ./utils */ "./node_modules/ultimate-text-to-image/build/utils/index.js");
class Measurable {
    constructor() {
        this.caches = new Map();
    }
    clearCache() {
        this.caches.clear();
    }
    getMeasuredParagraph(options) {
        const canvas = (0, canvas_1.createCanvas)(100, 100);
        const ctx = canvas.getContext("2d");
        return this.testBestMeasuredParagraph(Object.assign({ ctx }, options));
    }
    // the logic below may cause the last checking run one more time (but it's ok since things are cached)
    testBestMeasuredParagraph(options) {
        const { maxWidth, maxHeight, maxFontSize, minFontSize, fontSize } = options, otherOptions = __rest(options, ["maxWidth", "maxHeight", "maxFontSize", "minFontSize", "fontSize"]);
        const measuredParagraph = this.testMeasuredParagraph(Object.assign(Object.assign({}, otherOptions), { maxWidth, fontSize }));
        const currentHeight = options.useGlyphPadding ? measuredParagraph.boundingHeight : measuredParagraph.height;
        const currentWidth = options.useGlyphPadding ? measuredParagraph.boundingWidth : measuredParagraph.width;
        // if height is within range
        if (currentHeight <= maxHeight && currentWidth <= maxWidth) {
            // we still can try to do searching
            if (options.maxFontSize > measuredParagraph.fontSize) {
                const newFontSize = Math.ceil((options.fontSize + options.maxFontSize) / 2);
                return this.testBestMeasuredParagraph(Object.assign(Object.assign({}, options), { fontSize: newFontSize, minFontSize: measuredParagraph.fontSize }));
            }
            else {
                return measuredParagraph;
            }
        }
        else {
            // if we have smaller available font size
            if (options.minFontSize < measuredParagraph.fontSize) {
                // we try an Log(N) guess
                const newFontSize = Math.floor((options.fontSize + options.minFontSize) / 2);
                return this.testBestMeasuredParagraph(Object.assign(Object.assign({}, options), { fontSize: newFontSize, maxFontSize: measuredParagraph.fontSize - 1 }));
            }
            else {
                return measuredParagraph;
            }
        }
    }
    // give information of all the lines
    testMeasuredParagraph(options) {
        const { ctx, text, noAutoWrap, fontFamily, fontStyle, fontWeight, fontSize, lineHeight, lineHeightMultiplier, autoWrapLineHeight, autoWrapLineHeightMultiplier, useGlyphPadding, } = options;
        const measuredWords = this.testMeasureWords({ ctx, text, fontStyle, fontWeight, fontSize, fontFamily });
        const maxWidth = options.maxWidth;
        // prepare settings
        const finalLineHeight = Math.round(typeof lineHeight === "number" ? lineHeight :
            (typeof lineHeightMultiplier === "number" ? fontSize * lineHeightMultiplier : fontSize));
        const finalAutoWrapLineHeight = Math.round(typeof autoWrapLineHeight === "number" ? autoWrapLineHeight :
            (typeof autoWrapLineHeightMultiplier === "number" ? fontSize * autoWrapLineHeightMultiplier : finalLineHeight));
        // find space width first
        const measuredSpace = this.testMeasuredWord(Object.assign(Object.assign({}, options), { text: " " }));
        const spaceWidth = measuredSpace.width;
        // prepare canvas
        let measuredLine = {
            text: "",
            width: 0,
            paddingTop: -fontSize,
            paddingBottom: 0,
            paddingLeft: 0,
            paddingRight: 0,
            nextLineHeight: 0,
            measuredWords: [],
        };
        const measuredParagraph = {
            text,
            width: 0,
            height: 0,
            fontSize,
            fontFamily,
            fontStyle,
            fontWeight,
            spaceWidth,
            boundingHeight: 0,
            boundingWidth: 0,
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            paddingRight: 0,
            measuredLines: [],
        };
        let lastMeasuredWord;
        for (const measuredWord of measuredWords) {
            // we get the last word spacing information
            let lastWordTotalSpaceWidth = 0;
            let lastWordSpaceCount = 0;
            if (lastMeasuredWord && !lastMeasuredWord.hasLineBreak) {
                lastWordTotalSpaceWidth = lastMeasuredWord.endingSpaceCount * spaceWidth;
                lastWordSpaceCount = lastMeasuredWord.endingSpaceCount;
            }
            // choose which width for calculation
            let currentWidth = measuredLine.width + lastWordTotalSpaceWidth + measuredWord.width;
            if (useGlyphPadding) {
                currentWidth += measuredWord.paddingLeft + measuredWord.paddingRight;
            }
            // if we have auto Wrap & make sure each line within max width
            if (!noAutoWrap && currentWidth > maxWidth) {
                // we go into another line the line contains something already
                if (measuredLine.text) {
                    measuredLine.nextLineHeight = finalAutoWrapLineHeight;
                    measuredParagraph.measuredLines.push(measuredLine);
                }
                // create new line
                measuredLine = {
                    text: measuredWord.text,
                    width: measuredWord.width,
                    paddingTop: measuredWord.paddingTop,
                    paddingBottom: measuredWord.paddingBottom,
                    paddingLeft: measuredWord.paddingLeft,
                    paddingRight: measuredWord.paddingRight,
                    nextLineHeight: 0,
                    measuredWords: [],
                };
            }
            else {
                // add the word
                measuredLine.text += (" ".repeat(lastWordSpaceCount) + measuredWord.text);
                measuredLine.paddingTop = Math.max(measuredLine.paddingTop, measuredWord.paddingTop);
                measuredLine.paddingBottom = Math.max(measuredLine.paddingBottom, measuredWord.paddingBottom);
                if (measuredLine.width === 0) {
                    measuredLine.paddingLeft = measuredWord.paddingLeft;
                }
                measuredLine.paddingRight = measuredWord.paddingRight;
                measuredLine.width = measuredLine.width + lastWordTotalSpaceWidth + measuredWord.width;
                measuredLine.measuredWords.push(measuredWord);
            }
            /// if it's not last word, do some further processing
            if (!measuredWord.isLastWord) {
                if (measuredWord.hasLineBreak) {
                    measuredLine.nextLineHeight = finalLineHeight;
                    measuredParagraph.measuredLines.push(measuredLine);
                    measuredLine = {
                        text: "",
                        width: 0,
                        paddingTop: -fontSize,
                        paddingBottom: 0,
                        paddingLeft: 0,
                        paddingRight: 0,
                        nextLineHeight: 0,
                        measuredWords: [],
                    };
                }
            }
            lastMeasuredWord = measuredWord;
        }
        // if we current measuredLine has width, add it
        if (measuredLine.width) {
            measuredParagraph.measuredLines.push(measuredLine);
        }
        // make sure we have lines
        // compute some final params
        const totalLines = measuredParagraph.measuredLines.length;
        if (totalLines) {
            measuredParagraph.width = measuredParagraph.measuredLines
                .reduce((a, b) => Math.max(a, b.width), 0);
            measuredParagraph.height = measuredParagraph.measuredLines
                .reduce((a, b) => a + b.nextLineHeight, measuredParagraph.fontSize);
            const paddingTop = measuredParagraph.measuredLines[0].paddingTop;
            const paddingBottom = measuredParagraph.measuredLines[totalLines - 1].paddingBottom;
            measuredParagraph.paddingTop = paddingTop;
            measuredParagraph.paddingBottom = paddingBottom;
            measuredParagraph.boundingHeight = measuredParagraph.height + paddingTop + paddingBottom;
            measuredParagraph.boundingWidth = measuredParagraph.measuredLines.reduce((a, b) => Math.max(a, b.width + b.paddingLeft + b.paddingRight), 0);
            measuredParagraph.paddingLeft = measuredParagraph.measuredLines.reduce((a, b) => Math.max(a, b.paddingLeft), -fontSize);
            measuredParagraph.paddingRight = measuredParagraph.measuredLines.reduce((a, b) => Math.max(a, b.paddingRight), -fontSize);
        }
        return measuredParagraph;
    }
    // give information for all the words
    testMeasureWords(options) {
        const measuredWords = [];
        const unicodeLineBreak = new UnicodeLineBreak_1.UnicodeLineBreak(options.text);
        for (const item of unicodeLineBreak) {
            const word = item.word;
            const trimmedWord = word.trimRight();
            const measuredWord = this.testMeasuredWord(Object.assign(Object.assign({}, options), { text: trimmedWord }));
            measuredWords.push({
                text: trimmedWord,
                width: measuredWord.width,
                paddingTop: measuredWord.paddingTop,
                paddingBottom: measuredWord.paddingBottom,
                paddingLeft: measuredWord.paddingLeft,
                paddingRight: measuredWord.paddingRight,
                endingSpaceCount: word.length - trimmedWord.length,
                isLastWord: item.isLastWord,
                hasLineBreak: item.hasLineBreak,
            });
        }
        return measuredWords;
    }
    testMeasuredWord(options) {
        const { ctx, text, fontStyle, fontWeight, fontSize, fontFamily } = options;
        const fontString = (0, utils_1.getFontString)({ fontStyle, fontWeight, fontSize, fontFamily });
        ctx.font = fontString;
        // create font family map if not exist
        if (!this.caches.has(fontString)) {
            this.caches.set(fontString, new Map());
        }
        // create font size map if not exist
        const fontFamilyMap = this.caches.get(fontString);
        if (!fontFamilyMap.has(fontSize)) {
            fontFamilyMap.set(fontSize, new Map());
        }
        // calculate the word width
        const fontSizeMap = fontFamilyMap.get(fontSize);
        if (!fontSizeMap.has(text)) {
            const measureText = ctx.measureText(text);
            let paddingLeft = measureText.actualBoundingBoxLeft;
            let paddingRight = measureText.actualBoundingBoxRight - measureText.width;
            // Special Handling: if this is reversed type of language
            if (measureText.width > 0 &&
                measureText.actualBoundingBoxLeft / measureText.width > 0.8 &&
                measureText.actualBoundingBoxRight / measureText.width < 0.2) {
                paddingLeft = measureText.actualBoundingBoxLeft - measureText.width;
                paddingRight = measureText.actualBoundingBoxRight;
            }
            // console.log(text, measureText);
            // console.log("measure", `${fontStyle}, left: ${paddingLeft}, right: ${paddingRight}, ${text}`);
            fontSizeMap.set(text, {
                text,
                width: measureText.width,
                paddingTop: measureText.actualBoundingBoxAscent - fontSize,
                paddingBottom: measureText.actualBoundingBoxDescent,
                paddingLeft,
                paddingRight,
            });
        }
        return fontSizeMap.get(text);
    }
}
exports.Measurable = Measurable;


/***/ }),

/***/ "./node_modules/ultimate-text-to-image/build/UltimateTextToImage.js":
/*!**************************************************************************!*\
  !*** ./node_modules/ultimate-text-to-image/build/UltimateTextToImage.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UltimateTextToImage = void 0;
const canvas_1 = __webpack_require__(/*! canvas */ "./node_modules/canvas/browser.js");
const BaseClass_1 = __webpack_require__(/*! ./BaseClass */ "./node_modules/ultimate-text-to-image/build/BaseClass.js");
const Measurable_1 = __webpack_require__(/*! ./Measurable */ "./node_modules/ultimate-text-to-image/build/Measurable.js");
const canvas_2 = __webpack_require__(/*! ./utils/canvas */ "./node_modules/ultimate-text-to-image/build/utils/canvas.js");
class UltimateTextToImage extends BaseClass_1.BaseClass {
    constructor(text, options = {}, renderOptions = {}) {
        super();
        this.text = text;
        this.options = options;
        this.renderOptions = renderOptions;
        this._defaultOptions = {
            width: undefined,
            height: undefined,
            maxWidth: undefined,
            maxHeight: undefined,
            noAutoWrap: false,
            fontFamily: "Arial",
            fontWeight: false,
            fontStyle: false,
            fontSize: 24,
            minFontSize: undefined,
            fontColor: "#333333",
            strokeSize: 0,
            strokeColor: "#000000",
            lineHeight: undefined,
            lineHeightMultiplier: undefined,
            autoWrapLineHeight: undefined,
            autoWrapLineHeightMultiplier: undefined,
            margin: 0,
            marginLeft: undefined,
            marginTop: undefined,
            marginRight: undefined,
            marginBottom: undefined,
            useGlyphPadding: true,
            chopOverflow: false,
            align: "left",
            valign: "top",
            alignToCenterIfHeightLE: 0,
            alignToCenterIfLinesLE: 0,
            borderColor: "#000000",
            borderSize: 0,
            backgroundColor: "",
            underlineSize: 0,
            underlineColor: "",
            images: [],
            nestedAlign: undefined,
            nestedValign: undefined,
        };
    }
    get measuredParagraph() {
        this._checkHasRendered();
        return this._measuredParagraph;
    }
    render() {
        this._startTimer();
        this._createCanvas();
        this._endTimer();
        return this;
    }
    // draw the image based on various options
    _createCanvas() {
        const text = this.text;
        // merge default options
        const options = Object.assign({}, this._defaultOptions, this.options);
        // prepare all variables
        const { height, width, noAutoWrap, fontFamily, fontStyle, fontWeight, fontSize, chopOverflow, useGlyphPadding, underlineSize, underlineColor, images, } = options;
        let { maxWidth, maxHeight, minFontSize } = options;
        // work on default values
        maxHeight = typeof maxHeight === "number" ? maxHeight : (typeof height === "number" ? height : UltimateTextToImage.maxSize);
        maxWidth = typeof maxWidth === "number" ? maxWidth : (typeof width === "number" ? width : UltimateTextToImage.maxSize);
        // update max size
        maxWidth = Math.max(width || 1, maxWidth);
        maxHeight = Math.max(height || 1, maxHeight);
        minFontSize = typeof minFontSize === "number" ? minFontSize : options.fontSize;
        const marginLeft = typeof options.marginLeft === "number" ? options.marginLeft : options.margin;
        const marginTop = typeof options.marginTop === "number" ? options.marginTop : options.margin;
        const marginRight = typeof options.marginRight === "number" ? options.marginRight : options.margin;
        const marginBottom = typeof options.marginBottom === "number" ? options.marginBottom : options.margin;
        // find the best measured paragraph
        const measuredParagraph = UltimateTextToImage.measurable.getMeasuredParagraph({
            text,
            maxWidth: maxWidth - marginLeft - marginRight,
            maxHeight: maxHeight - marginTop - marginBottom,
            noAutoWrap,
            fontFamily,
            fontStyle,
            fontWeight,
            maxFontSize: fontSize,
            minFontSize,
            fontSize,
            useGlyphPadding,
            lineHeight: options.lineHeight,
            lineHeightMultiplier: options.lineHeightMultiplier,
            autoWrapLineHeight: options.autoWrapLineHeight,
            autoWrapLineHeightMultiplier: options.autoWrapLineHeightMultiplier,
        });
        // prepared update varaibles
        const finalFontSize = measuredParagraph.fontSize;
        // update the alignments
        let finalValign = options.valign;
        let finalAlign = options.align;
        const desiredCanvasHeight = measuredParagraph.height + marginTop + marginBottom;
        const desiredCanvasBoundingHeight = measuredParagraph.boundingHeight + marginTop + marginBottom;
        const desiredCanvasWidth = measuredParagraph.width + marginLeft + marginRight;
        const desiredCanvasBoundingWidth = measuredParagraph.boundingWidth + marginLeft + marginRight;
        let finalHeight = Math.max(typeof height === "number" ? height : desiredCanvasHeight, Math.min(maxHeight, desiredCanvasHeight));
        let finalWidth = Math.max(typeof width === "number" ? width : desiredCanvasWidth, Math.min(maxWidth, desiredCanvasWidth));
        if (options.alignToCenterIfHeightLE && measuredParagraph.height <= options.alignToCenterIfHeightLE) {
            finalValign = "middle";
            finalAlign = "center";
        }
        if (options.alignToCenterIfLinesLE && measuredParagraph.measuredLines.length <= options.alignToCenterIfLinesLE) {
            finalValign = "middle";
            finalAlign = "center";
        }
        // if we want more precise spacing
        if (useGlyphPadding) {
            finalHeight = Math.max(typeof height === "number" ? height : desiredCanvasBoundingHeight, Math.min(maxHeight, desiredCanvasBoundingHeight));
            finalWidth = Math.max(typeof width === "number" ? width : desiredCanvasBoundingWidth, Math.min(maxWidth, desiredCanvasBoundingWidth));
        }
        // update the object values
        finalWidth = Math.max(1, finalWidth);
        finalHeight = Math.max(1, finalHeight);
        this._measuredParagraph = measuredParagraph;
        this._canvas = (0, canvas_1.createCanvas)(finalWidth, finalHeight);
        const ctx = this._canvas.getContext("2d");
        // hook
        (0, canvas_2.renderHook)(this._canvas, this.renderOptions.preRender);
        // draw images
        (0, canvas_2.drawImages)(ctx, { width: finalWidth, height: finalHeight, layer: -1, images });
        // draw background
        (0, canvas_2.drawBackgroundColor)(ctx, { color: options.backgroundColor });
        // draw border
        (0, canvas_2.drawBorder)(ctx, { color: options.borderColor, size: options.borderSize });
        // draw images
        (0, canvas_2.drawImages)(ctx, { width: finalWidth, height: finalHeight, layer: 0, images });
        // draw texts
        (0, canvas_2.drawTexts)(ctx, {
            measuredParagraph,
            width: finalWidth,
            height: finalHeight,
            fontFamily,
            fontStyle: options.fontStyle,
            fontWeight: options.fontWeight,
            fontSize: finalFontSize,
            fontColor: options.fontColor,
            strokeSize: options.strokeSize,
            strokeColor: options.strokeColor,
            valign: finalValign,
            align: finalAlign,
            // margin: options.margin,
            marginLeft,
            marginTop,
            marginRight,
            marginBottom,
            chopOverflow,
            useGlyphPadding,
            underlineSize,
            underlineColor,
        });
        (0, canvas_2.drawImages)(ctx, { width: finalWidth, height: finalHeight, layer: 1, images });
        // hook
        (0, canvas_2.renderHook)(this._canvas, this.renderOptions.posRender);
        return this._canvas;
    }
}
exports.UltimateTextToImage = UltimateTextToImage;
UltimateTextToImage.measurable = new Measurable_1.Measurable();
UltimateTextToImage.maxSize = 2 << 14 - 1;


/***/ }),

/***/ "./node_modules/ultimate-text-to-image/build/UnicodeLineBreak.js":
/*!***********************************************************************!*\
  !*** ./node_modules/ultimate-text-to-image/build/UnicodeLineBreak.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UnicodeLineBreak = void 0;
// tslint:disable-next-line:no-var-requires variable-name
const LineBreakNext = __webpack_require__(/*! linebreak-next */ "./node_modules/linebreak-next/src/linebreaker-browser.js");
class UnicodeLineBreak {
    constructor(text) {
        this.text = text;
        //
    }
    getResults() {
        const results = [];
        for (const item of this) {
            results.push(item);
        }
        return results;
    }
    [Symbol.iterator]() {
        const text = this.text;
        const lineBreaker = new LineBreakNext(text);
        let last = 0;
        return {
            next: () => {
                const bk = lineBreaker.nextBreak();
                if (!bk) {
                    return { value: undefined, done: true };
                }
                const word = text
                    .slice(last, bk.position)
                    .replace(/(\r?\n)*$/, "");
                const index = last;
                const isLastWord = bk.position === text.length;
                last = bk.position;
                return { value: { word, index, hasLineBreak: bk.required, isLastWord }, done: false };
            },
        };
    }
}
exports.UnicodeLineBreak = UnicodeLineBreak;


/***/ }),

/***/ "./node_modules/ultimate-text-to-image/build/VerticalImage.js":
/*!********************************************************************!*\
  !*** ./node_modules/ultimate-text-to-image/build/VerticalImage.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VerticalImage = void 0;
const canvas_1 = __webpack_require__(/*! canvas */ "./node_modules/canvas/browser.js");
const BaseClass_1 = __webpack_require__(/*! ./BaseClass */ "./node_modules/ultimate-text-to-image/build/BaseClass.js");
const canvas_2 = __webpack_require__(/*! ./utils/canvas */ "./node_modules/ultimate-text-to-image/build/utils/canvas.js");
class VerticalImage extends BaseClass_1.BaseClass {
    constructor(ultimateTextToImages, options = {}, renderOptions = {}) {
        super();
        this.ultimateTextToImages = ultimateTextToImages;
        this.options = options;
        this.renderOptions = renderOptions;
    }
    render() {
        this._startTimer();
        const { backgroundColor } = this.options;
        const margin = this.options.margin || 0;
        for (const ultimateTextToImage of this.ultimateTextToImages) {
            ultimateTextToImage.render();
        }
        const width = this.ultimateTextToImages
            .reduce((a, b) => Math.max(a, b.width), 0) + margin * 2;
        const height = this.ultimateTextToImages.reduce((a, b) => a + b.height, 0) + margin * 2;
        this._canvas = new canvas_1.Canvas(width, height);
        const ctx = this._canvas.getContext("2d");
        // hook
        (0, canvas_2.renderHook)(this._canvas, this.renderOptions.preRender);
        // draw background
        (0, canvas_2.drawBackgroundColor)(ctx, { color: backgroundColor });
        let x = 0;
        let y = margin;
        for (const ultimateTextToImage of this.ultimateTextToImages) {
            let align = this.options.align;
            if (ultimateTextToImage.options.nestedAlign) {
                align = ultimateTextToImage.options.nestedAlign;
            }
            if (align === "right") {
                x = width - ultimateTextToImage.width - margin;
            }
            else if (align === "center") {
                x = (width - ultimateTextToImage.width) / 2;
            }
            else {
                x = margin;
            }
            ctx.drawImage(ultimateTextToImage.canvas, x, y);
            y += ultimateTextToImage.height;
        }
        // hook
        (0, canvas_2.renderHook)(this._canvas, this.renderOptions.posRender);
        this._endTimer();
        return this;
    }
}
exports.VerticalImage = VerticalImage;


/***/ }),

/***/ "./node_modules/ultimate-text-to-image/build/getCanvasImage.js":
/*!*********************************************************************!*\
  !*** ./node_modules/ultimate-text-to-image/build/getCanvasImage.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getCanvasImage = void 0;
const canvas = __importStar(__webpack_require__(/*! canvas */ "./node_modules/canvas/browser.js"));
const simple_get_1 = __webpack_require__(/*! simple-get */ "./node_modules/simple-get/index.js");
const getCanvasImage = (options) => __awaiter(void 0, void 0, void 0, function* () {
    if (options.buffer) {
        const newBase64 = `data:image/jpg;base64,${options.buffer.toString("base64")}`;
        return yield canvas.loadImage(newBase64);
    }
    else if (options.arrayBuffer) {
        const newBase64 = `data:image/jpg;base64,${Buffer.from(options.arrayBuffer).toString("base64")}`;
        return yield canvas.loadImage(newBase64);
    }
    else if (options.url) {
        try {
            const buffer = yield new Promise((resolve, reject) => {
                (0, simple_get_1.concat)(options.url, (err, res, data) => {
                    if (err) {
                        return reject(err);
                    }
                    if (res.statusCode !== 200) {
                        return reject(new Error("Invalid Image"));
                    }
                    resolve(data);
                });
            });
            const newBase64 = `data:image/jpg;base64,${buffer.toString("base64")}`;
            return yield canvas.loadImage(newBase64);
        }
        catch (err) {
            // ignore error
        }
        yield new Promise(resolve => setTimeout(resolve, 1000));
    }
    else if (options.base64) {
        const base64 = options.base64;
        if (base64.indexOf("data:") === 0) {
            return yield canvas.loadImage(base64);
        }
        else {
            const newBase64 = `data:image/jpg;base64,${base64}`;
            return yield canvas.loadImage(newBase64);
        }
    }
    throw new Error("Invalid Image");
});
exports.getCanvasImage = getCanvasImage;


/***/ }),

/***/ "./node_modules/ultimate-text-to-image/build/index.js":
/*!************************************************************!*\
  !*** ./node_modules/ultimate-text-to-image/build/index.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UnicodeLineBreak = exports.VerticalImage = exports.HorizontalImage = exports.UltimateTextToImage = exports.registerFont = exports.getCanvasImage = void 0;
const getCanvasImage_1 = __webpack_require__(/*! ./getCanvasImage */ "./node_modules/ultimate-text-to-image/build/getCanvasImage.js");
Object.defineProperty(exports, "getCanvasImage", ({ enumerable: true, get: function () { return getCanvasImage_1.getCanvasImage; } }));
const HorizontalImage_1 = __webpack_require__(/*! ./HorizontalImage */ "./node_modules/ultimate-text-to-image/build/HorizontalImage.js");
Object.defineProperty(exports, "HorizontalImage", ({ enumerable: true, get: function () { return HorizontalImage_1.HorizontalImage; } }));
const registerFont_1 = __webpack_require__(/*! ./registerFont */ "./node_modules/ultimate-text-to-image/build/registerFont.js");
Object.defineProperty(exports, "registerFont", ({ enumerable: true, get: function () { return registerFont_1.registerFont; } }));
const UltimateTextToImage_1 = __webpack_require__(/*! ./UltimateTextToImage */ "./node_modules/ultimate-text-to-image/build/UltimateTextToImage.js");
Object.defineProperty(exports, "UltimateTextToImage", ({ enumerable: true, get: function () { return UltimateTextToImage_1.UltimateTextToImage; } }));
const UnicodeLineBreak_1 = __webpack_require__(/*! ./UnicodeLineBreak */ "./node_modules/ultimate-text-to-image/build/UnicodeLineBreak.js");
Object.defineProperty(exports, "UnicodeLineBreak", ({ enumerable: true, get: function () { return UnicodeLineBreak_1.UnicodeLineBreak; } }));
const VerticalImage_1 = __webpack_require__(/*! ./VerticalImage */ "./node_modules/ultimate-text-to-image/build/VerticalImage.js");
Object.defineProperty(exports, "VerticalImage", ({ enumerable: true, get: function () { return VerticalImage_1.VerticalImage; } }));


/***/ }),

/***/ "./node_modules/ultimate-text-to-image/build/registerFont.js":
/*!*******************************************************************!*\
  !*** ./node_modules/ultimate-text-to-image/build/registerFont.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.registerFont = void 0;
const canvas = __importStar(__webpack_require__(/*! canvas */ "./node_modules/canvas/browser.js"));
const crypto_1 = __importDefault(__webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'crypto'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())));
const registerFont = (filename, options) => {
    const family = (options === null || options === void 0 ? void 0 : options.family) || generateRandomString(16);
    const weight = typeof (options === null || options === void 0 ? void 0 : options.weight) === "boolean" ? (options.weight ? "bold" : undefined) : ((options === null || options === void 0 ? void 0 : options.weight) ? options.weight.toString() : undefined);
    const style = typeof (options === null || options === void 0 ? void 0 : options.style) === "boolean" ? (options.style ? "italic" : undefined) : ((options === null || options === void 0 ? void 0 : options.style) ? options.style : undefined);
    canvas.registerFont(filename, { family, weight, style });
};
exports.registerFont = registerFont;
function generateRandomString(length) {
    const value = crypto_1.default.randomBytes(Math.ceil(length / 2)).toString("hex");
    return value.substr(0, length);
}


/***/ }),

/***/ "./node_modules/ultimate-text-to-image/build/utils/canvas.js":
/*!*******************************************************************!*\
  !*** ./node_modules/ultimate-text-to-image/build/utils/canvas.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.drawTexts = exports.drawImages = exports.drawBorder = exports.drawBackgroundColor = exports.renderHook = void 0;
const canvas_1 = __webpack_require__(/*! canvas */ "./node_modules/canvas/browser.js");
const index_1 = __webpack_require__(/*! ./index */ "./node_modules/ultimate-text-to-image/build/utils/index.js");
/** @internal */
function renderHook(canvas, hook) {
    if (hook) {
        hook(canvas);
    }
}
exports.renderHook = renderHook;
/** @internal */
function drawBackgroundColor(ctx, options) {
    if (options.color || typeof options.color === "number") {
        const { width, height } = ctx.canvas;
        ctx.fillStyle = (0, index_1.parseColorString)(options.color);
        ctx.fillRect(0, 0, width, height);
    }
}
exports.drawBackgroundColor = drawBackgroundColor;
/** @internal */
function drawBorder(ctx, options) {
    if (options.size && (options.color || typeof options.color === "number")) {
        const { width, height } = ctx.canvas;
        ctx.strokeStyle = (0, index_1.parseColorString)(options.color);
        // multiple by 2 since it's align to center
        ctx.lineWidth = options.size * 2;
        ctx.strokeRect(0, 0, width, height);
    }
}
exports.drawBorder = drawBorder;
/** @internal */
function drawImages(ctx, options) {
    const { images } = options;
    const canvasWidth = options.width | 0;
    const canvasHeight = options.height | 0;
    for (const imageSetting of images) {
        const { canvasImage, repeat, sx, sy, tx, ty } = imageSetting;
        const layer = imageSetting.layer || 0;
        // make sure it's a valid image
        if (!canvasImage || !canvasImage.width || !canvasImage.height) {
            continue;
        }
        // check the layer
        if (layer !== options.layer) {
            continue;
        }
        // prepare all dimensions
        const imageWidth = canvasImage.width;
        const imageHeight = canvasImage.height;
        const tempWidth = imageSetting.width === "image" ? imageWidth : (imageSetting.width === "canvas" ? canvasWidth : (imageSetting.width || 0));
        const tempHeight = imageSetting.height === "image" ? imageHeight : (imageSetting.height === "canvas" ? canvasHeight : (imageSetting.height || 0));
        const x = typeof sx === "number" ? (sx >= 0 ? sx : canvasWidth + sx) : (imageSetting.x || 0);
        const y = typeof sy === "number" ? (sy >= 0 ? sy : canvasHeight + sy) : (imageSetting.y || 0);
        const width = typeof tx === "number" ? (tx > 0 ? tx : canvasWidth + tx) - x : (tempWidth || canvasWidth - x);
        const height = typeof ty === "number" ? (ty > 0 ? ty : canvasHeight + ty) - y : (tempHeight || canvasHeight - y);
        // skip if invalid
        if (width <= 0 || height <= 0) {
            continue;
        }
        if (!repeat || repeat === "none" || repeat === "topLeft") {
            ctx.drawImage(canvasImage, 0, 0, width, height, x, y, width, height);
        }
        else if (repeat === "topCenter") {
            const sx1 = (imageWidth - width) / 2;
            ctx.drawImage(canvasImage, sx1, 0, width, height, x, y, width, height);
        }
        else if (repeat === "topRight") {
            const sx1 = imageWidth - width;
            ctx.drawImage(canvasImage, sx1, 0, width, height, x, y, width, height);
        }
        else if (repeat === "middleLeft") {
            const sy1 = (imageHeight - height) / 2;
            ctx.drawImage(canvasImage, 0, sy1, width, height, x, y, width, height);
        }
        else if (repeat === "center") {
            const sx1 = (imageWidth - width) / 2;
            const sy1 = (imageHeight - height) / 2;
            ctx.drawImage(canvasImage, sx1, sy1, width, height, x, y, width, height);
        }
        else if (repeat === "middleRight") {
            const sx1 = imageWidth - width;
            const sy1 = (imageHeight - height) / 2;
            ctx.drawImage(canvasImage, sx1, sy1, width, height, x, y, width, height);
        }
        else if (repeat === "bottomLeft") {
            const sy1 = imageHeight - height;
            ctx.drawImage(canvasImage, 0, sy1, width, height, x, y, width, height);
        }
        else if (repeat === "bottomCenter") {
            const sx1 = (imageWidth - width) / 2;
            const sy1 = imageHeight - height;
            ctx.drawImage(canvasImage, sx1, sy1, width, height, x, y, width, height);
        }
        else if (repeat === "bottomRight") {
            const sx1 = imageWidth - width;
            const sy1 = imageHeight - height;
            ctx.drawImage(canvasImage, sx1, sy1, width, height, x, y, width, height);
        }
        else if (repeat === "fit") {
            ctx.drawImage(canvasImage, 0, 0, imageWidth, imageHeight, x, y, width, height);
        }
        else if (repeat === "fitX") {
            const finalImageHeight = Math.min(height, imageHeight);
            ctx.drawImage(canvasImage, 0, 0, imageWidth, finalImageHeight, x, y, width, finalImageHeight);
        }
        else if (repeat === "fitY") {
            const finalImageWidth = Math.min(x + width - x, imageWidth);
            ctx.drawImage(canvasImage, 0, 0, finalImageWidth, imageHeight, x, y, finalImageWidth, height);
        }
        else if (repeat === "repeat") {
            for (let y1 = y; y1 < y + height; y1 += imageHeight) {
                for (let x1 = x; x1 < x + width; x1 += imageWidth) {
                    const finalImageWidth = Math.min(x + width - x1, imageWidth);
                    const finalImageHeight = Math.min(y + height - y1, imageHeight);
                    ctx.drawImage(canvasImage, 0, 0, finalImageWidth, finalImageHeight, x1, y1, finalImageWidth, finalImageHeight);
                }
            }
        }
        else if (repeat === "repeatY") {
            for (let y1 = y; y1 < y + height; y1 += imageHeight) {
                const finalImageWidth = Math.min(x + width - x, imageWidth);
                const finalImageHeight = Math.min(y + height - y1, imageHeight);
                ctx.drawImage(canvasImage, 0, 0, finalImageWidth, finalImageHeight, x, y1, finalImageWidth, finalImageHeight);
            }
        }
        else if (repeat === "repeatX") {
            for (let x1 = x; x1 < x + width; x1 += imageWidth) {
                const finalImageWidth = Math.min(x + width - x1, imageWidth);
                const finalImageHeight = Math.min(y + height - y, imageHeight);
                ctx.drawImage(canvasImage, 0, 0, finalImageWidth, finalImageHeight, x1, y, finalImageWidth, finalImageHeight);
            }
        }
    }
}
exports.drawImages = drawImages;
/** @internal */
function drawTexts(ctx, options) {
    const { measuredParagraph, width, height, fontFamily, fontStyle, fontWeight, fontSize, fontColor, strokeSize, strokeColor, valign, align, marginLeft, marginTop, marginRight, marginBottom, chopOverflow, useGlyphPadding, underlineSize, underlineColor, } = options;
    // return immediately if nothing to draw
    if (!measuredParagraph.measuredLines.length) {
        return;
    }
    const textCanvasWidth = useGlyphPadding ? measuredParagraph.boundingWidth : measuredParagraph.width;
    const textCanvasHeight = useGlyphPadding ? measuredParagraph.boundingHeight : measuredParagraph.height;
    // we add extra height (just fontSize) to make sure we able to draw characters with boxDescent
    const renderMargin = Math.round(fontSize / 2);
    const textCanvas = (0, canvas_1.createCanvas)(textCanvasWidth + renderMargin * 2, textCanvasHeight + renderMargin * 2);
    const parsedFontColor = (0, index_1.parseColorString)(fontColor);
    const parsedUnderlineStyle = (0, index_1.parseColorString)(underlineColor);
    const textCtx = textCanvas.getContext("2d");
    textCtx.font = (0, index_1.getFontString)({ fontStyle, fontWeight, fontSize, fontFamily });
    // we draw everything cuz align may need to display different parts (this can be optimized a bit if necessary)
    let y = useGlyphPadding ? fontSize + measuredParagraph.measuredLines[0].paddingTop : fontSize;
    for (const measuredLine of measuredParagraph.measuredLines) {
        let x = 0;
        if (align === "center") {
            x = (textCanvasWidth - measuredLine.width) / 2;
            if (useGlyphPadding) {
                x = (textCanvasWidth - (measuredLine.width - measuredLine.paddingLeft + measuredLine.paddingRight)) / 2;
            }
        }
        else if (align === "right") {
            x = textCanvasWidth - measuredLine.width;
            if (useGlyphPadding) {
                x = textCanvasWidth - measuredLine.width - measuredParagraph.paddingRight;
            }
        }
        else {
            if (useGlyphPadding) {
                x = measuredParagraph.paddingLeft;
            }
        }
        // draw underline
        if (underlineSize) {
            textCtx.fillStyle = parsedUnderlineStyle;
            textCtx.fillRect(x + renderMargin, y + renderMargin, measuredLine.width, underlineSize);
        }
        // draw the text
        textCtx.fillStyle = parsedFontColor;
        textCtx.fillText(measuredLine.text, x + renderMargin, y + renderMargin);
        // draw the stoke if have
        if (strokeSize) {
            textCtx.strokeStyle = (0, index_1.parseColorString)(strokeColor);
            textCtx.lineWidth = strokeSize;
            textCtx.strokeText(measuredLine.text, x + renderMargin, y + renderMargin);
        }
        // advance y
        y += (measuredLine.nextLineHeight);
    }
    // // if we want more precise spacing
    let sx = 0;
    let sy = 0;
    let tx = 0;
    let ty = 0;
    let sWidth = width;
    let sHeight = height;
    // measure what to display for align
    if (align === "right") {
        sx = textCanvasWidth - width + marginRight;
        if (chopOverflow) {
            tx += marginLeft;
            sx += marginLeft;
            sWidth = width - marginLeft - marginRight;
        }
    }
    else if (align === "center") {
        sx = (textCanvasWidth - width - marginLeft + marginRight) / 2;
        if (chopOverflow) {
            tx += marginLeft;
            sx += marginLeft;
            sWidth = width - marginLeft - marginRight;
        }
    }
    else { // left
        sx = -marginLeft;
        if (chopOverflow) {
            sWidth = width - marginRight;
        }
    }
    // measure what to display for valign
    if (valign === "bottom") {
        sy = textCanvasHeight - height + marginBottom;
        if (chopOverflow) {
            ty += marginTop;
            sy += marginTop;
            sHeight = height - marginTop - marginBottom;
        }
    }
    else if (valign === "middle") {
        sy = (textCanvasHeight - height - marginTop + marginBottom) / 2;
        if (chopOverflow) {
            ty += marginTop;
            sy += marginTop;
            sHeight = height - marginTop - marginBottom;
        }
    }
    else { // top
        sy = -marginTop;
        if (chopOverflow) {
            sHeight = height - marginBottom;
        }
    }
    // draw the image
    ctx.drawImage(textCanvas, sx + renderMargin, sy + renderMargin, sWidth, sHeight, tx, ty, sWidth, sHeight);
}
exports.drawTexts = drawTexts;


/***/ }),

/***/ "./node_modules/ultimate-text-to-image/build/utils/index.js":
/*!******************************************************************!*\
  !*** ./node_modules/ultimate-text-to-image/build/utils/index.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.hrtime = exports.parseHexTo255 = exports.parseColor = exports.parseColorString = exports.getFontString = void 0;
const getFontString = (options) => {
    const styleStrings = [];
    if (options.fontStyle) {
        if (typeof options.fontStyle === "boolean") {
            styleStrings.push(`italic`);
        }
        else {
            styleStrings.push(options.fontStyle);
        }
    }
    if (options.fontWeight) {
        if (typeof options.fontWeight === "boolean") {
            styleStrings.push(`bold`);
        }
        else {
            styleStrings.push(options.fontWeight.toString());
        }
    }
    styleStrings.push(`${options.fontSize}px`);
    styleStrings.push(`"${options.fontFamily}"`);
    return styleStrings.join(" ");
};
exports.getFontString = getFontString;
const parseColorString = (value) => {
    const { r, g, b, a } = (0, exports.parseColor)(value);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
};
exports.parseColorString = parseColorString;
const parseColor = (value) => {
    if (typeof value === "string") {
        value = value.replace(/^0x/i, "");
        value = value.replace(/^#/, "");
        const r = (0, exports.parseHexTo255)(value.substr(0, 2), 0);
        const g = (0, exports.parseHexTo255)(value.substr(2, 2), 0);
        const b = (0, exports.parseHexTo255)(value.substr(4, 2), 0);
        const a = (0, exports.parseHexTo255)(value.substr(6, 2), 255) / 255;
        return { r, g, b, a };
    }
    else {
        if (value <= 0xFFFFFF) {
            const r = (value >> 16) & 0xFF;
            const g = (value >> 8) & 0xFF;
            const b = (value >> 0) & 0xFF;
            const a = 1;
            return { r, g, b, a };
        }
        else {
            const r = (value >> 24) & 0xFF;
            const g = (value >> 16) & 0xFF;
            const b = (value >> 8) & 0xFF;
            const a = ((value >> 0) & 0xFF) / 255;
            return { r, g, b, a };
        }
    }
};
exports.parseColor = parseColor;
const parseHexTo255 = (value, defaultValue) => {
    try {
        if (value) {
            const decimal = parseInt(`0x${value}`, 16);
            if (!isNaN(decimal)) {
                return Math.max(0, Math.min(decimal, 255));
            }
        }
    }
    catch (err) {
        // ignore any error
    }
    return defaultValue;
};
exports.parseHexTo255 = parseHexTo255;
const hrtime = (previousHrTime) => {
    if (process && process.hrtime) {
        return process.hrtime(previousHrTime);
    }
    else {
        const performance = window.performance;
        const baseNow = Math.floor((Date.now() - performance.now()) * 1e-3);
        const clocktime = performance.now() * 1e-3;
        let seconds = Math.floor(clocktime) + baseNow;
        let nanoseconds = Math.floor((clocktime % 1) * 1e9);
        if (previousHrTime) {
            seconds = seconds - previousHrTime[0];
            nanoseconds = nanoseconds - previousHrTime[1];
            if (nanoseconds < 0) {
                seconds--;
                nanoseconds += 1e9;
            }
        }
        return [seconds, nanoseconds];
    }
};
exports.hrtime = hrtime;


/***/ }),

/***/ "./node_modules/unicode-trie/index.js":
/*!********************************************!*\
  !*** ./node_modules/unicode-trie/index.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const inflate = __webpack_require__(/*! tiny-inflate */ "./node_modules/tiny-inflate/index.js");

// Shift size for getting the index-1 table offset.
const SHIFT_1 = 6 + 5;

// Shift size for getting the index-2 table offset.
const SHIFT_2 = 5;

// Difference between the two shift sizes,
// for getting an index-1 offset from an index-2 offset. 6=11-5
const SHIFT_1_2 = SHIFT_1 - SHIFT_2;

// Number of index-1 entries for the BMP. 32=0x20
// This part of the index-1 table is omitted from the serialized form.
const OMITTED_BMP_INDEX_1_LENGTH = 0x10000 >> SHIFT_1;

// Number of entries in an index-2 block. 64=0x40
const INDEX_2_BLOCK_LENGTH = 1 << SHIFT_1_2;

// Mask for getting the lower bits for the in-index-2-block offset. */
const INDEX_2_MASK = INDEX_2_BLOCK_LENGTH - 1;

// Shift size for shifting left the index array values.
// Increases possible data size with 16-bit index values at the cost
// of compactability.
// This requires data blocks to be aligned by DATA_GRANULARITY.
const INDEX_SHIFT = 2;

// Number of entries in a data block. 32=0x20
const DATA_BLOCK_LENGTH = 1 << SHIFT_2;

// Mask for getting the lower bits for the in-data-block offset.
const DATA_MASK = DATA_BLOCK_LENGTH - 1;

// The part of the index-2 table for U+D800..U+DBFF stores values for
// lead surrogate code _units_ not code _points_.
// Values for lead surrogate code _points_ are indexed with this portion of the table.
// Length=32=0x20=0x400>>SHIFT_2. (There are 1024=0x400 lead surrogates.)
const LSCP_INDEX_2_OFFSET = 0x10000 >> SHIFT_2;
const LSCP_INDEX_2_LENGTH = 0x400 >> SHIFT_2;

// Count the lengths of both BMP pieces. 2080=0x820
const INDEX_2_BMP_LENGTH = LSCP_INDEX_2_OFFSET + LSCP_INDEX_2_LENGTH;

// The 2-byte UTF-8 version of the index-2 table follows at offset 2080=0x820.
// Length 32=0x20 for lead bytes C0..DF, regardless of SHIFT_2.
const UTF8_2B_INDEX_2_OFFSET = INDEX_2_BMP_LENGTH;
const UTF8_2B_INDEX_2_LENGTH = 0x800 >> 6;  // U+0800 is the first code point after 2-byte UTF-8

// The index-1 table, only used for supplementary code points, at offset 2112=0x840.
// Variable length, for code points up to highStart, where the last single-value range starts.
// Maximum length 512=0x200=0x100000>>SHIFT_1.
// (For 0x100000 supplementary code points U+10000..U+10ffff.)
//
// The part of the index-2 table for supplementary code points starts
// after this index-1 table.
//
// Both the index-1 table and the following part of the index-2 table
// are omitted completely if there is only BMP data.
const INDEX_1_OFFSET = UTF8_2B_INDEX_2_OFFSET + UTF8_2B_INDEX_2_LENGTH;

// The alignment size of a data block. Also the granularity for compaction.
const DATA_GRANULARITY = 1 << INDEX_SHIFT;

class UnicodeTrie {
  constructor(data) {
    const isBuffer = (typeof data.readUInt32BE === 'function') && (typeof data.slice === 'function');

    if (isBuffer || data instanceof Uint8Array) {
      // read binary format
      let uncompressedLength;
      if (isBuffer) {
        this.highStart = data.readUInt32BE(0);
        this.errorValue = data.readUInt32BE(4);
        uncompressedLength = data.readUInt32BE(8);
        data = data.slice(12);
      } else {
        const view = new DataView(data.buffer);
        this.highStart = view.getUint32(0);
        this.errorValue = view.getUint32(4);
        uncompressedLength = view.getUint32(8);
        data = data.subarray(12);
      }

      // double inflate the actual trie data
      data = inflate(data, new Uint8Array(uncompressedLength));
      data = inflate(data, new Uint8Array(uncompressedLength));
      this.data = new Uint32Array(data.buffer);

    } else {
      // pre-parsed data
      ({ data: this.data, highStart: this.highStart, errorValue: this.errorValue } = data);
    }
  }

  get(codePoint) {
    let index;
    if ((codePoint < 0) || (codePoint > 0x10ffff)) {
      return this.errorValue;
    }

    if ((codePoint < 0xd800) || ((codePoint > 0xdbff) && (codePoint <= 0xffff))) {
      // Ordinary BMP code point, excluding leading surrogates.
      // BMP uses a single level lookup.  BMP index starts at offset 0 in the index.
      // data is stored in the index array itself.
      index = (this.data[codePoint >> SHIFT_2] << INDEX_SHIFT) + (codePoint & DATA_MASK);
      return this.data[index];
    }

    if (codePoint <= 0xffff) {
      // Lead Surrogate Code Point.  A Separate index section is stored for
      // lead surrogate code units and code points.
      //   The main index has the code unit data.
      //   For this function, we need the code point data.
      index = (this.data[LSCP_INDEX_2_OFFSET + ((codePoint - 0xd800) >> SHIFT_2)] << INDEX_SHIFT) + (codePoint & DATA_MASK);
      return this.data[index];
    }

    if (codePoint < this.highStart) {
      // Supplemental code point, use two-level lookup.
      index = this.data[(INDEX_1_OFFSET - OMITTED_BMP_INDEX_1_LENGTH) + (codePoint >> SHIFT_1)];
      index = this.data[index + ((codePoint >> SHIFT_2) & INDEX_2_MASK)];
      index = (index << INDEX_SHIFT) + (codePoint & DATA_MASK);
      return this.data[index];
    }

    return this.data[this.data.length - DATA_GRANULARITY];
  }
}

module.exports = UnicodeTrie;

/***/ }),

/***/ "./node_modules/wrappy/wrappy.js":
/*!***************************************!*\
  !*** ./node_modules/wrappy/wrappy.js ***!
  \***************************************/
/***/ ((module) => {

// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
module.exports = wrappy
function wrappy (fn, cb) {
  if (fn && cb) return wrappy(fn)(cb)

  if (typeof fn !== 'function')
    throw new TypeError('need wrapper function')

  Object.keys(fn).forEach(function (k) {
    wrapper[k] = fn[k]
  })

  return wrapper

  function wrapper() {
    var args = new Array(arguments.length)
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i]
    }
    var ret = fn.apply(this, args)
    var cb = args[args.length-1]
    if (typeof ret === 'function' && ret !== cb) {
      Object.keys(cb).forEach(function (k) {
        ret[k] = cb[k]
      })
    }
    return ret
  }
}


/***/ }),

/***/ "?45bd":
/*!*************************************!*\
  !*** decompress-response (ignored) ***!
  \*************************************/
/***/ (() => {

/* (ignored) */

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*****************************************!*\
  !*** ./src/extension-dom-controller.js ***!
  \*****************************************/
const UltimateTextToImage = __webpack_require__(/*! ultimate-text-to-image */ "./node_modules/ultimate-text-to-image/build/index.js")

window.addEventListener('DOMContentLoaded', () => {
  // const transformScrapedData = (scrapedData) => {
  //   const { REDDIT_SCRAPED_DATA } = scrapedData
  //   console.log(REDDIT_SCRAPED_DATA)
  //   const titleData = REDDIT_SCRAPED_DATA[0]?.data?.children[0]?.data
  //   /* has all the comments. Replies field has all of its children.
  //   Follows the same data structure */
  //   const commentData = REDDIT_SCRAPED_DATA[1]?.data?.children

  //   console.log(titleData, commentData)
  // }

  const generateImage = (text) => {
    // Fetches value
    const selectedResolution = $('#resolution').val()
    const backgroundColor = $('#backgroundColor').val()
    const txtColor = $('#textColor').val()

    let resolution
    switch (selectedResolution) {
      case 'square':
        resolution = { width: 1080, height: 1080 }
        break
      case 'portrait':
        resolution = { width: 1080, height: 1350 }
        break
      case 'landscape':
        resolution = { width: 1080, height: 608 }
        break
      default:
        resolution = { width: 400, height: 200 }
        break
    }
    // Create a canvas element

    const generatedImg = new UltimateTextToImage('geend')

    console.log(generateImage)
  }

  const setDOMInfo = (info) => {
    const isRedditComments = info?.SUCCESS
    if (isRedditComments) {
      $('.non-reddit').hide()
      $('.loader').hide()
      $('.container').show()
      const title = info?.REDDIT_SCRAPED_DATA[0].data.children[0].data.title
      $('.pageTitle').html(title)
    } else {
      $('.loader').hide()
      $('.non-reddit').show()
      $('.container').hide()
    }
  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'updateSelectedComments') {
      console.log(request.text)
      generateImage(request.text)
    }
  })

  // ...query for the active tab...
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true
    },
    (tabs) => {
      // ...and send a request for the DOM info...
      chrome.tabs.sendMessage(
        tabs[0].id,
        { from: 'popup', subject: 'DOMInfo' },
        // ...also specifying a callback to be called
        //    from the receiving end (content script).
        setDOMInfo
      )
    }
  )
})

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!***********************************!*\
  !*** ./src/tab-dom-controller.js ***!
  \***********************************/
console.log('DOM load')

chrome.runtime.sendMessage({
  from: 'content',
  subject: 'showPageAction'
})

const PAGE_DATA_URL = `https://${window.location.host}${window.location.pathname}.json`

const runDataAnalysis = (data) => {
  // Listen for messages from the popup.
  chrome.runtime.onMessage.addListener((msg, sender, response) => {
    if (
      window.location.href.includes('https://www.reddit.com/r/') &&
      window.location.href.includes('/comments/')
    ) {
      // * Only for reddit comment pages
      if (msg.from === 'popup' && msg.subject === 'DOMInfo') {
        // * checks the request subject, popup is asking for dom-info here
        var domInfo = {
          SUCCESS: true,
          REDDIT_SCRAPED_DATA: data,
          CURRENT_PAGE_URL: window.location.href
        }
        response(domInfo)
      }
    } else {
      // * In case its not reddit
      var domInfo = {
        SUCCESS: false
      }
    }
  })
}

let selectedComments = []

window.addEventListener('click', (event) => {
  console.log(event.target)
  if (event.target.tagName.toLowerCase() === 'p') {
    chrome.runtime.sendMessage({
      action: 'updateSelectedComments',
      text: event.target.innerHTML
    })
  }
})

// * Fetches the data from page and then calls a function to broadcast message
$.ajax({
  url: PAGE_DATA_URL,
  success: runDataAnalysis
})

})();

/******/ })()
;
//# sourceMappingURL=extension-dom-controller.js.map