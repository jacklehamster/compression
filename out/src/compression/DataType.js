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
    DataType[DataType["REFERENCE_8"] = 30] = "REFERENCE_8";
    DataType[DataType["REFERENCE_16"] = 31] = "REFERENCE_16";
    DataType[DataType["REFERENCE_32"] = 32] = "REFERENCE_32";
    DataType[DataType["COMPLEX_OBJECT"] = 33] = "COMPLEX_OBJECT";
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
    return DataTypeUtils;
}());
exports.DataTypeUtils = DataTypeUtils;
