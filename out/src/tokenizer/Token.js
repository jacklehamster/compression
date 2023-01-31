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
