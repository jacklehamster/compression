(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/*
 * JavaScript MD5
 * https://github.com/blueimp/JavaScript-MD5
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 *
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

/* global define */

/* eslint-disable strict */

;(function ($) {
  'use strict'

  /**
   * Add integers, wrapping at 2^32.
   * This uses 16-bit operations internally to work around bugs in interpreters.
   *
   * @param {number} x First integer
   * @param {number} y Second integer
   * @returns {number} Sum
   */
  function safeAdd(x, y) {
    var lsw = (x & 0xffff) + (y & 0xffff)
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16)
    return (msw << 16) | (lsw & 0xffff)
  }

  /**
   * Bitwise rotate a 32-bit number to the left.
   *
   * @param {number} num 32-bit number
   * @param {number} cnt Rotation count
   * @returns {number} Rotated number
   */
  function bitRotateLeft(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt))
  }

  /**
   * Basic operation the algorithm uses.
   *
   * @param {number} q q
   * @param {number} a a
   * @param {number} b b
   * @param {number} x x
   * @param {number} s s
   * @param {number} t t
   * @returns {number} Result
   */
  function md5cmn(q, a, b, x, s, t) {
    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b)
  }
  /**
   * Basic operation the algorithm uses.
   *
   * @param {number} a a
   * @param {number} b b
   * @param {number} c c
   * @param {number} d d
   * @param {number} x x
   * @param {number} s s
   * @param {number} t t
   * @returns {number} Result
   */
  function md5ff(a, b, c, d, x, s, t) {
    return md5cmn((b & c) | (~b & d), a, b, x, s, t)
  }
  /**
   * Basic operation the algorithm uses.
   *
   * @param {number} a a
   * @param {number} b b
   * @param {number} c c
   * @param {number} d d
   * @param {number} x x
   * @param {number} s s
   * @param {number} t t
   * @returns {number} Result
   */
  function md5gg(a, b, c, d, x, s, t) {
    return md5cmn((b & d) | (c & ~d), a, b, x, s, t)
  }
  /**
   * Basic operation the algorithm uses.
   *
   * @param {number} a a
   * @param {number} b b
   * @param {number} c c
   * @param {number} d d
   * @param {number} x x
   * @param {number} s s
   * @param {number} t t
   * @returns {number} Result
   */
  function md5hh(a, b, c, d, x, s, t) {
    return md5cmn(b ^ c ^ d, a, b, x, s, t)
  }
  /**
   * Basic operation the algorithm uses.
   *
   * @param {number} a a
   * @param {number} b b
   * @param {number} c c
   * @param {number} d d
   * @param {number} x x
   * @param {number} s s
   * @param {number} t t
   * @returns {number} Result
   */
  function md5ii(a, b, c, d, x, s, t) {
    return md5cmn(c ^ (b | ~d), a, b, x, s, t)
  }

  /**
   * Calculate the MD5 of an array of little-endian words, and a bit length.
   *
   * @param {Array} x Array of little-endian words
   * @param {number} len Bit length
   * @returns {Array<number>} MD5 Array
   */
  function binlMD5(x, len) {
    /* append padding */
    x[len >> 5] |= 0x80 << len % 32
    x[(((len + 64) >>> 9) << 4) + 14] = len

    var i
    var olda
    var oldb
    var oldc
    var oldd
    var a = 1732584193
    var b = -271733879
    var c = -1732584194
    var d = 271733878

    for (i = 0; i < x.length; i += 16) {
      olda = a
      oldb = b
      oldc = c
      oldd = d

      a = md5ff(a, b, c, d, x[i], 7, -680876936)
      d = md5ff(d, a, b, c, x[i + 1], 12, -389564586)
      c = md5ff(c, d, a, b, x[i + 2], 17, 606105819)
      b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330)
      a = md5ff(a, b, c, d, x[i + 4], 7, -176418897)
      d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426)
      c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341)
      b = md5ff(b, c, d, a, x[i + 7], 22, -45705983)
      a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416)
      d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417)
      c = md5ff(c, d, a, b, x[i + 10], 17, -42063)
      b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162)
      a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682)
      d = md5ff(d, a, b, c, x[i + 13], 12, -40341101)
      c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290)
      b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329)

      a = md5gg(a, b, c, d, x[i + 1], 5, -165796510)
      d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632)
      c = md5gg(c, d, a, b, x[i + 11], 14, 643717713)
      b = md5gg(b, c, d, a, x[i], 20, -373897302)
      a = md5gg(a, b, c, d, x[i + 5], 5, -701558691)
      d = md5gg(d, a, b, c, x[i + 10], 9, 38016083)
      c = md5gg(c, d, a, b, x[i + 15], 14, -660478335)
      b = md5gg(b, c, d, a, x[i + 4], 20, -405537848)
      a = md5gg(a, b, c, d, x[i + 9], 5, 568446438)
      d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690)
      c = md5gg(c, d, a, b, x[i + 3], 14, -187363961)
      b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501)
      a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467)
      d = md5gg(d, a, b, c, x[i + 2], 9, -51403784)
      c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473)
      b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734)

      a = md5hh(a, b, c, d, x[i + 5], 4, -378558)
      d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463)
      c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562)
      b = md5hh(b, c, d, a, x[i + 14], 23, -35309556)
      a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060)
      d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353)
      c = md5hh(c, d, a, b, x[i + 7], 16, -155497632)
      b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640)
      a = md5hh(a, b, c, d, x[i + 13], 4, 681279174)
      d = md5hh(d, a, b, c, x[i], 11, -358537222)
      c = md5hh(c, d, a, b, x[i + 3], 16, -722521979)
      b = md5hh(b, c, d, a, x[i + 6], 23, 76029189)
      a = md5hh(a, b, c, d, x[i + 9], 4, -640364487)
      d = md5hh(d, a, b, c, x[i + 12], 11, -421815835)
      c = md5hh(c, d, a, b, x[i + 15], 16, 530742520)
      b = md5hh(b, c, d, a, x[i + 2], 23, -995338651)

      a = md5ii(a, b, c, d, x[i], 6, -198630844)
      d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415)
      c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905)
      b = md5ii(b, c, d, a, x[i + 5], 21, -57434055)
      a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571)
      d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606)
      c = md5ii(c, d, a, b, x[i + 10], 15, -1051523)
      b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799)
      a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359)
      d = md5ii(d, a, b, c, x[i + 15], 10, -30611744)
      c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380)
      b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649)
      a = md5ii(a, b, c, d, x[i + 4], 6, -145523070)
      d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379)
      c = md5ii(c, d, a, b, x[i + 2], 15, 718787259)
      b = md5ii(b, c, d, a, x[i + 9], 21, -343485551)

      a = safeAdd(a, olda)
      b = safeAdd(b, oldb)
      c = safeAdd(c, oldc)
      d = safeAdd(d, oldd)
    }
    return [a, b, c, d]
  }

  /**
   * Convert an array of little-endian words to a string
   *
   * @param {Array<number>} input MD5 Array
   * @returns {string} MD5 string
   */
  function binl2rstr(input) {
    var i
    var output = ''
    var length32 = input.length * 32
    for (i = 0; i < length32; i += 8) {
      output += String.fromCharCode((input[i >> 5] >>> i % 32) & 0xff)
    }
    return output
  }

  /**
   * Convert a raw string to an array of little-endian words
   * Characters >255 have their high-byte silently ignored.
   *
   * @param {string} input Raw input string
   * @returns {Array<number>} Array of little-endian words
   */
  function rstr2binl(input) {
    var i
    var output = []
    output[(input.length >> 2) - 1] = undefined
    for (i = 0; i < output.length; i += 1) {
      output[i] = 0
    }
    var length8 = input.length * 8
    for (i = 0; i < length8; i += 8) {
      output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << i % 32
    }
    return output
  }

  /**
   * Calculate the MD5 of a raw string
   *
   * @param {string} s Input string
   * @returns {string} Raw MD5 string
   */
  function rstrMD5(s) {
    return binl2rstr(binlMD5(rstr2binl(s), s.length * 8))
  }

  /**
   * Calculates the HMAC-MD5 of a key and some data (raw strings)
   *
   * @param {string} key HMAC key
   * @param {string} data Raw input string
   * @returns {string} Raw MD5 string
   */
  function rstrHMACMD5(key, data) {
    var i
    var bkey = rstr2binl(key)
    var ipad = []
    var opad = []
    var hash
    ipad[15] = opad[15] = undefined
    if (bkey.length > 16) {
      bkey = binlMD5(bkey, key.length * 8)
    }
    for (i = 0; i < 16; i += 1) {
      ipad[i] = bkey[i] ^ 0x36363636
      opad[i] = bkey[i] ^ 0x5c5c5c5c
    }
    hash = binlMD5(ipad.concat(rstr2binl(data)), 512 + data.length * 8)
    return binl2rstr(binlMD5(opad.concat(hash), 512 + 128))
  }

  /**
   * Convert a raw string to a hex string
   *
   * @param {string} input Raw input string
   * @returns {string} Hex encoded string
   */
  function rstr2hex(input) {
    var hexTab = '0123456789abcdef'
    var output = ''
    var x
    var i
    for (i = 0; i < input.length; i += 1) {
      x = input.charCodeAt(i)
      output += hexTab.charAt((x >>> 4) & 0x0f) + hexTab.charAt(x & 0x0f)
    }
    return output
  }

  /**
   * Encode a string as UTF-8
   *
   * @param {string} input Input string
   * @returns {string} UTF8 string
   */
  function str2rstrUTF8(input) {
    return unescape(encodeURIComponent(input))
  }

  /**
   * Encodes input string as raw MD5 string
   *
   * @param {string} s Input string
   * @returns {string} Raw MD5 string
   */
  function rawMD5(s) {
    return rstrMD5(str2rstrUTF8(s))
  }
  /**
   * Encodes input string as Hex encoded string
   *
   * @param {string} s Input string
   * @returns {string} Hex encoded string
   */
  function hexMD5(s) {
    return rstr2hex(rawMD5(s))
  }
  /**
   * Calculates the raw HMAC-MD5 for the given key and data
   *
   * @param {string} k HMAC key
   * @param {string} d Input string
   * @returns {string} Raw MD5 string
   */
  function rawHMACMD5(k, d) {
    return rstrHMACMD5(str2rstrUTF8(k), str2rstrUTF8(d))
  }
  /**
   * Calculates the Hex encoded HMAC-MD5 for the given key and data
   *
   * @param {string} k HMAC key
   * @param {string} d Input string
   * @returns {string} Raw MD5 string
   */
  function hexHMACMD5(k, d) {
    return rstr2hex(rawHMACMD5(k, d))
  }

  /**
   * Calculates MD5 value for a given string.
   * If a key is provided, calculates the HMAC-MD5 value.
   * Returns a Hex encoded string unless the raw argument is given.
   *
   * @param {string} string Input string
   * @param {string} [key] HMAC key
   * @param {boolean} [raw] Raw output switch
   * @returns {string} MD5 output
   */
  function md5(string, key, raw) {
    if (!key) {
      if (!raw) {
        return hexMD5(string)
      }
      return rawMD5(string)
    }
    if (!raw) {
      return hexHMACMD5(key, string)
    }
    return rawHMACMD5(key, string)
  }

  if (typeof define === 'function' && define.amd) {
    define(function () {
      return md5
    })
  } else if (typeof module === 'object' && module.exports) {
    module.exports = md5
  } else {
    $.md5 = md5
  }
})(this)

},{}],2:[function(require,module,exports){
"use strict";
// DEFLATE is a complex format; to read this code, you should probably check the RFC first:
// https://tools.ietf.org/html/rfc1951
// You may also wish to take a look at the guide I made about this program:
// https://gist.github.com/101arrowz/253f31eb5abc3d9275ab943003ffecad
// Some of the following code is similar to that of UZIP.js:
// https://github.com/photopea/UZIP.js
// However, the vast majority of the codebase has diverged from UZIP.js to increase performance and reduce bundle size.
// Sometimes 0 will appear where -1 would be more appropriate. This is because using a uint
// is better for memory in most engines (I *think*).
var node_worker_1 = require("./node-worker.cjs");
// aliases for shorter compressed code (most minifers don't do this)
var u8 = Uint8Array, u16 = Uint16Array, u32 = Uint32Array;
// fixed length extra bits
var fleb = new u8([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, /* unused */ 0, 0, /* impossible */ 0]);
// fixed distance extra bits
// see fleb note
var fdeb = new u8([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, /* unused */ 0, 0]);
// code length index map
var clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
// get base, reverse index map from extra bits
var freb = function (eb, start) {
    var b = new u16(31);
    for (var i = 0; i < 31; ++i) {
        b[i] = start += 1 << eb[i - 1];
    }
    // numbers here are at max 18 bits
    var r = new u32(b[30]);
    for (var i = 1; i < 30; ++i) {
        for (var j = b[i]; j < b[i + 1]; ++j) {
            r[j] = ((j - b[i]) << 5) | i;
        }
    }
    return [b, r];
};
var _a = freb(fleb, 2), fl = _a[0], revfl = _a[1];
// we can ignore the fact that the other numbers are wrong; they never happen anyway
fl[28] = 258, revfl[258] = 28;
var _b = freb(fdeb, 0), fd = _b[0], revfd = _b[1];
// map of value to reverse (assuming 16 bits)
var rev = new u16(32768);
for (var i = 0; i < 32768; ++i) {
    // reverse table algorithm from SO
    var x = ((i & 0xAAAA) >>> 1) | ((i & 0x5555) << 1);
    x = ((x & 0xCCCC) >>> 2) | ((x & 0x3333) << 2);
    x = ((x & 0xF0F0) >>> 4) | ((x & 0x0F0F) << 4);
    rev[i] = (((x & 0xFF00) >>> 8) | ((x & 0x00FF) << 8)) >>> 1;
}
// create huffman tree from u8 "map": index -> code length for code index
// mb (max bits) must be at most 15
// TODO: optimize/split up?
var hMap = (function (cd, mb, r) {
    var s = cd.length;
    // index
    var i = 0;
    // u16 "map": index -> # of codes with bit length = index
    var l = new u16(mb);
    // length of cd must be 288 (total # of codes)
    for (; i < s; ++i) {
        if (cd[i])
            ++l[cd[i] - 1];
    }
    // u16 "map": index -> minimum code for bit length = index
    var le = new u16(mb);
    for (i = 0; i < mb; ++i) {
        le[i] = (le[i - 1] + l[i - 1]) << 1;
    }
    var co;
    if (r) {
        // u16 "map": index -> number of actual bits, symbol for code
        co = new u16(1 << mb);
        // bits to remove for reverser
        var rvb = 15 - mb;
        for (i = 0; i < s; ++i) {
            // ignore 0 lengths
            if (cd[i]) {
                // num encoding both symbol and bits read
                var sv = (i << 4) | cd[i];
                // free bits
                var r_1 = mb - cd[i];
                // start value
                var v = le[cd[i] - 1]++ << r_1;
                // m is end value
                for (var m = v | ((1 << r_1) - 1); v <= m; ++v) {
                    // every 16 bit value starting with the code yields the same result
                    co[rev[v] >>> rvb] = sv;
                }
            }
        }
    }
    else {
        co = new u16(s);
        for (i = 0; i < s; ++i) {
            if (cd[i]) {
                co[i] = rev[le[cd[i] - 1]++] >>> (15 - cd[i]);
            }
        }
    }
    return co;
});
// fixed length tree
var flt = new u8(288);
for (var i = 0; i < 144; ++i)
    flt[i] = 8;
for (var i = 144; i < 256; ++i)
    flt[i] = 9;
for (var i = 256; i < 280; ++i)
    flt[i] = 7;
for (var i = 280; i < 288; ++i)
    flt[i] = 8;
// fixed distance tree
var fdt = new u8(32);
for (var i = 0; i < 32; ++i)
    fdt[i] = 5;
// fixed length map
var flm = /*#__PURE__*/ hMap(flt, 9, 0), flrm = /*#__PURE__*/ hMap(flt, 9, 1);
// fixed distance map
var fdm = /*#__PURE__*/ hMap(fdt, 5, 0), fdrm = /*#__PURE__*/ hMap(fdt, 5, 1);
// find max of array
var max = function (a) {
    var m = a[0];
    for (var i = 1; i < a.length; ++i) {
        if (a[i] > m)
            m = a[i];
    }
    return m;
};
// read d, starting at bit p and mask with m
var bits = function (d, p, m) {
    var o = (p / 8) | 0;
    return ((d[o] | (d[o + 1] << 8)) >> (p & 7)) & m;
};
// read d, starting at bit p continuing for at least 16 bits
var bits16 = function (d, p) {
    var o = (p / 8) | 0;
    return ((d[o] | (d[o + 1] << 8) | (d[o + 2] << 16)) >> (p & 7));
};
// get end of byte
var shft = function (p) { return ((p + 7) / 8) | 0; };
// typed array slice - allows garbage collector to free original reference,
// while being more compatible than .slice
var slc = function (v, s, e) {
    if (s == null || s < 0)
        s = 0;
    if (e == null || e > v.length)
        e = v.length;
    // can't use .constructor in case user-supplied
    var n = new (v.BYTES_PER_ELEMENT == 2 ? u16 : v.BYTES_PER_ELEMENT == 4 ? u32 : u8)(e - s);
    n.set(v.subarray(s, e));
    return n;
};
/**
 * Codes for errors generated within this library
 */
exports.FlateErrorCode = {
    UnexpectedEOF: 0,
    InvalidBlockType: 1,
    InvalidLengthLiteral: 2,
    InvalidDistance: 3,
    StreamFinished: 4,
    NoStreamHandler: 5,
    InvalidHeader: 6,
    NoCallback: 7,
    InvalidUTF8: 8,
    ExtraFieldTooLong: 9,
    InvalidDate: 10,
    FilenameTooLong: 11,
    StreamFinishing: 12,
    InvalidZipData: 13,
    UnknownCompressionMethod: 14
};
// error codes
var ec = [
    'unexpected EOF',
    'invalid block type',
    'invalid length/literal',
    'invalid distance',
    'stream finished',
    'no stream handler',
    ,
    'no callback',
    'invalid UTF-8 data',
    'extra field too long',
    'date not in range 1980-2099',
    'filename too long',
    'stream finishing',
    'invalid zip data'
    // determined by unknown compression method
];
;
var err = function (ind, msg, nt) {
    var e = new Error(msg || ec[ind]);
    e.code = ind;
    if (Error.captureStackTrace)
        Error.captureStackTrace(e, err);
    if (!nt)
        throw e;
    return e;
};
// expands raw DEFLATE data
var inflt = function (dat, buf, st) {
    // source length
    var sl = dat.length;
    if (!sl || (st && st.f && !st.l))
        return buf || new u8(0);
    // have to estimate size
    var noBuf = !buf || st;
    // no state
    var noSt = !st || st.i;
    if (!st)
        st = {};
    // Assumes roughly 33% compression ratio average
    if (!buf)
        buf = new u8(sl * 3);
    // ensure buffer can fit at least l elements
    var cbuf = function (l) {
        var bl = buf.length;
        // need to increase size to fit
        if (l > bl) {
            // Double or set to necessary, whichever is greater
            var nbuf = new u8(Math.max(bl * 2, l));
            nbuf.set(buf);
            buf = nbuf;
        }
    };
    //  last chunk         bitpos           bytes
    var final = st.f || 0, pos = st.p || 0, bt = st.b || 0, lm = st.l, dm = st.d, lbt = st.m, dbt = st.n;
    // total bits
    var tbts = sl * 8;
    do {
        if (!lm) {
            // BFINAL - this is only 1 when last chunk is next
            final = bits(dat, pos, 1);
            // type: 0 = no compression, 1 = fixed huffman, 2 = dynamic huffman
            var type = bits(dat, pos + 1, 3);
            pos += 3;
            if (!type) {
                // go to end of byte boundary
                var s = shft(pos) + 4, l = dat[s - 4] | (dat[s - 3] << 8), t = s + l;
                if (t > sl) {
                    if (noSt)
                        err(0);
                    break;
                }
                // ensure size
                if (noBuf)
                    cbuf(bt + l);
                // Copy over uncompressed data
                buf.set(dat.subarray(s, t), bt);
                // Get new bitpos, update byte count
                st.b = bt += l, st.p = pos = t * 8, st.f = final;
                continue;
            }
            else if (type == 1)
                lm = flrm, dm = fdrm, lbt = 9, dbt = 5;
            else if (type == 2) {
                //  literal                            lengths
                var hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4;
                var tl = hLit + bits(dat, pos + 5, 31) + 1;
                pos += 14;
                // length+distance tree
                var ldt = new u8(tl);
                // code length tree
                var clt = new u8(19);
                for (var i = 0; i < hcLen; ++i) {
                    // use index map to get real code
                    clt[clim[i]] = bits(dat, pos + i * 3, 7);
                }
                pos += hcLen * 3;
                // code lengths bits
                var clb = max(clt), clbmsk = (1 << clb) - 1;
                // code lengths map
                var clm = hMap(clt, clb, 1);
                for (var i = 0; i < tl;) {
                    var r = clm[bits(dat, pos, clbmsk)];
                    // bits read
                    pos += r & 15;
                    // symbol
                    var s = r >>> 4;
                    // code length to copy
                    if (s < 16) {
                        ldt[i++] = s;
                    }
                    else {
                        //  copy   count
                        var c = 0, n = 0;
                        if (s == 16)
                            n = 3 + bits(dat, pos, 3), pos += 2, c = ldt[i - 1];
                        else if (s == 17)
                            n = 3 + bits(dat, pos, 7), pos += 3;
                        else if (s == 18)
                            n = 11 + bits(dat, pos, 127), pos += 7;
                        while (n--)
                            ldt[i++] = c;
                    }
                }
                //    length tree                 distance tree
                var lt = ldt.subarray(0, hLit), dt = ldt.subarray(hLit);
                // max length bits
                lbt = max(lt);
                // max dist bits
                dbt = max(dt);
                lm = hMap(lt, lbt, 1);
                dm = hMap(dt, dbt, 1);
            }
            else
                err(1);
            if (pos > tbts) {
                if (noSt)
                    err(0);
                break;
            }
        }
        // Make sure the buffer can hold this + the largest possible addition
        // Maximum chunk size (practically, theoretically infinite) is 2^17;
        if (noBuf)
            cbuf(bt + 131072);
        var lms = (1 << lbt) - 1, dms = (1 << dbt) - 1;
        var lpos = pos;
        for (;; lpos = pos) {
            // bits read, code
            var c = lm[bits16(dat, pos) & lms], sym = c >>> 4;
            pos += c & 15;
            if (pos > tbts) {
                if (noSt)
                    err(0);
                break;
            }
            if (!c)
                err(2);
            if (sym < 256)
                buf[bt++] = sym;
            else if (sym == 256) {
                lpos = pos, lm = null;
                break;
            }
            else {
                var add = sym - 254;
                // no extra bits needed if less
                if (sym > 264) {
                    // index
                    var i = sym - 257, b = fleb[i];
                    add = bits(dat, pos, (1 << b) - 1) + fl[i];
                    pos += b;
                }
                // dist
                var d = dm[bits16(dat, pos) & dms], dsym = d >>> 4;
                if (!d)
                    err(3);
                pos += d & 15;
                var dt = fd[dsym];
                if (dsym > 3) {
                    var b = fdeb[dsym];
                    dt += bits16(dat, pos) & ((1 << b) - 1), pos += b;
                }
                if (pos > tbts) {
                    if (noSt)
                        err(0);
                    break;
                }
                if (noBuf)
                    cbuf(bt + 131072);
                var end = bt + add;
                for (; bt < end; bt += 4) {
                    buf[bt] = buf[bt - dt];
                    buf[bt + 1] = buf[bt + 1 - dt];
                    buf[bt + 2] = buf[bt + 2 - dt];
                    buf[bt + 3] = buf[bt + 3 - dt];
                }
                bt = end;
            }
        }
        st.l = lm, st.p = lpos, st.b = bt, st.f = final;
        if (lm)
            final = 1, st.m = lbt, st.d = dm, st.n = dbt;
    } while (!final);
    return bt == buf.length ? buf : slc(buf, 0, bt);
};
// starting at p, write the minimum number of bits that can hold v to d
var wbits = function (d, p, v) {
    v <<= p & 7;
    var o = (p / 8) | 0;
    d[o] |= v;
    d[o + 1] |= v >>> 8;
};
// starting at p, write the minimum number of bits (>8) that can hold v to d
var wbits16 = function (d, p, v) {
    v <<= p & 7;
    var o = (p / 8) | 0;
    d[o] |= v;
    d[o + 1] |= v >>> 8;
    d[o + 2] |= v >>> 16;
};
// creates code lengths from a frequency table
var hTree = function (d, mb) {
    // Need extra info to make a tree
    var t = [];
    for (var i = 0; i < d.length; ++i) {
        if (d[i])
            t.push({ s: i, f: d[i] });
    }
    var s = t.length;
    var t2 = t.slice();
    if (!s)
        return [et, 0];
    if (s == 1) {
        var v = new u8(t[0].s + 1);
        v[t[0].s] = 1;
        return [v, 1];
    }
    t.sort(function (a, b) { return a.f - b.f; });
    // after i2 reaches last ind, will be stopped
    // freq must be greater than largest possible number of symbols
    t.push({ s: -1, f: 25001 });
    var l = t[0], r = t[1], i0 = 0, i1 = 1, i2 = 2;
    t[0] = { s: -1, f: l.f + r.f, l: l, r: r };
    // efficient algorithm from UZIP.js
    // i0 is lookbehind, i2 is lookahead - after processing two low-freq
    // symbols that combined have high freq, will start processing i2 (high-freq,
    // non-composite) symbols instead
    // see https://reddit.com/r/photopea/comments/ikekht/uzipjs_questions/
    while (i1 != s - 1) {
        l = t[t[i0].f < t[i2].f ? i0++ : i2++];
        r = t[i0 != i1 && t[i0].f < t[i2].f ? i0++ : i2++];
        t[i1++] = { s: -1, f: l.f + r.f, l: l, r: r };
    }
    var maxSym = t2[0].s;
    for (var i = 1; i < s; ++i) {
        if (t2[i].s > maxSym)
            maxSym = t2[i].s;
    }
    // code lengths
    var tr = new u16(maxSym + 1);
    // max bits in tree
    var mbt = ln(t[i1 - 1], tr, 0);
    if (mbt > mb) {
        // more algorithms from UZIP.js
        // TODO: find out how this code works (debt)
        //  ind    debt
        var i = 0, dt = 0;
        //    left            cost
        var lft = mbt - mb, cst = 1 << lft;
        t2.sort(function (a, b) { return tr[b.s] - tr[a.s] || a.f - b.f; });
        for (; i < s; ++i) {
            var i2_1 = t2[i].s;
            if (tr[i2_1] > mb) {
                dt += cst - (1 << (mbt - tr[i2_1]));
                tr[i2_1] = mb;
            }
            else
                break;
        }
        dt >>>= lft;
        while (dt > 0) {
            var i2_2 = t2[i].s;
            if (tr[i2_2] < mb)
                dt -= 1 << (mb - tr[i2_2]++ - 1);
            else
                ++i;
        }
        for (; i >= 0 && dt; --i) {
            var i2_3 = t2[i].s;
            if (tr[i2_3] == mb) {
                --tr[i2_3];
                ++dt;
            }
        }
        mbt = mb;
    }
    return [new u8(tr), mbt];
};
// get the max length and assign length codes
var ln = function (n, l, d) {
    return n.s == -1
        ? Math.max(ln(n.l, l, d + 1), ln(n.r, l, d + 1))
        : (l[n.s] = d);
};
// length codes generation
var lc = function (c) {
    var s = c.length;
    // Note that the semicolon was intentional
    while (s && !c[--s])
        ;
    var cl = new u16(++s);
    //  ind      num         streak
    var cli = 0, cln = c[0], cls = 1;
    var w = function (v) { cl[cli++] = v; };
    for (var i = 1; i <= s; ++i) {
        if (c[i] == cln && i != s)
            ++cls;
        else {
            if (!cln && cls > 2) {
                for (; cls > 138; cls -= 138)
                    w(32754);
                if (cls > 2) {
                    w(cls > 10 ? ((cls - 11) << 5) | 28690 : ((cls - 3) << 5) | 12305);
                    cls = 0;
                }
            }
            else if (cls > 3) {
                w(cln), --cls;
                for (; cls > 6; cls -= 6)
                    w(8304);
                if (cls > 2)
                    w(((cls - 3) << 5) | 8208), cls = 0;
            }
            while (cls--)
                w(cln);
            cls = 1;
            cln = c[i];
        }
    }
    return [cl.subarray(0, cli), s];
};
// calculate the length of output from tree, code lengths
var clen = function (cf, cl) {
    var l = 0;
    for (var i = 0; i < cl.length; ++i)
        l += cf[i] * cl[i];
    return l;
};
// writes a fixed block
// returns the new bit pos
var wfblk = function (out, pos, dat) {
    // no need to write 00 as type: TypedArray defaults to 0
    var s = dat.length;
    var o = shft(pos + 2);
    out[o] = s & 255;
    out[o + 1] = s >>> 8;
    out[o + 2] = out[o] ^ 255;
    out[o + 3] = out[o + 1] ^ 255;
    for (var i = 0; i < s; ++i)
        out[o + i + 4] = dat[i];
    return (o + 4 + s) * 8;
};
// writes a block
var wblk = function (dat, out, final, syms, lf, df, eb, li, bs, bl, p) {
    wbits(out, p++, final);
    ++lf[256];
    var _a = hTree(lf, 15), dlt = _a[0], mlb = _a[1];
    var _b = hTree(df, 15), ddt = _b[0], mdb = _b[1];
    var _c = lc(dlt), lclt = _c[0], nlc = _c[1];
    var _d = lc(ddt), lcdt = _d[0], ndc = _d[1];
    var lcfreq = new u16(19);
    for (var i = 0; i < lclt.length; ++i)
        lcfreq[lclt[i] & 31]++;
    for (var i = 0; i < lcdt.length; ++i)
        lcfreq[lcdt[i] & 31]++;
    var _e = hTree(lcfreq, 7), lct = _e[0], mlcb = _e[1];
    var nlcc = 19;
    for (; nlcc > 4 && !lct[clim[nlcc - 1]]; --nlcc)
        ;
    var flen = (bl + 5) << 3;
    var ftlen = clen(lf, flt) + clen(df, fdt) + eb;
    var dtlen = clen(lf, dlt) + clen(df, ddt) + eb + 14 + 3 * nlcc + clen(lcfreq, lct) + (2 * lcfreq[16] + 3 * lcfreq[17] + 7 * lcfreq[18]);
    if (flen <= ftlen && flen <= dtlen)
        return wfblk(out, p, dat.subarray(bs, bs + bl));
    var lm, ll, dm, dl;
    wbits(out, p, 1 + (dtlen < ftlen)), p += 2;
    if (dtlen < ftlen) {
        lm = hMap(dlt, mlb, 0), ll = dlt, dm = hMap(ddt, mdb, 0), dl = ddt;
        var llm = hMap(lct, mlcb, 0);
        wbits(out, p, nlc - 257);
        wbits(out, p + 5, ndc - 1);
        wbits(out, p + 10, nlcc - 4);
        p += 14;
        for (var i = 0; i < nlcc; ++i)
            wbits(out, p + 3 * i, lct[clim[i]]);
        p += 3 * nlcc;
        var lcts = [lclt, lcdt];
        for (var it = 0; it < 2; ++it) {
            var clct = lcts[it];
            for (var i = 0; i < clct.length; ++i) {
                var len = clct[i] & 31;
                wbits(out, p, llm[len]), p += lct[len];
                if (len > 15)
                    wbits(out, p, (clct[i] >>> 5) & 127), p += clct[i] >>> 12;
            }
        }
    }
    else {
        lm = flm, ll = flt, dm = fdm, dl = fdt;
    }
    for (var i = 0; i < li; ++i) {
        if (syms[i] > 255) {
            var len = (syms[i] >>> 18) & 31;
            wbits16(out, p, lm[len + 257]), p += ll[len + 257];
            if (len > 7)
                wbits(out, p, (syms[i] >>> 23) & 31), p += fleb[len];
            var dst = syms[i] & 31;
            wbits16(out, p, dm[dst]), p += dl[dst];
            if (dst > 3)
                wbits16(out, p, (syms[i] >>> 5) & 8191), p += fdeb[dst];
        }
        else {
            wbits16(out, p, lm[syms[i]]), p += ll[syms[i]];
        }
    }
    wbits16(out, p, lm[256]);
    return p + ll[256];
};
// deflate options (nice << 13) | chain
var deo = /*#__PURE__*/ new u32([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]);
// empty
var et = /*#__PURE__*/ new u8(0);
// compresses data into a raw DEFLATE buffer
var dflt = function (dat, lvl, plvl, pre, post, lst) {
    var s = dat.length;
    var o = new u8(pre + s + 5 * (1 + Math.ceil(s / 7000)) + post);
    // writing to this writes to the output buffer
    var w = o.subarray(pre, o.length - post);
    var pos = 0;
    if (!lvl || s < 8) {
        for (var i = 0; i <= s; i += 65535) {
            // end
            var e = i + 65535;
            if (e >= s) {
                // write final block
                w[pos >> 3] = lst;
            }
            pos = wfblk(w, pos + 1, dat.subarray(i, e));
        }
    }
    else {
        var opt = deo[lvl - 1];
        var n = opt >>> 13, c = opt & 8191;
        var msk_1 = (1 << plvl) - 1;
        //    prev 2-byte val map    curr 2-byte val map
        var prev = new u16(32768), head = new u16(msk_1 + 1);
        var bs1_1 = Math.ceil(plvl / 3), bs2_1 = 2 * bs1_1;
        var hsh = function (i) { return (dat[i] ^ (dat[i + 1] << bs1_1) ^ (dat[i + 2] << bs2_1)) & msk_1; };
        // 24576 is an arbitrary number of maximum symbols per block
        // 424 buffer for last block
        var syms = new u32(25000);
        // length/literal freq   distance freq
        var lf = new u16(288), df = new u16(32);
        //  l/lcnt  exbits  index  l/lind  waitdx  bitpos
        var lc_1 = 0, eb = 0, i = 0, li = 0, wi = 0, bs = 0;
        for (; i < s; ++i) {
            // hash value
            // deopt when i > s - 3 - at end, deopt acceptable
            var hv = hsh(i);
            // index mod 32768    previous index mod
            var imod = i & 32767, pimod = head[hv];
            prev[imod] = pimod;
            head[hv] = imod;
            // We always should modify head and prev, but only add symbols if
            // this data is not yet processed ("wait" for wait index)
            if (wi <= i) {
                // bytes remaining
                var rem = s - i;
                if ((lc_1 > 7000 || li > 24576) && rem > 423) {
                    pos = wblk(dat, w, 0, syms, lf, df, eb, li, bs, i - bs, pos);
                    li = lc_1 = eb = 0, bs = i;
                    for (var j = 0; j < 286; ++j)
                        lf[j] = 0;
                    for (var j = 0; j < 30; ++j)
                        df[j] = 0;
                }
                //  len    dist   chain
                var l = 2, d = 0, ch_1 = c, dif = (imod - pimod) & 32767;
                if (rem > 2 && hv == hsh(i - dif)) {
                    var maxn = Math.min(n, rem) - 1;
                    var maxd = Math.min(32767, i);
                    // max possible length
                    // not capped at dif because decompressors implement "rolling" index population
                    var ml = Math.min(258, rem);
                    while (dif <= maxd && --ch_1 && imod != pimod) {
                        if (dat[i + l] == dat[i + l - dif]) {
                            var nl = 0;
                            for (; nl < ml && dat[i + nl] == dat[i + nl - dif]; ++nl)
                                ;
                            if (nl > l) {
                                l = nl, d = dif;
                                // break out early when we reach "nice" (we are satisfied enough)
                                if (nl > maxn)
                                    break;
                                // now, find the rarest 2-byte sequence within this
                                // length of literals and search for that instead.
                                // Much faster than just using the start
                                var mmd = Math.min(dif, nl - 2);
                                var md = 0;
                                for (var j = 0; j < mmd; ++j) {
                                    var ti = (i - dif + j + 32768) & 32767;
                                    var pti = prev[ti];
                                    var cd = (ti - pti + 32768) & 32767;
                                    if (cd > md)
                                        md = cd, pimod = ti;
                                }
                            }
                        }
                        // check the previous match
                        imod = pimod, pimod = prev[imod];
                        dif += (imod - pimod + 32768) & 32767;
                    }
                }
                // d will be nonzero only when a match was found
                if (d) {
                    // store both dist and len data in one Uint32
                    // Make sure this is recognized as a len/dist with 28th bit (2^28)
                    syms[li++] = 268435456 | (revfl[l] << 18) | revfd[d];
                    var lin = revfl[l] & 31, din = revfd[d] & 31;
                    eb += fleb[lin] + fdeb[din];
                    ++lf[257 + lin];
                    ++df[din];
                    wi = i + l;
                    ++lc_1;
                }
                else {
                    syms[li++] = dat[i];
                    ++lf[dat[i]];
                }
            }
        }
        pos = wblk(dat, w, lst, syms, lf, df, eb, li, bs, i - bs, pos);
        // this is the easiest way to avoid needing to maintain state
        if (!lst && pos & 7)
            pos = wfblk(w, pos + 1, et);
    }
    return slc(o, 0, pre + shft(pos) + post);
};
// CRC32 table
var crct = /*#__PURE__*/ (function () {
    var t = new Int32Array(256);
    for (var i = 0; i < 256; ++i) {
        var c = i, k = 9;
        while (--k)
            c = ((c & 1) && -306674912) ^ (c >>> 1);
        t[i] = c;
    }
    return t;
})();
// CRC32
var crc = function () {
    var c = -1;
    return {
        p: function (d) {
            // closures have awful performance
            var cr = c;
            for (var i = 0; i < d.length; ++i)
                cr = crct[(cr & 255) ^ d[i]] ^ (cr >>> 8);
            c = cr;
        },
        d: function () { return ~c; }
    };
};
// Alder32
var adler = function () {
    var a = 1, b = 0;
    return {
        p: function (d) {
            // closures have awful performance
            var n = a, m = b;
            var l = d.length | 0;
            for (var i = 0; i != l;) {
                var e = Math.min(i + 2655, l);
                for (; i < e; ++i)
                    m += n += d[i];
                n = (n & 65535) + 15 * (n >> 16), m = (m & 65535) + 15 * (m >> 16);
            }
            a = n, b = m;
        },
        d: function () {
            a %= 65521, b %= 65521;
            return (a & 255) << 24 | (a >>> 8) << 16 | (b & 255) << 8 | (b >>> 8);
        }
    };
};
;
// deflate with opts
var dopt = function (dat, opt, pre, post, st) {
    return dflt(dat, opt.level == null ? 6 : opt.level, opt.mem == null ? Math.ceil(Math.max(8, Math.min(13, Math.log(dat.length))) * 1.5) : (12 + opt.mem), pre, post, !st);
};
// Walmart object spread
var mrg = function (a, b) {
    var o = {};
    for (var k in a)
        o[k] = a[k];
    for (var k in b)
        o[k] = b[k];
    return o;
};
// worker clone
// This is possibly the craziest part of the entire codebase, despite how simple it may seem.
// The only parameter to this function is a closure that returns an array of variables outside of the function scope.
// We're going to try to figure out the variable names used in the closure as strings because that is crucial for workerization.
// We will return an object mapping of true variable name to value (basically, the current scope as a JS object).
// The reason we can't just use the original variable names is minifiers mangling the toplevel scope.
// This took me three weeks to figure out how to do.
var wcln = function (fn, fnStr, td) {
    var dt = fn();
    var st = fn.toString();
    var ks = st.slice(st.indexOf('[') + 1, st.lastIndexOf(']')).replace(/\s+/g, '').split(',');
    for (var i = 0; i < dt.length; ++i) {
        var v = dt[i], k = ks[i];
        if (typeof v == 'function') {
            fnStr += ';' + k + '=';
            var st_1 = v.toString();
            if (v.prototype) {
                // for global objects
                if (st_1.indexOf('[native code]') != -1) {
                    var spInd = st_1.indexOf(' ', 8) + 1;
                    fnStr += st_1.slice(spInd, st_1.indexOf('(', spInd));
                }
                else {
                    fnStr += st_1;
                    for (var t in v.prototype)
                        fnStr += ';' + k + '.prototype.' + t + '=' + v.prototype[t].toString();
                }
            }
            else
                fnStr += st_1;
        }
        else
            td[k] = v;
    }
    return [fnStr, td];
};
var ch = [];
// clone bufs
var cbfs = function (v) {
    var tl = [];
    for (var k in v) {
        if (v[k].buffer) {
            tl.push((v[k] = new v[k].constructor(v[k])).buffer);
        }
    }
    return tl;
};
// use a worker to execute code
var wrkr = function (fns, init, id, cb) {
    var _a;
    if (!ch[id]) {
        var fnStr = '', td_1 = {}, m = fns.length - 1;
        for (var i = 0; i < m; ++i)
            _a = wcln(fns[i], fnStr, td_1), fnStr = _a[0], td_1 = _a[1];
        ch[id] = wcln(fns[m], fnStr, td_1);
    }
    var td = mrg({}, ch[id][1]);
    return node_worker_1["default"](ch[id][0] + ';onmessage=function(e){for(var k in e.data)self[k]=e.data[k];onmessage=' + init.toString() + '}', id, td, cbfs(td), cb);
};
// base async inflate fn
var bInflt = function () { return [u8, u16, u32, fleb, fdeb, clim, fl, fd, flrm, fdrm, rev, ec, hMap, max, bits, bits16, shft, slc, err, inflt, inflateSync, pbf, gu8]; };
var bDflt = function () { return [u8, u16, u32, fleb, fdeb, clim, revfl, revfd, flm, flt, fdm, fdt, rev, deo, et, hMap, wbits, wbits16, hTree, ln, lc, clen, wfblk, wblk, shft, slc, dflt, dopt, deflateSync, pbf]; };
// gzip extra
var gze = function () { return [gzh, gzhl, wbytes, crc, crct]; };
// gunzip extra
var guze = function () { return [gzs, gzl]; };
// zlib extra
var zle = function () { return [zlh, wbytes, adler]; };
// unzlib extra
var zule = function () { return [zlv]; };
// post buf
var pbf = function (msg) { return postMessage(msg, [msg.buffer]); };
// get u8
var gu8 = function (o) { return o && o.size && new u8(o.size); };
// async helper
var cbify = function (dat, opts, fns, init, id, cb) {
    var w = wrkr(fns, init, id, function (err, dat) {
        w.terminate();
        cb(err, dat);
    });
    w.postMessage([dat, opts], opts.consume ? [dat.buffer] : []);
    return function () { w.terminate(); };
};
// auto stream
var astrm = function (strm) {
    strm.ondata = function (dat, final) { return postMessage([dat, final], [dat.buffer]); };
    return function (ev) { return strm.push(ev.data[0], ev.data[1]); };
};
// async stream attach
var astrmify = function (fns, strm, opts, init, id) {
    var t;
    var w = wrkr(fns, init, id, function (err, dat) {
        if (err)
            w.terminate(), strm.ondata.call(strm, err);
        else {
            if (dat[1])
                w.terminate();
            strm.ondata.call(strm, err, dat[0], dat[1]);
        }
    });
    w.postMessage(opts);
    strm.push = function (d, f) {
        if (!strm.ondata)
            err(5);
        if (t)
            strm.ondata(err(4, 0, 1), null, !!f);
        w.postMessage([d, t = f], [d.buffer]);
    };
    strm.terminate = function () { w.terminate(); };
};
// read 2 bytes
var b2 = function (d, b) { return d[b] | (d[b + 1] << 8); };
// read 4 bytes
var b4 = function (d, b) { return (d[b] | (d[b + 1] << 8) | (d[b + 2] << 16) | (d[b + 3] << 24)) >>> 0; };
var b8 = function (d, b) { return b4(d, b) + (b4(d, b + 4) * 4294967296); };
// write bytes
var wbytes = function (d, b, v) {
    for (; v; ++b)
        d[b] = v, v >>>= 8;
};
// gzip header
var gzh = function (c, o) {
    var fn = o.filename;
    c[0] = 31, c[1] = 139, c[2] = 8, c[8] = o.level < 2 ? 4 : o.level == 9 ? 2 : 0, c[9] = 3; // assume Unix
    if (o.mtime != 0)
        wbytes(c, 4, Math.floor(new Date(o.mtime || Date.now()) / 1000));
    if (fn) {
        c[3] = 8;
        for (var i = 0; i <= fn.length; ++i)
            c[i + 10] = fn.charCodeAt(i);
    }
};
// gzip footer: -8 to -4 = CRC, -4 to -0 is length
// gzip start
var gzs = function (d) {
    if (d[0] != 31 || d[1] != 139 || d[2] != 8)
        err(6, 'invalid gzip data');
    var flg = d[3];
    var st = 10;
    if (flg & 4)
        st += d[10] | (d[11] << 8) + 2;
    for (var zs = (flg >> 3 & 1) + (flg >> 4 & 1); zs > 0; zs -= !d[st++])
        ;
    return st + (flg & 2);
};
// gzip length
var gzl = function (d) {
    var l = d.length;
    return ((d[l - 4] | d[l - 3] << 8 | d[l - 2] << 16) | (d[l - 1] << 24)) >>> 0;
};
// gzip header length
var gzhl = function (o) { return 10 + ((o.filename && (o.filename.length + 1)) || 0); };
// zlib header
var zlh = function (c, o) {
    var lv = o.level, fl = lv == 0 ? 0 : lv < 6 ? 1 : lv == 9 ? 3 : 2;
    c[0] = 120, c[1] = (fl << 6) | (fl ? (32 - 2 * fl) : 1);
};
// zlib valid
var zlv = function (d) {
    if ((d[0] & 15) != 8 || (d[0] >>> 4) > 7 || ((d[0] << 8 | d[1]) % 31))
        err(6, 'invalid zlib data');
    if (d[1] & 32)
        err(6, 'invalid zlib data: preset dictionaries not supported');
};
function AsyncCmpStrm(opts, cb) {
    if (!cb && typeof opts == 'function')
        cb = opts, opts = {};
    this.ondata = cb;
    return opts;
}
// zlib footer: -4 to -0 is Adler32
/**
 * Streaming DEFLATE compression
 */
var Deflate = /*#__PURE__*/ (function () {
    function Deflate(opts, cb) {
        if (!cb && typeof opts == 'function')
            cb = opts, opts = {};
        this.ondata = cb;
        this.o = opts || {};
    }
    Deflate.prototype.p = function (c, f) {
        this.ondata(dopt(c, this.o, 0, 0, !f), f);
    };
    /**
     * Pushes a chunk to be deflated
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    Deflate.prototype.push = function (chunk, final) {
        if (!this.ondata)
            err(5);
        if (this.d)
            err(4);
        this.d = final;
        this.p(chunk, final || false);
    };
    return Deflate;
}());
exports.Deflate = Deflate;
/**
 * Asynchronous streaming DEFLATE compression
 */
var AsyncDeflate = /*#__PURE__*/ (function () {
    function AsyncDeflate(opts, cb) {
        astrmify([
            bDflt,
            function () { return [astrm, Deflate]; }
        ], this, AsyncCmpStrm.call(this, opts, cb), function (ev) {
            var strm = new Deflate(ev.data);
            onmessage = astrm(strm);
        }, 6);
    }
    return AsyncDeflate;
}());
exports.AsyncDeflate = AsyncDeflate;
function deflate(data, opts, cb) {
    if (!cb)
        cb = opts, opts = {};
    if (typeof cb != 'function')
        err(7);
    return cbify(data, opts, [
        bDflt,
    ], function (ev) { return pbf(deflateSync(ev.data[0], ev.data[1])); }, 0, cb);
}
exports.deflate = deflate;
/**
 * Compresses data with DEFLATE without any wrapper
 * @param data The data to compress
 * @param opts The compression options
 * @returns The deflated version of the data
 */
function deflateSync(data, opts) {
    return dopt(data, opts || {}, 0, 0);
}
exports.deflateSync = deflateSync;
/**
 * Streaming DEFLATE decompression
 */
var Inflate = /*#__PURE__*/ (function () {
    /**
     * Creates an inflation stream
     * @param cb The callback to call whenever data is inflated
     */
    function Inflate(cb) {
        this.s = {};
        this.p = new u8(0);
        this.ondata = cb;
    }
    Inflate.prototype.e = function (c) {
        if (!this.ondata)
            err(5);
        if (this.d)
            err(4);
        var l = this.p.length;
        var n = new u8(l + c.length);
        n.set(this.p), n.set(c, l), this.p = n;
    };
    Inflate.prototype.c = function (final) {
        this.d = this.s.i = final || false;
        var bts = this.s.b;
        var dt = inflt(this.p, this.o, this.s);
        this.ondata(slc(dt, bts, this.s.b), this.d);
        this.o = slc(dt, this.s.b - 32768), this.s.b = this.o.length;
        this.p = slc(this.p, (this.s.p / 8) | 0), this.s.p &= 7;
    };
    /**
     * Pushes a chunk to be inflated
     * @param chunk The chunk to push
     * @param final Whether this is the final chunk
     */
    Inflate.prototype.push = function (chunk, final) {
        this.e(chunk), this.c(final);
    };
    return Inflate;
}());
exports.Inflate = Inflate;
/**
 * Asynchronous streaming DEFLATE decompression
 */
var AsyncInflate = /*#__PURE__*/ (function () {
    /**
     * Creates an asynchronous inflation stream
     * @param cb The callback to call whenever data is deflated
     */
    function AsyncInflate(cb) {
        this.ondata = cb;
        astrmify([
            bInflt,
            function () { return [astrm, Inflate]; }
        ], this, 0, function () {
            var strm = new Inflate();
            onmessage = astrm(strm);
        }, 7);
    }
    return AsyncInflate;
}());
exports.AsyncInflate = AsyncInflate;
function inflate(data, opts, cb) {
    if (!cb)
        cb = opts, opts = {};
    if (typeof cb != 'function')
        err(7);
    return cbify(data, opts, [
        bInflt
    ], function (ev) { return pbf(inflateSync(ev.data[0], gu8(ev.data[1]))); }, 1, cb);
}
exports.inflate = inflate;
/**
 * Expands DEFLATE data with no wrapper
 * @param data The data to decompress
 * @param out Where to write the data. Saves memory if you know the decompressed size and provide an output buffer of that length.
 * @returns The decompressed version of the data
 */
function inflateSync(data, out) {
    return inflt(data, out);
}
exports.inflateSync = inflateSync;
// before you yell at me for not just using extends, my reason is that TS inheritance is hard to workerize.
/**
 * Streaming GZIP compression
 */
var Gzip = /*#__PURE__*/ (function () {
    function Gzip(opts, cb) {
        this.c = crc();
        this.l = 0;
        this.v = 1;
        Deflate.call(this, opts, cb);
    }
    /**
     * Pushes a chunk to be GZIPped
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    Gzip.prototype.push = function (chunk, final) {
        Deflate.prototype.push.call(this, chunk, final);
    };
    Gzip.prototype.p = function (c, f) {
        this.c.p(c);
        this.l += c.length;
        var raw = dopt(c, this.o, this.v && gzhl(this.o), f && 8, !f);
        if (this.v)
            gzh(raw, this.o), this.v = 0;
        if (f)
            wbytes(raw, raw.length - 8, this.c.d()), wbytes(raw, raw.length - 4, this.l);
        this.ondata(raw, f);
    };
    return Gzip;
}());
exports.Gzip = Gzip;
exports.Compress = Gzip;
/**
 * Asynchronous streaming GZIP compression
 */
var AsyncGzip = /*#__PURE__*/ (function () {
    function AsyncGzip(opts, cb) {
        astrmify([
            bDflt,
            gze,
            function () { return [astrm, Deflate, Gzip]; }
        ], this, AsyncCmpStrm.call(this, opts, cb), function (ev) {
            var strm = new Gzip(ev.data);
            onmessage = astrm(strm);
        }, 8);
    }
    return AsyncGzip;
}());
exports.AsyncGzip = AsyncGzip;
exports.AsyncCompress = AsyncGzip;
function gzip(data, opts, cb) {
    if (!cb)
        cb = opts, opts = {};
    if (typeof cb != 'function')
        err(7);
    return cbify(data, opts, [
        bDflt,
        gze,
        function () { return [gzipSync]; }
    ], function (ev) { return pbf(gzipSync(ev.data[0], ev.data[1])); }, 2, cb);
}
exports.gzip = gzip;
exports.compress = gzip;
/**
 * Compresses data with GZIP
 * @param data The data to compress
 * @param opts The compression options
 * @returns The gzipped version of the data
 */
function gzipSync(data, opts) {
    if (!opts)
        opts = {};
    var c = crc(), l = data.length;
    c.p(data);
    var d = dopt(data, opts, gzhl(opts), 8), s = d.length;
    return gzh(d, opts), wbytes(d, s - 8, c.d()), wbytes(d, s - 4, l), d;
}
exports.gzipSync = gzipSync;
exports.compressSync = gzipSync;
/**
 * Streaming GZIP decompression
 */
var Gunzip = /*#__PURE__*/ (function () {
    /**
     * Creates a GUNZIP stream
     * @param cb The callback to call whenever data is inflated
     */
    function Gunzip(cb) {
        this.v = 1;
        Inflate.call(this, cb);
    }
    /**
     * Pushes a chunk to be GUNZIPped
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    Gunzip.prototype.push = function (chunk, final) {
        Inflate.prototype.e.call(this, chunk);
        if (this.v) {
            var s = this.p.length > 3 ? gzs(this.p) : 4;
            if (s >= this.p.length && !final)
                return;
            this.p = this.p.subarray(s), this.v = 0;
        }
        if (final) {
            if (this.p.length < 8)
                err(6, 'invalid gzip data');
            this.p = this.p.subarray(0, -8);
        }
        // necessary to prevent TS from using the closure value
        // This allows for workerization to function correctly
        Inflate.prototype.c.call(this, final);
    };
    return Gunzip;
}());
exports.Gunzip = Gunzip;
/**
 * Asynchronous streaming GZIP decompression
 */
var AsyncGunzip = /*#__PURE__*/ (function () {
    /**
     * Creates an asynchronous GUNZIP stream
     * @param cb The callback to call whenever data is deflated
     */
    function AsyncGunzip(cb) {
        this.ondata = cb;
        astrmify([
            bInflt,
            guze,
            function () { return [astrm, Inflate, Gunzip]; }
        ], this, 0, function () {
            var strm = new Gunzip();
            onmessage = astrm(strm);
        }, 9);
    }
    return AsyncGunzip;
}());
exports.AsyncGunzip = AsyncGunzip;
function gunzip(data, opts, cb) {
    if (!cb)
        cb = opts, opts = {};
    if (typeof cb != 'function')
        err(7);
    return cbify(data, opts, [
        bInflt,
        guze,
        function () { return [gunzipSync]; }
    ], function (ev) { return pbf(gunzipSync(ev.data[0])); }, 3, cb);
}
exports.gunzip = gunzip;
/**
 * Expands GZIP data
 * @param data The data to decompress
 * @param out Where to write the data. GZIP already encodes the output size, so providing this doesn't save memory.
 * @returns The decompressed version of the data
 */
function gunzipSync(data, out) {
    return inflt(data.subarray(gzs(data), -8), out || new u8(gzl(data)));
}
exports.gunzipSync = gunzipSync;
/**
 * Streaming Zlib compression
 */
var Zlib = /*#__PURE__*/ (function () {
    function Zlib(opts, cb) {
        this.c = adler();
        this.v = 1;
        Deflate.call(this, opts, cb);
    }
    /**
     * Pushes a chunk to be zlibbed
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    Zlib.prototype.push = function (chunk, final) {
        Deflate.prototype.push.call(this, chunk, final);
    };
    Zlib.prototype.p = function (c, f) {
        this.c.p(c);
        var raw = dopt(c, this.o, this.v && 2, f && 4, !f);
        if (this.v)
            zlh(raw, this.o), this.v = 0;
        if (f)
            wbytes(raw, raw.length - 4, this.c.d());
        this.ondata(raw, f);
    };
    return Zlib;
}());
exports.Zlib = Zlib;
/**
 * Asynchronous streaming Zlib compression
 */
var AsyncZlib = /*#__PURE__*/ (function () {
    function AsyncZlib(opts, cb) {
        astrmify([
            bDflt,
            zle,
            function () { return [astrm, Deflate, Zlib]; }
        ], this, AsyncCmpStrm.call(this, opts, cb), function (ev) {
            var strm = new Zlib(ev.data);
            onmessage = astrm(strm);
        }, 10);
    }
    return AsyncZlib;
}());
exports.AsyncZlib = AsyncZlib;
function zlib(data, opts, cb) {
    if (!cb)
        cb = opts, opts = {};
    if (typeof cb != 'function')
        err(7);
    return cbify(data, opts, [
        bDflt,
        zle,
        function () { return [zlibSync]; }
    ], function (ev) { return pbf(zlibSync(ev.data[0], ev.data[1])); }, 4, cb);
}
exports.zlib = zlib;
/**
 * Compress data with Zlib
 * @param data The data to compress
 * @param opts The compression options
 * @returns The zlib-compressed version of the data
 */
function zlibSync(data, opts) {
    if (!opts)
        opts = {};
    var a = adler();
    a.p(data);
    var d = dopt(data, opts, 2, 4);
    return zlh(d, opts), wbytes(d, d.length - 4, a.d()), d;
}
exports.zlibSync = zlibSync;
/**
 * Streaming Zlib decompression
 */
var Unzlib = /*#__PURE__*/ (function () {
    /**
     * Creates a Zlib decompression stream
     * @param cb The callback to call whenever data is inflated
     */
    function Unzlib(cb) {
        this.v = 1;
        Inflate.call(this, cb);
    }
    /**
     * Pushes a chunk to be unzlibbed
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    Unzlib.prototype.push = function (chunk, final) {
        Inflate.prototype.e.call(this, chunk);
        if (this.v) {
            if (this.p.length < 2 && !final)
                return;
            this.p = this.p.subarray(2), this.v = 0;
        }
        if (final) {
            if (this.p.length < 4)
                err(6, 'invalid zlib data');
            this.p = this.p.subarray(0, -4);
        }
        // necessary to prevent TS from using the closure value
        // This allows for workerization to function correctly
        Inflate.prototype.c.call(this, final);
    };
    return Unzlib;
}());
exports.Unzlib = Unzlib;
/**
 * Asynchronous streaming Zlib decompression
 */
var AsyncUnzlib = /*#__PURE__*/ (function () {
    /**
     * Creates an asynchronous Zlib decompression stream
     * @param cb The callback to call whenever data is deflated
     */
    function AsyncUnzlib(cb) {
        this.ondata = cb;
        astrmify([
            bInflt,
            zule,
            function () { return [astrm, Inflate, Unzlib]; }
        ], this, 0, function () {
            var strm = new Unzlib();
            onmessage = astrm(strm);
        }, 11);
    }
    return AsyncUnzlib;
}());
exports.AsyncUnzlib = AsyncUnzlib;
function unzlib(data, opts, cb) {
    if (!cb)
        cb = opts, opts = {};
    if (typeof cb != 'function')
        err(7);
    return cbify(data, opts, [
        bInflt,
        zule,
        function () { return [unzlibSync]; }
    ], function (ev) { return pbf(unzlibSync(ev.data[0], gu8(ev.data[1]))); }, 5, cb);
}
exports.unzlib = unzlib;
/**
 * Expands Zlib data
 * @param data The data to decompress
 * @param out Where to write the data. Saves memory if you know the decompressed size and provide an output buffer of that length.
 * @returns The decompressed version of the data
 */
function unzlibSync(data, out) {
    return inflt((zlv(data), data.subarray(2, -4)), out);
}
exports.unzlibSync = unzlibSync;
/**
 * Streaming GZIP, Zlib, or raw DEFLATE decompression
 */
var Decompress = /*#__PURE__*/ (function () {
    /**
     * Creates a decompression stream
     * @param cb The callback to call whenever data is decompressed
     */
    function Decompress(cb) {
        this.G = Gunzip;
        this.I = Inflate;
        this.Z = Unzlib;
        this.ondata = cb;
    }
    /**
     * Pushes a chunk to be decompressed
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    Decompress.prototype.push = function (chunk, final) {
        if (!this.ondata)
            err(5);
        if (!this.s) {
            if (this.p && this.p.length) {
                var n = new u8(this.p.length + chunk.length);
                n.set(this.p), n.set(chunk, this.p.length);
            }
            else
                this.p = chunk;
            if (this.p.length > 2) {
                var _this_1 = this;
                var cb = function () { _this_1.ondata.apply(_this_1, arguments); };
                this.s = (this.p[0] == 31 && this.p[1] == 139 && this.p[2] == 8)
                    ? new this.G(cb)
                    : ((this.p[0] & 15) != 8 || (this.p[0] >> 4) > 7 || ((this.p[0] << 8 | this.p[1]) % 31))
                        ? new this.I(cb)
                        : new this.Z(cb);
                this.s.push(this.p, final);
                this.p = null;
            }
        }
        else
            this.s.push(chunk, final);
    };
    return Decompress;
}());
exports.Decompress = Decompress;
/**
 * Asynchronous streaming GZIP, Zlib, or raw DEFLATE decompression
 */
var AsyncDecompress = /*#__PURE__*/ (function () {
    /**
   * Creates an asynchronous decompression stream
   * @param cb The callback to call whenever data is decompressed
   */
    function AsyncDecompress(cb) {
        this.G = AsyncGunzip;
        this.I = AsyncInflate;
        this.Z = AsyncUnzlib;
        this.ondata = cb;
    }
    /**
     * Pushes a chunk to be decompressed
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    AsyncDecompress.prototype.push = function (chunk, final) {
        Decompress.prototype.push.call(this, chunk, final);
    };
    return AsyncDecompress;
}());
exports.AsyncDecompress = AsyncDecompress;
function decompress(data, opts, cb) {
    if (!cb)
        cb = opts, opts = {};
    if (typeof cb != 'function')
        err(7);
    return (data[0] == 31 && data[1] == 139 && data[2] == 8)
        ? gunzip(data, opts, cb)
        : ((data[0] & 15) != 8 || (data[0] >> 4) > 7 || ((data[0] << 8 | data[1]) % 31))
            ? inflate(data, opts, cb)
            : unzlib(data, opts, cb);
}
exports.decompress = decompress;
/**
 * Expands compressed GZIP, Zlib, or raw DEFLATE data, automatically detecting the format
 * @param data The data to decompress
 * @param out Where to write the data. Saves memory if you know the decompressed size and provide an output buffer of that length.
 * @returns The decompressed version of the data
 */
function decompressSync(data, out) {
    return (data[0] == 31 && data[1] == 139 && data[2] == 8)
        ? gunzipSync(data, out)
        : ((data[0] & 15) != 8 || (data[0] >> 4) > 7 || ((data[0] << 8 | data[1]) % 31))
            ? inflateSync(data, out)
            : unzlibSync(data, out);
}
exports.decompressSync = decompressSync;
// flatten a directory structure
var fltn = function (d, p, t, o) {
    for (var k in d) {
        var val = d[k], n = p + k, op = o;
        if (Array.isArray(val))
            op = mrg(o, val[1]), val = val[0];
        if (val instanceof u8)
            t[n] = [val, op];
        else {
            t[n += '/'] = [new u8(0), op];
            fltn(val, n, t, o);
        }
    }
};
// text encoder
var te = typeof TextEncoder != 'undefined' && /*#__PURE__*/ new TextEncoder();
// text decoder
var td = typeof TextDecoder != 'undefined' && /*#__PURE__*/ new TextDecoder();
// text decoder stream
var tds = 0;
try {
    td.decode(et, { stream: true });
    tds = 1;
}
catch (e) { }
// decode UTF8
var dutf8 = function (d) {
    for (var r = '', i = 0;;) {
        var c = d[i++];
        var eb = (c > 127) + (c > 223) + (c > 239);
        if (i + eb > d.length)
            return [r, slc(d, i - 1)];
        if (!eb)
            r += String.fromCharCode(c);
        else if (eb == 3) {
            c = ((c & 15) << 18 | (d[i++] & 63) << 12 | (d[i++] & 63) << 6 | (d[i++] & 63)) - 65536,
                r += String.fromCharCode(55296 | (c >> 10), 56320 | (c & 1023));
        }
        else if (eb & 1)
            r += String.fromCharCode((c & 31) << 6 | (d[i++] & 63));
        else
            r += String.fromCharCode((c & 15) << 12 | (d[i++] & 63) << 6 | (d[i++] & 63));
    }
};
/**
 * Streaming UTF-8 decoding
 */
var DecodeUTF8 = /*#__PURE__*/ (function () {
    /**
     * Creates a UTF-8 decoding stream
     * @param cb The callback to call whenever data is decoded
     */
    function DecodeUTF8(cb) {
        this.ondata = cb;
        if (tds)
            this.t = new TextDecoder();
        else
            this.p = et;
    }
    /**
     * Pushes a chunk to be decoded from UTF-8 binary
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    DecodeUTF8.prototype.push = function (chunk, final) {
        if (!this.ondata)
            err(5);
        final = !!final;
        if (this.t) {
            this.ondata(this.t.decode(chunk, { stream: true }), final);
            if (final) {
                if (this.t.decode().length)
                    err(8);
                this.t = null;
            }
            return;
        }
        if (!this.p)
            err(4);
        var dat = new u8(this.p.length + chunk.length);
        dat.set(this.p);
        dat.set(chunk, this.p.length);
        var _a = dutf8(dat), ch = _a[0], np = _a[1];
        if (final) {
            if (np.length)
                err(8);
            this.p = null;
        }
        else
            this.p = np;
        this.ondata(ch, final);
    };
    return DecodeUTF8;
}());
exports.DecodeUTF8 = DecodeUTF8;
/**
 * Streaming UTF-8 encoding
 */
var EncodeUTF8 = /*#__PURE__*/ (function () {
    /**
     * Creates a UTF-8 decoding stream
     * @param cb The callback to call whenever data is encoded
     */
    function EncodeUTF8(cb) {
        this.ondata = cb;
    }
    /**
     * Pushes a chunk to be encoded to UTF-8
     * @param chunk The string data to push
     * @param final Whether this is the last chunk
     */
    EncodeUTF8.prototype.push = function (chunk, final) {
        if (!this.ondata)
            err(5);
        if (this.d)
            err(4);
        this.ondata(strToU8(chunk), this.d = final || false);
    };
    return EncodeUTF8;
}());
exports.EncodeUTF8 = EncodeUTF8;
/**
 * Converts a string into a Uint8Array for use with compression/decompression methods
 * @param str The string to encode
 * @param latin1 Whether or not to interpret the data as Latin-1. This should
 *               not need to be true unless decoding a binary string.
 * @returns The string encoded in UTF-8/Latin-1 binary
 */
function strToU8(str, latin1) {
    if (latin1) {
        var ar_1 = new u8(str.length);
        for (var i = 0; i < str.length; ++i)
            ar_1[i] = str.charCodeAt(i);
        return ar_1;
    }
    if (te)
        return te.encode(str);
    var l = str.length;
    var ar = new u8(str.length + (str.length >> 1));
    var ai = 0;
    var w = function (v) { ar[ai++] = v; };
    for (var i = 0; i < l; ++i) {
        if (ai + 5 > ar.length) {
            var n = new u8(ai + 8 + ((l - i) << 1));
            n.set(ar);
            ar = n;
        }
        var c = str.charCodeAt(i);
        if (c < 128 || latin1)
            w(c);
        else if (c < 2048)
            w(192 | (c >> 6)), w(128 | (c & 63));
        else if (c > 55295 && c < 57344)
            c = 65536 + (c & 1023 << 10) | (str.charCodeAt(++i) & 1023),
                w(240 | (c >> 18)), w(128 | ((c >> 12) & 63)), w(128 | ((c >> 6) & 63)), w(128 | (c & 63));
        else
            w(224 | (c >> 12)), w(128 | ((c >> 6) & 63)), w(128 | (c & 63));
    }
    return slc(ar, 0, ai);
}
exports.strToU8 = strToU8;
/**
 * Converts a Uint8Array to a string
 * @param dat The data to decode to string
 * @param latin1 Whether or not to interpret the data as Latin-1. This should
 *               not need to be true unless encoding to binary string.
 * @returns The original UTF-8/Latin-1 string
 */
function strFromU8(dat, latin1) {
    if (latin1) {
        var r = '';
        for (var i = 0; i < dat.length; i += 16384)
            r += String.fromCharCode.apply(null, dat.subarray(i, i + 16384));
        return r;
    }
    else if (td)
        return td.decode(dat);
    else {
        var _a = dutf8(dat), out = _a[0], ext = _a[1];
        if (ext.length)
            err(8);
        return out;
    }
}
exports.strFromU8 = strFromU8;
;
// deflate bit flag
var dbf = function (l) { return l == 1 ? 3 : l < 6 ? 2 : l == 9 ? 1 : 0; };
// skip local zip header
var slzh = function (d, b) { return b + 30 + b2(d, b + 26) + b2(d, b + 28); };
// read zip header
var zh = function (d, b, z) {
    var fnl = b2(d, b + 28), fn = strFromU8(d.subarray(b + 46, b + 46 + fnl), !(b2(d, b + 8) & 2048)), es = b + 46 + fnl, bs = b4(d, b + 20);
    var _a = z && bs == 4294967295 ? z64e(d, es) : [bs, b4(d, b + 24), b4(d, b + 42)], sc = _a[0], su = _a[1], off = _a[2];
    return [b2(d, b + 10), sc, su, fn, es + b2(d, b + 30) + b2(d, b + 32), off];
};
// read zip64 extra field
var z64e = function (d, b) {
    for (; b2(d, b) != 1; b += 4 + b2(d, b + 2))
        ;
    return [b8(d, b + 12), b8(d, b + 4), b8(d, b + 20)];
};
// extra field length
var exfl = function (ex) {
    var le = 0;
    if (ex) {
        for (var k in ex) {
            var l = ex[k].length;
            if (l > 65535)
                err(9);
            le += l + 4;
        }
    }
    return le;
};
// write zip header
var wzh = function (d, b, f, fn, u, c, ce, co) {
    var fl = fn.length, ex = f.extra, col = co && co.length;
    var exl = exfl(ex);
    wbytes(d, b, ce != null ? 0x2014B50 : 0x4034B50), b += 4;
    if (ce != null)
        d[b++] = 20, d[b++] = f.os;
    d[b] = 20, b += 2; // spec compliance? what's that?
    d[b++] = (f.flag << 1) | (c < 0 && 8), d[b++] = u && 8;
    d[b++] = f.compression & 255, d[b++] = f.compression >> 8;
    var dt = new Date(f.mtime == null ? Date.now() : f.mtime), y = dt.getFullYear() - 1980;
    if (y < 0 || y > 119)
        err(10);
    wbytes(d, b, (y << 25) | ((dt.getMonth() + 1) << 21) | (dt.getDate() << 16) | (dt.getHours() << 11) | (dt.getMinutes() << 5) | (dt.getSeconds() >>> 1)), b += 4;
    if (c != -1) {
        wbytes(d, b, f.crc);
        wbytes(d, b + 4, c < 0 ? -c - 2 : c);
        wbytes(d, b + 8, f.size);
    }
    wbytes(d, b + 12, fl);
    wbytes(d, b + 14, exl), b += 16;
    if (ce != null) {
        wbytes(d, b, col);
        wbytes(d, b + 6, f.attrs);
        wbytes(d, b + 10, ce), b += 14;
    }
    d.set(fn, b);
    b += fl;
    if (exl) {
        for (var k in ex) {
            var exf = ex[k], l = exf.length;
            wbytes(d, b, +k);
            wbytes(d, b + 2, l);
            d.set(exf, b + 4), b += 4 + l;
        }
    }
    if (col)
        d.set(co, b), b += col;
    return b;
};
// write zip footer (end of central directory)
var wzf = function (o, b, c, d, e) {
    wbytes(o, b, 0x6054B50); // skip disk
    wbytes(o, b + 8, c);
    wbytes(o, b + 10, c);
    wbytes(o, b + 12, d);
    wbytes(o, b + 16, e);
};
/**
 * A pass-through stream to keep data uncompressed in a ZIP archive.
 */
var ZipPassThrough = /*#__PURE__*/ (function () {
    /**
     * Creates a pass-through stream that can be added to ZIP archives
     * @param filename The filename to associate with this data stream
     */
    function ZipPassThrough(filename) {
        this.filename = filename;
        this.c = crc();
        this.size = 0;
        this.compression = 0;
    }
    /**
     * Processes a chunk and pushes to the output stream. You can override this
     * method in a subclass for custom behavior, but by default this passes
     * the data through. You must call this.ondata(err, chunk, final) at some
     * point in this method.
     * @param chunk The chunk to process
     * @param final Whether this is the last chunk
     */
    ZipPassThrough.prototype.process = function (chunk, final) {
        this.ondata(null, chunk, final);
    };
    /**
     * Pushes a chunk to be added. If you are subclassing this with a custom
     * compression algorithm, note that you must push data from the source
     * file only, pre-compression.
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    ZipPassThrough.prototype.push = function (chunk, final) {
        if (!this.ondata)
            err(5);
        this.c.p(chunk);
        this.size += chunk.length;
        if (final)
            this.crc = this.c.d();
        this.process(chunk, final || false);
    };
    return ZipPassThrough;
}());
exports.ZipPassThrough = ZipPassThrough;
// I don't extend because TypeScript extension adds 1kB of runtime bloat
/**
 * Streaming DEFLATE compression for ZIP archives. Prefer using AsyncZipDeflate
 * for better performance
 */
var ZipDeflate = /*#__PURE__*/ (function () {
    /**
     * Creates a DEFLATE stream that can be added to ZIP archives
     * @param filename The filename to associate with this data stream
     * @param opts The compression options
     */
    function ZipDeflate(filename, opts) {
        var _this_1 = this;
        if (!opts)
            opts = {};
        ZipPassThrough.call(this, filename);
        this.d = new Deflate(opts, function (dat, final) {
            _this_1.ondata(null, dat, final);
        });
        this.compression = 8;
        this.flag = dbf(opts.level);
    }
    ZipDeflate.prototype.process = function (chunk, final) {
        try {
            this.d.push(chunk, final);
        }
        catch (e) {
            this.ondata(e, null, final);
        }
    };
    /**
     * Pushes a chunk to be deflated
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    ZipDeflate.prototype.push = function (chunk, final) {
        ZipPassThrough.prototype.push.call(this, chunk, final);
    };
    return ZipDeflate;
}());
exports.ZipDeflate = ZipDeflate;
/**
 * Asynchronous streaming DEFLATE compression for ZIP archives
 */
var AsyncZipDeflate = /*#__PURE__*/ (function () {
    /**
     * Creates a DEFLATE stream that can be added to ZIP archives
     * @param filename The filename to associate with this data stream
     * @param opts The compression options
     */
    function AsyncZipDeflate(filename, opts) {
        var _this_1 = this;
        if (!opts)
            opts = {};
        ZipPassThrough.call(this, filename);
        this.d = new AsyncDeflate(opts, function (err, dat, final) {
            _this_1.ondata(err, dat, final);
        });
        this.compression = 8;
        this.flag = dbf(opts.level);
        this.terminate = this.d.terminate;
    }
    AsyncZipDeflate.prototype.process = function (chunk, final) {
        this.d.push(chunk, final);
    };
    /**
     * Pushes a chunk to be deflated
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    AsyncZipDeflate.prototype.push = function (chunk, final) {
        ZipPassThrough.prototype.push.call(this, chunk, final);
    };
    return AsyncZipDeflate;
}());
exports.AsyncZipDeflate = AsyncZipDeflate;
// TODO: Better tree shaking
/**
 * A zippable archive to which files can incrementally be added
 */
var Zip = /*#__PURE__*/ (function () {
    /**
     * Creates an empty ZIP archive to which files can be added
     * @param cb The callback to call whenever data for the generated ZIP archive
     *           is available
     */
    function Zip(cb) {
        this.ondata = cb;
        this.u = [];
        this.d = 1;
    }
    /**
     * Adds a file to the ZIP archive
     * @param file The file stream to add
     */
    Zip.prototype.add = function (file) {
        var _this_1 = this;
        if (!this.ondata)
            err(5);
        // finishing or finished
        if (this.d & 2)
            this.ondata(err(4 + (this.d & 1) * 8, 0, 1), null, false);
        else {
            var f = strToU8(file.filename), fl_1 = f.length;
            var com = file.comment, o = com && strToU8(com);
            var u = fl_1 != file.filename.length || (o && (com.length != o.length));
            var hl_1 = fl_1 + exfl(file.extra) + 30;
            if (fl_1 > 65535)
                this.ondata(err(11, 0, 1), null, false);
            var header = new u8(hl_1);
            wzh(header, 0, file, f, u, -1);
            var chks_1 = [header];
            var pAll_1 = function () {
                for (var _i = 0, chks_2 = chks_1; _i < chks_2.length; _i++) {
                    var chk = chks_2[_i];
                    _this_1.ondata(null, chk, false);
                }
                chks_1 = [];
            };
            var tr_1 = this.d;
            this.d = 0;
            var ind_1 = this.u.length;
            var uf_1 = mrg(file, {
                f: f,
                u: u,
                o: o,
                t: function () {
                    if (file.terminate)
                        file.terminate();
                },
                r: function () {
                    pAll_1();
                    if (tr_1) {
                        var nxt = _this_1.u[ind_1 + 1];
                        if (nxt)
                            nxt.r();
                        else
                            _this_1.d = 1;
                    }
                    tr_1 = 1;
                }
            });
            var cl_1 = 0;
            file.ondata = function (err, dat, final) {
                if (err) {
                    _this_1.ondata(err, dat, final);
                    _this_1.terminate();
                }
                else {
                    cl_1 += dat.length;
                    chks_1.push(dat);
                    if (final) {
                        var dd = new u8(16);
                        wbytes(dd, 0, 0x8074B50);
                        wbytes(dd, 4, file.crc);
                        wbytes(dd, 8, cl_1);
                        wbytes(dd, 12, file.size);
                        chks_1.push(dd);
                        uf_1.c = cl_1, uf_1.b = hl_1 + cl_1 + 16, uf_1.crc = file.crc, uf_1.size = file.size;
                        if (tr_1)
                            uf_1.r();
                        tr_1 = 1;
                    }
                    else if (tr_1)
                        pAll_1();
                }
            };
            this.u.push(uf_1);
        }
    };
    /**
     * Ends the process of adding files and prepares to emit the final chunks.
     * This *must* be called after adding all desired files for the resulting
     * ZIP file to work properly.
     */
    Zip.prototype.end = function () {
        var _this_1 = this;
        if (this.d & 2) {
            this.ondata(err(4 + (this.d & 1) * 8, 0, 1), null, true);
            return;
        }
        if (this.d)
            this.e();
        else
            this.u.push({
                r: function () {
                    if (!(_this_1.d & 1))
                        return;
                    _this_1.u.splice(-1, 1);
                    _this_1.e();
                },
                t: function () { }
            });
        this.d = 3;
    };
    Zip.prototype.e = function () {
        var bt = 0, l = 0, tl = 0;
        for (var _i = 0, _a = this.u; _i < _a.length; _i++) {
            var f = _a[_i];
            tl += 46 + f.f.length + exfl(f.extra) + (f.o ? f.o.length : 0);
        }
        var out = new u8(tl + 22);
        for (var _b = 0, _c = this.u; _b < _c.length; _b++) {
            var f = _c[_b];
            wzh(out, bt, f, f.f, f.u, -f.c - 2, l, f.o);
            bt += 46 + f.f.length + exfl(f.extra) + (f.o ? f.o.length : 0), l += f.b;
        }
        wzf(out, bt, this.u.length, tl, l);
        this.ondata(null, out, true);
        this.d = 2;
    };
    /**
     * A method to terminate any internal workers used by the stream. Subsequent
     * calls to add() will fail.
     */
    Zip.prototype.terminate = function () {
        for (var _i = 0, _a = this.u; _i < _a.length; _i++) {
            var f = _a[_i];
            f.t();
        }
        this.d = 2;
    };
    return Zip;
}());
exports.Zip = Zip;
function zip(data, opts, cb) {
    if (!cb)
        cb = opts, opts = {};
    if (typeof cb != 'function')
        err(7);
    var r = {};
    fltn(data, '', r, opts);
    var k = Object.keys(r);
    var lft = k.length, o = 0, tot = 0;
    var slft = lft, files = new Array(lft);
    var term = [];
    var tAll = function () {
        for (var i = 0; i < term.length; ++i)
            term[i]();
    };
    var cbd = function (a, b) {
        mt(function () { cb(a, b); });
    };
    mt(function () { cbd = cb; });
    var cbf = function () {
        var out = new u8(tot + 22), oe = o, cdl = tot - o;
        tot = 0;
        for (var i = 0; i < slft; ++i) {
            var f = files[i];
            try {
                var l = f.c.length;
                wzh(out, tot, f, f.f, f.u, l);
                var badd = 30 + f.f.length + exfl(f.extra);
                var loc = tot + badd;
                out.set(f.c, loc);
                wzh(out, o, f, f.f, f.u, l, tot, f.m), o += 16 + badd + (f.m ? f.m.length : 0), tot = loc + l;
            }
            catch (e) {
                return cbd(e, null);
            }
        }
        wzf(out, o, files.length, cdl, oe);
        cbd(null, out);
    };
    if (!lft)
        cbf();
    var _loop_1 = function (i) {
        var fn = k[i];
        var _a = r[fn], file = _a[0], p = _a[1];
        var c = crc(), size = file.length;
        c.p(file);
        var f = strToU8(fn), s = f.length;
        var com = p.comment, m = com && strToU8(com), ms = m && m.length;
        var exl = exfl(p.extra);
        var compression = p.level == 0 ? 0 : 8;
        var cbl = function (e, d) {
            if (e) {
                tAll();
                cbd(e, null);
            }
            else {
                var l = d.length;
                files[i] = mrg(p, {
                    size: size,
                    crc: c.d(),
                    c: d,
                    f: f,
                    m: m,
                    u: s != fn.length || (m && (com.length != ms)),
                    compression: compression
                });
                o += 30 + s + exl + l;
                tot += 76 + 2 * (s + exl) + (ms || 0) + l;
                if (!--lft)
                    cbf();
            }
        };
        if (s > 65535)
            cbl(err(11, 0, 1), null);
        if (!compression)
            cbl(null, file);
        else if (size < 160000) {
            try {
                cbl(null, deflateSync(file, p));
            }
            catch (e) {
                cbl(e, null);
            }
        }
        else
            term.push(deflate(file, p, cbl));
    };
    // Cannot use lft because it can decrease
    for (var i = 0; i < slft; ++i) {
        _loop_1(i);
    }
    return tAll;
}
exports.zip = zip;
/**
 * Synchronously creates a ZIP file. Prefer using `zip` for better performance
 * with more than one file.
 * @param data The directory structure for the ZIP archive
 * @param opts The main options, merged with per-file options
 * @returns The generated ZIP archive
 */
function zipSync(data, opts) {
    if (!opts)
        opts = {};
    var r = {};
    var files = [];
    fltn(data, '', r, opts);
    var o = 0;
    var tot = 0;
    for (var fn in r) {
        var _a = r[fn], file = _a[0], p = _a[1];
        var compression = p.level == 0 ? 0 : 8;
        var f = strToU8(fn), s = f.length;
        var com = p.comment, m = com && strToU8(com), ms = m && m.length;
        var exl = exfl(p.extra);
        if (s > 65535)
            err(11);
        var d = compression ? deflateSync(file, p) : file, l = d.length;
        var c = crc();
        c.p(file);
        files.push(mrg(p, {
            size: file.length,
            crc: c.d(),
            c: d,
            f: f,
            m: m,
            u: s != fn.length || (m && (com.length != ms)),
            o: o,
            compression: compression
        }));
        o += 30 + s + exl + l;
        tot += 76 + 2 * (s + exl) + (ms || 0) + l;
    }
    var out = new u8(tot + 22), oe = o, cdl = tot - o;
    for (var i = 0; i < files.length; ++i) {
        var f = files[i];
        wzh(out, f.o, f, f.f, f.u, f.c.length);
        var badd = 30 + f.f.length + exfl(f.extra);
        out.set(f.c, f.o + badd);
        wzh(out, o, f, f.f, f.u, f.c.length, f.o, f.m), o += 16 + badd + (f.m ? f.m.length : 0);
    }
    wzf(out, o, files.length, cdl, oe);
    return out;
}
exports.zipSync = zipSync;
/**
 * Streaming pass-through decompression for ZIP archives
 */
var UnzipPassThrough = /*#__PURE__*/ (function () {
    function UnzipPassThrough() {
    }
    UnzipPassThrough.prototype.push = function (data, final) {
        this.ondata(null, data, final);
    };
    UnzipPassThrough.compression = 0;
    return UnzipPassThrough;
}());
exports.UnzipPassThrough = UnzipPassThrough;
/**
 * Streaming DEFLATE decompression for ZIP archives. Prefer AsyncZipInflate for
 * better performance.
 */
var UnzipInflate = /*#__PURE__*/ (function () {
    /**
     * Creates a DEFLATE decompression that can be used in ZIP archives
     */
    function UnzipInflate() {
        var _this_1 = this;
        this.i = new Inflate(function (dat, final) {
            _this_1.ondata(null, dat, final);
        });
    }
    UnzipInflate.prototype.push = function (data, final) {
        try {
            this.i.push(data, final);
        }
        catch (e) {
            this.ondata(e, null, final);
        }
    };
    UnzipInflate.compression = 8;
    return UnzipInflate;
}());
exports.UnzipInflate = UnzipInflate;
/**
 * Asynchronous streaming DEFLATE decompression for ZIP archives
 */
var AsyncUnzipInflate = /*#__PURE__*/ (function () {
    /**
     * Creates a DEFLATE decompression that can be used in ZIP archives
     */
    function AsyncUnzipInflate(_, sz) {
        var _this_1 = this;
        if (sz < 320000) {
            this.i = new Inflate(function (dat, final) {
                _this_1.ondata(null, dat, final);
            });
        }
        else {
            this.i = new AsyncInflate(function (err, dat, final) {
                _this_1.ondata(err, dat, final);
            });
            this.terminate = this.i.terminate;
        }
    }
    AsyncUnzipInflate.prototype.push = function (data, final) {
        if (this.i.terminate)
            data = slc(data, 0);
        this.i.push(data, final);
    };
    AsyncUnzipInflate.compression = 8;
    return AsyncUnzipInflate;
}());
exports.AsyncUnzipInflate = AsyncUnzipInflate;
/**
 * A ZIP archive decompression stream that emits files as they are discovered
 */
var Unzip = /*#__PURE__*/ (function () {
    /**
     * Creates a ZIP decompression stream
     * @param cb The callback to call whenever a file in the ZIP archive is found
     */
    function Unzip(cb) {
        this.onfile = cb;
        this.k = [];
        this.o = {
            0: UnzipPassThrough
        };
        this.p = et;
    }
    /**
     * Pushes a chunk to be unzipped
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    Unzip.prototype.push = function (chunk, final) {
        var _this_1 = this;
        if (!this.onfile)
            err(5);
        if (!this.p)
            err(4);
        if (this.c > 0) {
            var len = Math.min(this.c, chunk.length);
            var toAdd = chunk.subarray(0, len);
            this.c -= len;
            if (this.d)
                this.d.push(toAdd, !this.c);
            else
                this.k[0].push(toAdd);
            chunk = chunk.subarray(len);
            if (chunk.length)
                return this.push(chunk, final);
        }
        else {
            var f = 0, i = 0, is = void 0, buf = void 0;
            if (!this.p.length)
                buf = chunk;
            else if (!chunk.length)
                buf = this.p;
            else {
                buf = new u8(this.p.length + chunk.length);
                buf.set(this.p), buf.set(chunk, this.p.length);
            }
            var l = buf.length, oc = this.c, add = oc && this.d;
            var _loop_2 = function () {
                var _a;
                var sig = b4(buf, i);
                if (sig == 0x4034B50) {
                    f = 1, is = i;
                    this_1.d = null;
                    this_1.c = 0;
                    var bf = b2(buf, i + 6), cmp_1 = b2(buf, i + 8), u = bf & 2048, dd = bf & 8, fnl = b2(buf, i + 26), es = b2(buf, i + 28);
                    if (l > i + 30 + fnl + es) {
                        var chks_3 = [];
                        this_1.k.unshift(chks_3);
                        f = 2;
                        var sc_1 = b4(buf, i + 18), su_1 = b4(buf, i + 22);
                        var fn_1 = strFromU8(buf.subarray(i + 30, i += 30 + fnl), !u);
                        if (sc_1 == 4294967295) {
                            _a = dd ? [-2] : z64e(buf, i), sc_1 = _a[0], su_1 = _a[1];
                        }
                        else if (dd)
                            sc_1 = -1;
                        i += es;
                        this_1.c = sc_1;
                        var d_1;
                        var file_1 = {
                            name: fn_1,
                            compression: cmp_1,
                            start: function () {
                                if (!file_1.ondata)
                                    err(5);
                                if (!sc_1)
                                    file_1.ondata(null, et, true);
                                else {
                                    var ctr = _this_1.o[cmp_1];
                                    if (!ctr)
                                        file_1.ondata(err(14, 'unknown compression type ' + cmp_1, 1), null, false);
                                    d_1 = sc_1 < 0 ? new ctr(fn_1) : new ctr(fn_1, sc_1, su_1);
                                    d_1.ondata = function (err, dat, final) { file_1.ondata(err, dat, final); };
                                    for (var _i = 0, chks_4 = chks_3; _i < chks_4.length; _i++) {
                                        var dat = chks_4[_i];
                                        d_1.push(dat, false);
                                    }
                                    if (_this_1.k[0] == chks_3 && _this_1.c)
                                        _this_1.d = d_1;
                                    else
                                        d_1.push(et, true);
                                }
                            },
                            terminate: function () {
                                if (d_1 && d_1.terminate)
                                    d_1.terminate();
                            }
                        };
                        if (sc_1 >= 0)
                            file_1.size = sc_1, file_1.originalSize = su_1;
                        this_1.onfile(file_1);
                    }
                    return "break";
                }
                else if (oc) {
                    if (sig == 0x8074B50) {
                        is = i += 12 + (oc == -2 && 8), f = 3, this_1.c = 0;
                        return "break";
                    }
                    else if (sig == 0x2014B50) {
                        is = i -= 4, f = 3, this_1.c = 0;
                        return "break";
                    }
                }
            };
            var this_1 = this;
            for (; i < l - 4; ++i) {
                var state_1 = _loop_2();
                if (state_1 === "break")
                    break;
            }
            this.p = et;
            if (oc < 0) {
                var dat = f ? buf.subarray(0, is - 12 - (oc == -2 && 8) - (b4(buf, is - 16) == 0x8074B50 && 4)) : buf.subarray(0, i);
                if (add)
                    add.push(dat, !!f);
                else
                    this.k[+(f == 2)].push(dat);
            }
            if (f & 2)
                return this.push(buf.subarray(i), final);
            this.p = buf.subarray(i);
        }
        if (final) {
            if (this.c)
                err(13);
            this.p = null;
        }
    };
    /**
     * Registers a decoder with the stream, allowing for files compressed with
     * the compression type provided to be expanded correctly
     * @param decoder The decoder constructor
     */
    Unzip.prototype.register = function (decoder) {
        this.o[decoder.compression] = decoder;
    };
    return Unzip;
}());
exports.Unzip = Unzip;
var mt = typeof queueMicrotask == 'function' ? queueMicrotask : typeof setTimeout == 'function' ? setTimeout : function (fn) { fn(); };
function unzip(data, opts, cb) {
    if (!cb)
        cb = opts, opts = {};
    if (typeof cb != 'function')
        err(7);
    var term = [];
    var tAll = function () {
        for (var i = 0; i < term.length; ++i)
            term[i]();
    };
    var files = {};
    var cbd = function (a, b) {
        mt(function () { cb(a, b); });
    };
    mt(function () { cbd = cb; });
    var e = data.length - 22;
    for (; b4(data, e) != 0x6054B50; --e) {
        if (!e || data.length - e > 65558) {
            cbd(err(13, 0, 1), null);
            return tAll;
        }
    }
    ;
    var lft = b2(data, e + 8);
    if (lft) {
        var c = lft;
        var o = b4(data, e + 16);
        var z = o == 4294967295 || c == 65535;
        if (z) {
            var ze = b4(data, e - 12);
            z = b4(data, ze) == 0x6064B50;
            if (z) {
                c = lft = b4(data, ze + 32);
                o = b4(data, ze + 48);
            }
        }
        var fltr = opts && opts.filter;
        var _loop_3 = function (i) {
            var _a = zh(data, o, z), c_1 = _a[0], sc = _a[1], su = _a[2], fn = _a[3], no = _a[4], off = _a[5], b = slzh(data, off);
            o = no;
            var cbl = function (e, d) {
                if (e) {
                    tAll();
                    cbd(e, null);
                }
                else {
                    if (d)
                        files[fn] = d;
                    if (!--lft)
                        cbd(null, files);
                }
            };
            if (!fltr || fltr({
                name: fn,
                size: sc,
                originalSize: su,
                compression: c_1
            })) {
                if (!c_1)
                    cbl(null, slc(data, b, b + sc));
                else if (c_1 == 8) {
                    var infl = data.subarray(b, b + sc);
                    if (sc < 320000) {
                        try {
                            cbl(null, inflateSync(infl, new u8(su)));
                        }
                        catch (e) {
                            cbl(e, null);
                        }
                    }
                    else
                        term.push(inflate(infl, { size: su }, cbl));
                }
                else
                    cbl(err(14, 'unknown compression type ' + c_1, 1), null);
            }
            else
                cbl(null, null);
        };
        for (var i = 0; i < c; ++i) {
            _loop_3(i);
        }
    }
    else
        cbd(null, {});
    return tAll;
}
exports.unzip = unzip;
/**
 * Synchronously decompresses a ZIP archive. Prefer using `unzip` for better
 * performance with more than one file.
 * @param data The raw compressed ZIP file
 * @param opts The ZIP extraction options
 * @returns The decompressed files
 */
function unzipSync(data, opts) {
    var files = {};
    var e = data.length - 22;
    for (; b4(data, e) != 0x6054B50; --e) {
        if (!e || data.length - e > 65558)
            err(13);
    }
    ;
    var c = b2(data, e + 8);
    if (!c)
        return {};
    var o = b4(data, e + 16);
    var z = o == 4294967295 || c == 65535;
    if (z) {
        var ze = b4(data, e - 12);
        z = b4(data, ze) == 0x6064B50;
        if (z) {
            c = b4(data, ze + 32);
            o = b4(data, ze + 48);
        }
    }
    var fltr = opts && opts.filter;
    for (var i = 0; i < c; ++i) {
        var _a = zh(data, o, z), c_2 = _a[0], sc = _a[1], su = _a[2], fn = _a[3], no = _a[4], off = _a[5], b = slzh(data, off);
        o = no;
        if (!fltr || fltr({
            name: fn,
            size: sc,
            originalSize: su,
            compression: c_2
        })) {
            if (!c_2)
                files[fn] = slc(data, b, b + sc);
            else if (c_2 == 8)
                files[fn] = inflateSync(data.subarray(b, b + sc), new u8(su));
            else
                err(14, 'unknown compression type ' + c_2);
        }
    }
    return files;
}
exports.unzipSync = unzipSync;

},{"./node-worker.cjs":3}],3:[function(require,module,exports){
"use strict";
var ch2 = {};
exports["default"] = (function (c, id, msg, transfer, cb) {
    var w = new Worker(ch2[id] || (ch2[id] = URL.createObjectURL(new Blob([
        c + ';addEventListener("error",function(e){e=e.error;postMessage({$e$:[e.message,e.code,e.stack]})})'
    ], { type: 'text/javascript' }))));
    w.onmessage = function (e) {
        var d = e.data, ed = d.$e$;
        if (ed) {
            var err = new Error(ed[0]);
            err['code'] = ed[1];
            err.stack = ed[2];
            cb(err, null);
        }
        else
            cb(null, d);
    };
    w.postMessage(msg, transfer);
    return w;
});

},{}],4:[function(require,module,exports){
!function(t,e){if("object"==typeof exports&&"object"==typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n=e();for(var i in n)("object"==typeof exports?exports:t)[i]=n[i]}}(this,(function(){return(()=>{"use strict";var t={d:(e,n)=>{for(var i in n)t.o(n,i)&&!t.o(e,i)&&Object.defineProperty(e,i,{enumerable:!0,get:n[i]})},o:(t,e)=>Object.prototype.hasOwnProperty.call(t,e),r:t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})}},e={};t.r(e),t.d(e,{StreamDataView:()=>o});var n=function(){function t(t){this.encoding=t||"utf-8"}return t.prototype.decode=function(t){var e=String.fromCharCode.apply(null,Array.from(t));return"utf-8"===this.encoding?decodeURIComponent(escape(e)):e},t}(),i=function(){function t(t){this.encoding=t||"utf-8"}return t.prototype.encode=function(t){return"utf-8"===this.encoding&&(t=unescape(encodeURIComponent(t))),new Uint8Array(t.split("").map((function(t){return t.charCodeAt(0)})))},t}(),o=function(){function t(t,e){this.offset=0,this.autoResize=!1,void 0===t&&(t=0,this.autoResize=!0),"number"==typeof t&&(t=new ArrayBuffer(t)),this.view=new DataView(t),this.littleEndian=!e}return t.fromByteString=function(e){var n=new t(e.split(" ").length);return n.fromByteString(e),n},t.fromTextString=function(e,n){var o,s=new t((o=n?new i("utf-8").encode(e):new i("ascii").encode(e)).length);return s.setNextString(e,n,o.length),s},t.prototype.resize=function(t){var e=function(t,e){if(!(t instanceof ArrayBuffer))throw new TypeError("Source must be an instance of ArrayBuffer");if(e<=t.byteLength)return t.slice(0,e);var n=new Uint8Array(t),i=new Uint8Array(new ArrayBuffer(e));return i.set(n),i.buffer}(this.getBuffer(),t);this.view=new DataView(e)},t.prototype.crop=function(){this.resize(this.getOffset())},t.prototype.getBuffer=function(){return this.view.buffer},t.prototype.skip=function(t){this.offset+=t},t.prototype.resetOffset=function(){this.offset=0},t.prototype.getOffset=function(){return this.offset},t.prototype.setOffset=function(t){this.offset=t},t.prototype.getInt8=function(t){return this.view.getInt8(t)},t.prototype.getUint8=function(t){return this.view.getUint8(t)},t.prototype.getNextInt8=function(){var t=this.getInt8(this.offset);return this.offset+=1,t},t.prototype.getNextUint8=function(){var t=this.getUint8(this.offset);return this.offset+=1,t},t.prototype.getInt16=function(t){return this.view.getInt16(t,this.littleEndian)},t.prototype.getUint16=function(t){return this.view.getUint16(t,this.littleEndian)},t.prototype.getNextInt16=function(){var t=this.getInt16(this.offset);return this.offset+=2,t},t.prototype.getNextUint16=function(){var t=this.getUint16(this.offset);return this.offset+=2,t},t.prototype.getInt32=function(t){return this.view.getInt32(t,this.littleEndian)},t.prototype.getUint32=function(t){return this.view.getUint32(t,this.littleEndian)},t.prototype.getNextInt32=function(){var t=this.getInt32(this.offset);return this.offset+=4,t},t.prototype.getNextUint32=function(){var t=this.getUint32(this.offset);return this.offset+=4,t},t.prototype.getFloat32=function(t){return this.view.getFloat32(t,this.littleEndian)},t.prototype.getFloat64=function(t){return this.view.getFloat64(t,this.littleEndian)},t.prototype.getNextFloat32=function(){var t=this.getFloat32(this.offset);return this.offset+=4,t},t.prototype.getNextFloat64=function(){var t=this.getFloat64(this.offset);return this.offset+=8,t},t.prototype.setInt8=function(t,e){this.handleAutoResize(t,1),this.view.setInt8(t,e)},t.prototype.setUint8=function(t,e){this.handleAutoResize(t,1),this.view.setUint8(t,e)},t.prototype.setNextInt8=function(t){this.setInt8(this.offset,t),this.offset+=1},t.prototype.setNextUint8=function(t){this.setUint8(this.offset,t),this.offset+=1},t.prototype.setInt16=function(t,e){this.handleAutoResize(t,2),this.view.setInt16(t,e,this.littleEndian)},t.prototype.setUint16=function(t,e){this.handleAutoResize(t,2),this.view.setUint16(t,e,this.littleEndian)},t.prototype.setNextInt16=function(t){this.setInt16(this.offset,t),this.offset+=2},t.prototype.setNextUint16=function(t){this.setUint16(this.offset,t),this.offset+=2},t.prototype.setInt32=function(t,e){this.handleAutoResize(t,4),this.view.setInt32(t,e,this.littleEndian)},t.prototype.setUint32=function(t,e){this.handleAutoResize(t,4),this.view.setUint32(t,e,this.littleEndian)},t.prototype.setNextInt32=function(t){this.setInt32(this.offset,t),this.offset+=4},t.prototype.setNextUint32=function(t){this.setUint32(this.offset,t),this.offset+=4},t.prototype.setFloat32=function(t,e){this.handleAutoResize(t,8),this.view.setFloat32(t,e,this.littleEndian)},t.prototype.setFloat64=function(t,e){this.handleAutoResize(t,8),this.view.setFloat64(t,e,this.littleEndian)},t.prototype.setNextFloat32=function(t){this.setFloat32(this.offset,t),this.offset+=4},t.prototype.setNextFloat64=function(t){this.setFloat64(this.offset,t),this.offset+=8},t.prototype.getBytes=function(t,e){void 0===t&&(t=0),e=e||this.view.buffer.byteLength-t;var n=this.getBuffer().slice(t,t+e);return new Uint8Array(n)},t.prototype.getNextBytes=function(t){var e=this.getBytes(this.offset,t);return this.offset+=t||0,e},t.prototype.setBytes=function(t,e){(e instanceof ArrayBuffer||Array.isArray(e))&&(e=new Uint8Array(e));var n=e;this.handleAutoResize(t,n.byteLength);for(var i=0;i<n.byteLength;i++)this.setUint8(t+i,n[i])},t.prototype.setNextBytes=function(t){Array.isArray(t)&&(t=new Uint8Array(t)),this.setBytes(this.offset,t),this.offset+=t.byteLength},t.prototype.getString=function(t,e,i,o){var s=this.getBytes(t,e);if(o){var r=s.indexOf(0);r>=0&&(s=s.slice(0,r))}return i?new n("utf-8").decode(s):new n("ascii").decode(s)},t.prototype.getNextString=function(t,e,n){var i=this.getString(this.offset,t,e,n);return this.offset+=t,i},t.prototype.setString=function(t,e,n,o){var s;s=n?new i("utf-8").encode(e):new i("ascii").encode(e),o="number"==typeof o?o:s.byteLength,this.handleAutoResize(t,o);for(var r=0;r<o;r++)this.view.setUint8(t+r,s[r]||0);return o},t.prototype.setNextString=function(t,e,n){this.offset+=this.setString(this.offset,t,e,n)},t.prototype.toByteString=function(){return Array.from(new Uint8Array(this.getBuffer())).map((function(t){return("00"+t.toString(16)).slice(-2)})).join(" ").toUpperCase()},t.prototype.toTextString=function(t){return this.getString(0,this.view.byteLength,t)},t.prototype.fromByteString=function(t){var e=t.split(" "),n=new ArrayBuffer(e.length);this.view=new DataView(n),this.setNextBytes(new Uint8Array(e.map((function(t){return parseInt(t,16)})))),this.resetOffset()},t.prototype.getLength=function(){return this.view.byteLength},t.prototype.clear=function(){this.view=new DataView(new ArrayBuffer(this.view.byteLength)),this.offset=0},t.prototype.handleAutoResize=function(t,e){this.autoResize&&this.getBuffer().byteLength<t+e&&this.resize(t+e)},t}();return e})()}));
},{}],5:[function(require,module,exports){
module.exports={
    "name": "@dobuki/compression",
    "version": "1.0.20",
    "description": "",
    "main": "out/src/index.js",
    "type": "module",
    "scripts": {
        "start": "webpack && tsc --esModuleInterop --resolveJsonModule --outdir out src/index.ts && npm run browserify && ts-node demo.ts",
        "test": "mocha src/index.test.js",
        "browserify": "browserify out/src/index.js -o public/compression.js"
    },
    "repository": {
        "type": "git",
        "url": "git+https://github.com/jacklehamster/compression.git"
    },
    "author": "",
    "license": "ISC",
    "bugs": {
        "url": "https://github.com/jacklehamster/compression/issues"
    },
    "homepage": "https://github.com/jacklehamster/compression#readme",
    "devDependencies": {
        "@types/blueimp-md5": "^2.18.0",
        "@types/express": "^4.17.13",
        "@types/node": "^18.7.14",
        "chai": "^4.2.0",
        "mocha": "^9.1.4",
        "mock-xmlhttprequest": "^7.0.4",
        "webpack-cli": "^4.10.0"
    },
    "dependencies": {
        "blueimp-md5": "^2.19.0",
        "dok-file-utils": "^1.0.14",
        "express": "^4.18.1",
        "express-static": "^1.2.6",
        "fflate": "^0.7.4",
        "icon-gen": "^3.0.1",
        "np": "^7.6.3",
        "path": "^0.12.7",
        "stream-data-view": "^1.7.2",
        "ts-loader": "^9.3.1",
        "ts-node": "^10.9.1"
    }
}

},{}],6:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var Reducer_1 = __importDefault(require("../reducer/Reducer"));
var stream_data_view_1 = require("stream-data-view");
var TokenEncoder_1 = __importDefault(require("./TokenEncoder"));
var FFlateEncoder_1 = __importDefault(require("./FFlateEncoder"));
var package_json_1 = require("../../package.json");
var Tokenizer_1 = __importDefault(require("../tokenizer/Tokenizer"));
var Extractor_1 = __importDefault(require("../expander/Extractor"));
var EncoderEnum;
(function (EncoderEnum) {
    EncoderEnum[EncoderEnum["NONE"] = 0] = "NONE";
    EncoderEnum[EncoderEnum["FFLATE"] = 1] = "FFLATE";
})(EncoderEnum || (EncoderEnum = {}));
;
var ENCODERS = [
    function () { return undefined; },
    function () { return new FFlateEncoder_1["default"](); },
];
var DEFAULT = [EncoderEnum.FFLATE];
var Compressor = /** @class */ (function () {
    function Compressor() {
    }
    Compressor.prototype.applyEncoders = function (buffer, encoders) {
        var resultBuffer = buffer;
        encoders.forEach(function (encoder) {
            resultBuffer = encoder.encode(resultBuffer);
        });
        return resultBuffer;
    };
    Compressor.prototype.applyDecoders = function (buffer, decoders) {
        var resultBuffer = buffer;
        decoders.forEach(function (decoder) {
            resultBuffer = decoder.decode(resultBuffer);
        });
        return resultBuffer;
    };
    /**
     * Load json or text files and compress them into one big blob.
     * This uses the default encoders.
     *
     * @param files files to load.
     */
    Compressor.prototype.loadAndCompress = function (files) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenizer, header, reducer, dataStore;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenizer = new Tokenizer_1["default"]();
                        return [4 /*yield*/, tokenizer.load.apply(tokenizer, files)];
                    case 1:
                        header = _a.sent();
                        reducer = new Reducer_1["default"]();
                        dataStore = reducer.reduce(header);
                        return [2 /*return*/, this.compressDataStore(dataStore)];
                }
            });
        });
    };
    /**
     * Compress data into one big blob.
     * This uses the default encoders.
     *
     * @param files files to load.
     */
    Compressor.prototype.compress = function (data) {
        var tokenizer = new Tokenizer_1["default"]();
        var header = tokenizer.tokenize(data);
        var reducer = new Reducer_1["default"]();
        var dataStore = reducer.reduce(header);
        return this.compressDataStore(dataStore);
    };
    Compressor.prototype.loadAndExpand = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var response, arrayBuffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(file)];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.arrayBuffer()];
                    case 2:
                        arrayBuffer = _a.sent();
                        return [2 /*return*/, this.expand(arrayBuffer)];
                }
            });
        });
    };
    Compressor.prototype.expand = function (arrayBuffer, config) {
        return new Extractor_1["default"](this.expandDataStore(arrayBuffer), config);
    };
    Compressor.prototype.compressDataStore = function (dataStore, encoderEnums) {
        var _a;
        if (encoderEnums === void 0) { encoderEnums = DEFAULT; }
        var streamDataView = new stream_data_view_1.StreamDataView();
        var tokenEncoder = new TokenEncoder_1["default"](streamDataView);
        //  Write header tokens
        tokenEncoder.encodeTokens(dataStore.headerTokens);
        //  Write fileNames
        tokenEncoder.encodeNumberArray(dataStore.files);
        var finalStream = new stream_data_view_1.StreamDataView();
        //  Write version
        finalStream.setNextUint8(package_json_1.version.length);
        finalStream.setNextString(package_json_1.version);
        //  Write encoders
        encoderEnums.forEach(function (encoderEnum) { return finalStream.setNextUint8(encoderEnum); });
        finalStream.setNextUint8(0);
        var encoders = encoderEnums
            .map(function (encoderEnum) { return ENCODERS[encoderEnum](); })
            .filter(function (encoder) { return !!encoder; });
        //  Write header
        var headerBuffer = this.applyEncoders(streamDataView.getBuffer(), encoders);
        finalStream.setNextUint32(headerBuffer.byteLength);
        finalStream.setNextBytes(headerBuffer);
        console.log("HEADER length", headerBuffer.byteLength);
        //  Write each file's data tokens.
        for (var index = 0; index < dataStore.files.length; index++) {
            var subStream = new stream_data_view_1.StreamDataView();
            var subEncoder = new TokenEncoder_1["default"](subStream);
            subEncoder.encodeTokens(dataStore.getDataTokens(index));
            //  save and compress buffer
            var subBuffer = this.applyEncoders(subStream.getBuffer(), encoders);
            finalStream.setNextUint32(subBuffer.byteLength);
            console.log("SUBBUFFER length", index, subBuffer.byteLength);
            finalStream.setNextBytes(subBuffer);
        }
        finalStream.setNextUint32(0);
        //  Write original data size
        finalStream.setNextUint32((_a = dataStore.originalDataSize) !== null && _a !== void 0 ? _a : 0);
        return finalStream.getBuffer();
    };
    Compressor.prototype.expandDataStore = function (arrayBuffer) {
        var _this = this;
        var compressedSize = arrayBuffer.byteLength;
        var input = arrayBuffer;
        var globalStream = new stream_data_view_1.StreamDataView(input);
        var version = globalStream.getNextString(globalStream.getNextUint8());
        var decoders = [];
        do {
            var encoderEnum = globalStream.getNextUint8();
            if (encoderEnum === EncoderEnum.NONE) {
                break;
            }
            var decoder = ENCODERS[encoderEnum]();
            if (decoder) {
                decoders.push(decoder);
            }
        } while (globalStream.getOffset() < globalStream.getLength());
        var headerByteLength = globalStream.getNextUint32();
        var headerBuffer = this.applyDecoders(globalStream.getNextBytes(headerByteLength).buffer, decoders);
        var headerTokenEncoder = new TokenEncoder_1["default"](new stream_data_view_1.StreamDataView(headerBuffer));
        var headerTokens = headerTokenEncoder.decodeTokens();
        var files = headerTokenEncoder.decodeNumberArray();
        var subBuffers = [];
        do {
            var byteLength = globalStream.getNextUint32();
            if (!byteLength) {
                break;
            }
            subBuffers.push(globalStream.getNextBytes(byteLength).buffer);
        } while (globalStream.getOffset() < globalStream.getLength());
        var getDataTokens = function (index) {
            var subBuffer = _this.applyDecoders(subBuffers[index], decoders);
            var streamDataView = new stream_data_view_1.StreamDataView(subBuffer);
            var tokenDecoder = new TokenEncoder_1["default"](streamDataView);
            return tokenDecoder.decodeTokens();
        };
        //  The remaining from streamDataView is extra. Some compressed data don't have it.
        var originalDataSize;
        try {
            originalDataSize = globalStream.getNextUint32() || undefined;
        }
        catch (e) {
        }
        return {
            version: version,
            originalDataSize: originalDataSize,
            compressedSize: compressedSize,
            headerTokens: headerTokens,
            files: files,
            getDataTokens: getDataTokens
        };
    };
    return Compressor;
}());
exports["default"] = Compressor;

},{"../../package.json":5,"../expander/Extractor":10,"../reducer/Reducer":13,"../tokenizer/Tokenizer":15,"./FFlateEncoder":8,"./TokenEncoder":9,"stream-data-view":4}],7:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.DataTypeUtils = exports.NUMBER_DATA_TYPES = exports.DataType = void 0;
var DataType;
(function (DataType) {
    DataType[DataType["UNDEFINED"] = 0] = "UNDEFINED";
    DataType[DataType["NULL"] = 1] = "NULL";
    DataType[DataType["BOOLEAN_FALSE"] = 2] = "BOOLEAN_FALSE";
    DataType[DataType["BOOLEAN_TRUE"] = 3] = "BOOLEAN_TRUE";
    DataType[DataType["INT8"] = 4] = "INT8";
    DataType[DataType["UINT8"] = 5] = "UINT8";
    DataType[DataType["INT16"] = 6] = "INT16";
    DataType[DataType["UINT16"] = 7] = "UINT16";
    DataType[DataType["INT32"] = 8] = "INT32";
    DataType[DataType["UINT32"] = 9] = "UINT32";
    DataType[DataType["FLOAT32"] = 10] = "FLOAT32";
    DataType[DataType["FLOAT64"] = 11] = "FLOAT64";
    DataType[DataType["STRING"] = 12] = "STRING";
    DataType[DataType["UNICODE"] = 13] = "UNICODE";
    DataType[DataType["OBJECT_8"] = 17] = "OBJECT_8";
    DataType[DataType["OBJECT_16"] = 18] = "OBJECT_16";
    DataType[DataType["OBJECT_32"] = 19] = "OBJECT_32";
    DataType[DataType["SPLIT_8"] = 20] = "SPLIT_8";
    DataType[DataType["SPLIT_16"] = 21] = "SPLIT_16";
    DataType[DataType["SPLIT_32"] = 22] = "SPLIT_32";
    DataType[DataType["ARRAY_8"] = 23] = "ARRAY_8";
    DataType[DataType["ARRAY_16"] = 24] = "ARRAY_16";
    DataType[DataType["ARRAY_32"] = 25] = "ARRAY_32";
    DataType[DataType["OFFSET_ARRAY_8"] = 26] = "OFFSET_ARRAY_8";
    DataType[DataType["OFFSET_ARRAY_16"] = 27] = "OFFSET_ARRAY_16";
    DataType[DataType["OFFSET_ARRAY_32"] = 28] = "OFFSET_ARRAY_32";
    DataType[DataType["EMPTY_ARRAY"] = 29] = "EMPTY_ARRAY";
    DataType[DataType["REFERENCE"] = 30] = "REFERENCE";
    DataType[DataType["COMPLEX_OBJECT"] = 31] = "COMPLEX_OBJECT";
})(DataType = exports.DataType || (exports.DataType = {}));
exports.NUMBER_DATA_TYPES = [
    DataType.UINT8,
    DataType.INT8,
    DataType.UINT16,
    DataType.INT16,
    DataType.UINT32,
    DataType.INT32,
    DataType.FLOAT32,
    DataType.FLOAT64,
];
var DataTypeUtils = /** @class */ (function () {
    function DataTypeUtils() {
    }
    DataTypeUtils.prototype.numberSatisfyDataType = function (value, dataType) {
        var hasDecimal = value % 1 !== 0;
        if (hasDecimal) {
            switch (dataType) {
                case DataType.FLOAT32:
                    return Math.fround(value) === value;
                case DataType.FLOAT64:
                    return true;
                default:
                    return false;
            }
        }
        switch (dataType) {
            case DataType.UINT8:
                return value >= 0 && value <= 255;
            case DataType.INT8:
                return value >= -128 && value <= 127;
            case DataType.UINT16:
                return value >= 0 && value <= 65535;
            case DataType.INT16:
                return value >= -32768 && value <= 32767;
            case DataType.UINT32:
                return value >= 0;
            case DataType.INT32:
                return true;
        }
        return false;
    };
    DataTypeUtils.prototype.getBestType = function (array) {
        var _this = this;
        if (array.some(function (number) { return number % 1 !== 0; })) {
            //  decimal
            if (array.every(function (number) { return _this.numberSatisfyDataType(number, DataType.FLOAT32); })) {
                return DataType.FLOAT32;
            }
            return DataType.FLOAT64;
        }
        var min = Math.min.apply(Math, array);
        var max = Math.max.apply(Math, array);
        for (var _i = 0, NUMBER_DATA_TYPES_1 = exports.NUMBER_DATA_TYPES; _i < NUMBER_DATA_TYPES_1.length; _i++) {
            var dataType = NUMBER_DATA_TYPES_1[_i];
            if (this.numberSatisfyDataType(min, dataType) && this.numberSatisfyDataType(max, dataType)) {
                return dataType;
            }
        }
        return DataType.FLOAT64;
    };
    DataTypeUtils.prototype.getNumberDataType = function (value) {
        for (var _i = 0, NUMBER_DATA_TYPES_2 = exports.NUMBER_DATA_TYPES; _i < NUMBER_DATA_TYPES_2.length; _i++) {
            var type = NUMBER_DATA_TYPES_2[_i];
            if (this.numberSatisfyDataType(value, type)) {
                return type;
            }
        }
        return DataType.UNDEFINED;
    };
    DataTypeUtils.prototype.getStringDataType = function (value) {
        var letterCodes = value.split("").map(function (l) { return l.charCodeAt(0); });
        if (letterCodes.every(function (code) { return code <= 255; })) {
            return DataType.STRING;
        }
        else {
            return DataType.UNICODE;
        }
    };
    DataTypeUtils.prototype.getFullTokenDataType = function (token) {
        switch (token.type) {
            case "array":
                return DataType.ARRAY_8;
            case "object":
                return DataType.OBJECT_8;
            case "split":
                return DataType.SPLIT_8;
            default:
                return this.getDataType(token);
        }
    };
    DataTypeUtils.prototype.getDataType = function (token) {
        switch (token.type) {
            case "array":
            case "object":
            case "split":
                var indices = token.value;
                if (!indices.length) {
                    console.assert(token.type === "array");
                    return DataType.EMPTY_ARRAY;
                }
                var offset_1 = 0;
                if (token.type === "array" && indices.length > 3) {
                    var min = Math.min.apply(Math, indices);
                    var max = Math.max.apply(Math, indices);
                    if (this.getNumberDataType(max - min) !== this.getNumberDataType(max)) {
                        offset_1 = min;
                    }
                    indices = indices.map(function (value) { return value - offset_1; });
                }
                var bestType = this.getBestType(indices);
                switch (token.type) {
                    case "object":
                        return bestType === DataType.UINT8
                            ? DataType.OBJECT_8
                            : bestType === DataType.UINT16
                                ? DataType.OBJECT_16
                                : DataType.OBJECT_32;
                    case "split":
                        return bestType === DataType.UINT8
                            ? DataType.SPLIT_8
                            : bestType === DataType.UINT16
                                ? DataType.SPLIT_16
                                : DataType.SPLIT_32;
                    case "array":
                        if (offset_1) {
                            return bestType === DataType.UINT8
                                ? DataType.OFFSET_ARRAY_8
                                : bestType === DataType.UINT16
                                    ? DataType.OFFSET_ARRAY_16
                                    : DataType.OFFSET_ARRAY_32;
                        }
                        else {
                            return bestType === DataType.UINT8
                                ? DataType.ARRAY_8
                                : bestType === DataType.UINT16
                                    ? DataType.ARRAY_16
                                    : DataType.ARRAY_32;
                        }
                }
            case "leaf":
                if (token.value === undefined) {
                    return DataType.UNDEFINED;
                }
                else if (token.value === null) {
                    return DataType.NULL;
                }
                else {
                    switch (typeof token.value) {
                        case "boolean":
                            return token.value ? DataType.BOOLEAN_TRUE : DataType.BOOLEAN_FALSE;
                        case "string":
                            return this.getStringDataType(token.value);
                        case "number":
                            return this.getNumberDataType(token.value);
                    }
                }
                break;
            case "reference":
                return DataType.REFERENCE;
        }
        throw new Error("Unrecognized type for ".concat(token.type, " value: ").concat(token.value));
    };
    DataTypeUtils.prototype.dataTypeToType = function (dataType) {
        switch (dataType) {
            case DataType.EMPTY_ARRAY:
            case DataType.ARRAY_8:
            case DataType.ARRAY_16:
            case DataType.ARRAY_32:
                return "array";
            case DataType.OBJECT_8:
            case DataType.OBJECT_16:
            case DataType.OBJECT_32:
                return "object";
            case DataType.SPLIT_8:
            case DataType.SPLIT_16:
            case DataType.SPLIT_32:
                return "split";
            case DataType.REFERENCE:
                return "reference";
            default:
                return "leaf";
        }
    };
    return DataTypeUtils;
}());
exports.DataTypeUtils = DataTypeUtils;

},{}],8:[function(require,module,exports){
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
exports.__esModule = true;
var fflate = __importStar(require("fflate"));
var FFlateEncoder = /** @class */ (function () {
    function FFlateEncoder() {
    }
    FFlateEncoder.prototype.encode = function (arrayBuffer) {
        return fflate.gzipSync(new Uint8Array(arrayBuffer)).buffer;
    };
    FFlateEncoder.prototype.decode = function (arrayBuffer) {
        return fflate.gunzipSync(new Uint8Array(arrayBuffer)).buffer;
    };
    return FFlateEncoder;
}());
exports["default"] = FFlateEncoder;

},{"fflate":2}],9:[function(require,module,exports){
"use strict";
exports.__esModule = true;
//18033
var stream_data_view_1 = require("stream-data-view");
var DataType_1 = require("./DataType");
var TokenEncoder = /** @class */ (function () {
    function TokenEncoder(streamDataView) {
        this.dataTypeUtils = new DataType_1.DataTypeUtils();
        this.streamDataView = streamDataView;
    }
    TokenEncoder.prototype.encodeTokens = function (tokens) {
        var pos = 0;
        while (pos < tokens.length) {
            var count = this.encodeMulti(tokens, pos);
            if (count) {
                pos += count;
            }
        }
        this.encodeMulti([], pos);
    };
    TokenEncoder.prototype.decodeTokens = function () {
        var tokens = [];
        while (this.streamDataView.getOffset() < this.streamDataView.getLength()) {
            if (!this.decodeMulti(tokens)) {
                break;
            }
        }
        return tokens;
    };
    TokenEncoder.prototype.encodeToken = function (token, dataType, multiInfo) {
        var usedDataType = dataType !== null && dataType !== void 0 ? dataType : this.encodeDataType(this.dataTypeUtils.getDataType(token));
        switch (usedDataType) {
            case DataType_1.DataType.UNDEFINED:
            case DataType_1.DataType.NULL:
            case DataType_1.DataType.BOOLEAN_TRUE:
            case DataType_1.DataType.BOOLEAN_FALSE:
            case DataType_1.DataType.EMPTY_ARRAY:
                break;
            case DataType_1.DataType.INT8:
            case DataType_1.DataType.UINT8:
            case DataType_1.DataType.INT16:
            case DataType_1.DataType.UINT16:
            case DataType_1.DataType.INT32:
            case DataType_1.DataType.UINT32:
            case DataType_1.DataType.FLOAT32:
            case DataType_1.DataType.FLOAT64:
                this.encodeSingleNumber(token.value, usedDataType);
                break;
            case DataType_1.DataType.STRING:
            case DataType_1.DataType.UNICODE:
                this.encodeString(token.value, usedDataType, multiInfo);
                break;
            case DataType_1.DataType.OBJECT_8:
            case DataType_1.DataType.OBJECT_16:
            case DataType_1.DataType.OBJECT_32:
                this.encodeObjectToken(token, usedDataType);
                break;
            case DataType_1.DataType.SPLIT_8:
            case DataType_1.DataType.SPLIT_16:
            case DataType_1.DataType.SPLIT_32:
                this.encodeSplitToken(token, usedDataType);
                break;
            case DataType_1.DataType.ARRAY_8:
            case DataType_1.DataType.ARRAY_16:
            case DataType_1.DataType.ARRAY_32:
            case DataType_1.DataType.OFFSET_ARRAY_8:
            case DataType_1.DataType.OFFSET_ARRAY_16:
            case DataType_1.DataType.OFFSET_ARRAY_32:
                this.encodeArrayToken(token, usedDataType);
                break;
            default:
                throw new Error("Invalid dataType: " + usedDataType);
        }
    };
    TokenEncoder.prototype.decodeToken = function (dataType, multiInfo) {
        var usedDataType = dataType !== null && dataType !== void 0 ? dataType : this.decodeDataType();
        switch (usedDataType) {
            case DataType_1.DataType.UNDEFINED:
                return { type: "leaf", value: undefined };
            case DataType_1.DataType.NULL:
                return { type: "leaf", value: null };
            case DataType_1.DataType.BOOLEAN_TRUE:
                return { type: "leaf", value: true };
            case DataType_1.DataType.BOOLEAN_FALSE:
                return { type: "leaf", value: false };
            case DataType_1.DataType.EMPTY_ARRAY:
                return { type: "array", value: [] };
            case DataType_1.DataType.INT8:
            case DataType_1.DataType.UINT8:
            case DataType_1.DataType.INT16:
            case DataType_1.DataType.UINT16:
            case DataType_1.DataType.INT32:
            case DataType_1.DataType.UINT32:
            case DataType_1.DataType.FLOAT32:
            case DataType_1.DataType.FLOAT64:
                return { type: "leaf", value: this.decodeSingleNumber(usedDataType) };
            case DataType_1.DataType.STRING:
            case DataType_1.DataType.UNICODE:
                return { type: "leaf", value: this.decodeString(usedDataType, multiInfo) };
            case DataType_1.DataType.OBJECT_8:
            case DataType_1.DataType.OBJECT_16:
            case DataType_1.DataType.OBJECT_32:
                return this.decodeObjectToken(usedDataType);
            case DataType_1.DataType.SPLIT_8:
            case DataType_1.DataType.SPLIT_16:
            case DataType_1.DataType.SPLIT_32:
                return this.decodeSplitToken(usedDataType);
            case DataType_1.DataType.ARRAY_8:
            case DataType_1.DataType.ARRAY_16:
            case DataType_1.DataType.ARRAY_32:
            case DataType_1.DataType.OFFSET_ARRAY_8:
            case DataType_1.DataType.OFFSET_ARRAY_16:
            case DataType_1.DataType.OFFSET_ARRAY_32:
                return this.decodeArrayToken(usedDataType);
            default:
                throw new Error("Invalid dataType: " + usedDataType);
        }
    };
    TokenEncoder.prototype.isOffsetDataType = function (dataType) {
        return dataType === DataType_1.DataType.OFFSET_ARRAY_8 || dataType === DataType_1.DataType.OFFSET_ARRAY_16 || dataType === DataType_1.DataType.OFFSET_ARRAY_32;
    };
    TokenEncoder.prototype.encodeArrayToken = function (arrayToken, dataType) {
        var usedDataType = dataType !== null && dataType !== void 0 ? dataType : this.encodeDataType(this.dataTypeUtils.getDataType(arrayToken));
        var numberType = usedDataType === DataType_1.DataType.ARRAY_8 || usedDataType === DataType_1.DataType.OFFSET_ARRAY_8
            ? DataType_1.DataType.UINT8
            : usedDataType === DataType_1.DataType.ARRAY_16 || usedDataType === DataType_1.DataType.OFFSET_ARRAY_16
                ? DataType_1.DataType.UINT16 : DataType_1.DataType.UINT32;
        var indices = arrayToken.value;
        if (this.isOffsetDataType(usedDataType)) {
            var offset_1 = Math.min.apply(Math, indices);
            indices = indices.map(function (value) { return value - offset_1; });
            this.encodeSingleNumber(offset_1);
        }
        this.encodeNumberArray(indices, numberType);
    };
    TokenEncoder.prototype.decodeArrayToken = function (dataType) {
        var usedDataType = dataType !== null && dataType !== void 0 ? dataType : this.decodeDataType();
        var offset = 0;
        if (this.isOffsetDataType(usedDataType)) {
            offset = this.decodeSingleNumber();
        }
        var numberType = usedDataType === DataType_1.DataType.ARRAY_8 || usedDataType === DataType_1.DataType.OFFSET_ARRAY_8
            ? DataType_1.DataType.UINT8
            : usedDataType === DataType_1.DataType.ARRAY_16 || usedDataType === DataType_1.DataType.OFFSET_ARRAY_16
                ? DataType_1.DataType.UINT16 : DataType_1.DataType.UINT32;
        var indices = this.decodeNumberArray(numberType)
            .map(function (value) { return value + offset; });
        return {
            type: "array",
            value: indices
        };
    };
    TokenEncoder.prototype.encodeObjectToken = function (objectToken, dataType) {
        var usedDataType = dataType !== null && dataType !== void 0 ? dataType : this.encodeDataType(this.dataTypeUtils.getDataType(objectToken));
        var numberType = usedDataType === DataType_1.DataType.OBJECT_8 ? DataType_1.DataType.UINT8 : usedDataType === DataType_1.DataType.OBJECT_16 ? DataType_1.DataType.UINT16 : DataType_1.DataType.UINT32;
        var _a = objectToken.value, keysIndex = _a[0], valuesIndex = _a[1];
        this.encodeSingleNumber(keysIndex, numberType);
        this.encodeSingleNumber(valuesIndex, numberType);
    };
    TokenEncoder.prototype.decodeObjectToken = function (dataType) {
        var usedDataType = dataType !== null && dataType !== void 0 ? dataType : this.decodeDataType();
        var numberType = usedDataType === DataType_1.DataType.OBJECT_8 ? DataType_1.DataType.UINT8 : usedDataType === DataType_1.DataType.OBJECT_16 ? DataType_1.DataType.UINT16 : DataType_1.DataType.UINT32;
        return {
            type: "object",
            value: [this.decodeSingleNumber(numberType), this.decodeSingleNumber(numberType)]
        };
    };
    TokenEncoder.prototype.encodeSplitToken = function (splitToken, dataType) {
        var usedDataType = dataType !== null && dataType !== void 0 ? dataType : this.encodeDataType(this.dataTypeUtils.getDataType(splitToken));
        var numberType = usedDataType === DataType_1.DataType.SPLIT_8 ? DataType_1.DataType.UINT8 : usedDataType === DataType_1.DataType.SPLIT_16 ? DataType_1.DataType.UINT16 : DataType_1.DataType.UINT32;
        var _a = splitToken.value, chunksIndex = _a[0], separatorsIndex = _a[1];
        this.encodeSingleNumber(chunksIndex, numberType);
        this.encodeSingleNumber(separatorsIndex, numberType);
    };
    TokenEncoder.prototype.decodeSplitToken = function (dataType) {
        var usedDataType = dataType !== null && dataType !== void 0 ? dataType : this.decodeDataType();
        var numberType = usedDataType === DataType_1.DataType.SPLIT_8 ? DataType_1.DataType.UINT8 : usedDataType === DataType_1.DataType.SPLIT_16 ? DataType_1.DataType.UINT16 : DataType_1.DataType.UINT32;
        return {
            type: "split",
            value: [this.decodeSingleNumber(numberType), this.decodeSingleNumber(numberType)]
        };
    };
    TokenEncoder.prototype.encodeDataType = function (dataType) {
        this.streamDataView.setNextUint8(dataType);
        return dataType;
    };
    TokenEncoder.prototype.decodeDataType = function () {
        return this.streamDataView.getNextUint8();
    };
    TokenEncoder.prototype.encodeMulti = function (tokens, pos) {
        if (pos >= tokens.length) {
            this.encodeSingleNumber(0, DataType_1.DataType.UINT8);
            return 0;
        }
        var firstType = this.dataTypeUtils.getDataType(tokens[pos]);
        var multiCount;
        var maxCount = Math.min(tokens.length - pos, 255);
        for (multiCount = 1; multiCount < maxCount; multiCount++) {
            if (this.dataTypeUtils.getDataType(tokens[pos + multiCount]) !== firstType) {
                break;
            }
        }
        //  encode a multi, meaning that the same type is going to get repeated multiple times
        this.encodeSingleNumber(multiCount, DataType_1.DataType.UINT8);
        this.encodeDataType(firstType);
        var multiInfo = {};
        for (var i = 0; i < multiCount; i++) {
            this.encodeToken(tokens[pos + i], firstType, multiInfo);
        }
        return multiCount;
    };
    TokenEncoder.prototype.decodeMulti = function (tokens) {
        var count = this.streamDataView.getNextUint8();
        if (!count) {
            return 0;
        }
        var dataType = this.decodeDataType();
        var multiInfo = {};
        for (var i = 0; i < count; i++) {
            var token = this.decodeToken(dataType, multiInfo);
            tokens.push(token);
        }
        return count;
    };
    TokenEncoder.prototype.encodeSingleNumber = function (value, dataType) {
        var usedDataType = dataType !== null && dataType !== void 0 ? dataType : this.encodeDataType(this.dataTypeUtils.getNumberDataType(value));
        switch (usedDataType) {
            case DataType_1.DataType.UINT8:
                this.streamDataView.setNextUint8(value);
                break;
            case DataType_1.DataType.INT8:
                this.streamDataView.setNextInt8(value);
                break;
            case DataType_1.DataType.UINT16:
                this.streamDataView.setNextUint16(value);
                break;
            case DataType_1.DataType.INT16:
                this.streamDataView.setNextInt16(value);
                break;
            case DataType_1.DataType.UINT32:
                this.streamDataView.setNextUint32(value);
                break;
            case DataType_1.DataType.INT32:
                this.streamDataView.setNextInt32(value);
                break;
            case DataType_1.DataType.FLOAT32:
                this.streamDataView.setNextFloat32(value);
                break;
            case DataType_1.DataType.FLOAT64:
                this.streamDataView.setNextFloat64(value);
                break;
            default:
                throw new Error("Invalid dataType for number: " + usedDataType);
        }
    };
    TokenEncoder.prototype.decodeSingleNumber = function (dataType) {
        var usedDataType = dataType !== null && dataType !== void 0 ? dataType : this.decodeDataType();
        switch (usedDataType) {
            case DataType_1.DataType.UINT8:
                return this.streamDataView.getNextUint8();
            case DataType_1.DataType.INT8:
                return this.streamDataView.getNextInt8();
            case DataType_1.DataType.UINT16:
                return this.streamDataView.getNextUint16();
            case DataType_1.DataType.INT16:
                return this.streamDataView.getNextInt16();
            case DataType_1.DataType.UINT32:
                return this.streamDataView.getNextUint32();
            case DataType_1.DataType.INT32:
                return this.streamDataView.getNextInt32();
            case DataType_1.DataType.FLOAT32:
                return this.streamDataView.getNextFloat32();
            case DataType_1.DataType.FLOAT64:
                return this.streamDataView.getNextFloat64();
            default:
                throw new Error("Invalid dataType for number: " + usedDataType);
        }
    };
    TokenEncoder.prototype.encodeNumberArray = function (array, dataType) {
        var pos;
        for (pos = 0; pos < array.length;) {
            var size = Math.min(255, array.length - pos);
            this.encodeSingleNumber(size, DataType_1.DataType.UINT8);
            if (!size) {
                break;
            }
            var bestType = dataType !== null && dataType !== void 0 ? dataType : this.encodeDataType(this.dataTypeUtils.getBestType(array));
            for (var i = 0; i < size; i++) {
                this.encodeSingleNumber(array[pos + i], bestType);
            }
            pos += size;
        }
        if (pos === 255) {
            //  Reached the max size of 255, but the next one is 0.
            this.encodeSingleNumber(0, DataType_1.DataType.UINT8);
        }
    };
    TokenEncoder.prototype.decodeNumberArray = function (dataType) {
        var size;
        var numbers = [];
        do {
            size = this.decodeSingleNumber(DataType_1.DataType.UINT8);
            if (!size) {
                break;
            }
            var type = dataType !== null && dataType !== void 0 ? dataType : this.decodeDataType();
            for (var i = 0; i < size; i++) {
                numbers.push(this.decodeSingleNumber(type));
            }
        } while (size >= 255);
        return numbers;
    };
    TokenEncoder.prototype.encodeString = function (value, dataType, multiInfo) {
        var _this = this;
        var letterCodes = value.split("").map(function (l) { return l.charCodeAt(0); });
        // const min = Math.min(...letterCodes);
        if (!multiInfo || multiInfo.lastStringLength !== value.length) {
            letterCodes.push(0);
        }
        // console.log(letterCodes, value, (letterCodes).map((value) => !value ? 0 : value - min + 1));
        var usedDataType = dataType !== null && dataType !== void 0 ? dataType : this.encodeDataType(this.dataTypeUtils.getStringDataType(value));
        var numberType = usedDataType === DataType_1.DataType.STRING ? DataType_1.DataType.UINT8 : DataType_1.DataType.UINT16;
        letterCodes.forEach(function (code) { return _this.encodeSingleNumber(code, numberType); });
        if (multiInfo) {
            multiInfo.lastStringLength = value.length;
        }
    };
    TokenEncoder.prototype.decodeString = function (dataType, multiInfo) {
        var usedDataType = dataType !== null && dataType !== void 0 ? dataType : this.decodeDataType();
        var charCodes = [];
        var numberType = usedDataType === DataType_1.DataType.STRING ? DataType_1.DataType.UINT8 : DataType_1.DataType.UINT16;
        do {
            var code = this.decodeSingleNumber(numberType);
            if (!code) {
                break;
            }
            charCodes.push(code);
            if ((multiInfo === null || multiInfo === void 0 ? void 0 : multiInfo.lastStringLength) && charCodes.length >= (multiInfo === null || multiInfo === void 0 ? void 0 : multiInfo.lastStringLength)) {
                break;
            }
        } while (true);
        var string = charCodes.map(function (code) { return String.fromCharCode(code); }).join("");
        if (multiInfo) {
            multiInfo.lastStringLength = string.length;
        }
        return string;
    };
    TokenEncoder.selfTest = function () {
        var _this = this;
        var testers = [
            //  0
            function (tokenEncoder, tokenDecoder, reset) {
                _this.testAction(DataType_1.DataType.STRING, function (dataType) { return tokenEncoder.encodeDataType(dataType); }, reset, function () { return tokenDecoder.decodeDataType(); });
            },
            function (tokenEncoder, tokenDecoder, reset) {
                _this.testAction(DataType_1.DataType.UNDEFINED, function (dataType) { return tokenEncoder.encodeDataType(dataType); }, reset, function () { return tokenDecoder.decodeDataType(); });
            },
            function (tokenEncoder, tokenDecoder, reset) {
                _this.testAction(33, function (number) { return tokenEncoder.encodeSingleNumber(number, DataType_1.DataType.INT8); }, reset, function () { return tokenDecoder.decodeSingleNumber(DataType_1.DataType.INT8); });
            },
            function (tokenEncoder, tokenDecoder, reset) {
                _this.testAction([
                    { type: "leaf", value: 123 },
                    { type: "leaf", value: 45 },
                    { type: "leaf", value: 67 },
                    { type: "leaf", value: 89 },
                ], function (header) { return tokenEncoder.encodeMulti(header, 0); }, reset, function () {
                    var result = [];
                    tokenDecoder.decodeMulti(result);
                    return result;
                });
            },
            function (tokenEncoder, tokenDecoder, reset) {
                _this.testAction([
                    { type: "leaf", value: 1000001 },
                    { type: "leaf", value: 1002000 },
                    { type: "leaf", value: 1003001 },
                ], function (header) { return tokenEncoder.encodeMulti(header, 0); }, reset, function () {
                    var result = [];
                    tokenDecoder.decodeMulti(result);
                    return result;
                });
            },
            //  5
            function (tokenEncoder, tokenDecoder, reset) {
                _this.testAction([1, 2, 3, 4, 10, 20, 200], function (array) { return tokenEncoder.encodeNumberArray(array); }, reset, function () { return tokenDecoder.decodeNumberArray(); });
            },
            function (tokenEncoder, tokenDecoder, reset) {
                _this.testAction(new Array(2000).fill(null).map(function (_, index) { return index; }), function (array) { return tokenEncoder.encodeNumberArray(array); }, reset, function () { return tokenDecoder.decodeNumberArray(); });
            },
            function (tokenEncoder, tokenDecoder, reset) {
                _this.testAction([10000, -202, 3, 4, 10, 20, 3200], function (array) { return tokenEncoder.encodeNumberArray(array); }, reset, function () { return tokenDecoder.decodeNumberArray(); });
            },
            function (tokenEncoder, tokenDecoder, reset) {
                _this.testAction("teststring", function (string) { return tokenEncoder.encodeString(string); }, reset, function () { return tokenDecoder.decodeString(); });
            },
            function (tokenEncoder, tokenDecoder, reset) {
                _this.testAction("teststring", function (string) { return tokenEncoder.encodeString(string, DataType_1.DataType.STRING); }, reset, function () { return tokenDecoder.decodeString(DataType_1.DataType.STRING); });
            },
            //  10
            function (tokenEncoder, tokenDecoder, reset) {
                _this.testAction("test😀😃😄😁😆", function (string) { return tokenEncoder.encodeString(string); }, reset, function () { return tokenDecoder.decodeString(); });
            },
            function (tokenEncoder, tokenDecoder, reset) {
                _this.testAction({ type: "object", value: [200, 201] }, function (o) { return tokenEncoder.encodeObjectToken(o); }, reset, function () { return tokenDecoder.decodeObjectToken(); });
            },
            function (tokenEncoder, tokenDecoder, reset) {
                _this.testAction({ type: "object", value: [2000, 2001] }, function (o) { return tokenEncoder.encodeObjectToken(o); }, reset, function () { return tokenDecoder.decodeObjectToken(); });
            },
            function (tokenEncoder, tokenDecoder, reset) {
                _this.testAction({ type: "object", value: [2000, 2001] }, function (o) { return tokenEncoder.encodeObjectToken(o, DataType_1.DataType.OBJECT_32); }, reset, function () { return tokenDecoder.decodeObjectToken(DataType_1.DataType.OBJECT_32); });
            },
            function (tokenEncoder, tokenDecoder, reset) {
                _this.testAction({ type: "split", value: [200, 201] }, function (o) { return tokenEncoder.encodeSplitToken(o); }, reset, function () { return tokenDecoder.decodeSplitToken(); });
            },
            //  15
            function (tokenEncoder, tokenDecoder, reset) {
                _this.testAction({ type: "split", value: [2000, 2001] }, function (o) { return tokenEncoder.encodeSplitToken(o); }, reset, function () { return tokenDecoder.decodeSplitToken(); });
            },
            function (tokenEncoder, tokenDecoder, reset) {
                _this.testAction({ type: "split", value: [2000, 2001] }, function (o) { return tokenEncoder.encodeSplitToken(o, DataType_1.DataType.SPLIT_32); }, reset, function () { return tokenDecoder.decodeSplitToken(DataType_1.DataType.SPLIT_32); });
            },
            function (tokenEncoder, tokenDecoder, reset) {
                _this.testAction({ type: "leaf", value: "tokenstring" }, function (o) { return tokenEncoder.encodeToken(o); }, reset, function () { return tokenDecoder.decodeToken(); });
            },
            function (tokenEncoder, tokenDecoder, reset) {
                _this.testAction({ type: "leaf", value: 123.5 }, function (o) { return tokenEncoder.encodeToken(o); }, reset, function () { return tokenDecoder.decodeToken(); });
            },
            function (tokenEncoder, tokenDecoder, reset) {
                _this.testAction({ type: "leaf", value: "😁😆" }, function (o) { return tokenEncoder.encodeToken(o); }, reset, function () { return tokenDecoder.decodeToken(); });
            },
            //  20
            function (tokenEncoder, tokenDecoder, reset) {
                _this.testAction({ type: "array", value: [1, 10, 20, 30, 200] }, function (o) { return tokenEncoder.encodeToken(o); }, reset, function () { return tokenDecoder.decodeToken(); });
            },
            function (tokenEncoder, tokenDecoder, reset) {
                _this.testAction({ type: "array", value: [1001, 1010, 1020, 1030, 1200] }, function (o) { return tokenEncoder.encodeToken(o); }, reset, function () { return tokenDecoder.decodeToken(); });
            },
            function (tokenEncoder, tokenDecoder, reset) {
                _this.testAction({ type: "array", value: [10010, 10100, 10300, 20000] }, function (o) { return tokenEncoder.encodeToken(o); }, reset, function () { return tokenDecoder.decodeToken(); });
            },
            function (tokenEncoder, tokenDecoder, reset) {
                _this.testAction({ type: "array", value: [10010, 10100, 10000] }, function (o) { return tokenEncoder.encodeToken(o); }, reset, function () { return tokenDecoder.decodeToken(); });
            },
            function (tokenEncoder, tokenDecoder, reset) {
                _this.testAction({ type: "array", value: new Array(260).fill(null).map(function (_, index) { return index; }) }, function (o) { return tokenEncoder.encodeToken(o); }, reset, function () { return tokenDecoder.decodeToken(); });
            },
            //  25
            function (tokenEncoder, tokenDecoder, reset) {
                _this.testAction(new Array(100).fill(null).map(function (_, index) {
                    var token = {
                        type: "array",
                        value: new Array(index).fill(null).map(function (_, index) { return index; })
                    };
                    return token;
                }), function (o) { return tokenEncoder.encodeTokens(o); }, reset, function () { return tokenDecoder.decodeTokens(); });
            },
            function (tokenEncoder, tokenDecoder, reset) {
                _this.testAction(new Array(260).fill(null).map(function (_, index) {
                    var token = {
                        type: "array",
                        value: new Array(index).fill(null).map(function (_, index) { return index; })
                    };
                    return token;
                }), function (o) { return tokenEncoder.encodeTokens(o); }, reset, function () { return tokenDecoder.decodeTokens(); });
            },
            function (tokenEncoder, tokenDecoder, reset) {
                _this.testAction(new Array(260).fill(null).map(function (_, index) {
                    var token = {
                        type: "array",
                        value: [1]
                    };
                    return token;
                }), function (o) { return tokenEncoder.encodeTokens(o); }, reset, function () { return tokenDecoder.decodeTokens(); });
            },
        ];
        testers.forEach(function (tester, index) {
            var streamDataView = new stream_data_view_1.StreamDataView();
            var encoder = new TokenEncoder(streamDataView);
            var decoder = new TokenEncoder(streamDataView);
            var reset = function () { return streamDataView.resetOffset(); };
            tester(encoder, decoder, reset);
            console.info("\u2705 Passed test ".concat(index, "."));
        });
    };
    TokenEncoder.testAction = function (value, encode, reset, decode, check) {
        if (check === void 0) { check = function (result, value) { return console.assert(JSON.stringify(result) === JSON.stringify(value), "Not equal: \n%s\n!==\n%s", JSON.stringify(result), JSON.stringify(value)); }; }
        encode(value);
        reset();
        var decoded = decode();
        reset();
        check(decoded, value);
    };
    return TokenEncoder;
}());
exports["default"] = TokenEncoder;

},{"./DataType":7,"stream-data-view":4}],10:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var DEFAULT_CONFIG = {
    cacheable: true,
    allowReferences: false
};
/**
 * Class storing all data that can be extracted.
 */
var ExtractableData = /** @class */ (function () {
    function ExtractableData(dataStore, config) {
        this.extractor = new Extractor();
        this.dataStore = dataStore;
        this.config = __assign(__assign({}, DEFAULT_CONFIG), config);
        this.fileNames = this.extractor.extractFileNames(dataStore.files, dataStore.headerTokens, this.config);
        this.fileToSlot = Object.fromEntries(this.fileNames.map(function (file, index) { return [file, index]; }));
        this.version = dataStore.version;
        this.originalDataSize = dataStore.originalDataSize;
        this.compressedSize = dataStore.compressedSize;
    }
    /**
     * Extract data form a stored file.
     *
     * @param filename filename to be extracted.
     * @param allowReferences If true, within the extracted object, multiple nodes can reference the same object.
     *  This helps performance and memory, but can lead to weird side effects if the extracted object
     *  gets modified.
     * @returns extracted data.
     */
    ExtractableData.prototype.extract = function (filename, allowReferences) {
        var slot = this.fileToSlot[filename];
        var dataTokens = this.dataStore.getDataTokens(slot);
        if (dataTokens) {
            return this.extractor.extract(this.dataStore.headerTokens, dataTokens, __assign(__assign({}, this.config), { allowReferences: allowReferences !== null && allowReferences !== void 0 ? allowReferences : this.config.allowReferences }));
        }
    };
    ExtractableData.prototype.getHeaderTokens = function () {
        return this.dataStore.headerTokens;
    };
    return ExtractableData;
}());
exports["default"] = ExtractableData;
var Extractor = /** @class */ (function () {
    function Extractor() {
        this.valueFetcher = {
            "array": this.getArray.bind(this),
            "leaf": undefined,
            "object": this.getObject.bind(this),
            "split": this.getSplit.bind(this),
            "reference": this.getReference.bind(this)
        };
    }
    Extractor.prototype.extractFileNames = function (files, headerTokens, config) {
        var _this = this;
        return files.map(function (index) { return _this.extractToken(index, headerTokens, undefined, config); });
    };
    Extractor.prototype.extract = function (headerTokens, dataTokens, config) {
        return this.extractToken(headerTokens.length + dataTokens.length - 1, headerTokens, dataTokens, config);
    };
    Extractor.prototype.extractToken = function (index, headerTokens, dataTokens, config, forceAllowUseCache) {
        var token = index < headerTokens.length ? headerTokens[index] : dataTokens === null || dataTokens === void 0 ? void 0 : dataTokens[index - headerTokens.length];
        if (!token) {
            throw new Error("Invalid token at index: " + index);
        }
        if (token.type === "leaf") {
            return token.value;
        }
        return this.extractValueOrCache(token, headerTokens, dataTokens, config, forceAllowUseCache || config.allowReferences, this.valueFetcher[token.type]);
    };
    Extractor.prototype.getReference = function (token, headerTokens, dataTokens, config) {
        var index = token.value;
        return this.extractToken(index, headerTokens, dataTokens, config);
    };
    Extractor.prototype.getArray = function (token, headerTokens, dataTokens, config) {
        var _this = this;
        if (!Array.isArray(token.value)) {
            throw new Error("Invalid array token");
        }
        return token.value.map(function (index) { return _this.extractToken(index, headerTokens, dataTokens, config); });
    };
    Extractor.prototype.getObject = function (token, headerTokens, dataTokens, config) {
        var _a = token.value, keyIndex = _a[0], valueIndex = _a[1];
        var keys = this.extractToken(keyIndex, headerTokens, dataTokens, config, true);
        var values = this.extractToken(valueIndex, headerTokens, dataTokens, config);
        return Object.fromEntries(keys.map(function (key, index) { return [key, values[index]]; }));
    };
    Extractor.prototype.getSplit = function (token, headerTokens, dataTokens, config) {
        var _a = token.value, chunksIndex = _a[0], separatorsIndex = _a[1];
        var chunks = this.extractToken(chunksIndex, headerTokens, dataTokens, config, true);
        var separators = this.extractToken(separatorsIndex, headerTokens, dataTokens, config, true);
        return chunks.map(function (chunk, index) { var _a; return "".concat(chunk).concat((_a = separators[index]) !== null && _a !== void 0 ? _a : ""); }).join("");
    };
    Extractor.prototype.extractValueOrCache = function (token, headerTokens, dataTokens, config, allowUseCache, getValue) {
        if (token.cache !== undefined && allowUseCache) {
            return token.cache;
        }
        if (!getValue) {
            throw new Error("getValue not provided.");
        }
        var value = getValue(token, headerTokens, dataTokens, config);
        if (config.cacheable) {
            token.cache = value;
        }
        return value;
    };
    return Extractor;
}());

},{}],11:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var Loader_1 = __importDefault(require("./io/Loader"));
var TokenEncoder_1 = __importDefault(require("./compression/TokenEncoder"));
var Compressor_1 = __importDefault(require("./compression/Compressor"));
var exportedClasses = {
    Loader: Loader_1["default"],
    Compressor: Compressor_1["default"],
    TokenEncoder: TokenEncoder_1["default"]
};
exports["default"] = exportedClasses;
globalThis.exports = exportedClasses;

},{"./compression/Compressor":6,"./compression/TokenEncoder":9,"./io/Loader":12}],12:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
function extension(file) {
    return file.split(".").pop();
}
var Loader = /** @class */ (function () {
    function Loader() {
    }
    Loader.prototype.load = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var response, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, fetch(file)];
                    case 1:
                        response = _b.sent();
                        if (!(extension(file) === "json")) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.json()];
                    case 2:
                        _a = _b.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, response.text()];
                    case 4:
                        _a = _b.sent();
                        _b.label = 5;
                    case 5: return [2 /*return*/, _a];
                }
            });
        });
    };
    return Loader;
}());
exports["default"] = Loader;

},{}],13:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var DataType_1 = require("../compression/DataType");
/**
 * Reduce header from using large tokens to reduce tokens.
 */
var Reducer = /** @class */ (function () {
    function Reducer(debug) {
        this.dataTypeUtils = new DataType_1.DataTypeUtils();
        this.debug = debug !== null && debug !== void 0 ? debug : false;
    }
    /**
     * Reduce header with smaller tokens for storage
     *
     * @param header Represents all data that we have.
     * @returns DataStorage object that's the minimum we can store.
     */
    Reducer.prototype.reduce = function (header) {
        var _this = this;
        var hashToIndex = {};
        //  start with header tokens
        var headerTokens = this.createReducedTokens(Object.values(header.registry)
            .filter(function (token) { return token.files.size > 1 || token.files.has("header"); }), hashToIndex);
        //  save files
        var fileEntries = Object.entries(header.files).sort(function (_a, _b) {
            var name1 = _a[0];
            var name2 = _b[0];
            return name1.localeCompare(name2);
        });
        var files = fileEntries.map(function (_a) {
            var token = _a[1];
            return hashToIndex[token.nameToken.hash];
        });
        //  save all files separately
        var dataTokens = fileEntries.map(function (_a) {
            var file = _a[0], root = _a[1].token;
            var subHashToIndex = __assign({}, hashToIndex);
            var tokens = Object.values(header.registry).filter(function (token) { return token.files.has(file) && token !== root; });
            return _this.createReducedTokens(tokens, subHashToIndex, headerTokens.length).concat(_this.createReducedTokens([root], subHashToIndex, headerTokens.length));
        });
        return {
            originalDataSize: header.originalDataSize,
            headerTokens: headerTokens,
            files: files,
            getDataTokens: function (index) { return dataTokens[index]; }
        };
    };
    /**
     * Sort tokens by frequency.
     */
    Reducer.prototype.sortTokens = function (tokens) {
        tokens.sort(function (t1, t2) { return t2.count - t1.count; });
    };
    /**
     * Organize tokens in groups of 255
     * @param tokens
     */
    Reducer.prototype.organizeTokens = function (tokens) {
        var _this = this;
        if (!tokens.length) {
            return tokens;
        }
        var buckets = [];
        tokens.forEach(function (token) {
            var dataType = _this.dataTypeUtils.getFullTokenDataType(token);
            var bucket = undefined;
            for (var _i = 0, buckets_1 = buckets; _i < buckets_1.length; _i++) {
                var b = buckets_1[_i];
                if (b.length < 255 && _this.dataTypeUtils.getFullTokenDataType(b[0]) === dataType) {
                    bucket = b;
                    break;
                }
            }
            if (!bucket) {
                bucket = [];
                buckets.push(bucket);
            }
            bucket.push(token);
        });
        buckets.forEach(function (bucket) {
            var dataType = _this.dataTypeUtils.getFullTokenDataType(bucket[0]);
            switch (dataType) {
                case DataType_1.DataType.UINT8:
                case DataType_1.DataType.UINT16:
                case DataType_1.DataType.UINT32:
                case DataType_1.DataType.INT8:
                case DataType_1.DataType.INT16:
                case DataType_1.DataType.INT32:
                case DataType_1.DataType.FLOAT32:
                case DataType_1.DataType.FLOAT64:
                    bucket.sort(function (a, b) { return b.value - a.value; });
                    break;
                case DataType_1.DataType.STRING:
                case DataType_1.DataType.UNICODE:
                    bucket.sort(function (a, b) { return b.value.length - a.value.length; });
                    break;
                case DataType_1.DataType.ARRAY_8:
                case DataType_1.DataType.ARRAY_16:
                case DataType_1.DataType.ARRAY_32:
                    bucket.sort(function (a, b) { return b.value.length - a.value.length; });
                    break;
            }
        });
        var resultTokens = [];
        buckets.forEach(function (bucket) { return bucket.forEach(function (token) { return resultTokens.push(token); }); });
        return resultTokens;
    };
    Reducer.prototype.createReducedTokens = function (tokens, hashToIndex, offset) {
        var _this = this;
        if (offset === void 0) { offset = 0; }
        this.sortTokens(tokens);
        var organizedTokens = this.organizeTokens(tokens);
        organizedTokens.forEach(function (_a, index) {
            var hash = _a.hash;
            return hashToIndex[hash] = index + offset;
        });
        return organizedTokens.map(function (token) {
            var _a, _b;
            return (__assign({ type: token.type, value: (_b = (_a = token.reference) === null || _a === void 0 ? void 0 : _a.map(function (hash) { return hashToIndex[hash]; })) !== null && _b !== void 0 ? _b : token.value }, _this.debug ? { debug: token.value } : {}));
        });
    };
    /**
     *  Traverse object to produce a set of tokens used to produce a complex object
     * @param token Root token
     * @param hashToIndex Hash to index mapping
     * @param result Resulting set of tokens
     */
    Reducer.prototype.createComplexObject = function (token, hashToIndex, registry, result) {
        var _this = this;
        var _a;
        if (hashToIndex[token.hash] >= 0) {
            result.push({ type: "reference", value: hashToIndex[token.hash] });
        }
        else if (token.type === "leaf") {
            if (token.count > 1) {
                var index = result.length;
                hashToIndex[token.hash] = index;
            }
            result.push({ type: token.type, value: token.value });
        }
        else if (token.type === "split" || token.type === "object" || token.type === "array") {
            if (token.count > 1) {
                var index = result.length;
                hashToIndex[token.hash] = index;
            }
            result.push({ type: token.type, value: undefined });
            var subTokens = (_a = token.reference) === null || _a === void 0 ? void 0 : _a.map(function (hash) { return registry[hash]; });
            subTokens === null || subTokens === void 0 ? void 0 : subTokens.forEach(function (token) {
                _this.createComplexObject(token, hashToIndex, registry, result);
            });
        }
        else {
            throw new Error("Invalid token type");
        }
    };
    return Reducer;
}());
exports["default"] = Reducer;

},{"../compression/DataType":7}],14:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.getType = exports.TEST_REGEX = exports.SPLIT_REGEX = void 0;
exports.SPLIT_REGEX = /\W+/g;
exports.TEST_REGEX = /(\w\W+|\W+\w)/;
/**
 * detect the type of a value
 *
 * @param value Value to analyze
 * @returns type of the value
 */
function getType(value) {
    if (Array.isArray(value)) {
        return "array";
    }
    else if (typeof value === "object" && value) {
        return "object";
    }
    else if (typeof value === "string" && exports.TEST_REGEX.test(value)) {
        return "split";
    }
    else {
        return "leaf";
    }
}
exports.getType = getType;

},{}],15:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var Loader_1 = __importDefault(require("../io/Loader"));
var Token_1 = require("./Token");
var blueimp_md5_1 = __importDefault(require("blueimp-md5"));
/**
 * Class for spitting objects into tokens.
 */
var Tokenizer = /** @class */ (function () {
    function Tokenizer() {
        this.loader = new Loader_1["default"]();
    }
    /**
     * Load json or text files and turn them into tokens.
     *
     * @param files files to load and reduce.
     */
    Tokenizer.prototype.load = function () {
        var files = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            files[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var sortedFiles, allData, header, textEncoder;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (files.some(function (file) { return typeof file !== "string"; })) {
                            throw new Error("Each argument passed to load must be a string.");
                        }
                        sortedFiles = files.sort();
                        return [4 /*yield*/, Promise.all(sortedFiles.map(this.loader.load))];
                    case 1:
                        allData = _a.sent();
                        header = this.tokenize(Object.fromEntries(allData.map(function (data, index) { return [sortedFiles[index], data]; })));
                        textEncoder = new TextEncoder();
                        header.originalDataSize = textEncoder.encode(JSON.stringify(allData)).byteLength;
                        return [2 /*return*/, header];
                }
            });
        });
    };
    /**
     * Takes a mapping of filename and their corresponding data, and turn them into tokens.
     *
     * @param items Mapping from filename to data.
     * @returns All data stored as tokens.
     */
    Tokenizer.prototype.tokenize = function (items) {
        var _this = this;
        var header = {
            registry: {},
            files: {}
        };
        var counter = { next: 0 };
        Object.entries(items).forEach(function (_a) {
            var file = _a[0], value = _a[1];
            header.files[file] = {
                nameToken: _this.tokenizeHelper(file, header.registry, counter, "header"),
                token: _this.tokenizeHelper(value, header.registry, counter, file)
            };
        });
        return header;
    };
    Tokenizer.prototype.registerToken = function (hash, value, registry, counter, file, reference) {
        var _a;
        var entry = (_a = registry[hash]) !== null && _a !== void 0 ? _a : (registry[hash] = {
            type: (0, Token_1.getType)(value),
            hash: hash,
            value: value,
            reference: reference,
            order: counter.next++,
            count: 0,
            files: new Set()
        });
        entry.files.add(file);
        entry.count++;
        return entry;
    };
    Tokenizer.prototype.tokenizeHelper = function (item, registry, counter, file) {
        var _this = this;
        var type = (0, Token_1.getType)(item);
        if (type === "array") {
            if (!Array.isArray(item)) {
                throw new Error("item should be an array");
            }
            var hashes = item.map(function (item) { return _this.tokenizeHelper(item, registry, counter, file); }).map(function (_a) {
                var hash = _a.hash;
                return hash;
            });
            var hash = (0, blueimp_md5_1["default"])(hashes.join(","));
            return this.registerToken(hash, item, registry, counter, file, hashes);
        }
        else if (type === "object") {
            var entries = Object.entries(item);
            var keysToken = this.tokenizeHelper(entries.map(function (_a) {
                var key = _a[0];
                return key;
            }), registry, counter, file);
            var valuesToken = this.tokenizeHelper(entries.map(function (_a) {
                var value = _a[1];
                return value;
            }), registry, counter, file);
            var hash = (0, blueimp_md5_1["default"])("".concat(keysToken.hash, "|").concat(valuesToken.hash));
            return this.registerToken(hash, item, registry, counter, file, [keysToken.hash, valuesToken.hash]);
        }
        else if (type === "split") {
            var chunks = item.split(Token_1.SPLIT_REGEX);
            var separators = item.match(Token_1.SPLIT_REGEX);
            var chunksToken = this.tokenizeHelper(chunks, registry, counter, file);
            var separatorsToken = this.tokenizeHelper(separators, registry, counter, file);
            var hash = (0, blueimp_md5_1["default"])("".concat(chunksToken.hash, "-").concat(separatorsToken.hash));
            return this.registerToken(hash, item, registry, counter, file, [chunksToken.hash, separatorsToken.hash]);
        }
        else {
            var m = (0, blueimp_md5_1["default"])(JSON.stringify(item));
            return this.registerToken(m, item, registry, counter, file);
        }
    };
    return Tokenizer;
}());
exports["default"] = Tokenizer;

},{"../io/Loader":12,"./Token":14,"blueimp-md5":1}]},{},[11]);
