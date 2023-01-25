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
/**
 * Reduce header from using large tokens to reduce tokens.
 */
var Reducer = /** @class */ (function () {
    function Reducer(debug) {
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
            getDataTokens: function (index) {
                return dataTokens[index];
            }
        };
    };
    Reducer.prototype.createReducedTokens = function (tokens, hashToIndex, offset) {
        var _this = this;
        if (offset === void 0) { offset = 0; }
        var sortedTokens = tokens.sort(function (t1, t2) { return t2.count - t1.count; });
        sortedTokens.forEach(function (_a, index) {
            var hash = _a.hash;
            hashToIndex[hash] = index + offset;
        });
        return sortedTokens.map(function (token) {
            var _a, _b;
            return (__assign({ type: token.type, value: (_b = (_a = token.reference) === null || _a === void 0 ? void 0 : _a.map(function (hash) { return hashToIndex[hash]; })) !== null && _b !== void 0 ? _b : token.value }, _this.debug ? { debug: token.value } : {}));
        });
    };
    return Reducer;
}());
exports["default"] = Reducer;
