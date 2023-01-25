"use strict";
exports.__esModule = true;
var stream_data_view_1 = require("stream-data-view");
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
})(DataType || (DataType = {}));
var Tag;
(function (Tag) {
    Tag[Tag["DONE"] = 100] = "DONE";
    Tag[Tag["MULTI"] = 101] = "MULTI";
})(Tag || (Tag = {}));
;
var NUMBER_DATA_TYPES = [
    DataType.UINT8,
    DataType.INT8,
    DataType.UINT16,
    DataType.INT16,
    DataType.UINT32,
    DataType.INT32,
    DataType.FLOAT32,
    DataType.FLOAT64,
];
var TokenEncoder = /** @class */ (function () {
    function TokenEncoder(streamDataView) {
        this.streamDataView = streamDataView;
    }
    TokenEncoder.prototype.encodeTokens = function (tokens) {
        var pos = 0;
        while (pos < tokens.length) {
            var count = this.encodeMulti(tokens, pos);
            if (count) {
                pos += count;
            }
            else {
                this.encodeToken(tokens[pos]);
                pos++;
            }
        }
        this.encodeTag(Tag.DONE);
    };
    TokenEncoder.prototype.decodeTokens = function () {
        var tokens = [];
        while (this.streamDataView.getOffset() < this.streamDataView.getLength()) {
            var tagOrDataType = this.decodeTagOrDataType();
            if (tagOrDataType === Tag.DONE) {
                break;
            }
            if (tagOrDataType === Tag.MULTI) {
                this.decodeMulti(tagOrDataType, tokens);
            }
            else {
                var token = this.decodeToken(tagOrDataType);
                tokens.push(token);
            }
        }
        return tokens;
    };
    TokenEncoder.prototype.encodeToken = function (token, dataType) {
        var usedDataType = dataType !== null && dataType !== void 0 ? dataType : this.encodeDataType(this.getDataType(token));
        switch (usedDataType) {
            case DataType.UNDEFINED:
            case DataType.NULL:
            case DataType.BOOLEAN_TRUE:
            case DataType.BOOLEAN_FALSE:
            case DataType.EMPTY_ARRAY:
                break;
            case DataType.INT8:
            case DataType.UINT8:
            case DataType.INT16:
            case DataType.UINT16:
            case DataType.INT32:
            case DataType.UINT32:
            case DataType.FLOAT32:
            case DataType.FLOAT64:
                this.encodeSingleNumber(token.value, usedDataType);
                break;
            case DataType.STRING:
            case DataType.UNICODE:
                this.encodeString(token.value, usedDataType);
                break;
            case DataType.OBJECT_8:
            case DataType.OBJECT_16:
            case DataType.OBJECT_32:
                this.encodeObjectToken(token, usedDataType);
                break;
            case DataType.SPLIT_8:
            case DataType.SPLIT_16:
            case DataType.SPLIT_32:
                this.encodeSplitToken(token, usedDataType);
                break;
            case DataType.ARRAY_8:
            case DataType.ARRAY_16:
            case DataType.ARRAY_32:
            case DataType.OFFSET_ARRAY_8:
            case DataType.OFFSET_ARRAY_16:
            case DataType.OFFSET_ARRAY_32:
                this.encodeArrayToken(token, usedDataType);
                break;
            default:
                throw new Error("Invalid dataType: " + usedDataType);
        }
    };
    TokenEncoder.prototype.decodeToken = function (dataType) {
        var usedDataType = dataType !== null && dataType !== void 0 ? dataType : this.decodeDataType();
        switch (usedDataType) {
            case DataType.UNDEFINED:
                return { type: "leaf", value: undefined };
            case DataType.NULL:
                return { type: "leaf", value: null };
            case DataType.BOOLEAN_TRUE:
                return { type: "leaf", value: true };
            case DataType.BOOLEAN_FALSE:
                return { type: "leaf", value: false };
            case DataType.EMPTY_ARRAY:
                return { type: "array", value: [] };
            case DataType.INT8:
            case DataType.UINT8:
            case DataType.INT16:
            case DataType.UINT16:
            case DataType.INT32:
            case DataType.UINT32:
            case DataType.FLOAT32:
            case DataType.FLOAT64:
                return { type: "leaf", value: this.decodeSingleNumber(usedDataType) };
            case DataType.STRING:
            case DataType.UNICODE:
                return { type: "leaf", value: this.decodeString(usedDataType) };
            case DataType.OBJECT_8:
            case DataType.OBJECT_16:
            case DataType.OBJECT_32:
                return this.decodeObjectToken(usedDataType);
            case DataType.SPLIT_8:
            case DataType.SPLIT_16:
            case DataType.SPLIT_32:
                return this.decodeSplitToken(usedDataType);
            case DataType.ARRAY_8:
            case DataType.ARRAY_16:
            case DataType.ARRAY_32:
            case DataType.OFFSET_ARRAY_8:
            case DataType.OFFSET_ARRAY_16:
            case DataType.OFFSET_ARRAY_32:
                return this.decodeArrayToken(usedDataType);
            default:
                throw new Error("Invalid dataType: " + usedDataType);
        }
    };
    TokenEncoder.prototype.isOffsetDataType = function (dataType) {
        return dataType === DataType.OFFSET_ARRAY_8 || dataType === DataType.OFFSET_ARRAY_16 || dataType === DataType.OFFSET_ARRAY_32;
    };
    TokenEncoder.prototype.encodeArrayToken = function (arrayToken, dataType) {
        var usedDataType = dataType !== null && dataType !== void 0 ? dataType : this.encodeDataType(this.getDataType(arrayToken));
        var numberType = usedDataType === DataType.ARRAY_8 || usedDataType === DataType.OFFSET_ARRAY_8
            ? DataType.UINT8
            : usedDataType === DataType.ARRAY_16 || usedDataType === DataType.OFFSET_ARRAY_16
                ? DataType.UINT16 : DataType.UINT32;
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
        var numberType = usedDataType === DataType.ARRAY_8 || usedDataType === DataType.OFFSET_ARRAY_8
            ? DataType.UINT8
            : usedDataType === DataType.ARRAY_16 || usedDataType === DataType.OFFSET_ARRAY_16
                ? DataType.UINT16 : DataType.UINT32;
        var indices = this.decodeNumberArray(numberType)
            .map(function (value) { return value + offset; });
        return {
            type: "array",
            value: indices
        };
    };
    TokenEncoder.prototype.encodeObjectToken = function (objectToken, dataType) {
        var usedDataType = dataType !== null && dataType !== void 0 ? dataType : this.encodeDataType(this.getDataType(objectToken));
        var numberType = usedDataType === DataType.OBJECT_8 ? DataType.UINT8 : usedDataType === DataType.OBJECT_16 ? DataType.UINT16 : DataType.UINT32;
        var _a = objectToken.value, keysIndex = _a[0], valuesIndex = _a[1];
        this.encodeSingleNumber(keysIndex, numberType);
        this.encodeSingleNumber(valuesIndex, numberType);
    };
    TokenEncoder.prototype.decodeObjectToken = function (dataType) {
        var usedDataType = dataType !== null && dataType !== void 0 ? dataType : this.decodeDataType();
        var numberType = usedDataType === DataType.OBJECT_8 ? DataType.UINT8 : usedDataType === DataType.OBJECT_16 ? DataType.UINT16 : DataType.UINT32;
        return {
            type: "object",
            value: [this.decodeSingleNumber(numberType), this.decodeSingleNumber(numberType)]
        };
    };
    TokenEncoder.prototype.encodeSplitToken = function (splitToken, dataType) {
        var usedDataType = dataType !== null && dataType !== void 0 ? dataType : this.encodeDataType(this.getDataType(splitToken));
        var numberType = usedDataType === DataType.SPLIT_8 ? DataType.UINT8 : usedDataType === DataType.SPLIT_16 ? DataType.UINT16 : DataType.UINT32;
        var _a = splitToken.value, chunksIndex = _a[0], separatorsIndex = _a[1];
        this.encodeSingleNumber(chunksIndex, numberType);
        this.encodeSingleNumber(separatorsIndex, numberType);
    };
    TokenEncoder.prototype.decodeSplitToken = function (dataType) {
        var usedDataType = dataType !== null && dataType !== void 0 ? dataType : this.decodeDataType();
        var numberType = usedDataType === DataType.SPLIT_8 ? DataType.UINT8 : usedDataType === DataType.SPLIT_16 ? DataType.UINT16 : DataType.UINT32;
        return {
            type: "split",
            value: [this.decodeSingleNumber(numberType), this.decodeSingleNumber(numberType)]
        };
    };
    TokenEncoder.prototype.encodeTag = function (tag) {
        this.streamDataView.setNextUint8(tag);
    };
    TokenEncoder.prototype.decodeTag = function () {
        return this.streamDataView.getNextUint8();
    };
    TokenEncoder.prototype.decodeTagOrDataType = function () {
        var dataType = this.streamDataView.getNextUint8();
        return dataType;
    };
    TokenEncoder.prototype.encodeDataType = function (dataType) {
        this.streamDataView.setNextUint8(dataType);
        return dataType;
    };
    TokenEncoder.prototype.decodeDataType = function () {
        return this.streamDataView.getNextUint8();
    };
    TokenEncoder.prototype.encodeMulti = function (tokens, pos) {
        var firstType = this.getDataType(tokens[pos]);
        var multiCount;
        var maxCount = Math.min(tokens.length - pos, 256);
        for (multiCount = 1; multiCount < maxCount; multiCount++) {
            if (this.getDataType(tokens[pos + multiCount]) !== firstType) {
                break;
            }
        }
        if (multiCount > 2) {
            //  encode a multi, meaning that the same type is going to get repeated multiple times
            this.encodeTag(Tag.MULTI);
            this.encodeSingleNumber(multiCount % 256, DataType.UINT8);
            this.encodeDataType(firstType);
            for (var i = 0; i < multiCount; i++) {
                this.encodeToken(tokens[pos + i], firstType);
            }
            return multiCount;
        }
        return 0;
    };
    TokenEncoder.prototype.decodeMulti = function (tag, tokens) {
        if (tag === Tag.MULTI) {
            var count = this.streamDataView.getNextUint8() || 256;
            var dataType = this.decodeDataType();
            for (var i = 0; i < count; i++) {
                var token = this.decodeToken(dataType);
                tokens.push(token);
            }
            return count;
        }
        return 0;
    };
    TokenEncoder.prototype.encodeSingleNumber = function (value, dataType) {
        var usedDataType = dataType !== null && dataType !== void 0 ? dataType : this.encodeDataType(this.getNumberDataType(value));
        switch (usedDataType) {
            case DataType.UINT8:
                this.streamDataView.setNextUint8(value);
                break;
            case DataType.INT8:
                this.streamDataView.setNextInt8(value);
                break;
            case DataType.UINT16:
                this.streamDataView.setNextUint16(value);
                break;
            case DataType.INT16:
                this.streamDataView.setNextInt16(value);
                break;
            case DataType.UINT32:
                this.streamDataView.setNextUint32(value);
                break;
            case DataType.INT32:
                this.streamDataView.setNextInt32(value);
                break;
            case DataType.FLOAT32:
                this.streamDataView.setNextFloat32(value);
                break;
            case DataType.FLOAT64:
                this.streamDataView.setNextFloat64(value);
                break;
            default:
                throw new Error("Invalid dataType for number: " + usedDataType);
        }
    };
    TokenEncoder.prototype.decodeSingleNumber = function (dataType) {
        var usedDataType = dataType !== null && dataType !== void 0 ? dataType : this.decodeDataType();
        switch (usedDataType) {
            case DataType.UINT8:
                return this.streamDataView.getNextUint8();
            case DataType.INT8:
                return this.streamDataView.getNextInt8();
            case DataType.UINT16:
                return this.streamDataView.getNextUint16();
            case DataType.INT16:
                return this.streamDataView.getNextInt16();
            case DataType.UINT32:
                return this.streamDataView.getNextUint32();
            case DataType.INT32:
                return this.streamDataView.getNextInt32();
            case DataType.FLOAT32:
                return this.streamDataView.getNextFloat32();
            case DataType.FLOAT64:
                return this.streamDataView.getNextFloat64();
            default:
                throw new Error("Invalid dataType for number: " + usedDataType);
        }
    };
    TokenEncoder.prototype.numberSatisfyDataType = function (value, dataType) {
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
    TokenEncoder.prototype.getBestType = function (array) {
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
        for (var _i = 0, NUMBER_DATA_TYPES_1 = NUMBER_DATA_TYPES; _i < NUMBER_DATA_TYPES_1.length; _i++) {
            var dataType = NUMBER_DATA_TYPES_1[_i];
            if (this.numberSatisfyDataType(min, dataType) && this.numberSatisfyDataType(max, dataType)) {
                return dataType;
            }
        }
        return DataType.FLOAT64;
    };
    TokenEncoder.prototype.encodeNumberArray = function (array, dataType) {
        var pos;
        for (pos = 0; pos < array.length;) {
            var size = Math.min(255, array.length - pos);
            this.encodeSingleNumber(size, DataType.UINT8);
            if (!size) {
                break;
            }
            var bestType = dataType !== null && dataType !== void 0 ? dataType : this.encodeDataType(this.getBestType(array));
            for (var i = 0; i < size; i++) {
                this.encodeSingleNumber(array[pos + i], bestType);
            }
            pos += size;
        }
        if (pos === 255) {
            //  Reached the max size of 255, but the next one is 0.
            this.encodeSingleNumber(0, DataType.UINT8);
        }
    };
    TokenEncoder.prototype.decodeNumberArray = function (dataType) {
        var size;
        var numbers = [];
        do {
            size = this.decodeSingleNumber(DataType.UINT8);
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
    TokenEncoder.prototype.getNumberDataType = function (value) {
        for (var _i = 0, NUMBER_DATA_TYPES_2 = NUMBER_DATA_TYPES; _i < NUMBER_DATA_TYPES_2.length; _i++) {
            var type = NUMBER_DATA_TYPES_2[_i];
            if (this.numberSatisfyDataType(value, type)) {
                return type;
            }
        }
        return DataType.UNDEFINED;
    };
    TokenEncoder.prototype.getStringDataType = function (value) {
        var letterCodes = value.split("").map(function (l) { return l.charCodeAt(0); });
        if (letterCodes.every(function (code) { return code <= 255; })) {
            return DataType.STRING;
        }
        else {
            return DataType.UNICODE;
        }
    };
    TokenEncoder.prototype.getDataType = function (token) {
        switch (token.type) {
            case "array":
            case "object":
            case "split":
                var indices = token.value;
                if (!indices.length) {
                    console.assert(token.type === "array");
                    return DataType.EMPTY_ARRAY;
                }
                var offset_2 = 0;
                if (token.type === "array" && indices.length > 3) {
                    var min = Math.min.apply(Math, indices);
                    var max = Math.max.apply(Math, indices);
                    if (this.getNumberDataType(max - min) !== this.getNumberDataType(max)) {
                        offset_2 = min;
                    }
                    indices = indices.map(function (value) { return value - offset_2; });
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
                        if (offset_2) {
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
        }
        throw new Error("Unrecognized type for ".concat(token.type, " value: ").concat(token.value));
    };
    TokenEncoder.prototype.dataTypeToType = function (dataType) {
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
            default:
                return "leaf";
        }
    };
    TokenEncoder.prototype.encodeString = function (value, dataType) {
        var _this = this;
        var letterCodes = value.split("").map(function (l) { return l.charCodeAt(0); });
        letterCodes.push(0);
        var usedDataType = dataType !== null && dataType !== void 0 ? dataType : this.encodeDataType(this.getStringDataType(value));
        var numberType = usedDataType === DataType.STRING ? DataType.UINT8 : DataType.UINT16;
        letterCodes.forEach(function (code) { return _this.encodeSingleNumber(code, numberType); });
    };
    TokenEncoder.prototype.decodeString = function (dataType) {
        var usedDataType = dataType !== null && dataType !== void 0 ? dataType : this.decodeDataType();
        var charCodes = [];
        var numberType = usedDataType === DataType.STRING ? DataType.UINT8 : DataType.UINT16;
        do {
            var code = this.decodeSingleNumber(numberType);
            if (!code) {
                break;
            }
            charCodes.push(code);
        } while (true);
        return charCodes.map(function (code) { return String.fromCharCode(code); }).join("");
    };
    TokenEncoder.selfTest = function () {
        var _this = this;
        var testers = [
            function (tokenEncoder, tokenDecoder, reset) {
                _this.testAction(DataType.STRING, function (dataType) { return tokenEncoder.encodeDataType(dataType); }, reset, function () { return tokenDecoder.decodeDataType(); });
            },
            function (tokenEncoder, tokenDecoder, reset) {
                _this.testAction(DataType.UNDEFINED, function (dataType) { return tokenEncoder.encodeDataType(dataType); }, reset, function () { return tokenDecoder.decodeDataType(); });
            },
            function (tokenEncoder, tokenDecoder, reset) {
                _this.testAction(33, function (number) { return tokenEncoder.encodeSingleNumber(number, DataType.INT8); }, reset, function () { return tokenDecoder.decodeSingleNumber(DataType.INT8); });
            },
            // (tokenEncoder, tokenDecoder, reset) => {
            //     this.testAction([
            //             { type: "leaf", value: 123 },
            //             { type: "leaf", value: 45 },
            //             { type: "leaf", value: 67 },
            //             { type: "leaf", value: 89 },
            //         ],
            //         header => tokenEncoder.encodeMulti(header, 0),
            //         reset,
            //         () => {
            //             const result: ReducedToken[] = [];
            //             tokenDecoder.decodeMulti(tokenDecoder.decodeTag(), result);
            //             return result;
            //         });
            // },
            // (tokenEncoder, tokenDecoder, reset) => {
            //     this.testAction([
            //             { type: "leaf", value: 1000001 },
            //             { type: "leaf", value: 1002000 },
            //             { type: "leaf", value: 1003001 },
            //         ],
            //         header => tokenEncoder.encodeMulti(header, 0),
            //         reset,
            //         () => {
            //             const result: ReducedToken[] = [];
            //             tokenDecoder.decodeMulti(tokenDecoder.decodeTag(), result);
            //             return result;
            //         });                
            // },
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
                _this.testAction("test-string", function (string) { return tokenEncoder.encodeString(string); }, reset, function () { return tokenDecoder.decodeString(); });
            },
            function (tokenEncoder, tokenDecoder, reset) {
                _this.testAction("test-string", function (string) { return tokenEncoder.encodeString(string, DataType.STRING); }, reset, function () { return tokenDecoder.decodeString(DataType.STRING); });
            },
            function (tokenEncoder, tokenDecoder, reset) {
                _this.testAction("test-😀😃😄😁😆", function (string) { return tokenEncoder.encodeString(string); }, reset, function () { return tokenDecoder.decodeString(); });
            },
            function (tokenEncoder, tokenDecoder, reset) {
                _this.testAction({ type: "object", value: [200, 201] }, function (o) { return tokenEncoder.encodeObjectToken(o); }, reset, function () { return tokenDecoder.decodeObjectToken(); });
            },
            function (tokenEncoder, tokenDecoder, reset) {
                _this.testAction({ type: "object", value: [2000, 2001] }, function (o) { return tokenEncoder.encodeObjectToken(o); }, reset, function () { return tokenDecoder.decodeObjectToken(); });
            },
            function (tokenEncoder, tokenDecoder, reset) {
                _this.testAction({ type: "object", value: [2000, 2001] }, function (o) { return tokenEncoder.encodeObjectToken(o, DataType.OBJECT_32); }, reset, function () { return tokenDecoder.decodeObjectToken(DataType.OBJECT_32); });
            },
            function (tokenEncoder, tokenDecoder, reset) {
                _this.testAction({ type: "split", value: [200, 201] }, function (o) { return tokenEncoder.encodeSplitToken(o); }, reset, function () { return tokenDecoder.decodeSplitToken(); });
            },
            function (tokenEncoder, tokenDecoder, reset) {
                _this.testAction({ type: "split", value: [2000, 2001] }, function (o) { return tokenEncoder.encodeSplitToken(o); }, reset, function () { return tokenDecoder.decodeSplitToken(); });
            },
            function (tokenEncoder, tokenDecoder, reset) {
                _this.testAction({ type: "split", value: [2000, 2001] }, function (o) { return tokenEncoder.encodeSplitToken(o, DataType.SPLIT_32); }, reset, function () { return tokenDecoder.decodeSplitToken(DataType.SPLIT_32); });
            },
            function (tokenEncoder, tokenDecoder, reset) {
                _this.testAction({ type: "leaf", value: "token-string" }, function (o) { return tokenEncoder.encodeToken(o); }, reset, function () { return tokenDecoder.decodeToken(); });
            },
            function (tokenEncoder, tokenDecoder, reset) {
                _this.testAction({ type: "leaf", value: 123.5 }, function (o) { return tokenEncoder.encodeToken(o); }, reset, function () { return tokenDecoder.decodeToken(); });
            },
            function (tokenEncoder, tokenDecoder, reset) {
                _this.testAction({ type: "leaf", value: "😁😆" }, function (o) { return tokenEncoder.encodeToken(o); }, reset, function () { return tokenDecoder.decodeToken(); });
            },
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
