import Token, { StoredToken, Type } from "../tokenizer/Token";

export enum StructureType {
    LEAF = 0,
    ARRAY = 1,
    OBJECT = 2,
    SPLIT = 3,
};

export enum DataType {
    UNDEFINED = 0,
    NULL = 1,
    BOOLEAN_FALSE = 2,
    BOOLEAN_TRUE = 3,
    INT8 = 4,
    UINT8 = 5,
    INT16 = 6,
    UINT16 = 7,
    INT32 = 8,
    UINT32 = 9,
    FLOAT32 = 10,
    FLOAT64 = 11,
    STRING = 12,
    UNICODE = 13,
    OBJECT_8 = 17,
    OBJECT_16 = 18,
    OBJECT_32 = 19,
    SPLIT_8 = 20,
    SPLIT_16 = 21,
    SPLIT_32 = 22,
    ARRAY_8 = 23,
    ARRAY_16 = 24,
    ARRAY_32 = 25,
    OFFSET_ARRAY_8 = 26,
    OFFSET_ARRAY_16 = 27,
    OFFSET_ARRAY_32 = 28,
    EMPTY_ARRAY = 29,
    REFERENCE_8 = 30,
    REFERENCE_16 = 31,
    REFERENCE_32 = 32,
    COMPLEX_OBJECT = 33,
}

export const NUMBER_DATA_TYPES = [
    DataType.UINT8,
    DataType.INT8,
    DataType.UINT16,
    DataType.INT16,
    DataType.UINT32,
    DataType.INT32,
    DataType.FLOAT32,
    DataType.FLOAT64,
];

export class DataTypeUtils {
        
    numberSatisfyDataType(value: number, dataType: DataType): boolean {
        const hasDecimal = value % 1 !== 0;
        if (hasDecimal) {
            switch(dataType) {
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
    }

    getBestType(array: number[]): DataType {
        if (array.some(number => number % 1 !== 0)) {
            //  decimal
            if (array.every(number => this.numberSatisfyDataType(number, DataType.FLOAT32))) {
                return DataType.FLOAT32;
            }
            return DataType.FLOAT64;
        }

        const min = Math.min(...array);
        const max = Math.max(...array);

        for (let dataType of NUMBER_DATA_TYPES) {
            if (this.numberSatisfyDataType(min, dataType) && this.numberSatisfyDataType(max, dataType)) {
                return dataType;
            }
        }
        return DataType.FLOAT64;
    }


    getNumberDataType(value: number): DataType {
        for (let type of NUMBER_DATA_TYPES) {
            if (this.numberSatisfyDataType(value, type)) {
                return type;
            }
        }
        return DataType.UNDEFINED;
    }

    getStringDataType(value: string): DataType {
        const letterCodes = value.split("").map(l => l.charCodeAt(0));
        if (letterCodes.every(code => code <= 255)) {
            return DataType.STRING;
        } else {
            return DataType.UNICODE;
        }    
    }

    getFullTokenDataType(token: Token): DataType {
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
    }

    getDataType(token: StoredToken): DataType {
        switch (token.type) {
            case "complex":
                return DataType.COMPLEX_OBJECT;
            case "array":
            case "object":
            case "split":
                let indices: number[] = token.value;
                if (!indices.length) {
                    console.assert(token.type === "array");
                    return DataType.EMPTY_ARRAY;
                }
                let offset = 0;
                if (token.type === "array" && indices.length > 3) {
                    const min = Math.min(...indices);
                    const max = Math.max(...indices);
                    if (this.getNumberDataType(max - min) !== this.getNumberDataType(max)) {
                        offset = min;
                    }
                    indices = indices.map(value => value - offset);
                }
                const bestType: DataType = this.getBestType(indices);
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
                        if (offset) {
                            return bestType === DataType.UINT8
                                ? DataType.OFFSET_ARRAY_8
                                : bestType === DataType.UINT16
                                ? DataType.OFFSET_ARRAY_16
                                : DataType.OFFSET_ARRAY_32;
                        } else {
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
                } else if (token.value === null) {
                    return DataType.NULL;
                } else {
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
                switch(this.getNumberDataType(token.value)) {
                    case DataType.UINT8:
                        return DataType.REFERENCE_8;
                    case DataType.UINT16:
                        return DataType.REFERENCE_16;
                    case DataType.UINT32:
                        return DataType.REFERENCE_32;
                }
                throw new Error("Invalid reference value: " + token.value);
        }
        throw new Error(`Unrecognized type for ${token.type} value: ${token.value}`);
    }

    dataTypeToType(dataType: DataType): Type {
        switch(dataType) {
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
    }

    typeToStructureType(type: Type): StructureType {
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
    }
}