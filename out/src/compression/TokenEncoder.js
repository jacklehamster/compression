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
