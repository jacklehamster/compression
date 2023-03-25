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
'use strict';


var loader = require('./lib/loader');
var dumper = require('./lib/dumper');


function renamed(from, to) {
  return function () {
    throw new Error('Function yaml.' + from + ' is removed in js-yaml 4. ' +
      'Use yaml.' + to + ' instead, which is now safe by default.');
  };
}


module.exports.Type                = require('./lib/type');
module.exports.Schema              = require('./lib/schema');
module.exports.FAILSAFE_SCHEMA     = require('./lib/schema/failsafe');
module.exports.JSON_SCHEMA         = require('./lib/schema/json');
module.exports.CORE_SCHEMA         = require('./lib/schema/core');
module.exports.DEFAULT_SCHEMA      = require('./lib/schema/default');
module.exports.load                = loader.load;
module.exports.loadAll             = loader.loadAll;
module.exports.dump                = dumper.dump;
module.exports.YAMLException       = require('./lib/exception');

// Re-export all types in case user wants to create custom schema
module.exports.types = {
  binary:    require('./lib/type/binary'),
  float:     require('./lib/type/float'),
  map:       require('./lib/type/map'),
  null:      require('./lib/type/null'),
  pairs:     require('./lib/type/pairs'),
  set:       require('./lib/type/set'),
  timestamp: require('./lib/type/timestamp'),
  bool:      require('./lib/type/bool'),
  int:       require('./lib/type/int'),
  merge:     require('./lib/type/merge'),
  omap:      require('./lib/type/omap'),
  seq:       require('./lib/type/seq'),
  str:       require('./lib/type/str')
};

// Removed functions from JS-YAML 3.0.x
module.exports.safeLoad            = renamed('safeLoad', 'load');
module.exports.safeLoadAll         = renamed('safeLoadAll', 'loadAll');
module.exports.safeDump            = renamed('safeDump', 'dump');

},{"./lib/dumper":6,"./lib/exception":7,"./lib/loader":8,"./lib/schema":9,"./lib/schema/core":10,"./lib/schema/default":11,"./lib/schema/failsafe":12,"./lib/schema/json":13,"./lib/type":15,"./lib/type/binary":16,"./lib/type/bool":17,"./lib/type/float":18,"./lib/type/int":19,"./lib/type/map":20,"./lib/type/merge":21,"./lib/type/null":22,"./lib/type/omap":23,"./lib/type/pairs":24,"./lib/type/seq":25,"./lib/type/set":26,"./lib/type/str":27,"./lib/type/timestamp":28}],5:[function(require,module,exports){
'use strict';


function isNothing(subject) {
  return (typeof subject === 'undefined') || (subject === null);
}


function isObject(subject) {
  return (typeof subject === 'object') && (subject !== null);
}


function toArray(sequence) {
  if (Array.isArray(sequence)) return sequence;
  else if (isNothing(sequence)) return [];

  return [ sequence ];
}


function extend(target, source) {
  var index, length, key, sourceKeys;

  if (source) {
    sourceKeys = Object.keys(source);

    for (index = 0, length = sourceKeys.length; index < length; index += 1) {
      key = sourceKeys[index];
      target[key] = source[key];
    }
  }

  return target;
}


function repeat(string, count) {
  var result = '', cycle;

  for (cycle = 0; cycle < count; cycle += 1) {
    result += string;
  }

  return result;
}


function isNegativeZero(number) {
  return (number === 0) && (Number.NEGATIVE_INFINITY === 1 / number);
}


module.exports.isNothing      = isNothing;
module.exports.isObject       = isObject;
module.exports.toArray        = toArray;
module.exports.repeat         = repeat;
module.exports.isNegativeZero = isNegativeZero;
module.exports.extend         = extend;

},{}],6:[function(require,module,exports){
'use strict';

/*eslint-disable no-use-before-define*/

var common              = require('./common');
var YAMLException       = require('./exception');
var DEFAULT_SCHEMA      = require('./schema/default');

var _toString       = Object.prototype.toString;
var _hasOwnProperty = Object.prototype.hasOwnProperty;

var CHAR_BOM                  = 0xFEFF;
var CHAR_TAB                  = 0x09; /* Tab */
var CHAR_LINE_FEED            = 0x0A; /* LF */
var CHAR_CARRIAGE_RETURN      = 0x0D; /* CR */
var CHAR_SPACE                = 0x20; /* Space */
var CHAR_EXCLAMATION          = 0x21; /* ! */
var CHAR_DOUBLE_QUOTE         = 0x22; /* " */
var CHAR_SHARP                = 0x23; /* # */
var CHAR_PERCENT              = 0x25; /* % */
var CHAR_AMPERSAND            = 0x26; /* & */
var CHAR_SINGLE_QUOTE         = 0x27; /* ' */
var CHAR_ASTERISK             = 0x2A; /* * */
var CHAR_COMMA                = 0x2C; /* , */
var CHAR_MINUS                = 0x2D; /* - */
var CHAR_COLON                = 0x3A; /* : */
var CHAR_EQUALS               = 0x3D; /* = */
var CHAR_GREATER_THAN         = 0x3E; /* > */
var CHAR_QUESTION             = 0x3F; /* ? */
var CHAR_COMMERCIAL_AT        = 0x40; /* @ */
var CHAR_LEFT_SQUARE_BRACKET  = 0x5B; /* [ */
var CHAR_RIGHT_SQUARE_BRACKET = 0x5D; /* ] */
var CHAR_GRAVE_ACCENT         = 0x60; /* ` */
var CHAR_LEFT_CURLY_BRACKET   = 0x7B; /* { */
var CHAR_VERTICAL_LINE        = 0x7C; /* | */
var CHAR_RIGHT_CURLY_BRACKET  = 0x7D; /* } */

var ESCAPE_SEQUENCES = {};

ESCAPE_SEQUENCES[0x00]   = '\\0';
ESCAPE_SEQUENCES[0x07]   = '\\a';
ESCAPE_SEQUENCES[0x08]   = '\\b';
ESCAPE_SEQUENCES[0x09]   = '\\t';
ESCAPE_SEQUENCES[0x0A]   = '\\n';
ESCAPE_SEQUENCES[0x0B]   = '\\v';
ESCAPE_SEQUENCES[0x0C]   = '\\f';
ESCAPE_SEQUENCES[0x0D]   = '\\r';
ESCAPE_SEQUENCES[0x1B]   = '\\e';
ESCAPE_SEQUENCES[0x22]   = '\\"';
ESCAPE_SEQUENCES[0x5C]   = '\\\\';
ESCAPE_SEQUENCES[0x85]   = '\\N';
ESCAPE_SEQUENCES[0xA0]   = '\\_';
ESCAPE_SEQUENCES[0x2028] = '\\L';
ESCAPE_SEQUENCES[0x2029] = '\\P';

var DEPRECATED_BOOLEANS_SYNTAX = [
  'y', 'Y', 'yes', 'Yes', 'YES', 'on', 'On', 'ON',
  'n', 'N', 'no', 'No', 'NO', 'off', 'Off', 'OFF'
];

var DEPRECATED_BASE60_SYNTAX = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;

function compileStyleMap(schema, map) {
  var result, keys, index, length, tag, style, type;

  if (map === null) return {};

  result = {};
  keys = Object.keys(map);

  for (index = 0, length = keys.length; index < length; index += 1) {
    tag = keys[index];
    style = String(map[tag]);

    if (tag.slice(0, 2) === '!!') {
      tag = 'tag:yaml.org,2002:' + tag.slice(2);
    }
    type = schema.compiledTypeMap['fallback'][tag];

    if (type && _hasOwnProperty.call(type.styleAliases, style)) {
      style = type.styleAliases[style];
    }

    result[tag] = style;
  }

  return result;
}

function encodeHex(character) {
  var string, handle, length;

  string = character.toString(16).toUpperCase();

  if (character <= 0xFF) {
    handle = 'x';
    length = 2;
  } else if (character <= 0xFFFF) {
    handle = 'u';
    length = 4;
  } else if (character <= 0xFFFFFFFF) {
    handle = 'U';
    length = 8;
  } else {
    throw new YAMLException('code point within a string may not be greater than 0xFFFFFFFF');
  }

  return '\\' + handle + common.repeat('0', length - string.length) + string;
}


var QUOTING_TYPE_SINGLE = 1,
    QUOTING_TYPE_DOUBLE = 2;

function State(options) {
  this.schema        = options['schema'] || DEFAULT_SCHEMA;
  this.indent        = Math.max(1, (options['indent'] || 2));
  this.noArrayIndent = options['noArrayIndent'] || false;
  this.skipInvalid   = options['skipInvalid'] || false;
  this.flowLevel     = (common.isNothing(options['flowLevel']) ? -1 : options['flowLevel']);
  this.styleMap      = compileStyleMap(this.schema, options['styles'] || null);
  this.sortKeys      = options['sortKeys'] || false;
  this.lineWidth     = options['lineWidth'] || 80;
  this.noRefs        = options['noRefs'] || false;
  this.noCompatMode  = options['noCompatMode'] || false;
  this.condenseFlow  = options['condenseFlow'] || false;
  this.quotingType   = options['quotingType'] === '"' ? QUOTING_TYPE_DOUBLE : QUOTING_TYPE_SINGLE;
  this.forceQuotes   = options['forceQuotes'] || false;
  this.replacer      = typeof options['replacer'] === 'function' ? options['replacer'] : null;

  this.implicitTypes = this.schema.compiledImplicit;
  this.explicitTypes = this.schema.compiledExplicit;

  this.tag = null;
  this.result = '';

  this.duplicates = [];
  this.usedDuplicates = null;
}

// Indents every line in a string. Empty lines (\n only) are not indented.
function indentString(string, spaces) {
  var ind = common.repeat(' ', spaces),
      position = 0,
      next = -1,
      result = '',
      line,
      length = string.length;

  while (position < length) {
    next = string.indexOf('\n', position);
    if (next === -1) {
      line = string.slice(position);
      position = length;
    } else {
      line = string.slice(position, next + 1);
      position = next + 1;
    }

    if (line.length && line !== '\n') result += ind;

    result += line;
  }

  return result;
}

function generateNextLine(state, level) {
  return '\n' + common.repeat(' ', state.indent * level);
}

function testImplicitResolving(state, str) {
  var index, length, type;

  for (index = 0, length = state.implicitTypes.length; index < length; index += 1) {
    type = state.implicitTypes[index];

    if (type.resolve(str)) {
      return true;
    }
  }

  return false;
}

// [33] s-white ::= s-space | s-tab
function isWhitespace(c) {
  return c === CHAR_SPACE || c === CHAR_TAB;
}

// Returns true if the character can be printed without escaping.
// From YAML 1.2: "any allowed characters known to be non-printable
// should also be escaped. [However,] This isn’t mandatory"
// Derived from nb-char - \t - #x85 - #xA0 - #x2028 - #x2029.
function isPrintable(c) {
  return  (0x00020 <= c && c <= 0x00007E)
      || ((0x000A1 <= c && c <= 0x00D7FF) && c !== 0x2028 && c !== 0x2029)
      || ((0x0E000 <= c && c <= 0x00FFFD) && c !== CHAR_BOM)
      ||  (0x10000 <= c && c <= 0x10FFFF);
}

// [34] ns-char ::= nb-char - s-white
// [27] nb-char ::= c-printable - b-char - c-byte-order-mark
// [26] b-char  ::= b-line-feed | b-carriage-return
// Including s-white (for some reason, examples doesn't match specs in this aspect)
// ns-char ::= c-printable - b-line-feed - b-carriage-return - c-byte-order-mark
function isNsCharOrWhitespace(c) {
  return isPrintable(c)
    && c !== CHAR_BOM
    // - b-char
    && c !== CHAR_CARRIAGE_RETURN
    && c !== CHAR_LINE_FEED;
}

// [127]  ns-plain-safe(c) ::= c = flow-out  ⇒ ns-plain-safe-out
//                             c = flow-in   ⇒ ns-plain-safe-in
//                             c = block-key ⇒ ns-plain-safe-out
//                             c = flow-key  ⇒ ns-plain-safe-in
// [128] ns-plain-safe-out ::= ns-char
// [129]  ns-plain-safe-in ::= ns-char - c-flow-indicator
// [130]  ns-plain-char(c) ::=  ( ns-plain-safe(c) - “:” - “#” )
//                            | ( /* An ns-char preceding */ “#” )
//                            | ( “:” /* Followed by an ns-plain-safe(c) */ )
function isPlainSafe(c, prev, inblock) {
  var cIsNsCharOrWhitespace = isNsCharOrWhitespace(c);
  var cIsNsChar = cIsNsCharOrWhitespace && !isWhitespace(c);
  return (
    // ns-plain-safe
    inblock ? // c = flow-in
      cIsNsCharOrWhitespace
      : cIsNsCharOrWhitespace
        // - c-flow-indicator
        && c !== CHAR_COMMA
        && c !== CHAR_LEFT_SQUARE_BRACKET
        && c !== CHAR_RIGHT_SQUARE_BRACKET
        && c !== CHAR_LEFT_CURLY_BRACKET
        && c !== CHAR_RIGHT_CURLY_BRACKET
  )
    // ns-plain-char
    && c !== CHAR_SHARP // false on '#'
    && !(prev === CHAR_COLON && !cIsNsChar) // false on ': '
    || (isNsCharOrWhitespace(prev) && !isWhitespace(prev) && c === CHAR_SHARP) // change to true on '[^ ]#'
    || (prev === CHAR_COLON && cIsNsChar); // change to true on ':[^ ]'
}

// Simplified test for values allowed as the first character in plain style.
function isPlainSafeFirst(c) {
  // Uses a subset of ns-char - c-indicator
  // where ns-char = nb-char - s-white.
  // No support of ( ( “?” | “:” | “-” ) /* Followed by an ns-plain-safe(c)) */ ) part
  return isPrintable(c) && c !== CHAR_BOM
    && !isWhitespace(c) // - s-white
    // - (c-indicator ::=
    // “-” | “?” | “:” | “,” | “[” | “]” | “{” | “}”
    && c !== CHAR_MINUS
    && c !== CHAR_QUESTION
    && c !== CHAR_COLON
    && c !== CHAR_COMMA
    && c !== CHAR_LEFT_SQUARE_BRACKET
    && c !== CHAR_RIGHT_SQUARE_BRACKET
    && c !== CHAR_LEFT_CURLY_BRACKET
    && c !== CHAR_RIGHT_CURLY_BRACKET
    // | “#” | “&” | “*” | “!” | “|” | “=” | “>” | “'” | “"”
    && c !== CHAR_SHARP
    && c !== CHAR_AMPERSAND
    && c !== CHAR_ASTERISK
    && c !== CHAR_EXCLAMATION
    && c !== CHAR_VERTICAL_LINE
    && c !== CHAR_EQUALS
    && c !== CHAR_GREATER_THAN
    && c !== CHAR_SINGLE_QUOTE
    && c !== CHAR_DOUBLE_QUOTE
    // | “%” | “@” | “`”)
    && c !== CHAR_PERCENT
    && c !== CHAR_COMMERCIAL_AT
    && c !== CHAR_GRAVE_ACCENT;
}

// Simplified test for values allowed as the last character in plain style.
function isPlainSafeLast(c) {
  // just not whitespace or colon, it will be checked to be plain character later
  return !isWhitespace(c) && c !== CHAR_COLON;
}

// Same as 'string'.codePointAt(pos), but works in older browsers.
function codePointAt(string, pos) {
  var first = string.charCodeAt(pos), second;
  if (first >= 0xD800 && first <= 0xDBFF && pos + 1 < string.length) {
    second = string.charCodeAt(pos + 1);
    if (second >= 0xDC00 && second <= 0xDFFF) {
      // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
      return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
    }
  }
  return first;
}

// Determines whether block indentation indicator is required.
function needIndentIndicator(string) {
  var leadingSpaceRe = /^\n* /;
  return leadingSpaceRe.test(string);
}

var STYLE_PLAIN   = 1,
    STYLE_SINGLE  = 2,
    STYLE_LITERAL = 3,
    STYLE_FOLDED  = 4,
    STYLE_DOUBLE  = 5;

// Determines which scalar styles are possible and returns the preferred style.
// lineWidth = -1 => no limit.
// Pre-conditions: str.length > 0.
// Post-conditions:
//    STYLE_PLAIN or STYLE_SINGLE => no \n are in the string.
//    STYLE_LITERAL => no lines are suitable for folding (or lineWidth is -1).
//    STYLE_FOLDED => a line > lineWidth and can be folded (and lineWidth != -1).
function chooseScalarStyle(string, singleLineOnly, indentPerLevel, lineWidth,
  testAmbiguousType, quotingType, forceQuotes, inblock) {

  var i;
  var char = 0;
  var prevChar = null;
  var hasLineBreak = false;
  var hasFoldableLine = false; // only checked if shouldTrackWidth
  var shouldTrackWidth = lineWidth !== -1;
  var previousLineBreak = -1; // count the first line correctly
  var plain = isPlainSafeFirst(codePointAt(string, 0))
          && isPlainSafeLast(codePointAt(string, string.length - 1));

  if (singleLineOnly || forceQuotes) {
    // Case: no block styles.
    // Check for disallowed characters to rule out plain and single.
    for (i = 0; i < string.length; char >= 0x10000 ? i += 2 : i++) {
      char = codePointAt(string, i);
      if (!isPrintable(char)) {
        return STYLE_DOUBLE;
      }
      plain = plain && isPlainSafe(char, prevChar, inblock);
      prevChar = char;
    }
  } else {
    // Case: block styles permitted.
    for (i = 0; i < string.length; char >= 0x10000 ? i += 2 : i++) {
      char = codePointAt(string, i);
      if (char === CHAR_LINE_FEED) {
        hasLineBreak = true;
        // Check if any line can be folded.
        if (shouldTrackWidth) {
          hasFoldableLine = hasFoldableLine ||
            // Foldable line = too long, and not more-indented.
            (i - previousLineBreak - 1 > lineWidth &&
             string[previousLineBreak + 1] !== ' ');
          previousLineBreak = i;
        }
      } else if (!isPrintable(char)) {
        return STYLE_DOUBLE;
      }
      plain = plain && isPlainSafe(char, prevChar, inblock);
      prevChar = char;
    }
    // in case the end is missing a \n
    hasFoldableLine = hasFoldableLine || (shouldTrackWidth &&
      (i - previousLineBreak - 1 > lineWidth &&
       string[previousLineBreak + 1] !== ' '));
  }
  // Although every style can represent \n without escaping, prefer block styles
  // for multiline, since they're more readable and they don't add empty lines.
  // Also prefer folding a super-long line.
  if (!hasLineBreak && !hasFoldableLine) {
    // Strings interpretable as another type have to be quoted;
    // e.g. the string 'true' vs. the boolean true.
    if (plain && !forceQuotes && !testAmbiguousType(string)) {
      return STYLE_PLAIN;
    }
    return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
  }
  // Edge case: block indentation indicator can only have one digit.
  if (indentPerLevel > 9 && needIndentIndicator(string)) {
    return STYLE_DOUBLE;
  }
  // At this point we know block styles are valid.
  // Prefer literal style unless we want to fold.
  if (!forceQuotes) {
    return hasFoldableLine ? STYLE_FOLDED : STYLE_LITERAL;
  }
  return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
}

// Note: line breaking/folding is implemented for only the folded style.
// NB. We drop the last trailing newline (if any) of a returned block scalar
//  since the dumper adds its own newline. This always works:
//    • No ending newline => unaffected; already using strip "-" chomping.
//    • Ending newline    => removed then restored.
//  Importantly, this keeps the "+" chomp indicator from gaining an extra line.
function writeScalar(state, string, level, iskey, inblock) {
  state.dump = (function () {
    if (string.length === 0) {
      return state.quotingType === QUOTING_TYPE_DOUBLE ? '""' : "''";
    }
    if (!state.noCompatMode) {
      if (DEPRECATED_BOOLEANS_SYNTAX.indexOf(string) !== -1 || DEPRECATED_BASE60_SYNTAX.test(string)) {
        return state.quotingType === QUOTING_TYPE_DOUBLE ? ('"' + string + '"') : ("'" + string + "'");
      }
    }

    var indent = state.indent * Math.max(1, level); // no 0-indent scalars
    // As indentation gets deeper, let the width decrease monotonically
    // to the lower bound min(state.lineWidth, 40).
    // Note that this implies
    //  state.lineWidth ≤ 40 + state.indent: width is fixed at the lower bound.
    //  state.lineWidth > 40 + state.indent: width decreases until the lower bound.
    // This behaves better than a constant minimum width which disallows narrower options,
    // or an indent threshold which causes the width to suddenly increase.
    var lineWidth = state.lineWidth === -1
      ? -1 : Math.max(Math.min(state.lineWidth, 40), state.lineWidth - indent);

    // Without knowing if keys are implicit/explicit, assume implicit for safety.
    var singleLineOnly = iskey
      // No block styles in flow mode.
      || (state.flowLevel > -1 && level >= state.flowLevel);
    function testAmbiguity(string) {
      return testImplicitResolving(state, string);
    }

    switch (chooseScalarStyle(string, singleLineOnly, state.indent, lineWidth,
      testAmbiguity, state.quotingType, state.forceQuotes && !iskey, inblock)) {

      case STYLE_PLAIN:
        return string;
      case STYLE_SINGLE:
        return "'" + string.replace(/'/g, "''") + "'";
      case STYLE_LITERAL:
        return '|' + blockHeader(string, state.indent)
          + dropEndingNewline(indentString(string, indent));
      case STYLE_FOLDED:
        return '>' + blockHeader(string, state.indent)
          + dropEndingNewline(indentString(foldString(string, lineWidth), indent));
      case STYLE_DOUBLE:
        return '"' + escapeString(string, lineWidth) + '"';
      default:
        throw new YAMLException('impossible error: invalid scalar style');
    }
  }());
}

// Pre-conditions: string is valid for a block scalar, 1 <= indentPerLevel <= 9.
function blockHeader(string, indentPerLevel) {
  var indentIndicator = needIndentIndicator(string) ? String(indentPerLevel) : '';

  // note the special case: the string '\n' counts as a "trailing" empty line.
  var clip =          string[string.length - 1] === '\n';
  var keep = clip && (string[string.length - 2] === '\n' || string === '\n');
  var chomp = keep ? '+' : (clip ? '' : '-');

  return indentIndicator + chomp + '\n';
}

// (See the note for writeScalar.)
function dropEndingNewline(string) {
  return string[string.length - 1] === '\n' ? string.slice(0, -1) : string;
}

// Note: a long line without a suitable break point will exceed the width limit.
// Pre-conditions: every char in str isPrintable, str.length > 0, width > 0.
function foldString(string, width) {
  // In folded style, $k$ consecutive newlines output as $k+1$ newlines—
  // unless they're before or after a more-indented line, or at the very
  // beginning or end, in which case $k$ maps to $k$.
  // Therefore, parse each chunk as newline(s) followed by a content line.
  var lineRe = /(\n+)([^\n]*)/g;

  // first line (possibly an empty line)
  var result = (function () {
    var nextLF = string.indexOf('\n');
    nextLF = nextLF !== -1 ? nextLF : string.length;
    lineRe.lastIndex = nextLF;
    return foldLine(string.slice(0, nextLF), width);
  }());
  // If we haven't reached the first content line yet, don't add an extra \n.
  var prevMoreIndented = string[0] === '\n' || string[0] === ' ';
  var moreIndented;

  // rest of the lines
  var match;
  while ((match = lineRe.exec(string))) {
    var prefix = match[1], line = match[2];
    moreIndented = (line[0] === ' ');
    result += prefix
      + (!prevMoreIndented && !moreIndented && line !== ''
        ? '\n' : '')
      + foldLine(line, width);
    prevMoreIndented = moreIndented;
  }

  return result;
}

// Greedy line breaking.
// Picks the longest line under the limit each time,
// otherwise settles for the shortest line over the limit.
// NB. More-indented lines *cannot* be folded, as that would add an extra \n.
function foldLine(line, width) {
  if (line === '' || line[0] === ' ') return line;

  // Since a more-indented line adds a \n, breaks can't be followed by a space.
  var breakRe = / [^ ]/g; // note: the match index will always be <= length-2.
  var match;
  // start is an inclusive index. end, curr, and next are exclusive.
  var start = 0, end, curr = 0, next = 0;
  var result = '';

  // Invariants: 0 <= start <= length-1.
  //   0 <= curr <= next <= max(0, length-2). curr - start <= width.
  // Inside the loop:
  //   A match implies length >= 2, so curr and next are <= length-2.
  while ((match = breakRe.exec(line))) {
    next = match.index;
    // maintain invariant: curr - start <= width
    if (next - start > width) {
      end = (curr > start) ? curr : next; // derive end <= length-2
      result += '\n' + line.slice(start, end);
      // skip the space that was output as \n
      start = end + 1;                    // derive start <= length-1
    }
    curr = next;
  }

  // By the invariants, start <= length-1, so there is something left over.
  // It is either the whole string or a part starting from non-whitespace.
  result += '\n';
  // Insert a break if the remainder is too long and there is a break available.
  if (line.length - start > width && curr > start) {
    result += line.slice(start, curr) + '\n' + line.slice(curr + 1);
  } else {
    result += line.slice(start);
  }

  return result.slice(1); // drop extra \n joiner
}

// Escapes a double-quoted string.
function escapeString(string) {
  var result = '';
  var char = 0;
  var escapeSeq;

  for (var i = 0; i < string.length; char >= 0x10000 ? i += 2 : i++) {
    char = codePointAt(string, i);
    escapeSeq = ESCAPE_SEQUENCES[char];

    if (!escapeSeq && isPrintable(char)) {
      result += string[i];
      if (char >= 0x10000) result += string[i + 1];
    } else {
      result += escapeSeq || encodeHex(char);
    }
  }

  return result;
}

function writeFlowSequence(state, level, object) {
  var _result = '',
      _tag    = state.tag,
      index,
      length,
      value;

  for (index = 0, length = object.length; index < length; index += 1) {
    value = object[index];

    if (state.replacer) {
      value = state.replacer.call(object, String(index), value);
    }

    // Write only valid elements, put null instead of invalid elements.
    if (writeNode(state, level, value, false, false) ||
        (typeof value === 'undefined' &&
         writeNode(state, level, null, false, false))) {

      if (_result !== '') _result += ',' + (!state.condenseFlow ? ' ' : '');
      _result += state.dump;
    }
  }

  state.tag = _tag;
  state.dump = '[' + _result + ']';
}

function writeBlockSequence(state, level, object, compact) {
  var _result = '',
      _tag    = state.tag,
      index,
      length,
      value;

  for (index = 0, length = object.length; index < length; index += 1) {
    value = object[index];

    if (state.replacer) {
      value = state.replacer.call(object, String(index), value);
    }

    // Write only valid elements, put null instead of invalid elements.
    if (writeNode(state, level + 1, value, true, true, false, true) ||
        (typeof value === 'undefined' &&
         writeNode(state, level + 1, null, true, true, false, true))) {

      if (!compact || _result !== '') {
        _result += generateNextLine(state, level);
      }

      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        _result += '-';
      } else {
        _result += '- ';
      }

      _result += state.dump;
    }
  }

  state.tag = _tag;
  state.dump = _result || '[]'; // Empty sequence if no valid values.
}

function writeFlowMapping(state, level, object) {
  var _result       = '',
      _tag          = state.tag,
      objectKeyList = Object.keys(object),
      index,
      length,
      objectKey,
      objectValue,
      pairBuffer;

  for (index = 0, length = objectKeyList.length; index < length; index += 1) {

    pairBuffer = '';
    if (_result !== '') pairBuffer += ', ';

    if (state.condenseFlow) pairBuffer += '"';

    objectKey = objectKeyList[index];
    objectValue = object[objectKey];

    if (state.replacer) {
      objectValue = state.replacer.call(object, objectKey, objectValue);
    }

    if (!writeNode(state, level, objectKey, false, false)) {
      continue; // Skip this pair because of invalid key;
    }

    if (state.dump.length > 1024) pairBuffer += '? ';

    pairBuffer += state.dump + (state.condenseFlow ? '"' : '') + ':' + (state.condenseFlow ? '' : ' ');

    if (!writeNode(state, level, objectValue, false, false)) {
      continue; // Skip this pair because of invalid value.
    }

    pairBuffer += state.dump;

    // Both key and value are valid.
    _result += pairBuffer;
  }

  state.tag = _tag;
  state.dump = '{' + _result + '}';
}

function writeBlockMapping(state, level, object, compact) {
  var _result       = '',
      _tag          = state.tag,
      objectKeyList = Object.keys(object),
      index,
      length,
      objectKey,
      objectValue,
      explicitPair,
      pairBuffer;

  // Allow sorting keys so that the output file is deterministic
  if (state.sortKeys === true) {
    // Default sorting
    objectKeyList.sort();
  } else if (typeof state.sortKeys === 'function') {
    // Custom sort function
    objectKeyList.sort(state.sortKeys);
  } else if (state.sortKeys) {
    // Something is wrong
    throw new YAMLException('sortKeys must be a boolean or a function');
  }

  for (index = 0, length = objectKeyList.length; index < length; index += 1) {
    pairBuffer = '';

    if (!compact || _result !== '') {
      pairBuffer += generateNextLine(state, level);
    }

    objectKey = objectKeyList[index];
    objectValue = object[objectKey];

    if (state.replacer) {
      objectValue = state.replacer.call(object, objectKey, objectValue);
    }

    if (!writeNode(state, level + 1, objectKey, true, true, true)) {
      continue; // Skip this pair because of invalid key.
    }

    explicitPair = (state.tag !== null && state.tag !== '?') ||
                   (state.dump && state.dump.length > 1024);

    if (explicitPair) {
      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        pairBuffer += '?';
      } else {
        pairBuffer += '? ';
      }
    }

    pairBuffer += state.dump;

    if (explicitPair) {
      pairBuffer += generateNextLine(state, level);
    }

    if (!writeNode(state, level + 1, objectValue, true, explicitPair)) {
      continue; // Skip this pair because of invalid value.
    }

    if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
      pairBuffer += ':';
    } else {
      pairBuffer += ': ';
    }

    pairBuffer += state.dump;

    // Both key and value are valid.
    _result += pairBuffer;
  }

  state.tag = _tag;
  state.dump = _result || '{}'; // Empty mapping if no valid pairs.
}

function detectType(state, object, explicit) {
  var _result, typeList, index, length, type, style;

  typeList = explicit ? state.explicitTypes : state.implicitTypes;

  for (index = 0, length = typeList.length; index < length; index += 1) {
    type = typeList[index];

    if ((type.instanceOf  || type.predicate) &&
        (!type.instanceOf || ((typeof object === 'object') && (object instanceof type.instanceOf))) &&
        (!type.predicate  || type.predicate(object))) {

      if (explicit) {
        if (type.multi && type.representName) {
          state.tag = type.representName(object);
        } else {
          state.tag = type.tag;
        }
      } else {
        state.tag = '?';
      }

      if (type.represent) {
        style = state.styleMap[type.tag] || type.defaultStyle;

        if (_toString.call(type.represent) === '[object Function]') {
          _result = type.represent(object, style);
        } else if (_hasOwnProperty.call(type.represent, style)) {
          _result = type.represent[style](object, style);
        } else {
          throw new YAMLException('!<' + type.tag + '> tag resolver accepts not "' + style + '" style');
        }

        state.dump = _result;
      }

      return true;
    }
  }

  return false;
}

// Serializes `object` and writes it to global `result`.
// Returns true on success, or false on invalid object.
//
function writeNode(state, level, object, block, compact, iskey, isblockseq) {
  state.tag = null;
  state.dump = object;

  if (!detectType(state, object, false)) {
    detectType(state, object, true);
  }

  var type = _toString.call(state.dump);
  var inblock = block;
  var tagStr;

  if (block) {
    block = (state.flowLevel < 0 || state.flowLevel > level);
  }

  var objectOrArray = type === '[object Object]' || type === '[object Array]',
      duplicateIndex,
      duplicate;

  if (objectOrArray) {
    duplicateIndex = state.duplicates.indexOf(object);
    duplicate = duplicateIndex !== -1;
  }

  if ((state.tag !== null && state.tag !== '?') || duplicate || (state.indent !== 2 && level > 0)) {
    compact = false;
  }

  if (duplicate && state.usedDuplicates[duplicateIndex]) {
    state.dump = '*ref_' + duplicateIndex;
  } else {
    if (objectOrArray && duplicate && !state.usedDuplicates[duplicateIndex]) {
      state.usedDuplicates[duplicateIndex] = true;
    }
    if (type === '[object Object]') {
      if (block && (Object.keys(state.dump).length !== 0)) {
        writeBlockMapping(state, level, state.dump, compact);
        if (duplicate) {
          state.dump = '&ref_' + duplicateIndex + state.dump;
        }
      } else {
        writeFlowMapping(state, level, state.dump);
        if (duplicate) {
          state.dump = '&ref_' + duplicateIndex + ' ' + state.dump;
        }
      }
    } else if (type === '[object Array]') {
      if (block && (state.dump.length !== 0)) {
        if (state.noArrayIndent && !isblockseq && level > 0) {
          writeBlockSequence(state, level - 1, state.dump, compact);
        } else {
          writeBlockSequence(state, level, state.dump, compact);
        }
        if (duplicate) {
          state.dump = '&ref_' + duplicateIndex + state.dump;
        }
      } else {
        writeFlowSequence(state, level, state.dump);
        if (duplicate) {
          state.dump = '&ref_' + duplicateIndex + ' ' + state.dump;
        }
      }
    } else if (type === '[object String]') {
      if (state.tag !== '?') {
        writeScalar(state, state.dump, level, iskey, inblock);
      }
    } else if (type === '[object Undefined]') {
      return false;
    } else {
      if (state.skipInvalid) return false;
      throw new YAMLException('unacceptable kind of an object to dump ' + type);
    }

    if (state.tag !== null && state.tag !== '?') {
      // Need to encode all characters except those allowed by the spec:
      //
      // [35] ns-dec-digit    ::=  [#x30-#x39] /* 0-9 */
      // [36] ns-hex-digit    ::=  ns-dec-digit
      //                         | [#x41-#x46] /* A-F */ | [#x61-#x66] /* a-f */
      // [37] ns-ascii-letter ::=  [#x41-#x5A] /* A-Z */ | [#x61-#x7A] /* a-z */
      // [38] ns-word-char    ::=  ns-dec-digit | ns-ascii-letter | “-”
      // [39] ns-uri-char     ::=  “%” ns-hex-digit ns-hex-digit | ns-word-char | “#”
      //                         | “;” | “/” | “?” | “:” | “@” | “&” | “=” | “+” | “$” | “,”
      //                         | “_” | “.” | “!” | “~” | “*” | “'” | “(” | “)” | “[” | “]”
      //
      // Also need to encode '!' because it has special meaning (end of tag prefix).
      //
      tagStr = encodeURI(
        state.tag[0] === '!' ? state.tag.slice(1) : state.tag
      ).replace(/!/g, '%21');

      if (state.tag[0] === '!') {
        tagStr = '!' + tagStr;
      } else if (tagStr.slice(0, 18) === 'tag:yaml.org,2002:') {
        tagStr = '!!' + tagStr.slice(18);
      } else {
        tagStr = '!<' + tagStr + '>';
      }

      state.dump = tagStr + ' ' + state.dump;
    }
  }

  return true;
}

function getDuplicateReferences(object, state) {
  var objects = [],
      duplicatesIndexes = [],
      index,
      length;

  inspectNode(object, objects, duplicatesIndexes);

  for (index = 0, length = duplicatesIndexes.length; index < length; index += 1) {
    state.duplicates.push(objects[duplicatesIndexes[index]]);
  }
  state.usedDuplicates = new Array(length);
}

function inspectNode(object, objects, duplicatesIndexes) {
  var objectKeyList,
      index,
      length;

  if (object !== null && typeof object === 'object') {
    index = objects.indexOf(object);
    if (index !== -1) {
      if (duplicatesIndexes.indexOf(index) === -1) {
        duplicatesIndexes.push(index);
      }
    } else {
      objects.push(object);

      if (Array.isArray(object)) {
        for (index = 0, length = object.length; index < length; index += 1) {
          inspectNode(object[index], objects, duplicatesIndexes);
        }
      } else {
        objectKeyList = Object.keys(object);

        for (index = 0, length = objectKeyList.length; index < length; index += 1) {
          inspectNode(object[objectKeyList[index]], objects, duplicatesIndexes);
        }
      }
    }
  }
}

function dump(input, options) {
  options = options || {};

  var state = new State(options);

  if (!state.noRefs) getDuplicateReferences(input, state);

  var value = input;

  if (state.replacer) {
    value = state.replacer.call({ '': value }, '', value);
  }

  if (writeNode(state, 0, value, true, true)) return state.dump + '\n';

  return '';
}

module.exports.dump = dump;

},{"./common":5,"./exception":7,"./schema/default":11}],7:[function(require,module,exports){
// YAML error class. http://stackoverflow.com/questions/8458984
//
'use strict';


function formatError(exception, compact) {
  var where = '', message = exception.reason || '(unknown reason)';

  if (!exception.mark) return message;

  if (exception.mark.name) {
    where += 'in "' + exception.mark.name + '" ';
  }

  where += '(' + (exception.mark.line + 1) + ':' + (exception.mark.column + 1) + ')';

  if (!compact && exception.mark.snippet) {
    where += '\n\n' + exception.mark.snippet;
  }

  return message + ' ' + where;
}


function YAMLException(reason, mark) {
  // Super constructor
  Error.call(this);

  this.name = 'YAMLException';
  this.reason = reason;
  this.mark = mark;
  this.message = formatError(this, false);

  // Include stack trace in error object
  if (Error.captureStackTrace) {
    // Chrome and NodeJS
    Error.captureStackTrace(this, this.constructor);
  } else {
    // FF, IE 10+ and Safari 6+. Fallback for others
    this.stack = (new Error()).stack || '';
  }
}


// Inherit from Error
YAMLException.prototype = Object.create(Error.prototype);
YAMLException.prototype.constructor = YAMLException;


YAMLException.prototype.toString = function toString(compact) {
  return this.name + ': ' + formatError(this, compact);
};


module.exports = YAMLException;

},{}],8:[function(require,module,exports){
'use strict';

/*eslint-disable max-len,no-use-before-define*/

var common              = require('./common');
var YAMLException       = require('./exception');
var makeSnippet         = require('./snippet');
var DEFAULT_SCHEMA      = require('./schema/default');


var _hasOwnProperty = Object.prototype.hasOwnProperty;


var CONTEXT_FLOW_IN   = 1;
var CONTEXT_FLOW_OUT  = 2;
var CONTEXT_BLOCK_IN  = 3;
var CONTEXT_BLOCK_OUT = 4;


var CHOMPING_CLIP  = 1;
var CHOMPING_STRIP = 2;
var CHOMPING_KEEP  = 3;


var PATTERN_NON_PRINTABLE         = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
var PATTERN_NON_ASCII_LINE_BREAKS = /[\x85\u2028\u2029]/;
var PATTERN_FLOW_INDICATORS       = /[,\[\]\{\}]/;
var PATTERN_TAG_HANDLE            = /^(?:!|!!|![a-z\-]+!)$/i;
var PATTERN_TAG_URI               = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;


function _class(obj) { return Object.prototype.toString.call(obj); }

function is_EOL(c) {
  return (c === 0x0A/* LF */) || (c === 0x0D/* CR */);
}

function is_WHITE_SPACE(c) {
  return (c === 0x09/* Tab */) || (c === 0x20/* Space */);
}

function is_WS_OR_EOL(c) {
  return (c === 0x09/* Tab */) ||
         (c === 0x20/* Space */) ||
         (c === 0x0A/* LF */) ||
         (c === 0x0D/* CR */);
}

function is_FLOW_INDICATOR(c) {
  return c === 0x2C/* , */ ||
         c === 0x5B/* [ */ ||
         c === 0x5D/* ] */ ||
         c === 0x7B/* { */ ||
         c === 0x7D/* } */;
}

function fromHexCode(c) {
  var lc;

  if ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */)) {
    return c - 0x30;
  }

  /*eslint-disable no-bitwise*/
  lc = c | 0x20;

  if ((0x61/* a */ <= lc) && (lc <= 0x66/* f */)) {
    return lc - 0x61 + 10;
  }

  return -1;
}

function escapedHexLen(c) {
  if (c === 0x78/* x */) { return 2; }
  if (c === 0x75/* u */) { return 4; }
  if (c === 0x55/* U */) { return 8; }
  return 0;
}

function fromDecimalCode(c) {
  if ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */)) {
    return c - 0x30;
  }

  return -1;
}

function simpleEscapeSequence(c) {
  /* eslint-disable indent */
  return (c === 0x30/* 0 */) ? '\x00' :
        (c === 0x61/* a */) ? '\x07' :
        (c === 0x62/* b */) ? '\x08' :
        (c === 0x74/* t */) ? '\x09' :
        (c === 0x09/* Tab */) ? '\x09' :
        (c === 0x6E/* n */) ? '\x0A' :
        (c === 0x76/* v */) ? '\x0B' :
        (c === 0x66/* f */) ? '\x0C' :
        (c === 0x72/* r */) ? '\x0D' :
        (c === 0x65/* e */) ? '\x1B' :
        (c === 0x20/* Space */) ? ' ' :
        (c === 0x22/* " */) ? '\x22' :
        (c === 0x2F/* / */) ? '/' :
        (c === 0x5C/* \ */) ? '\x5C' :
        (c === 0x4E/* N */) ? '\x85' :
        (c === 0x5F/* _ */) ? '\xA0' :
        (c === 0x4C/* L */) ? '\u2028' :
        (c === 0x50/* P */) ? '\u2029' : '';
}

function charFromCodepoint(c) {
  if (c <= 0xFFFF) {
    return String.fromCharCode(c);
  }
  // Encode UTF-16 surrogate pair
  // https://en.wikipedia.org/wiki/UTF-16#Code_points_U.2B010000_to_U.2B10FFFF
  return String.fromCharCode(
    ((c - 0x010000) >> 10) + 0xD800,
    ((c - 0x010000) & 0x03FF) + 0xDC00
  );
}

var simpleEscapeCheck = new Array(256); // integer, for fast access
var simpleEscapeMap = new Array(256);
for (var i = 0; i < 256; i++) {
  simpleEscapeCheck[i] = simpleEscapeSequence(i) ? 1 : 0;
  simpleEscapeMap[i] = simpleEscapeSequence(i);
}


function State(input, options) {
  this.input = input;

  this.filename  = options['filename']  || null;
  this.schema    = options['schema']    || DEFAULT_SCHEMA;
  this.onWarning = options['onWarning'] || null;
  // (Hidden) Remove? makes the loader to expect YAML 1.1 documents
  // if such documents have no explicit %YAML directive
  this.legacy    = options['legacy']    || false;

  this.json      = options['json']      || false;
  this.listener  = options['listener']  || null;

  this.implicitTypes = this.schema.compiledImplicit;
  this.typeMap       = this.schema.compiledTypeMap;

  this.length     = input.length;
  this.position   = 0;
  this.line       = 0;
  this.lineStart  = 0;
  this.lineIndent = 0;

  // position of first leading tab in the current line,
  // used to make sure there are no tabs in the indentation
  this.firstTabInLine = -1;

  this.documents = [];

  /*
  this.version;
  this.checkLineBreaks;
  this.tagMap;
  this.anchorMap;
  this.tag;
  this.anchor;
  this.kind;
  this.result;*/

}


function generateError(state, message) {
  var mark = {
    name:     state.filename,
    buffer:   state.input.slice(0, -1), // omit trailing \0
    position: state.position,
    line:     state.line,
    column:   state.position - state.lineStart
  };

  mark.snippet = makeSnippet(mark);

  return new YAMLException(message, mark);
}

function throwError(state, message) {
  throw generateError(state, message);
}

function throwWarning(state, message) {
  if (state.onWarning) {
    state.onWarning.call(null, generateError(state, message));
  }
}


var directiveHandlers = {

  YAML: function handleYamlDirective(state, name, args) {

    var match, major, minor;

    if (state.version !== null) {
      throwError(state, 'duplication of %YAML directive');
    }

    if (args.length !== 1) {
      throwError(state, 'YAML directive accepts exactly one argument');
    }

    match = /^([0-9]+)\.([0-9]+)$/.exec(args[0]);

    if (match === null) {
      throwError(state, 'ill-formed argument of the YAML directive');
    }

    major = parseInt(match[1], 10);
    minor = parseInt(match[2], 10);

    if (major !== 1) {
      throwError(state, 'unacceptable YAML version of the document');
    }

    state.version = args[0];
    state.checkLineBreaks = (minor < 2);

    if (minor !== 1 && minor !== 2) {
      throwWarning(state, 'unsupported YAML version of the document');
    }
  },

  TAG: function handleTagDirective(state, name, args) {

    var handle, prefix;

    if (args.length !== 2) {
      throwError(state, 'TAG directive accepts exactly two arguments');
    }

    handle = args[0];
    prefix = args[1];

    if (!PATTERN_TAG_HANDLE.test(handle)) {
      throwError(state, 'ill-formed tag handle (first argument) of the TAG directive');
    }

    if (_hasOwnProperty.call(state.tagMap, handle)) {
      throwError(state, 'there is a previously declared suffix for "' + handle + '" tag handle');
    }

    if (!PATTERN_TAG_URI.test(prefix)) {
      throwError(state, 'ill-formed tag prefix (second argument) of the TAG directive');
    }

    try {
      prefix = decodeURIComponent(prefix);
    } catch (err) {
      throwError(state, 'tag prefix is malformed: ' + prefix);
    }

    state.tagMap[handle] = prefix;
  }
};


function captureSegment(state, start, end, checkJson) {
  var _position, _length, _character, _result;

  if (start < end) {
    _result = state.input.slice(start, end);

    if (checkJson) {
      for (_position = 0, _length = _result.length; _position < _length; _position += 1) {
        _character = _result.charCodeAt(_position);
        if (!(_character === 0x09 ||
              (0x20 <= _character && _character <= 0x10FFFF))) {
          throwError(state, 'expected valid JSON character');
        }
      }
    } else if (PATTERN_NON_PRINTABLE.test(_result)) {
      throwError(state, 'the stream contains non-printable characters');
    }

    state.result += _result;
  }
}

function mergeMappings(state, destination, source, overridableKeys) {
  var sourceKeys, key, index, quantity;

  if (!common.isObject(source)) {
    throwError(state, 'cannot merge mappings; the provided source object is unacceptable');
  }

  sourceKeys = Object.keys(source);

  for (index = 0, quantity = sourceKeys.length; index < quantity; index += 1) {
    key = sourceKeys[index];

    if (!_hasOwnProperty.call(destination, key)) {
      destination[key] = source[key];
      overridableKeys[key] = true;
    }
  }
}

function storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode,
  startLine, startLineStart, startPos) {

  var index, quantity;

  // The output is a plain object here, so keys can only be strings.
  // We need to convert keyNode to a string, but doing so can hang the process
  // (deeply nested arrays that explode exponentially using aliases).
  if (Array.isArray(keyNode)) {
    keyNode = Array.prototype.slice.call(keyNode);

    for (index = 0, quantity = keyNode.length; index < quantity; index += 1) {
      if (Array.isArray(keyNode[index])) {
        throwError(state, 'nested arrays are not supported inside keys');
      }

      if (typeof keyNode === 'object' && _class(keyNode[index]) === '[object Object]') {
        keyNode[index] = '[object Object]';
      }
    }
  }

  // Avoid code execution in load() via toString property
  // (still use its own toString for arrays, timestamps,
  // and whatever user schema extensions happen to have @@toStringTag)
  if (typeof keyNode === 'object' && _class(keyNode) === '[object Object]') {
    keyNode = '[object Object]';
  }


  keyNode = String(keyNode);

  if (_result === null) {
    _result = {};
  }

  if (keyTag === 'tag:yaml.org,2002:merge') {
    if (Array.isArray(valueNode)) {
      for (index = 0, quantity = valueNode.length; index < quantity; index += 1) {
        mergeMappings(state, _result, valueNode[index], overridableKeys);
      }
    } else {
      mergeMappings(state, _result, valueNode, overridableKeys);
    }
  } else {
    if (!state.json &&
        !_hasOwnProperty.call(overridableKeys, keyNode) &&
        _hasOwnProperty.call(_result, keyNode)) {
      state.line = startLine || state.line;
      state.lineStart = startLineStart || state.lineStart;
      state.position = startPos || state.position;
      throwError(state, 'duplicated mapping key');
    }

    // used for this specific key only because Object.defineProperty is slow
    if (keyNode === '__proto__') {
      Object.defineProperty(_result, keyNode, {
        configurable: true,
        enumerable: true,
        writable: true,
        value: valueNode
      });
    } else {
      _result[keyNode] = valueNode;
    }
    delete overridableKeys[keyNode];
  }

  return _result;
}

function readLineBreak(state) {
  var ch;

  ch = state.input.charCodeAt(state.position);

  if (ch === 0x0A/* LF */) {
    state.position++;
  } else if (ch === 0x0D/* CR */) {
    state.position++;
    if (state.input.charCodeAt(state.position) === 0x0A/* LF */) {
      state.position++;
    }
  } else {
    throwError(state, 'a line break is expected');
  }

  state.line += 1;
  state.lineStart = state.position;
  state.firstTabInLine = -1;
}

function skipSeparationSpace(state, allowComments, checkIndent) {
  var lineBreaks = 0,
      ch = state.input.charCodeAt(state.position);

  while (ch !== 0) {
    while (is_WHITE_SPACE(ch)) {
      if (ch === 0x09/* Tab */ && state.firstTabInLine === -1) {
        state.firstTabInLine = state.position;
      }
      ch = state.input.charCodeAt(++state.position);
    }

    if (allowComments && ch === 0x23/* # */) {
      do {
        ch = state.input.charCodeAt(++state.position);
      } while (ch !== 0x0A/* LF */ && ch !== 0x0D/* CR */ && ch !== 0);
    }

    if (is_EOL(ch)) {
      readLineBreak(state);

      ch = state.input.charCodeAt(state.position);
      lineBreaks++;
      state.lineIndent = 0;

      while (ch === 0x20/* Space */) {
        state.lineIndent++;
        ch = state.input.charCodeAt(++state.position);
      }
    } else {
      break;
    }
  }

  if (checkIndent !== -1 && lineBreaks !== 0 && state.lineIndent < checkIndent) {
    throwWarning(state, 'deficient indentation');
  }

  return lineBreaks;
}

function testDocumentSeparator(state) {
  var _position = state.position,
      ch;

  ch = state.input.charCodeAt(_position);

  // Condition state.position === state.lineStart is tested
  // in parent on each call, for efficiency. No needs to test here again.
  if ((ch === 0x2D/* - */ || ch === 0x2E/* . */) &&
      ch === state.input.charCodeAt(_position + 1) &&
      ch === state.input.charCodeAt(_position + 2)) {

    _position += 3;

    ch = state.input.charCodeAt(_position);

    if (ch === 0 || is_WS_OR_EOL(ch)) {
      return true;
    }
  }

  return false;
}

function writeFoldedLines(state, count) {
  if (count === 1) {
    state.result += ' ';
  } else if (count > 1) {
    state.result += common.repeat('\n', count - 1);
  }
}


function readPlainScalar(state, nodeIndent, withinFlowCollection) {
  var preceding,
      following,
      captureStart,
      captureEnd,
      hasPendingContent,
      _line,
      _lineStart,
      _lineIndent,
      _kind = state.kind,
      _result = state.result,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (is_WS_OR_EOL(ch)      ||
      is_FLOW_INDICATOR(ch) ||
      ch === 0x23/* # */    ||
      ch === 0x26/* & */    ||
      ch === 0x2A/* * */    ||
      ch === 0x21/* ! */    ||
      ch === 0x7C/* | */    ||
      ch === 0x3E/* > */    ||
      ch === 0x27/* ' */    ||
      ch === 0x22/* " */    ||
      ch === 0x25/* % */    ||
      ch === 0x40/* @ */    ||
      ch === 0x60/* ` */) {
    return false;
  }

  if (ch === 0x3F/* ? */ || ch === 0x2D/* - */) {
    following = state.input.charCodeAt(state.position + 1);

    if (is_WS_OR_EOL(following) ||
        withinFlowCollection && is_FLOW_INDICATOR(following)) {
      return false;
    }
  }

  state.kind = 'scalar';
  state.result = '';
  captureStart = captureEnd = state.position;
  hasPendingContent = false;

  while (ch !== 0) {
    if (ch === 0x3A/* : */) {
      following = state.input.charCodeAt(state.position + 1);

      if (is_WS_OR_EOL(following) ||
          withinFlowCollection && is_FLOW_INDICATOR(following)) {
        break;
      }

    } else if (ch === 0x23/* # */) {
      preceding = state.input.charCodeAt(state.position - 1);

      if (is_WS_OR_EOL(preceding)) {
        break;
      }

    } else if ((state.position === state.lineStart && testDocumentSeparator(state)) ||
               withinFlowCollection && is_FLOW_INDICATOR(ch)) {
      break;

    } else if (is_EOL(ch)) {
      _line = state.line;
      _lineStart = state.lineStart;
      _lineIndent = state.lineIndent;
      skipSeparationSpace(state, false, -1);

      if (state.lineIndent >= nodeIndent) {
        hasPendingContent = true;
        ch = state.input.charCodeAt(state.position);
        continue;
      } else {
        state.position = captureEnd;
        state.line = _line;
        state.lineStart = _lineStart;
        state.lineIndent = _lineIndent;
        break;
      }
    }

    if (hasPendingContent) {
      captureSegment(state, captureStart, captureEnd, false);
      writeFoldedLines(state, state.line - _line);
      captureStart = captureEnd = state.position;
      hasPendingContent = false;
    }

    if (!is_WHITE_SPACE(ch)) {
      captureEnd = state.position + 1;
    }

    ch = state.input.charCodeAt(++state.position);
  }

  captureSegment(state, captureStart, captureEnd, false);

  if (state.result) {
    return true;
  }

  state.kind = _kind;
  state.result = _result;
  return false;
}

function readSingleQuotedScalar(state, nodeIndent) {
  var ch,
      captureStart, captureEnd;

  ch = state.input.charCodeAt(state.position);

  if (ch !== 0x27/* ' */) {
    return false;
  }

  state.kind = 'scalar';
  state.result = '';
  state.position++;
  captureStart = captureEnd = state.position;

  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    if (ch === 0x27/* ' */) {
      captureSegment(state, captureStart, state.position, true);
      ch = state.input.charCodeAt(++state.position);

      if (ch === 0x27/* ' */) {
        captureStart = state.position;
        state.position++;
        captureEnd = state.position;
      } else {
        return true;
      }

    } else if (is_EOL(ch)) {
      captureSegment(state, captureStart, captureEnd, true);
      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
      captureStart = captureEnd = state.position;

    } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
      throwError(state, 'unexpected end of the document within a single quoted scalar');

    } else {
      state.position++;
      captureEnd = state.position;
    }
  }

  throwError(state, 'unexpected end of the stream within a single quoted scalar');
}

function readDoubleQuotedScalar(state, nodeIndent) {
  var captureStart,
      captureEnd,
      hexLength,
      hexResult,
      tmp,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch !== 0x22/* " */) {
    return false;
  }

  state.kind = 'scalar';
  state.result = '';
  state.position++;
  captureStart = captureEnd = state.position;

  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    if (ch === 0x22/* " */) {
      captureSegment(state, captureStart, state.position, true);
      state.position++;
      return true;

    } else if (ch === 0x5C/* \ */) {
      captureSegment(state, captureStart, state.position, true);
      ch = state.input.charCodeAt(++state.position);

      if (is_EOL(ch)) {
        skipSeparationSpace(state, false, nodeIndent);

        // TODO: rework to inline fn with no type cast?
      } else if (ch < 256 && simpleEscapeCheck[ch]) {
        state.result += simpleEscapeMap[ch];
        state.position++;

      } else if ((tmp = escapedHexLen(ch)) > 0) {
        hexLength = tmp;
        hexResult = 0;

        for (; hexLength > 0; hexLength--) {
          ch = state.input.charCodeAt(++state.position);

          if ((tmp = fromHexCode(ch)) >= 0) {
            hexResult = (hexResult << 4) + tmp;

          } else {
            throwError(state, 'expected hexadecimal character');
          }
        }

        state.result += charFromCodepoint(hexResult);

        state.position++;

      } else {
        throwError(state, 'unknown escape sequence');
      }

      captureStart = captureEnd = state.position;

    } else if (is_EOL(ch)) {
      captureSegment(state, captureStart, captureEnd, true);
      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
      captureStart = captureEnd = state.position;

    } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
      throwError(state, 'unexpected end of the document within a double quoted scalar');

    } else {
      state.position++;
      captureEnd = state.position;
    }
  }

  throwError(state, 'unexpected end of the stream within a double quoted scalar');
}

function readFlowCollection(state, nodeIndent) {
  var readNext = true,
      _line,
      _lineStart,
      _pos,
      _tag     = state.tag,
      _result,
      _anchor  = state.anchor,
      following,
      terminator,
      isPair,
      isExplicitPair,
      isMapping,
      overridableKeys = Object.create(null),
      keyNode,
      keyTag,
      valueNode,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch === 0x5B/* [ */) {
    terminator = 0x5D;/* ] */
    isMapping = false;
    _result = [];
  } else if (ch === 0x7B/* { */) {
    terminator = 0x7D;/* } */
    isMapping = true;
    _result = {};
  } else {
    return false;
  }

  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }

  ch = state.input.charCodeAt(++state.position);

  while (ch !== 0) {
    skipSeparationSpace(state, true, nodeIndent);

    ch = state.input.charCodeAt(state.position);

    if (ch === terminator) {
      state.position++;
      state.tag = _tag;
      state.anchor = _anchor;
      state.kind = isMapping ? 'mapping' : 'sequence';
      state.result = _result;
      return true;
    } else if (!readNext) {
      throwError(state, 'missed comma between flow collection entries');
    } else if (ch === 0x2C/* , */) {
      // "flow collection entries can never be completely empty", as per YAML 1.2, section 7.4
      throwError(state, "expected the node content, but found ','");
    }

    keyTag = keyNode = valueNode = null;
    isPair = isExplicitPair = false;

    if (ch === 0x3F/* ? */) {
      following = state.input.charCodeAt(state.position + 1);

      if (is_WS_OR_EOL(following)) {
        isPair = isExplicitPair = true;
        state.position++;
        skipSeparationSpace(state, true, nodeIndent);
      }
    }

    _line = state.line; // Save the current line.
    _lineStart = state.lineStart;
    _pos = state.position;
    composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
    keyTag = state.tag;
    keyNode = state.result;
    skipSeparationSpace(state, true, nodeIndent);

    ch = state.input.charCodeAt(state.position);

    if ((isExplicitPair || state.line === _line) && ch === 0x3A/* : */) {
      isPair = true;
      ch = state.input.charCodeAt(++state.position);
      skipSeparationSpace(state, true, nodeIndent);
      composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
      valueNode = state.result;
    }

    if (isMapping) {
      storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos);
    } else if (isPair) {
      _result.push(storeMappingPair(state, null, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos));
    } else {
      _result.push(keyNode);
    }

    skipSeparationSpace(state, true, nodeIndent);

    ch = state.input.charCodeAt(state.position);

    if (ch === 0x2C/* , */) {
      readNext = true;
      ch = state.input.charCodeAt(++state.position);
    } else {
      readNext = false;
    }
  }

  throwError(state, 'unexpected end of the stream within a flow collection');
}

function readBlockScalar(state, nodeIndent) {
  var captureStart,
      folding,
      chomping       = CHOMPING_CLIP,
      didReadContent = false,
      detectedIndent = false,
      textIndent     = nodeIndent,
      emptyLines     = 0,
      atMoreIndented = false,
      tmp,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch === 0x7C/* | */) {
    folding = false;
  } else if (ch === 0x3E/* > */) {
    folding = true;
  } else {
    return false;
  }

  state.kind = 'scalar';
  state.result = '';

  while (ch !== 0) {
    ch = state.input.charCodeAt(++state.position);

    if (ch === 0x2B/* + */ || ch === 0x2D/* - */) {
      if (CHOMPING_CLIP === chomping) {
        chomping = (ch === 0x2B/* + */) ? CHOMPING_KEEP : CHOMPING_STRIP;
      } else {
        throwError(state, 'repeat of a chomping mode identifier');
      }

    } else if ((tmp = fromDecimalCode(ch)) >= 0) {
      if (tmp === 0) {
        throwError(state, 'bad explicit indentation width of a block scalar; it cannot be less than one');
      } else if (!detectedIndent) {
        textIndent = nodeIndent + tmp - 1;
        detectedIndent = true;
      } else {
        throwError(state, 'repeat of an indentation width identifier');
      }

    } else {
      break;
    }
  }

  if (is_WHITE_SPACE(ch)) {
    do { ch = state.input.charCodeAt(++state.position); }
    while (is_WHITE_SPACE(ch));

    if (ch === 0x23/* # */) {
      do { ch = state.input.charCodeAt(++state.position); }
      while (!is_EOL(ch) && (ch !== 0));
    }
  }

  while (ch !== 0) {
    readLineBreak(state);
    state.lineIndent = 0;

    ch = state.input.charCodeAt(state.position);

    while ((!detectedIndent || state.lineIndent < textIndent) &&
           (ch === 0x20/* Space */)) {
      state.lineIndent++;
      ch = state.input.charCodeAt(++state.position);
    }

    if (!detectedIndent && state.lineIndent > textIndent) {
      textIndent = state.lineIndent;
    }

    if (is_EOL(ch)) {
      emptyLines++;
      continue;
    }

    // End of the scalar.
    if (state.lineIndent < textIndent) {

      // Perform the chomping.
      if (chomping === CHOMPING_KEEP) {
        state.result += common.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);
      } else if (chomping === CHOMPING_CLIP) {
        if (didReadContent) { // i.e. only if the scalar is not empty.
          state.result += '\n';
        }
      }

      // Break this `while` cycle and go to the funciton's epilogue.
      break;
    }

    // Folded style: use fancy rules to handle line breaks.
    if (folding) {

      // Lines starting with white space characters (more-indented lines) are not folded.
      if (is_WHITE_SPACE(ch)) {
        atMoreIndented = true;
        // except for the first content line (cf. Example 8.1)
        state.result += common.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);

      // End of more-indented block.
      } else if (atMoreIndented) {
        atMoreIndented = false;
        state.result += common.repeat('\n', emptyLines + 1);

      // Just one line break - perceive as the same line.
      } else if (emptyLines === 0) {
        if (didReadContent) { // i.e. only if we have already read some scalar content.
          state.result += ' ';
        }

      // Several line breaks - perceive as different lines.
      } else {
        state.result += common.repeat('\n', emptyLines);
      }

    // Literal style: just add exact number of line breaks between content lines.
    } else {
      // Keep all line breaks except the header line break.
      state.result += common.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);
    }

    didReadContent = true;
    detectedIndent = true;
    emptyLines = 0;
    captureStart = state.position;

    while (!is_EOL(ch) && (ch !== 0)) {
      ch = state.input.charCodeAt(++state.position);
    }

    captureSegment(state, captureStart, state.position, false);
  }

  return true;
}

function readBlockSequence(state, nodeIndent) {
  var _line,
      _tag      = state.tag,
      _anchor   = state.anchor,
      _result   = [],
      following,
      detected  = false,
      ch;

  // there is a leading tab before this token, so it can't be a block sequence/mapping;
  // it can still be flow sequence/mapping or a scalar
  if (state.firstTabInLine !== -1) return false;

  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }

  ch = state.input.charCodeAt(state.position);

  while (ch !== 0) {
    if (state.firstTabInLine !== -1) {
      state.position = state.firstTabInLine;
      throwError(state, 'tab characters must not be used in indentation');
    }

    if (ch !== 0x2D/* - */) {
      break;
    }

    following = state.input.charCodeAt(state.position + 1);

    if (!is_WS_OR_EOL(following)) {
      break;
    }

    detected = true;
    state.position++;

    if (skipSeparationSpace(state, true, -1)) {
      if (state.lineIndent <= nodeIndent) {
        _result.push(null);
        ch = state.input.charCodeAt(state.position);
        continue;
      }
    }

    _line = state.line;
    composeNode(state, nodeIndent, CONTEXT_BLOCK_IN, false, true);
    _result.push(state.result);
    skipSeparationSpace(state, true, -1);

    ch = state.input.charCodeAt(state.position);

    if ((state.line === _line || state.lineIndent > nodeIndent) && (ch !== 0)) {
      throwError(state, 'bad indentation of a sequence entry');
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }

  if (detected) {
    state.tag = _tag;
    state.anchor = _anchor;
    state.kind = 'sequence';
    state.result = _result;
    return true;
  }
  return false;
}

function readBlockMapping(state, nodeIndent, flowIndent) {
  var following,
      allowCompact,
      _line,
      _keyLine,
      _keyLineStart,
      _keyPos,
      _tag          = state.tag,
      _anchor       = state.anchor,
      _result       = {},
      overridableKeys = Object.create(null),
      keyTag        = null,
      keyNode       = null,
      valueNode     = null,
      atExplicitKey = false,
      detected      = false,
      ch;

  // there is a leading tab before this token, so it can't be a block sequence/mapping;
  // it can still be flow sequence/mapping or a scalar
  if (state.firstTabInLine !== -1) return false;

  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }

  ch = state.input.charCodeAt(state.position);

  while (ch !== 0) {
    if (!atExplicitKey && state.firstTabInLine !== -1) {
      state.position = state.firstTabInLine;
      throwError(state, 'tab characters must not be used in indentation');
    }

    following = state.input.charCodeAt(state.position + 1);
    _line = state.line; // Save the current line.

    //
    // Explicit notation case. There are two separate blocks:
    // first for the key (denoted by "?") and second for the value (denoted by ":")
    //
    if ((ch === 0x3F/* ? */ || ch === 0x3A/* : */) && is_WS_OR_EOL(following)) {

      if (ch === 0x3F/* ? */) {
        if (atExplicitKey) {
          storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
          keyTag = keyNode = valueNode = null;
        }

        detected = true;
        atExplicitKey = true;
        allowCompact = true;

      } else if (atExplicitKey) {
        // i.e. 0x3A/* : */ === character after the explicit key.
        atExplicitKey = false;
        allowCompact = true;

      } else {
        throwError(state, 'incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line');
      }

      state.position += 1;
      ch = following;

    //
    // Implicit notation case. Flow-style node as the key first, then ":", and the value.
    //
    } else {
      _keyLine = state.line;
      _keyLineStart = state.lineStart;
      _keyPos = state.position;

      if (!composeNode(state, flowIndent, CONTEXT_FLOW_OUT, false, true)) {
        // Neither implicit nor explicit notation.
        // Reading is done. Go to the epilogue.
        break;
      }

      if (state.line === _line) {
        ch = state.input.charCodeAt(state.position);

        while (is_WHITE_SPACE(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }

        if (ch === 0x3A/* : */) {
          ch = state.input.charCodeAt(++state.position);

          if (!is_WS_OR_EOL(ch)) {
            throwError(state, 'a whitespace character is expected after the key-value separator within a block mapping');
          }

          if (atExplicitKey) {
            storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
            keyTag = keyNode = valueNode = null;
          }

          detected = true;
          atExplicitKey = false;
          allowCompact = false;
          keyTag = state.tag;
          keyNode = state.result;

        } else if (detected) {
          throwError(state, 'can not read an implicit mapping pair; a colon is missed');

        } else {
          state.tag = _tag;
          state.anchor = _anchor;
          return true; // Keep the result of `composeNode`.
        }

      } else if (detected) {
        throwError(state, 'can not read a block mapping entry; a multiline key may not be an implicit key');

      } else {
        state.tag = _tag;
        state.anchor = _anchor;
        return true; // Keep the result of `composeNode`.
      }
    }

    //
    // Common reading code for both explicit and implicit notations.
    //
    if (state.line === _line || state.lineIndent > nodeIndent) {
      if (atExplicitKey) {
        _keyLine = state.line;
        _keyLineStart = state.lineStart;
        _keyPos = state.position;
      }

      if (composeNode(state, nodeIndent, CONTEXT_BLOCK_OUT, true, allowCompact)) {
        if (atExplicitKey) {
          keyNode = state.result;
        } else {
          valueNode = state.result;
        }
      }

      if (!atExplicitKey) {
        storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _keyLine, _keyLineStart, _keyPos);
        keyTag = keyNode = valueNode = null;
      }

      skipSeparationSpace(state, true, -1);
      ch = state.input.charCodeAt(state.position);
    }

    if ((state.line === _line || state.lineIndent > nodeIndent) && (ch !== 0)) {
      throwError(state, 'bad indentation of a mapping entry');
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }

  //
  // Epilogue.
  //

  // Special case: last mapping's node contains only the key in explicit notation.
  if (atExplicitKey) {
    storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
  }

  // Expose the resulting mapping.
  if (detected) {
    state.tag = _tag;
    state.anchor = _anchor;
    state.kind = 'mapping';
    state.result = _result;
  }

  return detected;
}

function readTagProperty(state) {
  var _position,
      isVerbatim = false,
      isNamed    = false,
      tagHandle,
      tagName,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch !== 0x21/* ! */) return false;

  if (state.tag !== null) {
    throwError(state, 'duplication of a tag property');
  }

  ch = state.input.charCodeAt(++state.position);

  if (ch === 0x3C/* < */) {
    isVerbatim = true;
    ch = state.input.charCodeAt(++state.position);

  } else if (ch === 0x21/* ! */) {
    isNamed = true;
    tagHandle = '!!';
    ch = state.input.charCodeAt(++state.position);

  } else {
    tagHandle = '!';
  }

  _position = state.position;

  if (isVerbatim) {
    do { ch = state.input.charCodeAt(++state.position); }
    while (ch !== 0 && ch !== 0x3E/* > */);

    if (state.position < state.length) {
      tagName = state.input.slice(_position, state.position);
      ch = state.input.charCodeAt(++state.position);
    } else {
      throwError(state, 'unexpected end of the stream within a verbatim tag');
    }
  } else {
    while (ch !== 0 && !is_WS_OR_EOL(ch)) {

      if (ch === 0x21/* ! */) {
        if (!isNamed) {
          tagHandle = state.input.slice(_position - 1, state.position + 1);

          if (!PATTERN_TAG_HANDLE.test(tagHandle)) {
            throwError(state, 'named tag handle cannot contain such characters');
          }

          isNamed = true;
          _position = state.position + 1;
        } else {
          throwError(state, 'tag suffix cannot contain exclamation marks');
        }
      }

      ch = state.input.charCodeAt(++state.position);
    }

    tagName = state.input.slice(_position, state.position);

    if (PATTERN_FLOW_INDICATORS.test(tagName)) {
      throwError(state, 'tag suffix cannot contain flow indicator characters');
    }
  }

  if (tagName && !PATTERN_TAG_URI.test(tagName)) {
    throwError(state, 'tag name cannot contain such characters: ' + tagName);
  }

  try {
    tagName = decodeURIComponent(tagName);
  } catch (err) {
    throwError(state, 'tag name is malformed: ' + tagName);
  }

  if (isVerbatim) {
    state.tag = tagName;

  } else if (_hasOwnProperty.call(state.tagMap, tagHandle)) {
    state.tag = state.tagMap[tagHandle] + tagName;

  } else if (tagHandle === '!') {
    state.tag = '!' + tagName;

  } else if (tagHandle === '!!') {
    state.tag = 'tag:yaml.org,2002:' + tagName;

  } else {
    throwError(state, 'undeclared tag handle "' + tagHandle + '"');
  }

  return true;
}

function readAnchorProperty(state) {
  var _position,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch !== 0x26/* & */) return false;

  if (state.anchor !== null) {
    throwError(state, 'duplication of an anchor property');
  }

  ch = state.input.charCodeAt(++state.position);
  _position = state.position;

  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }

  if (state.position === _position) {
    throwError(state, 'name of an anchor node must contain at least one character');
  }

  state.anchor = state.input.slice(_position, state.position);
  return true;
}

function readAlias(state) {
  var _position, alias,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch !== 0x2A/* * */) return false;

  ch = state.input.charCodeAt(++state.position);
  _position = state.position;

  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }

  if (state.position === _position) {
    throwError(state, 'name of an alias node must contain at least one character');
  }

  alias = state.input.slice(_position, state.position);

  if (!_hasOwnProperty.call(state.anchorMap, alias)) {
    throwError(state, 'unidentified alias "' + alias + '"');
  }

  state.result = state.anchorMap[alias];
  skipSeparationSpace(state, true, -1);
  return true;
}

function composeNode(state, parentIndent, nodeContext, allowToSeek, allowCompact) {
  var allowBlockStyles,
      allowBlockScalars,
      allowBlockCollections,
      indentStatus = 1, // 1: this>parent, 0: this=parent, -1: this<parent
      atNewLine  = false,
      hasContent = false,
      typeIndex,
      typeQuantity,
      typeList,
      type,
      flowIndent,
      blockIndent;

  if (state.listener !== null) {
    state.listener('open', state);
  }

  state.tag    = null;
  state.anchor = null;
  state.kind   = null;
  state.result = null;

  allowBlockStyles = allowBlockScalars = allowBlockCollections =
    CONTEXT_BLOCK_OUT === nodeContext ||
    CONTEXT_BLOCK_IN  === nodeContext;

  if (allowToSeek) {
    if (skipSeparationSpace(state, true, -1)) {
      atNewLine = true;

      if (state.lineIndent > parentIndent) {
        indentStatus = 1;
      } else if (state.lineIndent === parentIndent) {
        indentStatus = 0;
      } else if (state.lineIndent < parentIndent) {
        indentStatus = -1;
      }
    }
  }

  if (indentStatus === 1) {
    while (readTagProperty(state) || readAnchorProperty(state)) {
      if (skipSeparationSpace(state, true, -1)) {
        atNewLine = true;
        allowBlockCollections = allowBlockStyles;

        if (state.lineIndent > parentIndent) {
          indentStatus = 1;
        } else if (state.lineIndent === parentIndent) {
          indentStatus = 0;
        } else if (state.lineIndent < parentIndent) {
          indentStatus = -1;
        }
      } else {
        allowBlockCollections = false;
      }
    }
  }

  if (allowBlockCollections) {
    allowBlockCollections = atNewLine || allowCompact;
  }

  if (indentStatus === 1 || CONTEXT_BLOCK_OUT === nodeContext) {
    if (CONTEXT_FLOW_IN === nodeContext || CONTEXT_FLOW_OUT === nodeContext) {
      flowIndent = parentIndent;
    } else {
      flowIndent = parentIndent + 1;
    }

    blockIndent = state.position - state.lineStart;

    if (indentStatus === 1) {
      if (allowBlockCollections &&
          (readBlockSequence(state, blockIndent) ||
           readBlockMapping(state, blockIndent, flowIndent)) ||
          readFlowCollection(state, flowIndent)) {
        hasContent = true;
      } else {
        if ((allowBlockScalars && readBlockScalar(state, flowIndent)) ||
            readSingleQuotedScalar(state, flowIndent) ||
            readDoubleQuotedScalar(state, flowIndent)) {
          hasContent = true;

        } else if (readAlias(state)) {
          hasContent = true;

          if (state.tag !== null || state.anchor !== null) {
            throwError(state, 'alias node should not have any properties');
          }

        } else if (readPlainScalar(state, flowIndent, CONTEXT_FLOW_IN === nodeContext)) {
          hasContent = true;

          if (state.tag === null) {
            state.tag = '?';
          }
        }

        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = state.result;
        }
      }
    } else if (indentStatus === 0) {
      // Special case: block sequences are allowed to have same indentation level as the parent.
      // http://www.yaml.org/spec/1.2/spec.html#id2799784
      hasContent = allowBlockCollections && readBlockSequence(state, blockIndent);
    }
  }

  if (state.tag === null) {
    if (state.anchor !== null) {
      state.anchorMap[state.anchor] = state.result;
    }

  } else if (state.tag === '?') {
    // Implicit resolving is not allowed for non-scalar types, and '?'
    // non-specific tag is only automatically assigned to plain scalars.
    //
    // We only need to check kind conformity in case user explicitly assigns '?'
    // tag, for example like this: "!<?> [0]"
    //
    if (state.result !== null && state.kind !== 'scalar') {
      throwError(state, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + state.kind + '"');
    }

    for (typeIndex = 0, typeQuantity = state.implicitTypes.length; typeIndex < typeQuantity; typeIndex += 1) {
      type = state.implicitTypes[typeIndex];

      if (type.resolve(state.result)) { // `state.result` updated in resolver if matched
        state.result = type.construct(state.result);
        state.tag = type.tag;
        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = state.result;
        }
        break;
      }
    }
  } else if (state.tag !== '!') {
    if (_hasOwnProperty.call(state.typeMap[state.kind || 'fallback'], state.tag)) {
      type = state.typeMap[state.kind || 'fallback'][state.tag];
    } else {
      // looking for multi type
      type = null;
      typeList = state.typeMap.multi[state.kind || 'fallback'];

      for (typeIndex = 0, typeQuantity = typeList.length; typeIndex < typeQuantity; typeIndex += 1) {
        if (state.tag.slice(0, typeList[typeIndex].tag.length) === typeList[typeIndex].tag) {
          type = typeList[typeIndex];
          break;
        }
      }
    }

    if (!type) {
      throwError(state, 'unknown tag !<' + state.tag + '>');
    }

    if (state.result !== null && type.kind !== state.kind) {
      throwError(state, 'unacceptable node kind for !<' + state.tag + '> tag; it should be "' + type.kind + '", not "' + state.kind + '"');
    }

    if (!type.resolve(state.result, state.tag)) { // `state.result` updated in resolver if matched
      throwError(state, 'cannot resolve a node with !<' + state.tag + '> explicit tag');
    } else {
      state.result = type.construct(state.result, state.tag);
      if (state.anchor !== null) {
        state.anchorMap[state.anchor] = state.result;
      }
    }
  }

  if (state.listener !== null) {
    state.listener('close', state);
  }
  return state.tag !== null ||  state.anchor !== null || hasContent;
}

function readDocument(state) {
  var documentStart = state.position,
      _position,
      directiveName,
      directiveArgs,
      hasDirectives = false,
      ch;

  state.version = null;
  state.checkLineBreaks = state.legacy;
  state.tagMap = Object.create(null);
  state.anchorMap = Object.create(null);

  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    skipSeparationSpace(state, true, -1);

    ch = state.input.charCodeAt(state.position);

    if (state.lineIndent > 0 || ch !== 0x25/* % */) {
      break;
    }

    hasDirectives = true;
    ch = state.input.charCodeAt(++state.position);
    _position = state.position;

    while (ch !== 0 && !is_WS_OR_EOL(ch)) {
      ch = state.input.charCodeAt(++state.position);
    }

    directiveName = state.input.slice(_position, state.position);
    directiveArgs = [];

    if (directiveName.length < 1) {
      throwError(state, 'directive name must not be less than one character in length');
    }

    while (ch !== 0) {
      while (is_WHITE_SPACE(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }

      if (ch === 0x23/* # */) {
        do { ch = state.input.charCodeAt(++state.position); }
        while (ch !== 0 && !is_EOL(ch));
        break;
      }

      if (is_EOL(ch)) break;

      _position = state.position;

      while (ch !== 0 && !is_WS_OR_EOL(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }

      directiveArgs.push(state.input.slice(_position, state.position));
    }

    if (ch !== 0) readLineBreak(state);

    if (_hasOwnProperty.call(directiveHandlers, directiveName)) {
      directiveHandlers[directiveName](state, directiveName, directiveArgs);
    } else {
      throwWarning(state, 'unknown document directive "' + directiveName + '"');
    }
  }

  skipSeparationSpace(state, true, -1);

  if (state.lineIndent === 0 &&
      state.input.charCodeAt(state.position)     === 0x2D/* - */ &&
      state.input.charCodeAt(state.position + 1) === 0x2D/* - */ &&
      state.input.charCodeAt(state.position + 2) === 0x2D/* - */) {
    state.position += 3;
    skipSeparationSpace(state, true, -1);

  } else if (hasDirectives) {
    throwError(state, 'directives end mark is expected');
  }

  composeNode(state, state.lineIndent - 1, CONTEXT_BLOCK_OUT, false, true);
  skipSeparationSpace(state, true, -1);

  if (state.checkLineBreaks &&
      PATTERN_NON_ASCII_LINE_BREAKS.test(state.input.slice(documentStart, state.position))) {
    throwWarning(state, 'non-ASCII line breaks are interpreted as content');
  }

  state.documents.push(state.result);

  if (state.position === state.lineStart && testDocumentSeparator(state)) {

    if (state.input.charCodeAt(state.position) === 0x2E/* . */) {
      state.position += 3;
      skipSeparationSpace(state, true, -1);
    }
    return;
  }

  if (state.position < (state.length - 1)) {
    throwError(state, 'end of the stream or a document separator is expected');
  } else {
    return;
  }
}


function loadDocuments(input, options) {
  input = String(input);
  options = options || {};

  if (input.length !== 0) {

    // Add tailing `\n` if not exists
    if (input.charCodeAt(input.length - 1) !== 0x0A/* LF */ &&
        input.charCodeAt(input.length - 1) !== 0x0D/* CR */) {
      input += '\n';
    }

    // Strip BOM
    if (input.charCodeAt(0) === 0xFEFF) {
      input = input.slice(1);
    }
  }

  var state = new State(input, options);

  var nullpos = input.indexOf('\0');

  if (nullpos !== -1) {
    state.position = nullpos;
    throwError(state, 'null byte is not allowed in input');
  }

  // Use 0 as string terminator. That significantly simplifies bounds check.
  state.input += '\0';

  while (state.input.charCodeAt(state.position) === 0x20/* Space */) {
    state.lineIndent += 1;
    state.position += 1;
  }

  while (state.position < (state.length - 1)) {
    readDocument(state);
  }

  return state.documents;
}


function loadAll(input, iterator, options) {
  if (iterator !== null && typeof iterator === 'object' && typeof options === 'undefined') {
    options = iterator;
    iterator = null;
  }

  var documents = loadDocuments(input, options);

  if (typeof iterator !== 'function') {
    return documents;
  }

  for (var index = 0, length = documents.length; index < length; index += 1) {
    iterator(documents[index]);
  }
}


function load(input, options) {
  var documents = loadDocuments(input, options);

  if (documents.length === 0) {
    /*eslint-disable no-undefined*/
    return undefined;
  } else if (documents.length === 1) {
    return documents[0];
  }
  throw new YAMLException('expected a single document in the stream, but found more');
}


module.exports.loadAll = loadAll;
module.exports.load    = load;

},{"./common":5,"./exception":7,"./schema/default":11,"./snippet":14}],9:[function(require,module,exports){
'use strict';

/*eslint-disable max-len*/

var YAMLException = require('./exception');
var Type          = require('./type');


function compileList(schema, name) {
  var result = [];

  schema[name].forEach(function (currentType) {
    var newIndex = result.length;

    result.forEach(function (previousType, previousIndex) {
      if (previousType.tag === currentType.tag &&
          previousType.kind === currentType.kind &&
          previousType.multi === currentType.multi) {

        newIndex = previousIndex;
      }
    });

    result[newIndex] = currentType;
  });

  return result;
}


function compileMap(/* lists... */) {
  var result = {
        scalar: {},
        sequence: {},
        mapping: {},
        fallback: {},
        multi: {
          scalar: [],
          sequence: [],
          mapping: [],
          fallback: []
        }
      }, index, length;

  function collectType(type) {
    if (type.multi) {
      result.multi[type.kind].push(type);
      result.multi['fallback'].push(type);
    } else {
      result[type.kind][type.tag] = result['fallback'][type.tag] = type;
    }
  }

  for (index = 0, length = arguments.length; index < length; index += 1) {
    arguments[index].forEach(collectType);
  }
  return result;
}


function Schema(definition) {
  return this.extend(definition);
}


Schema.prototype.extend = function extend(definition) {
  var implicit = [];
  var explicit = [];

  if (definition instanceof Type) {
    // Schema.extend(type)
    explicit.push(definition);

  } else if (Array.isArray(definition)) {
    // Schema.extend([ type1, type2, ... ])
    explicit = explicit.concat(definition);

  } else if (definition && (Array.isArray(definition.implicit) || Array.isArray(definition.explicit))) {
    // Schema.extend({ explicit: [ type1, type2, ... ], implicit: [ type1, type2, ... ] })
    if (definition.implicit) implicit = implicit.concat(definition.implicit);
    if (definition.explicit) explicit = explicit.concat(definition.explicit);

  } else {
    throw new YAMLException('Schema.extend argument should be a Type, [ Type ], ' +
      'or a schema definition ({ implicit: [...], explicit: [...] })');
  }

  implicit.forEach(function (type) {
    if (!(type instanceof Type)) {
      throw new YAMLException('Specified list of YAML types (or a single Type object) contains a non-Type object.');
    }

    if (type.loadKind && type.loadKind !== 'scalar') {
      throw new YAMLException('There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.');
    }

    if (type.multi) {
      throw new YAMLException('There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.');
    }
  });

  explicit.forEach(function (type) {
    if (!(type instanceof Type)) {
      throw new YAMLException('Specified list of YAML types (or a single Type object) contains a non-Type object.');
    }
  });

  var result = Object.create(Schema.prototype);

  result.implicit = (this.implicit || []).concat(implicit);
  result.explicit = (this.explicit || []).concat(explicit);

  result.compiledImplicit = compileList(result, 'implicit');
  result.compiledExplicit = compileList(result, 'explicit');
  result.compiledTypeMap  = compileMap(result.compiledImplicit, result.compiledExplicit);

  return result;
};


module.exports = Schema;

},{"./exception":7,"./type":15}],10:[function(require,module,exports){
// Standard YAML's Core schema.
// http://www.yaml.org/spec/1.2/spec.html#id2804923
//
// NOTE: JS-YAML does not support schema-specific tag resolution restrictions.
// So, Core schema has no distinctions from JSON schema is JS-YAML.


'use strict';


module.exports = require('./json');

},{"./json":13}],11:[function(require,module,exports){
// JS-YAML's default schema for `safeLoad` function.
// It is not described in the YAML specification.
//
// This schema is based on standard YAML's Core schema and includes most of
// extra types described at YAML tag repository. (http://yaml.org/type/)


'use strict';


module.exports = require('./core').extend({
  implicit: [
    require('../type/timestamp'),
    require('../type/merge')
  ],
  explicit: [
    require('../type/binary'),
    require('../type/omap'),
    require('../type/pairs'),
    require('../type/set')
  ]
});

},{"../type/binary":16,"../type/merge":21,"../type/omap":23,"../type/pairs":24,"../type/set":26,"../type/timestamp":28,"./core":10}],12:[function(require,module,exports){
// Standard YAML's Failsafe schema.
// http://www.yaml.org/spec/1.2/spec.html#id2802346


'use strict';


var Schema = require('../schema');


module.exports = new Schema({
  explicit: [
    require('../type/str'),
    require('../type/seq'),
    require('../type/map')
  ]
});

},{"../schema":9,"../type/map":20,"../type/seq":25,"../type/str":27}],13:[function(require,module,exports){
// Standard YAML's JSON schema.
// http://www.yaml.org/spec/1.2/spec.html#id2803231
//
// NOTE: JS-YAML does not support schema-specific tag resolution restrictions.
// So, this schema is not such strict as defined in the YAML specification.
// It allows numbers in binary notaion, use `Null` and `NULL` as `null`, etc.


'use strict';


module.exports = require('./failsafe').extend({
  implicit: [
    require('../type/null'),
    require('../type/bool'),
    require('../type/int'),
    require('../type/float')
  ]
});

},{"../type/bool":17,"../type/float":18,"../type/int":19,"../type/null":22,"./failsafe":12}],14:[function(require,module,exports){
'use strict';


var common = require('./common');


// get snippet for a single line, respecting maxLength
function getLine(buffer, lineStart, lineEnd, position, maxLineLength) {
  var head = '';
  var tail = '';
  var maxHalfLength = Math.floor(maxLineLength / 2) - 1;

  if (position - lineStart > maxHalfLength) {
    head = ' ... ';
    lineStart = position - maxHalfLength + head.length;
  }

  if (lineEnd - position > maxHalfLength) {
    tail = ' ...';
    lineEnd = position + maxHalfLength - tail.length;
  }

  return {
    str: head + buffer.slice(lineStart, lineEnd).replace(/\t/g, '→') + tail,
    pos: position - lineStart + head.length // relative position
  };
}


function padStart(string, max) {
  return common.repeat(' ', max - string.length) + string;
}


function makeSnippet(mark, options) {
  options = Object.create(options || null);

  if (!mark.buffer) return null;

  if (!options.maxLength) options.maxLength = 79;
  if (typeof options.indent      !== 'number') options.indent      = 1;
  if (typeof options.linesBefore !== 'number') options.linesBefore = 3;
  if (typeof options.linesAfter  !== 'number') options.linesAfter  = 2;

  var re = /\r?\n|\r|\0/g;
  var lineStarts = [ 0 ];
  var lineEnds = [];
  var match;
  var foundLineNo = -1;

  while ((match = re.exec(mark.buffer))) {
    lineEnds.push(match.index);
    lineStarts.push(match.index + match[0].length);

    if (mark.position <= match.index && foundLineNo < 0) {
      foundLineNo = lineStarts.length - 2;
    }
  }

  if (foundLineNo < 0) foundLineNo = lineStarts.length - 1;

  var result = '', i, line;
  var lineNoLength = Math.min(mark.line + options.linesAfter, lineEnds.length).toString().length;
  var maxLineLength = options.maxLength - (options.indent + lineNoLength + 3);

  for (i = 1; i <= options.linesBefore; i++) {
    if (foundLineNo - i < 0) break;
    line = getLine(
      mark.buffer,
      lineStarts[foundLineNo - i],
      lineEnds[foundLineNo - i],
      mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo - i]),
      maxLineLength
    );
    result = common.repeat(' ', options.indent) + padStart((mark.line - i + 1).toString(), lineNoLength) +
      ' | ' + line.str + '\n' + result;
  }

  line = getLine(mark.buffer, lineStarts[foundLineNo], lineEnds[foundLineNo], mark.position, maxLineLength);
  result += common.repeat(' ', options.indent) + padStart((mark.line + 1).toString(), lineNoLength) +
    ' | ' + line.str + '\n';
  result += common.repeat('-', options.indent + lineNoLength + 3 + line.pos) + '^' + '\n';

  for (i = 1; i <= options.linesAfter; i++) {
    if (foundLineNo + i >= lineEnds.length) break;
    line = getLine(
      mark.buffer,
      lineStarts[foundLineNo + i],
      lineEnds[foundLineNo + i],
      mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo + i]),
      maxLineLength
    );
    result += common.repeat(' ', options.indent) + padStart((mark.line + i + 1).toString(), lineNoLength) +
      ' | ' + line.str + '\n';
  }

  return result.replace(/\n$/, '');
}


module.exports = makeSnippet;

},{"./common":5}],15:[function(require,module,exports){
'use strict';

var YAMLException = require('./exception');

var TYPE_CONSTRUCTOR_OPTIONS = [
  'kind',
  'multi',
  'resolve',
  'construct',
  'instanceOf',
  'predicate',
  'represent',
  'representName',
  'defaultStyle',
  'styleAliases'
];

var YAML_NODE_KINDS = [
  'scalar',
  'sequence',
  'mapping'
];

function compileStyleAliases(map) {
  var result = {};

  if (map !== null) {
    Object.keys(map).forEach(function (style) {
      map[style].forEach(function (alias) {
        result[String(alias)] = style;
      });
    });
  }

  return result;
}

function Type(tag, options) {
  options = options || {};

  Object.keys(options).forEach(function (name) {
    if (TYPE_CONSTRUCTOR_OPTIONS.indexOf(name) === -1) {
      throw new YAMLException('Unknown option "' + name + '" is met in definition of "' + tag + '" YAML type.');
    }
  });

  // TODO: Add tag format check.
  this.options       = options; // keep original options in case user wants to extend this type later
  this.tag           = tag;
  this.kind          = options['kind']          || null;
  this.resolve       = options['resolve']       || function () { return true; };
  this.construct     = options['construct']     || function (data) { return data; };
  this.instanceOf    = options['instanceOf']    || null;
  this.predicate     = options['predicate']     || null;
  this.represent     = options['represent']     || null;
  this.representName = options['representName'] || null;
  this.defaultStyle  = options['defaultStyle']  || null;
  this.multi         = options['multi']         || false;
  this.styleAliases  = compileStyleAliases(options['styleAliases'] || null);

  if (YAML_NODE_KINDS.indexOf(this.kind) === -1) {
    throw new YAMLException('Unknown kind "' + this.kind + '" is specified for "' + tag + '" YAML type.');
  }
}

module.exports = Type;

},{"./exception":7}],16:[function(require,module,exports){
'use strict';

/*eslint-disable no-bitwise*/


var Type = require('../type');


// [ 64, 65, 66 ] -> [ padding, CR, LF ]
var BASE64_MAP = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r';


function resolveYamlBinary(data) {
  if (data === null) return false;

  var code, idx, bitlen = 0, max = data.length, map = BASE64_MAP;

  // Convert one by one.
  for (idx = 0; idx < max; idx++) {
    code = map.indexOf(data.charAt(idx));

    // Skip CR/LF
    if (code > 64) continue;

    // Fail on illegal characters
    if (code < 0) return false;

    bitlen += 6;
  }

  // If there are any bits left, source was corrupted
  return (bitlen % 8) === 0;
}

function constructYamlBinary(data) {
  var idx, tailbits,
      input = data.replace(/[\r\n=]/g, ''), // remove CR/LF & padding to simplify scan
      max = input.length,
      map = BASE64_MAP,
      bits = 0,
      result = [];

  // Collect by 6*4 bits (3 bytes)

  for (idx = 0; idx < max; idx++) {
    if ((idx % 4 === 0) && idx) {
      result.push((bits >> 16) & 0xFF);
      result.push((bits >> 8) & 0xFF);
      result.push(bits & 0xFF);
    }

    bits = (bits << 6) | map.indexOf(input.charAt(idx));
  }

  // Dump tail

  tailbits = (max % 4) * 6;

  if (tailbits === 0) {
    result.push((bits >> 16) & 0xFF);
    result.push((bits >> 8) & 0xFF);
    result.push(bits & 0xFF);
  } else if (tailbits === 18) {
    result.push((bits >> 10) & 0xFF);
    result.push((bits >> 2) & 0xFF);
  } else if (tailbits === 12) {
    result.push((bits >> 4) & 0xFF);
  }

  return new Uint8Array(result);
}

function representYamlBinary(object /*, style*/) {
  var result = '', bits = 0, idx, tail,
      max = object.length,
      map = BASE64_MAP;

  // Convert every three bytes to 4 ASCII characters.

  for (idx = 0; idx < max; idx++) {
    if ((idx % 3 === 0) && idx) {
      result += map[(bits >> 18) & 0x3F];
      result += map[(bits >> 12) & 0x3F];
      result += map[(bits >> 6) & 0x3F];
      result += map[bits & 0x3F];
    }

    bits = (bits << 8) + object[idx];
  }

  // Dump tail

  tail = max % 3;

  if (tail === 0) {
    result += map[(bits >> 18) & 0x3F];
    result += map[(bits >> 12) & 0x3F];
    result += map[(bits >> 6) & 0x3F];
    result += map[bits & 0x3F];
  } else if (tail === 2) {
    result += map[(bits >> 10) & 0x3F];
    result += map[(bits >> 4) & 0x3F];
    result += map[(bits << 2) & 0x3F];
    result += map[64];
  } else if (tail === 1) {
    result += map[(bits >> 2) & 0x3F];
    result += map[(bits << 4) & 0x3F];
    result += map[64];
    result += map[64];
  }

  return result;
}

function isBinary(obj) {
  return Object.prototype.toString.call(obj) ===  '[object Uint8Array]';
}

module.exports = new Type('tag:yaml.org,2002:binary', {
  kind: 'scalar',
  resolve: resolveYamlBinary,
  construct: constructYamlBinary,
  predicate: isBinary,
  represent: representYamlBinary
});

},{"../type":15}],17:[function(require,module,exports){
'use strict';

var Type = require('../type');

function resolveYamlBoolean(data) {
  if (data === null) return false;

  var max = data.length;

  return (max === 4 && (data === 'true' || data === 'True' || data === 'TRUE')) ||
         (max === 5 && (data === 'false' || data === 'False' || data === 'FALSE'));
}

function constructYamlBoolean(data) {
  return data === 'true' ||
         data === 'True' ||
         data === 'TRUE';
}

function isBoolean(object) {
  return Object.prototype.toString.call(object) === '[object Boolean]';
}

module.exports = new Type('tag:yaml.org,2002:bool', {
  kind: 'scalar',
  resolve: resolveYamlBoolean,
  construct: constructYamlBoolean,
  predicate: isBoolean,
  represent: {
    lowercase: function (object) { return object ? 'true' : 'false'; },
    uppercase: function (object) { return object ? 'TRUE' : 'FALSE'; },
    camelcase: function (object) { return object ? 'True' : 'False'; }
  },
  defaultStyle: 'lowercase'
});

},{"../type":15}],18:[function(require,module,exports){
'use strict';

var common = require('../common');
var Type   = require('../type');

var YAML_FLOAT_PATTERN = new RegExp(
  // 2.5e4, 2.5 and integers
  '^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?' +
  // .2e4, .2
  // special case, seems not from spec
  '|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?' +
  // .inf
  '|[-+]?\\.(?:inf|Inf|INF)' +
  // .nan
  '|\\.(?:nan|NaN|NAN))$');

function resolveYamlFloat(data) {
  if (data === null) return false;

  if (!YAML_FLOAT_PATTERN.test(data) ||
      // Quick hack to not allow integers end with `_`
      // Probably should update regexp & check speed
      data[data.length - 1] === '_') {
    return false;
  }

  return true;
}

function constructYamlFloat(data) {
  var value, sign;

  value  = data.replace(/_/g, '').toLowerCase();
  sign   = value[0] === '-' ? -1 : 1;

  if ('+-'.indexOf(value[0]) >= 0) {
    value = value.slice(1);
  }

  if (value === '.inf') {
    return (sign === 1) ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;

  } else if (value === '.nan') {
    return NaN;
  }
  return sign * parseFloat(value, 10);
}


var SCIENTIFIC_WITHOUT_DOT = /^[-+]?[0-9]+e/;

function representYamlFloat(object, style) {
  var res;

  if (isNaN(object)) {
    switch (style) {
      case 'lowercase': return '.nan';
      case 'uppercase': return '.NAN';
      case 'camelcase': return '.NaN';
    }
  } else if (Number.POSITIVE_INFINITY === object) {
    switch (style) {
      case 'lowercase': return '.inf';
      case 'uppercase': return '.INF';
      case 'camelcase': return '.Inf';
    }
  } else if (Number.NEGATIVE_INFINITY === object) {
    switch (style) {
      case 'lowercase': return '-.inf';
      case 'uppercase': return '-.INF';
      case 'camelcase': return '-.Inf';
    }
  } else if (common.isNegativeZero(object)) {
    return '-0.0';
  }

  res = object.toString(10);

  // JS stringifier can build scientific format without dots: 5e-100,
  // while YAML requres dot: 5.e-100. Fix it with simple hack

  return SCIENTIFIC_WITHOUT_DOT.test(res) ? res.replace('e', '.e') : res;
}

function isFloat(object) {
  return (Object.prototype.toString.call(object) === '[object Number]') &&
         (object % 1 !== 0 || common.isNegativeZero(object));
}

module.exports = new Type('tag:yaml.org,2002:float', {
  kind: 'scalar',
  resolve: resolveYamlFloat,
  construct: constructYamlFloat,
  predicate: isFloat,
  represent: representYamlFloat,
  defaultStyle: 'lowercase'
});

},{"../common":5,"../type":15}],19:[function(require,module,exports){
'use strict';

var common = require('../common');
var Type   = require('../type');

function isHexCode(c) {
  return ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */)) ||
         ((0x41/* A */ <= c) && (c <= 0x46/* F */)) ||
         ((0x61/* a */ <= c) && (c <= 0x66/* f */));
}

function isOctCode(c) {
  return ((0x30/* 0 */ <= c) && (c <= 0x37/* 7 */));
}

function isDecCode(c) {
  return ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */));
}

function resolveYamlInteger(data) {
  if (data === null) return false;

  var max = data.length,
      index = 0,
      hasDigits = false,
      ch;

  if (!max) return false;

  ch = data[index];

  // sign
  if (ch === '-' || ch === '+') {
    ch = data[++index];
  }

  if (ch === '0') {
    // 0
    if (index + 1 === max) return true;
    ch = data[++index];

    // base 2, base 8, base 16

    if (ch === 'b') {
      // base 2
      index++;

      for (; index < max; index++) {
        ch = data[index];
        if (ch === '_') continue;
        if (ch !== '0' && ch !== '1') return false;
        hasDigits = true;
      }
      return hasDigits && ch !== '_';
    }


    if (ch === 'x') {
      // base 16
      index++;

      for (; index < max; index++) {
        ch = data[index];
        if (ch === '_') continue;
        if (!isHexCode(data.charCodeAt(index))) return false;
        hasDigits = true;
      }
      return hasDigits && ch !== '_';
    }


    if (ch === 'o') {
      // base 8
      index++;

      for (; index < max; index++) {
        ch = data[index];
        if (ch === '_') continue;
        if (!isOctCode(data.charCodeAt(index))) return false;
        hasDigits = true;
      }
      return hasDigits && ch !== '_';
    }
  }

  // base 10 (except 0)

  // value should not start with `_`;
  if (ch === '_') return false;

  for (; index < max; index++) {
    ch = data[index];
    if (ch === '_') continue;
    if (!isDecCode(data.charCodeAt(index))) {
      return false;
    }
    hasDigits = true;
  }

  // Should have digits and should not end with `_`
  if (!hasDigits || ch === '_') return false;

  return true;
}

function constructYamlInteger(data) {
  var value = data, sign = 1, ch;

  if (value.indexOf('_') !== -1) {
    value = value.replace(/_/g, '');
  }

  ch = value[0];

  if (ch === '-' || ch === '+') {
    if (ch === '-') sign = -1;
    value = value.slice(1);
    ch = value[0];
  }

  if (value === '0') return 0;

  if (ch === '0') {
    if (value[1] === 'b') return sign * parseInt(value.slice(2), 2);
    if (value[1] === 'x') return sign * parseInt(value.slice(2), 16);
    if (value[1] === 'o') return sign * parseInt(value.slice(2), 8);
  }

  return sign * parseInt(value, 10);
}

function isInteger(object) {
  return (Object.prototype.toString.call(object)) === '[object Number]' &&
         (object % 1 === 0 && !common.isNegativeZero(object));
}

module.exports = new Type('tag:yaml.org,2002:int', {
  kind: 'scalar',
  resolve: resolveYamlInteger,
  construct: constructYamlInteger,
  predicate: isInteger,
  represent: {
    binary:      function (obj) { return obj >= 0 ? '0b' + obj.toString(2) : '-0b' + obj.toString(2).slice(1); },
    octal:       function (obj) { return obj >= 0 ? '0o'  + obj.toString(8) : '-0o'  + obj.toString(8).slice(1); },
    decimal:     function (obj) { return obj.toString(10); },
    /* eslint-disable max-len */
    hexadecimal: function (obj) { return obj >= 0 ? '0x' + obj.toString(16).toUpperCase() :  '-0x' + obj.toString(16).toUpperCase().slice(1); }
  },
  defaultStyle: 'decimal',
  styleAliases: {
    binary:      [ 2,  'bin' ],
    octal:       [ 8,  'oct' ],
    decimal:     [ 10, 'dec' ],
    hexadecimal: [ 16, 'hex' ]
  }
});

},{"../common":5,"../type":15}],20:[function(require,module,exports){
'use strict';

var Type = require('../type');

module.exports = new Type('tag:yaml.org,2002:map', {
  kind: 'mapping',
  construct: function (data) { return data !== null ? data : {}; }
});

},{"../type":15}],21:[function(require,module,exports){
'use strict';

var Type = require('../type');

function resolveYamlMerge(data) {
  return data === '<<' || data === null;
}

module.exports = new Type('tag:yaml.org,2002:merge', {
  kind: 'scalar',
  resolve: resolveYamlMerge
});

},{"../type":15}],22:[function(require,module,exports){
'use strict';

var Type = require('../type');

function resolveYamlNull(data) {
  if (data === null) return true;

  var max = data.length;

  return (max === 1 && data === '~') ||
         (max === 4 && (data === 'null' || data === 'Null' || data === 'NULL'));
}

function constructYamlNull() {
  return null;
}

function isNull(object) {
  return object === null;
}

module.exports = new Type('tag:yaml.org,2002:null', {
  kind: 'scalar',
  resolve: resolveYamlNull,
  construct: constructYamlNull,
  predicate: isNull,
  represent: {
    canonical: function () { return '~';    },
    lowercase: function () { return 'null'; },
    uppercase: function () { return 'NULL'; },
    camelcase: function () { return 'Null'; },
    empty:     function () { return '';     }
  },
  defaultStyle: 'lowercase'
});

},{"../type":15}],23:[function(require,module,exports){
'use strict';

var Type = require('../type');

var _hasOwnProperty = Object.prototype.hasOwnProperty;
var _toString       = Object.prototype.toString;

function resolveYamlOmap(data) {
  if (data === null) return true;

  var objectKeys = [], index, length, pair, pairKey, pairHasKey,
      object = data;

  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];
    pairHasKey = false;

    if (_toString.call(pair) !== '[object Object]') return false;

    for (pairKey in pair) {
      if (_hasOwnProperty.call(pair, pairKey)) {
        if (!pairHasKey) pairHasKey = true;
        else return false;
      }
    }

    if (!pairHasKey) return false;

    if (objectKeys.indexOf(pairKey) === -1) objectKeys.push(pairKey);
    else return false;
  }

  return true;
}

function constructYamlOmap(data) {
  return data !== null ? data : [];
}

module.exports = new Type('tag:yaml.org,2002:omap', {
  kind: 'sequence',
  resolve: resolveYamlOmap,
  construct: constructYamlOmap
});

},{"../type":15}],24:[function(require,module,exports){
'use strict';

var Type = require('../type');

var _toString = Object.prototype.toString;

function resolveYamlPairs(data) {
  if (data === null) return true;

  var index, length, pair, keys, result,
      object = data;

  result = new Array(object.length);

  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];

    if (_toString.call(pair) !== '[object Object]') return false;

    keys = Object.keys(pair);

    if (keys.length !== 1) return false;

    result[index] = [ keys[0], pair[keys[0]] ];
  }

  return true;
}

function constructYamlPairs(data) {
  if (data === null) return [];

  var index, length, pair, keys, result,
      object = data;

  result = new Array(object.length);

  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];

    keys = Object.keys(pair);

    result[index] = [ keys[0], pair[keys[0]] ];
  }

  return result;
}

module.exports = new Type('tag:yaml.org,2002:pairs', {
  kind: 'sequence',
  resolve: resolveYamlPairs,
  construct: constructYamlPairs
});

},{"../type":15}],25:[function(require,module,exports){
'use strict';

var Type = require('../type');

module.exports = new Type('tag:yaml.org,2002:seq', {
  kind: 'sequence',
  construct: function (data) { return data !== null ? data : []; }
});

},{"../type":15}],26:[function(require,module,exports){
'use strict';

var Type = require('../type');

var _hasOwnProperty = Object.prototype.hasOwnProperty;

function resolveYamlSet(data) {
  if (data === null) return true;

  var key, object = data;

  for (key in object) {
    if (_hasOwnProperty.call(object, key)) {
      if (object[key] !== null) return false;
    }
  }

  return true;
}

function constructYamlSet(data) {
  return data !== null ? data : {};
}

module.exports = new Type('tag:yaml.org,2002:set', {
  kind: 'mapping',
  resolve: resolveYamlSet,
  construct: constructYamlSet
});

},{"../type":15}],27:[function(require,module,exports){
'use strict';

var Type = require('../type');

module.exports = new Type('tag:yaml.org,2002:str', {
  kind: 'scalar',
  construct: function (data) { return data !== null ? data : ''; }
});

},{"../type":15}],28:[function(require,module,exports){
'use strict';

var Type = require('../type');

var YAML_DATE_REGEXP = new RegExp(
  '^([0-9][0-9][0-9][0-9])'          + // [1] year
  '-([0-9][0-9])'                    + // [2] month
  '-([0-9][0-9])$');                   // [3] day

var YAML_TIMESTAMP_REGEXP = new RegExp(
  '^([0-9][0-9][0-9][0-9])'          + // [1] year
  '-([0-9][0-9]?)'                   + // [2] month
  '-([0-9][0-9]?)'                   + // [3] day
  '(?:[Tt]|[ \\t]+)'                 + // ...
  '([0-9][0-9]?)'                    + // [4] hour
  ':([0-9][0-9])'                    + // [5] minute
  ':([0-9][0-9])'                    + // [6] second
  '(?:\\.([0-9]*))?'                 + // [7] fraction
  '(?:[ \\t]*(Z|([-+])([0-9][0-9]?)' + // [8] tz [9] tz_sign [10] tz_hour
  '(?::([0-9][0-9]))?))?$');           // [11] tz_minute

function resolveYamlTimestamp(data) {
  if (data === null) return false;
  if (YAML_DATE_REGEXP.exec(data) !== null) return true;
  if (YAML_TIMESTAMP_REGEXP.exec(data) !== null) return true;
  return false;
}

function constructYamlTimestamp(data) {
  var match, year, month, day, hour, minute, second, fraction = 0,
      delta = null, tz_hour, tz_minute, date;

  match = YAML_DATE_REGEXP.exec(data);
  if (match === null) match = YAML_TIMESTAMP_REGEXP.exec(data);

  if (match === null) throw new Error('Date resolve error');

  // match: [1] year [2] month [3] day

  year = +(match[1]);
  month = +(match[2]) - 1; // JS month starts with 0
  day = +(match[3]);

  if (!match[4]) { // no hour
    return new Date(Date.UTC(year, month, day));
  }

  // match: [4] hour [5] minute [6] second [7] fraction

  hour = +(match[4]);
  minute = +(match[5]);
  second = +(match[6]);

  if (match[7]) {
    fraction = match[7].slice(0, 3);
    while (fraction.length < 3) { // milli-seconds
      fraction += '0';
    }
    fraction = +fraction;
  }

  // match: [8] tz [9] tz_sign [10] tz_hour [11] tz_minute

  if (match[9]) {
    tz_hour = +(match[10]);
    tz_minute = +(match[11] || 0);
    delta = (tz_hour * 60 + tz_minute) * 60000; // delta in mili-seconds
    if (match[9] === '-') delta = -delta;
  }

  date = new Date(Date.UTC(year, month, day, hour, minute, second, fraction));

  if (delta) date.setTime(date.getTime() - delta);

  return date;
}

function representYamlTimestamp(object /*, style*/) {
  return object.toISOString();
}

module.exports = new Type('tag:yaml.org,2002:timestamp', {
  kind: 'scalar',
  resolve: resolveYamlTimestamp,
  construct: constructYamlTimestamp,
  instanceOf: Date,
  represent: representYamlTimestamp
});

},{"../type":15}],29:[function(require,module,exports){
!function(t,e){if("object"==typeof exports&&"object"==typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n=e();for(var i in n)("object"==typeof exports?exports:t)[i]=n[i]}}(this,(function(){return(()=>{"use strict";var t={d:(e,n)=>{for(var i in n)t.o(n,i)&&!t.o(e,i)&&Object.defineProperty(e,i,{enumerable:!0,get:n[i]})},o:(t,e)=>Object.prototype.hasOwnProperty.call(t,e),r:t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})}},e={};t.r(e),t.d(e,{StreamDataView:()=>o});var n=function(){function t(t){this.encoding=t||"utf-8"}return t.prototype.decode=function(t){var e=String.fromCharCode.apply(null,Array.from(t));return"utf-8"===this.encoding?decodeURIComponent(escape(e)):e},t}(),i=function(){function t(t){this.encoding=t||"utf-8"}return t.prototype.encode=function(t){return"utf-8"===this.encoding&&(t=unescape(encodeURIComponent(t))),new Uint8Array(t.split("").map((function(t){return t.charCodeAt(0)})))},t}(),o=function(){function t(t,e){this.offset=0,this.autoResize=!1,void 0===t&&(t=0,this.autoResize=!0),"number"==typeof t&&(t=new ArrayBuffer(t)),this.view=new DataView(t),this.littleEndian=!e}return t.fromByteString=function(e){var n=new t(e.split(" ").length);return n.fromByteString(e),n},t.fromTextString=function(e,n){var o,s=new t((o=n?new i("utf-8").encode(e):new i("ascii").encode(e)).length);return s.setNextString(e,n,o.length),s},t.prototype.resize=function(t){var e=function(t,e){if(!(t instanceof ArrayBuffer))throw new TypeError("Source must be an instance of ArrayBuffer");if(e<=t.byteLength)return t.slice(0,e);var n=new Uint8Array(t),i=new Uint8Array(new ArrayBuffer(e));return i.set(n),i.buffer}(this.getBuffer(),t);this.view=new DataView(e)},t.prototype.crop=function(){this.resize(this.getOffset())},t.prototype.getBuffer=function(){return this.view.buffer},t.prototype.skip=function(t){this.offset+=t},t.prototype.resetOffset=function(){this.offset=0},t.prototype.getOffset=function(){return this.offset},t.prototype.setOffset=function(t){this.offset=t},t.prototype.getInt8=function(t){return this.view.getInt8(t)},t.prototype.getUint8=function(t){return this.view.getUint8(t)},t.prototype.getNextInt8=function(){var t=this.getInt8(this.offset);return this.offset+=1,t},t.prototype.getNextUint8=function(){var t=this.getUint8(this.offset);return this.offset+=1,t},t.prototype.getInt16=function(t){return this.view.getInt16(t,this.littleEndian)},t.prototype.getUint16=function(t){return this.view.getUint16(t,this.littleEndian)},t.prototype.getNextInt16=function(){var t=this.getInt16(this.offset);return this.offset+=2,t},t.prototype.getNextUint16=function(){var t=this.getUint16(this.offset);return this.offset+=2,t},t.prototype.getInt32=function(t){return this.view.getInt32(t,this.littleEndian)},t.prototype.getUint32=function(t){return this.view.getUint32(t,this.littleEndian)},t.prototype.getNextInt32=function(){var t=this.getInt32(this.offset);return this.offset+=4,t},t.prototype.getNextUint32=function(){var t=this.getUint32(this.offset);return this.offset+=4,t},t.prototype.getFloat32=function(t){return this.view.getFloat32(t,this.littleEndian)},t.prototype.getFloat64=function(t){return this.view.getFloat64(t,this.littleEndian)},t.prototype.getNextFloat32=function(){var t=this.getFloat32(this.offset);return this.offset+=4,t},t.prototype.getNextFloat64=function(){var t=this.getFloat64(this.offset);return this.offset+=8,t},t.prototype.setInt8=function(t,e){this.handleAutoResize(t,1),this.view.setInt8(t,e)},t.prototype.setUint8=function(t,e){this.handleAutoResize(t,1),this.view.setUint8(t,e)},t.prototype.setNextInt8=function(t){this.setInt8(this.offset,t),this.offset+=1},t.prototype.setNextUint8=function(t){this.setUint8(this.offset,t),this.offset+=1},t.prototype.setInt16=function(t,e){this.handleAutoResize(t,2),this.view.setInt16(t,e,this.littleEndian)},t.prototype.setUint16=function(t,e){this.handleAutoResize(t,2),this.view.setUint16(t,e,this.littleEndian)},t.prototype.setNextInt16=function(t){this.setInt16(this.offset,t),this.offset+=2},t.prototype.setNextUint16=function(t){this.setUint16(this.offset,t),this.offset+=2},t.prototype.setInt32=function(t,e){this.handleAutoResize(t,4),this.view.setInt32(t,e,this.littleEndian)},t.prototype.setUint32=function(t,e){this.handleAutoResize(t,4),this.view.setUint32(t,e,this.littleEndian)},t.prototype.setNextInt32=function(t){this.setInt32(this.offset,t),this.offset+=4},t.prototype.setNextUint32=function(t){this.setUint32(this.offset,t),this.offset+=4},t.prototype.setFloat32=function(t,e){this.handleAutoResize(t,8),this.view.setFloat32(t,e,this.littleEndian)},t.prototype.setFloat64=function(t,e){this.handleAutoResize(t,8),this.view.setFloat64(t,e,this.littleEndian)},t.prototype.setNextFloat32=function(t){this.setFloat32(this.offset,t),this.offset+=4},t.prototype.setNextFloat64=function(t){this.setFloat64(this.offset,t),this.offset+=8},t.prototype.getBytes=function(t,e){void 0===t&&(t=0),e=e||this.view.buffer.byteLength-t;var n=this.getBuffer().slice(t,t+e);return new Uint8Array(n)},t.prototype.getNextBytes=function(t){var e=this.getBytes(this.offset,t);return this.offset+=t||0,e},t.prototype.setBytes=function(t,e){(e instanceof ArrayBuffer||Array.isArray(e))&&(e=new Uint8Array(e));var n=e;this.handleAutoResize(t,n.byteLength);for(var i=0;i<n.byteLength;i++)this.setUint8(t+i,n[i])},t.prototype.setNextBytes=function(t){Array.isArray(t)&&(t=new Uint8Array(t)),this.setBytes(this.offset,t),this.offset+=t.byteLength},t.prototype.getString=function(t,e,i,o){var s=this.getBytes(t,e);if(o){var r=s.indexOf(0);r>=0&&(s=s.slice(0,r))}return i?new n("utf-8").decode(s):new n("ascii").decode(s)},t.prototype.getNextString=function(t,e,n){var i=this.getString(this.offset,t,e,n);return this.offset+=t,i},t.prototype.setString=function(t,e,n,o){var s;s=n?new i("utf-8").encode(e):new i("ascii").encode(e),o="number"==typeof o?o:s.byteLength,this.handleAutoResize(t,o);for(var r=0;r<o;r++)this.view.setUint8(t+r,s[r]||0);return o},t.prototype.setNextString=function(t,e,n){this.offset+=this.setString(this.offset,t,e,n)},t.prototype.toByteString=function(){return Array.from(new Uint8Array(this.getBuffer())).map((function(t){return("00"+t.toString(16)).slice(-2)})).join(" ").toUpperCase()},t.prototype.toTextString=function(t){return this.getString(0,this.view.byteLength,t)},t.prototype.fromByteString=function(t){var e=t.split(" "),n=new ArrayBuffer(e.length);this.view=new DataView(n),this.setNextBytes(new Uint8Array(e.map((function(t){return parseInt(t,16)})))),this.resetOffset()},t.prototype.getLength=function(){return this.view.byteLength},t.prototype.clear=function(){this.view=new DataView(new ArrayBuffer(this.view.byteLength)),this.offset=0},t.prototype.handleAutoResize=function(t,e){this.autoResize&&this.getBuffer().byteLength<t+e&&this.resize(t+e)},t}();return e})()}));
},{}],30:[function(require,module,exports){
module.exports={
    "name": "@dobuki/compression",
    "version": "1.0.28",
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
        "browserify": "^17.0.0",
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
        "js-yaml": "^4.1.0",
        "np": "^7.6.3",
        "path": "^0.12.7",
        "stream-data-view": "^1.7.2",
        "ts-loader": "^9.3.1",
        "ts-node": "^10.9.1"
    }
}

},{}],31:[function(require,module,exports){
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
        tokenEncoder.encodeTokens(dataStore.headerTokens, true);
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
            subEncoder.encodeTokens(dataStore.getDataTokens(index), false);
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
        var headerTokens = headerTokenEncoder.decodeTokens(true);
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
            return tokenDecoder.decodeTokens(false);
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

},{"../../package.json":30,"../expander/Extractor":35,"../reducer/Reducer":38,"../tokenizer/Tokenizer":40,"./FFlateEncoder":33,"./TokenEncoder":34,"stream-data-view":29}],32:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.DataTypeUtils = exports.NUMBER_DATA_TYPES = exports.DataType = exports.StructureType = void 0;
var StructureType;
(function (StructureType) {
    StructureType[StructureType["LEAF"] = 0] = "LEAF";
    StructureType[StructureType["ARRAY"] = 1] = "ARRAY";
    StructureType[StructureType["OBJECT"] = 2] = "OBJECT";
    StructureType[StructureType["SPLIT"] = 3] = "SPLIT";
})(StructureType = exports.StructureType || (exports.StructureType = {}));
;
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
    DataType[DataType["REFERENCE_8"] = 30] = "REFERENCE_8";
    DataType[DataType["REFERENCE_16"] = 31] = "REFERENCE_16";
    DataType[DataType["REFERENCE_32"] = 32] = "REFERENCE_32";
    DataType[DataType["COMPLEX_OBJECT"] = 33] = "COMPLEX_OBJECT";
    DataType[DataType["UINT2"] = 34] = "UINT2";
    DataType[DataType["UINT4"] = 35] = "UINT4";
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
    DataTypeUtils.prototype.getStringDataType = function (value, noSet) {
        if (noSet === void 0) { noSet = false; }
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
            case "complex":
                return DataType.COMPLEX_OBJECT;
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
                switch (this.getNumberDataType(token.value)) {
                    case DataType.UINT8:
                        return DataType.REFERENCE_8;
                    case DataType.UINT16:
                        return DataType.REFERENCE_16;
                    case DataType.UINT32:
                        return DataType.REFERENCE_32;
                }
                throw new Error("Invalid reference value: " + token.value);
        }
        throw new Error("Unrecognized type for ".concat(token.type, " value: ").concat(token.value));
    };
    DataTypeUtils.prototype.dataTypeToType = function (dataType) {
        switch (dataType) {
            case DataType.COMPLEX_OBJECT:
                return "complex";
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
            case DataType.REFERENCE_8:
            case DataType.REFERENCE_16:
            case DataType.REFERENCE_32:
                return "reference";
            default:
                return "leaf";
        }
    };
    DataTypeUtils.prototype.typeToStructureType = function (type) {
        switch (type) {
            case "leaf":
                return StructureType.LEAF;
            case "array":
                return StructureType.ARRAY;
            case "object":
                return StructureType.OBJECT;
            case "split":
                return StructureType.SPLIT;
        }
        throw new Error("Cannot translate to structure type: " + type);
    };
    return DataTypeUtils;
}());
exports.DataTypeUtils = DataTypeUtils;

},{}],33:[function(require,module,exports){
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

},{"fflate":2}],34:[function(require,module,exports){
"use strict";
exports.__esModule = true;
//13093
var stream_data_view_1 = require("stream-data-view");
var DataType_1 = require("./DataType");
var MAX_ARRAY_SIZE = 255;
var TokenEncoder = /** @class */ (function () {
    function TokenEncoder(streamDataView) {
        this.streamDataView = streamDataView;
        this.dataTypeUtils = new DataType_1.DataTypeUtils();
    }
    TokenEncoder.prototype.encodeTokens = function (tokens, organized) {
        var pos = 0;
        while (pos < tokens.length) {
            var count = this.encodeMulti(tokens, pos, organized);
            if (count) {
                pos += count;
            }
        }
        this.encodeMulti([], pos, organized);
    };
    TokenEncoder.prototype.decodeTokens = function (organized) {
        var tokens = [];
        while (this.streamDataView.getOffset() < this.streamDataView.getLength()) {
            if (!this.decodeMulti(tokens, organized)) {
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
            case DataType_1.DataType.REFERENCE_8:
            case DataType_1.DataType.REFERENCE_16:
            case DataType_1.DataType.REFERENCE_32:
                this.encodeReferenceToken(token, usedDataType);
                break;
            case DataType_1.DataType.COMPLEX_OBJECT:
                this.encodeComplexToken(token, usedDataType);
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
            case DataType_1.DataType.UINT2:
            case DataType_1.DataType.UINT4:
                throw new Error("Use decode number array.");
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
            case DataType_1.DataType.REFERENCE_8:
            case DataType_1.DataType.REFERENCE_16:
            case DataType_1.DataType.REFERENCE_32:
                return this.decodeReferenceToken(usedDataType);
            case DataType_1.DataType.COMPLEX_OBJECT:
                return this.decodeComplexToken(usedDataType);
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
    TokenEncoder.prototype.encodeReferenceToken = function (token, dataType) {
        var usedDataType = dataType !== null && dataType !== void 0 ? dataType : this.encodeDataType(this.dataTypeUtils.getDataType(token));
        var numberType = usedDataType === DataType_1.DataType.REFERENCE_8 ? DataType_1.DataType.UINT8 : usedDataType === DataType_1.DataType.REFERENCE_16 ? DataType_1.DataType.UINT16 : DataType_1.DataType.UINT32;
        var index = token.value;
        this.encodeSingleNumber(index, numberType);
    };
    TokenEncoder.prototype.decodeReferenceToken = function (dataType) {
        var usedDataType = dataType !== null && dataType !== void 0 ? dataType : this.decodeDataType();
        var numberType = usedDataType === DataType_1.DataType.REFERENCE_8 ? DataType_1.DataType.UINT8 : usedDataType === DataType_1.DataType.REFERENCE_16 ? DataType_1.DataType.UINT16 : DataType_1.DataType.UINT32;
        return {
            type: "reference",
            value: this.decodeSingleNumber(numberType)
        };
    };
    TokenEncoder.prototype.encodeComplexToken = function (token, dataType) {
        if (dataType === undefined) {
            this.encodeDataType(this.dataTypeUtils.getDataType(token));
        }
        var structure = token.value;
        this.encodeNumberArray(structure, DataType_1.DataType.UINT2);
    };
    TokenEncoder.prototype.decodeComplexToken = function (dataType) {
        var usedDataType = dataType !== null && dataType !== void 0 ? dataType : this.decodeDataType();
        var structure = this.decodeNumberArray(DataType_1.DataType.UINT2);
        return {
            type: this.dataTypeUtils.dataTypeToType(usedDataType),
            value: structure
        };
    };
    TokenEncoder.prototype.encodeDataType = function (dataType) {
        this.streamDataView.setNextUint8(dataType);
        return dataType;
    };
    TokenEncoder.prototype.decodeDataType = function () {
        var dataType = this.streamDataView.getNextUint8();
        return dataType;
    };
    TokenEncoder.prototype.encodeMulti = function (tokens, pos, organized) {
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
        var multiInfo = { organized: organized };
        for (var i = 0; i < multiCount; i++) {
            this.encodeToken(tokens[pos + i], firstType, multiInfo);
        }
        return multiCount;
    };
    TokenEncoder.prototype.decodeMulti = function (tokens, organized) {
        var count = this.streamDataView.getNextUint8();
        if (!count) {
            return 0;
        }
        var dataType = this.decodeDataType();
        var multiInfo = { organized: organized };
        for (var i = 0; i < count; i++) {
            var token = this.decodeToken(dataType, multiInfo);
            tokens.push(token);
        }
        return count;
    };
    TokenEncoder.prototype.encodeSingleNumber = function (value, dataType) {
        var usedDataType = dataType !== null && dataType !== void 0 ? dataType : this.encodeDataType(this.dataTypeUtils.getNumberDataType(value));
        switch (usedDataType) {
            case DataType_1.DataType.UINT2:
            case DataType_1.DataType.UINT4:
                throw new Error("Use encode number array.");
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
            case DataType_1.DataType.UINT2:
            case DataType_1.DataType.UINT4:
                throw new Error("Use decode number array.");
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
    TokenEncoder.prototype.bit2ToNum = function (_a) {
        var a = _a[0], b = _a[1], c = _a[2], d = _a[3];
        return ((a !== null && a !== void 0 ? a : 0) << 0) | ((b !== null && b !== void 0 ? b : 0) << 2) | ((c !== null && c !== void 0 ? c : 0) << 4) | ((d !== null && d !== void 0 ? d : 0) << 6);
    };
    TokenEncoder.prototype.numToBit2 = function (n, size) {
        if (size === void 0) { size = 4; }
        return [(n >> 0) & 3, (n >> 2) & 3, (n >> 4) & 3, (n >> 6) & 3].slice(0, size);
    };
    TokenEncoder.prototype.bit4ToNum = function (_a) {
        var a = _a[0], b = _a[1];
        return ((a !== null && a !== void 0 ? a : 0) << 0) | ((b !== null && b !== void 0 ? b : 0) << 4);
    };
    TokenEncoder.prototype.numToBit4 = function (n, size) {
        if (size === void 0) { size = 2; }
        return [(n >> 0) & 15, (n >> 4) & 15].slice(0, size);
    };
    TokenEncoder.prototype.encodeNumberArray = function (array, dataType) {
        if (dataType === DataType_1.DataType.UINT2 || dataType === DataType_1.DataType.UINT4) {
            var stride = dataType === DataType_1.DataType.UINT2 ? 4 : 2;
            var transform = dataType === DataType_1.DataType.UINT2 ? this.bit2ToNum : this.bit4ToNum;
            var bytes = [];
            for (var i = 0; i < array.length; i += stride) {
                bytes.push(transform(array.slice(i, i + stride)));
            }
            this.encodeNumberArray(bytes, DataType_1.DataType.UINT8);
            this.encodeSingleNumber(array.length - bytes.length * stride, DataType_1.DataType.INT8);
            return;
        }
        var pos;
        for (pos = 0; pos < array.length;) {
            var size = Math.min(MAX_ARRAY_SIZE, array.length - pos);
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
        if (pos === MAX_ARRAY_SIZE) {
            //  Reached the max size, but the next one is 0.
            this.encodeSingleNumber(0, DataType_1.DataType.UINT8);
        }
    };
    TokenEncoder.prototype.decodeNumberArray = function (dataType) {
        if (dataType === DataType_1.DataType.UINT2 || dataType === DataType_1.DataType.UINT4) {
            var transform = dataType === DataType_1.DataType.UINT2 ? this.numToBit2 : this.numToBit4;
            var structure = [];
            var bytes = this.decodeNumberArray(DataType_1.DataType.UINT8);
            for (var _i = 0, bytes_1 = bytes; _i < bytes_1.length; _i++) {
                var byte = bytes_1[_i];
                structure.push.apply(structure, transform(byte));
            }
            var sizeDiff = this.decodeSingleNumber(DataType_1.DataType.INT8);
            structure.length += sizeDiff;
            return structure;
        }
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
        } while (size >= MAX_ARRAY_SIZE);
        return numbers;
    };
    TokenEncoder.prototype.encodeString = function (value, dataType, multiInfo, noSet) {
        var _this = this;
        if (noSet === void 0) { noSet = false; }
        var usedDataType = dataType !== null && dataType !== void 0 ? dataType : this.encodeDataType(this.dataTypeUtils.getStringDataType(value, noSet));
        var letterCodes = value.split("").map(function (l) { return l.charCodeAt(0); });
        if (!(multiInfo === null || multiInfo === void 0 ? void 0 : multiInfo.organized) || multiInfo.lastStringLength !== value.length) {
            letterCodes.push(0);
        }
        // console.log(letterCodes, value, (letterCodes).map((value) => !value ? 0 : value - min + 1));
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
            if ((multiInfo === null || multiInfo === void 0 ? void 0 : multiInfo.organized) && (multiInfo === null || multiInfo === void 0 ? void 0 : multiInfo.lastStringLength) && charCodes.length >= (multiInfo === null || multiInfo === void 0 ? void 0 : multiInfo.lastStringLength)) {
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
                ], function (header) { return tokenEncoder.encodeMulti(header, 0, false); }, reset, function () {
                    var result = [];
                    tokenDecoder.decodeMulti(result, false);
                    return result;
                });
            },
            function (tokenEncoder, tokenDecoder, reset) {
                _this.testAction([
                    { type: "leaf", value: 1000001 },
                    { type: "leaf", value: 1002000 },
                    { type: "leaf", value: 1003001 },
                ], function (header) { return tokenEncoder.encodeMulti(header, 0, false); }, reset, function () {
                    var result = [];
                    tokenDecoder.decodeMulti(result, false);
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
                }), function (o) { return tokenEncoder.encodeTokens(o, false); }, reset, function () { return tokenDecoder.decodeTokens(false); });
            },
            function (tokenEncoder, tokenDecoder, reset) {
                _this.testAction(new Array(260).fill(null).map(function (_, index) {
                    var token = {
                        type: "array",
                        value: new Array(index).fill(null).map(function (_, index) { return index; })
                    };
                    return token;
                }), function (o) { return tokenEncoder.encodeTokens(o, false); }, reset, function () { return tokenDecoder.decodeTokens(false); });
            },
            function (tokenEncoder, tokenDecoder, reset) {
                _this.testAction(new Array(260).fill(null).map(function (_, index) {
                    var token = {
                        type: "array",
                        value: [1]
                    };
                    return token;
                }), function (o) { return tokenEncoder.encodeTokens(o, false); }, reset, function () { return tokenDecoder.decodeTokens(false); });
            },
            function (tokenEncoder, tokenDecoder, reset) {
                _this.testAction({ type: "complex", value: [1, 2, 3, 2, 1, 2, 1, 0] }, function (o) { return tokenEncoder.encodeToken(o); }, reset, function () { return tokenDecoder.decodeToken(); });
            },
            function (tokenEncoder, tokenDecoder, reset) {
                _this.testAction({ type: "complex", value: "120100310000000310000000031000003100003100000031000000031000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000031000000000010000000120103100020103100020103100031000000000002010031000000031000000003100000310000310000003100000003100000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000310000000000100000001201031000201031000201031000310000000000020100310000000310000000031000003100003100000031000000031000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000003100000000001000000012010310002010310002010310003100000000000201003100000003100000000310000031000031000000310000000031000000000000000000000000000100000000000000000000000000310000000000100000001201031000201031000201031000310000000000020100310000000310000000031000003100003100000031000000031000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000003100000000001000000012010310002010310002010310003100000000000".split("").map(function (a) { return parseInt(a); }) }, function (o) { return tokenEncoder.encodeToken(o); }, reset, function () { return tokenDecoder.decodeToken(); });
            },
            //  30
            function (tokenEncoder, tokenDecoder, reset) {
                _this.testAction([1, 2, 3, 2, 1, 2, 1, 0], function (o) { return tokenEncoder.encodeNumberArray(o, DataType_1.DataType.UINT2); }, reset, function () { return tokenDecoder.decodeNumberArray(DataType_1.DataType.UINT2); });
            },
            function (tokenEncoder, tokenDecoder, reset) {
                _this.testAction([1, 15, 12, 12, 1, 9, 1, 0], function (o) { return tokenEncoder.encodeNumberArray(o, DataType_1.DataType.UINT4); }, reset, function () { return tokenDecoder.decodeNumberArray(DataType_1.DataType.UINT4); });
            },
            function (tokenEncoder, tokenDecoder, reset) {
                _this.testAction("xyzxyzyzxxxyyyzzz", function (o) { return tokenEncoder.encodeString(o); }, reset, function () { return tokenDecoder.decodeString(); });
            },
            function (tokenEncoder, tokenDecoder, reset) {
                _this.testAction("abcdeabcabcadbdddba", function (o) { return tokenEncoder.encodeString(o); }, reset, function () { return tokenDecoder.decodeString(); });
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
        if (check === void 0) { check = function (result, value) { return console.assert(JSON.stringify(result) === JSON.stringify(value), "Not equal: \n%s\n!==\n%s (expected)", JSON.stringify(result), JSON.stringify(value)); }; }
        encode(value);
        reset();
        var decoded = decode();
        reset();
        check(decoded, value);
    };
    return TokenEncoder;
}());
exports["default"] = TokenEncoder;

},{"./DataType":32,"stream-data-view":29}],35:[function(require,module,exports){
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var DataType_1 = require("../compression/DataType");
var DEFAULT_CONFIG = {
    cacheable: true
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
     * @returns extracted data.
     */
    ExtractableData.prototype.extract = function (filename) {
        var slot = this.fileToSlot[filename];
        var dataTokens = this.dataStore.getDataTokens(slot);
        if (dataTokens) {
            return this.extractor.extract(this.dataStore.headerTokens, dataTokens, this.config);
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
            "leaf": this.getLeaf.bind(this),
            "object": this.getObject.bind(this),
            "split": this.getSplit.bind(this),
            "reference": this.getReference.bind(this),
            "complex": undefined
        };
    }
    Extractor.prototype.extractFileNames = function (files, headerTokens, config) {
        var _this = this;
        return files.map(function (index) { return _this.extractToken(index, headerTokens, undefined, config); });
    };
    Extractor.prototype.extract = function (headerTokens, dataTokens, config) {
        var tokenStream = dataTokens.entries();
        var _a = tokenStream.next().value, complexToken = _a[1];
        var structure = complexToken.value;
        var token = this.extractComplex(structure.entries(), tokenStream, headerTokens, __spreadArray([], dataTokens, true), config);
        return token;
    };
    Extractor.prototype.extractComplex = function (structure, tokenStream, headerTokens, dataTokens, config) {
        var _this = this;
        var _a = structure.next().value, structureType = _a[1];
        switch (structureType) {
            case DataType_1.StructureType.LEAF:
                var _b = tokenStream.next().value, leafToken = _b[1];
                var value = this.extractValueOrCache(leafToken, headerTokens, dataTokens, config, true, this.valueFetcher[leafToken.type]);
                return value;
            case DataType_1.StructureType.ARRAY:
                var _c = tokenStream.next().value, numToken = _c[1];
                var array = new Array(numToken.value).fill(null)
                    .map(function (_) { return _this.extractComplex(structure, tokenStream, headerTokens, dataTokens, config); });
                return array;
            case DataType_1.StructureType.OBJECT:
                var keys = this.extractComplex(structure, tokenStream, headerTokens, dataTokens, config);
                var values_1 = this.extractComplex(structure, tokenStream, headerTokens, dataTokens, config);
                var object = Object.fromEntries(keys.map(function (key, index) { return [key, values_1[index]]; }));
                return object;
            case DataType_1.StructureType.SPLIT:
                var chunks = this.extractComplex(structure, tokenStream, headerTokens, dataTokens, config);
                var separators_1 = this.extractComplex(structure, tokenStream, headerTokens, dataTokens, config);
                var split = chunks.map(function (chunk, index) { var _a; return "".concat(chunk).concat((_a = separators_1[index]) !== null && _a !== void 0 ? _a : ""); }).join("");
                return split;
        }
    };
    Extractor.prototype.extractToken = function (index, headerTokens, dataTokens, config, allowUseCache) {
        var token = index < headerTokens.length ? headerTokens[index] : dataTokens === null || dataTokens === void 0 ? void 0 : dataTokens[index - headerTokens.length];
        if (!token) {
            throw new Error("Invalid token at index: " + index);
        }
        return this.extractValueOrCache(token, headerTokens, dataTokens, config, allowUseCache, this.valueFetcher[token.type]);
    };
    Extractor.prototype.getLeaf = function (token) {
        return token.value;
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
        var value = getValue(token, headerTokens, dataTokens, config);
        if (config.cacheable && token.type !== "leaf") {
            token.cache = value;
        }
        return value;
    };
    return Extractor;
}());

},{"../compression/DataType":32}],36:[function(require,module,exports){
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

},{"./compression/Compressor":31,"./compression/TokenEncoder":34,"./io/Loader":37}],37:[function(require,module,exports){
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
var yaml = require('js-yaml');
function extension(file) {
    return file.split(".").pop();
}
var Loader = /** @class */ (function () {
    function Loader() {
    }
    Loader.prototype.load = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var response, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, fetch(file)];
                    case 1:
                        response = _d.sent();
                        if (!(extension(file) === "yaml" || extension(file) === "yml")) return [3 /*break*/, 3];
                        _b = (_a = yaml).load;
                        return [4 /*yield*/, response.text()];
                    case 2: return [2 /*return*/, _b.apply(_a, [_d.sent()])];
                    case 3:
                        if (!(extension(file) === "json")) return [3 /*break*/, 5];
                        return [4 /*yield*/, response.json()];
                    case 4:
                        _c = _d.sent();
                        return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, response.text()];
                    case 6:
                        _c = _d.sent();
                        _d.label = 7;
                    case 7: return [2 /*return*/, _c];
                }
            });
        });
    };
    return Loader;
}());
exports["default"] = Loader;

},{"js-yaml":4}],38:[function(require,module,exports){
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
    function Reducer() {
        this.dataTypeUtils = new DataType_1.DataTypeUtils();
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
        var headerTokens = this.createReducedHeaderTokens(this.filterSplit(Object.values(header.registry)
            .filter(function (token) { return token.files.size > 1 || token.files.has("header"); }), header.registry), hashToIndex);
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
        //  save all files separately as complex objects.
        var dataTokens = fileEntries.map(function (_a) {
            var root = _a[1].token;
            var subHashToIndex = __assign({}, hashToIndex);
            var structure = [];
            var result = [{
                    type: "complex",
                    value: structure
                }];
            _this.createComplexObject(root, subHashToIndex, header.registry, headerTokens, structure, result);
            return result;
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
    Reducer.prototype.filterSplit = function (tokens, registry) {
        for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
            var token = tokens_1[_i];
            if (token.type === "split") {
                var _a = token.reference, chunskHash = _a[0], separatorsHash = _a[1];
                var chunksToken = registry[chunskHash];
                var separatorsToken = registry[separatorsHash];
                if (chunksToken.count <= token.count && separatorsToken.count <= token.count) {
                    chunksToken.deleted = true;
                    separatorsToken.deleted = true;
                    token.type = "leaf";
                    delete token.reference;
                }
            }
        }
        return tokens.filter(function (_a) {
            var deleted = _a.deleted;
            return !deleted;
        });
    };
    Reducer.prototype.createReducedHeaderTokens = function (tokens, hashToIndex, offset) {
        if (offset === void 0) { offset = 0; }
        this.sortTokens(tokens);
        var organizedTokens = this.organizeTokens(tokens);
        organizedTokens.forEach(function (_a, index) {
            var hash = _a.hash;
            return hashToIndex[hash] = index + offset;
        });
        return organizedTokens.map(function (token) {
            var _a, _b;
            return ({
                type: token.type,
                value: (_b = (_a = token.reference) === null || _a === void 0 ? void 0 : _a.map(function (hash) { return hashToIndex[hash]; })) !== null && _b !== void 0 ? _b : token.value
            });
        });
    };
    /**
     *  Traverse object to produce a set of tokens used to produce a complex object
     * @param token Root token
     * @param hashToIndex Hash to index mapping
     * @param result Resulting set of tokens
     */
    Reducer.prototype.createComplexObject = function (token, hashToIndex, registry, headerTokens, structure, resultDataTokens) {
        var _this = this;
        var _a, _b;
        if (hashToIndex[token.hash] >= 0) {
            structure.push(DataType_1.StructureType.LEAF);
            resultDataTokens.push({ type: "reference", value: hashToIndex[token.hash] });
        }
        else if (token.type === "leaf") {
            structure.push(this.dataTypeUtils.typeToStructureType(token.type));
            hashToIndex[token.hash] = headerTokens.length + resultDataTokens.length;
            resultDataTokens.push({ type: token.type, value: token.value });
        }
        else if (token.type === "split" || token.type === "object" || token.type === "array") {
            structure.push(this.dataTypeUtils.typeToStructureType(token.type));
            if (token.type === "array") {
                resultDataTokens.push({ type: "leaf", value: (_a = token.reference) === null || _a === void 0 ? void 0 : _a.length });
            }
            var subTokens = (_b = token.reference) === null || _b === void 0 ? void 0 : _b.map(function (hash) { return registry[hash]; });
            subTokens === null || subTokens === void 0 ? void 0 : subTokens.forEach(function (token) {
                _this.createComplexObject(token, hashToIndex, registry, headerTokens, structure, resultDataTokens);
            });
        }
        else {
            throw new Error("Invalid token type");
        }
    };
    return Reducer;
}());
exports["default"] = Reducer;

},{"../compression/DataType":32}],39:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.getType = exports.TEST_REGEX = exports.SPLIT_REGEX = void 0;
exports.SPLIT_REGEX = /\W+/g;
exports.TEST_REGEX = /(\w{3,}\W+){2,}|(\W+\w{3,}){2,}/;
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
    else if (typeof value === "string" && new Set(value).size < 16) {
        return "leaf";
    }
    else if (typeof value === "string" && exports.TEST_REGEX.test(value)) {
        return "split";
    }
    else {
        return "leaf";
    }
}
exports.getType = getType;

},{}],40:[function(require,module,exports){
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

},{"../io/Loader":37,"./Token":39,"blueimp-md5":1}]},{},[36]);
