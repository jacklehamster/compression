import { StreamDataView } from "stream-data-view";
import { ReducedToken, Type } from "../tokenizer/Token";
declare enum DataType {
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
    EMPTY_ARRAY = 29
}
declare enum Tag {
    DONE = 100,
    MULTI = 101
}
export default class TokenEncoder {
    streamDataView: StreamDataView;
    constructor(streamDataView: StreamDataView);
    encodeTokens(tokens: ReducedToken[]): void;
    decodeTokens(): ReducedToken[];
    encodeToken(token: ReducedToken, dataType?: DataType): void;
    decodeToken(dataType?: DataType): ReducedToken;
    isOffsetDataType(dataType: DataType): boolean;
    encodeArrayToken(arrayToken: ReducedToken, dataType?: DataType): void;
    decodeArrayToken(dataType?: DataType): ReducedToken;
    encodeObjectToken(objectToken: ReducedToken, dataType?: DataType): void;
    decodeObjectToken(dataType?: DataType): ReducedToken;
    encodeSplitToken(splitToken: ReducedToken, dataType?: DataType): void;
    decodeSplitToken(dataType?: DataType): ReducedToken;
    encodeTag(tag: Tag): void;
    decodeTag(): Tag;
    decodeTagOrDataType(): Tag | DataType;
    encodeDataType(dataType: DataType): DataType;
    decodeDataType(): DataType;
    encodeMulti(tokens: ReducedToken[], pos: number): number;
    decodeMulti(tag: Tag, tokens: ReducedToken[]): number;
    encodeSingleNumber(value: number, dataType?: DataType): void;
    decodeSingleNumber(dataType?: DataType): number;
    numberSatisfyDataType(value: number, dataType: DataType): boolean;
    getBestType(array: number[]): DataType;
    encodeNumberArray(array: number[], dataType?: DataType): void;
    decodeNumberArray(dataType?: DataType): number[];
    getNumberDataType(value: number): DataType;
    getStringDataType(value: string): DataType;
    getDataType(token: ReducedToken): DataType;
    dataTypeToType(dataType: DataType): Type;
    encodeString(value: string, dataType?: DataType): void;
    decodeString(dataType?: DataType): string;
    static selfTest(): void;
    private static testAction;
}
export {};
