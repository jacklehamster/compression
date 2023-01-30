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
