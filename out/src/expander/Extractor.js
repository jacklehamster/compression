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
