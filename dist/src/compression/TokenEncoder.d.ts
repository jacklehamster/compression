import { StreamDataView } from "stream-data-view";
import { ReducedToken } from "../tokenizer/Token";
import { DataType, DataTypeUtils } from "./DataType";
interface MultiInfo {
    lastStringLength?: number;
}
export default class TokenEncoder {
    streamDataView: StreamDataView;
    dataTypeUtils: DataTypeUtils;
    constructor(streamDataView: StreamDataView);
    encodeTokens(tokens: ReducedToken[]): void;
    decodeTokens(): ReducedToken[];
    encodeToken(token: ReducedToken, dataType?: DataType, multiInfo?: MultiInfo): void;
    decodeToken(dataType?: DataType, multiInfo?: MultiInfo): ReducedToken;
    isOffsetDataType(dataType: DataType): boolean;
    encodeArrayToken(arrayToken: ReducedToken, dataType?: DataType): void;
    decodeArrayToken(dataType?: DataType): ReducedToken;
    encodeObjectToken(objectToken: ReducedToken, dataType?: DataType): void;
    decodeObjectToken(dataType?: DataType): ReducedToken;
    encodeSplitToken(splitToken: ReducedToken, dataType?: DataType): void;
    decodeSplitToken(dataType?: DataType): ReducedToken;
    encodeDataType(dataType: DataType): DataType;
    decodeDataType(): DataType;
    encodeMulti(tokens: ReducedToken[], pos: number): number;
    decodeMulti(tokens: ReducedToken[]): number;
    encodeSingleNumber(value: number, dataType?: DataType): void;
    decodeSingleNumber(dataType?: DataType): number;
    encodeNumberArray(array: number[], dataType?: DataType): void;
    decodeNumberArray(dataType?: DataType): number[];
    encodeString(value: string, dataType?: DataType, multiInfo?: MultiInfo): void;
    decodeString(dataType?: DataType, multiInfo?: MultiInfo): string;
    static selfTest(): void;
    private static testAction;
}
export {};
