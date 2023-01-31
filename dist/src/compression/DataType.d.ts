import Token, { StoredToken, Type } from "../tokenizer/Token";
export declare enum StructureType {
    LEAF = 0,
    ARRAY = 1,
    OBJECT = 2,
    SPLIT = 3
}
export declare enum DataType {
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
    UINT2 = 34,
    UINT4 = 35,
    STRING2 = 36,
    STRING4 = 37
}
export declare const NUMBER_DATA_TYPES: DataType[];
export declare class DataTypeUtils {
    allowSet: boolean;
    constructor(allowSet: boolean);
    numberSatisfyDataType(value: number, dataType: DataType): boolean;
    getBestType(array: number[]): DataType;
    getNumberDataType(value: number): DataType;
    getStringDataType(value: string, noSet?: boolean): DataType;
    getFullTokenDataType(token: Token): DataType;
    getDataType(token: StoredToken): DataType;
    dataTypeToType(dataType: DataType): Type;
    typeToStructureType(type: Type): StructureType;
}
