"use strict";
exports.__esModule = true;
//13093
var stream_data_view_1 = require("stream-data-view");
var DataType_1 = require("./DataType");
var MAX_ARRAY_SIZE = 255;
var TokenEncoder = /** @class */ (function () {
    function TokenEncoder(streamDataView, allowSet) {
        this.streamDataView = streamDataView;
        this.dataTypeUtils = new DataType_1.DataTypeUtils(allowSet);
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
            case DataType_1.DataType.STRING2:
            case DataType_1.DataType.STRING4:
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
            case DataType_1.DataType.STRING2:
            case DataType_1.DataType.STRING4:
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
        if (usedDataType === DataType_1.DataType.STRING2 || usedDataType === DataType_1.DataType.STRING4) {
            var set = new Set(value.split(""));
            var letters_1 = Array.from(set).sort();
            this.encodeString(letters_1.join(""), undefined, multiInfo, true);
            this.encodeNumberArray(value.split("").map(function (letter) { return letters_1.indexOf(letter); }), letters_1.length <= 4 ? DataType_1.DataType.UINT2 : DataType_1.DataType.UINT4);
            return;
        }
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
        if (usedDataType === DataType_1.DataType.STRING2 || usedDataType === DataType_1.DataType.STRING4) {
            var letters_2 = this.decodeString(undefined, multiInfo).split("");
            var array = this.decodeNumberArray(letters_2.length <= 4 ? DataType_1.DataType.UINT2 : DataType_1.DataType.UINT4);
            return array.map(function (index) { return letters_2[index]; }).join("");
        }
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
            var encoder = new TokenEncoder(streamDataView, true);
            var decoder = new TokenEncoder(streamDataView, true);
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
