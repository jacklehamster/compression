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
