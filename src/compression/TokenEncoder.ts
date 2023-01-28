//18033
import { StreamDataView } from "stream-data-view";
import { ReducedToken } from "../tokenizer/Token";
import { DataType, DataTypeUtils } from "./DataType";

type Tester = (encoder: TokenEncoder, decoder: TokenEncoder, reset: () => void) => void;

interface MultiInfo {
    lastStringLength?: number;
}

export default class TokenEncoder {
    streamDataView: StreamDataView;
    dataTypeUtils: DataTypeUtils = new DataTypeUtils();

    constructor(streamDataView: StreamDataView) {
        this.streamDataView = streamDataView;
    }

    encodeTokens(tokens: ReducedToken[]) {
        let pos = 0;
        while (pos < tokens.length) {
            const count = this.encodeMulti(tokens, pos);
            if (count) {
                pos += count;
            }
        }
        this.encodeMulti([], pos);
    }

    decodeTokens() {
        const tokens:  ReducedToken[] = [];
        while(this.streamDataView.getOffset() < this.streamDataView.getLength()) {
            if (!this.decodeMulti(tokens)) {
                break;
            }
        }
        return tokens;
    }

    encodeToken(token: ReducedToken, dataType?: DataType, multiInfo?: MultiInfo): void {
        const usedDataType: DataType = dataType ?? this.encodeDataType(this.dataTypeUtils.getDataType(token));
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
                this.encodeString(token.value, usedDataType, multiInfo);
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
    }

    decodeToken(dataType?: DataType, multiInfo?: MultiInfo): ReducedToken {
        const usedDataType = dataType ?? this.decodeDataType();
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
                return { type: "leaf", value: this.decodeString(usedDataType, multiInfo) };
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
    }

    isOffsetDataType(dataType: DataType) {
        return dataType === DataType.OFFSET_ARRAY_8 || dataType === DataType.OFFSET_ARRAY_16 || dataType === DataType.OFFSET_ARRAY_32;
    }

    encodeArrayToken(arrayToken: ReducedToken, dataType?: DataType) {
        const usedDataType = dataType ?? this.encodeDataType(this.dataTypeUtils.getDataType(arrayToken));
        const numberType = usedDataType === DataType.ARRAY_8 || usedDataType === DataType.OFFSET_ARRAY_8
            ? DataType.UINT8
            : usedDataType === DataType.ARRAY_16 || usedDataType === DataType.OFFSET_ARRAY_16
            ? DataType.UINT16 : DataType.UINT32;

        let indices = arrayToken.value;
        if (this.isOffsetDataType(usedDataType)) {
            const offset = Math.min(...indices);
            indices = indices.map((value: number) => value - offset);
            this.encodeSingleNumber(offset);
        }

        this.encodeNumberArray(indices, numberType);
    }

    decodeArrayToken(dataType?: DataType): ReducedToken {
        const usedDataType = dataType ?? this.decodeDataType();

        let offset = 0;
        if (this.isOffsetDataType(usedDataType)) {
            offset = this.decodeSingleNumber();
        }

        const numberType = usedDataType === DataType.ARRAY_8 || usedDataType === DataType.OFFSET_ARRAY_8
            ? DataType.UINT8
            : usedDataType === DataType.ARRAY_16 || usedDataType === DataType.OFFSET_ARRAY_16
            ? DataType.UINT16 : DataType.UINT32;
        const indices = this.decodeNumberArray(numberType)
            .map(value => value + offset);
        return {
            type: "array",
            value: indices,
        }
    }

    encodeObjectToken(objectToken: ReducedToken, dataType?: DataType) {
        const usedDataType = dataType ?? this.encodeDataType(this.dataTypeUtils.getDataType(objectToken));
        const numberType = usedDataType === DataType.OBJECT_8 ? DataType.UINT8 : usedDataType === DataType.OBJECT_16 ? DataType.UINT16 : DataType.UINT32;
        const [keysIndex, valuesIndex] = objectToken.value;
        this.encodeSingleNumber(keysIndex, numberType);
        this.encodeSingleNumber(valuesIndex, numberType);
    }

    decodeObjectToken(dataType?: DataType): ReducedToken {
        const usedDataType = dataType ?? this.decodeDataType();
        const numberType = usedDataType === DataType.OBJECT_8 ? DataType.UINT8 : usedDataType === DataType.OBJECT_16 ? DataType.UINT16 : DataType.UINT32;
        return {
            type: "object",
            value: [this.decodeSingleNumber(numberType), this.decodeSingleNumber(numberType)],
        };
    }

    encodeSplitToken(splitToken: ReducedToken, dataType?: DataType) {
        const usedDataType = dataType ?? this.encodeDataType(this.dataTypeUtils.getDataType(splitToken));
        const numberType = usedDataType === DataType.SPLIT_8 ? DataType.UINT8 : usedDataType === DataType.SPLIT_16 ? DataType.UINT16 : DataType.UINT32;
        const [chunksIndex, separatorsIndex] = splitToken.value;
        this.encodeSingleNumber(chunksIndex, numberType);
        this.encodeSingleNumber(separatorsIndex, numberType);
    }

    decodeSplitToken(dataType?: DataType): ReducedToken {
        const usedDataType = dataType ?? this.decodeDataType();
        const numberType = usedDataType === DataType.SPLIT_8 ? DataType.UINT8 : usedDataType === DataType.SPLIT_16 ? DataType.UINT16 : DataType.UINT32;
        return {
            type: "split",
            value: [this.decodeSingleNumber(numberType), this.decodeSingleNumber(numberType)],
        };
    }

    encodeDataType(dataType: DataType): DataType {
        this.streamDataView.setNextUint8(dataType);
        return dataType;
    }

    decodeDataType(): DataType {
        return this.streamDataView.getNextUint8();
    }

    encodeMulti(tokens: ReducedToken[], pos: number): number {
        if (pos >= tokens.length) {
            this.encodeSingleNumber(0, DataType.UINT8);
            return 0;
        }
        const firstType = this.dataTypeUtils.getDataType(tokens[pos]);
        let multiCount;
        const maxCount = Math.min(tokens.length - pos, 255);
        for (multiCount = 1; multiCount < maxCount; multiCount++) {
            if (this.dataTypeUtils.getDataType(tokens[pos + multiCount]) !== firstType) {
                break;
            }
        }
        //  encode a multi, meaning that the same type is going to get repeated multiple times
        this.encodeSingleNumber(multiCount, DataType.UINT8);
        this.encodeDataType(firstType);
        const multiInfo: MultiInfo = {};
        for (let i = 0; i < multiCount; i++) {
            this.encodeToken(tokens[pos + i], firstType, multiInfo);
        }
        return multiCount;
    }

    decodeMulti(tokens: ReducedToken[]): number {
        const count = this.streamDataView.getNextUint8();
        if (!count) {
            return 0;
        }
        const dataType = this.decodeDataType();
        const multiInfo: MultiInfo = {};
        for (let i = 0; i < count; i++) {
            const token = this.decodeToken(dataType, multiInfo);
            tokens.push(token);
        }
        return count;
    }

    encodeSingleNumber(value: number, dataType?: DataType) {
        const usedDataType = dataType ?? this.encodeDataType(this.dataTypeUtils.getNumberDataType(value));

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
    }

    decodeSingleNumber(dataType?: DataType): number {
        const usedDataType = dataType ?? this.decodeDataType();

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
    }
    
    encodeNumberArray(array: number[], dataType?: DataType) {
        let pos;
        for (pos = 0; pos < array.length;) {
            const size = Math.min(255, array.length - pos);
            this.encodeSingleNumber(size, DataType.UINT8);
            if (!size) {
                break;
            }

            const bestType: DataType = dataType ?? this.encodeDataType(this.dataTypeUtils.getBestType(array));
    
            for (let i = 0; i < size; i++) {
                this.encodeSingleNumber(array[pos + i], bestType);
            }

            pos += size;
        }
        if (pos === 255) {
            //  Reached the max size of 255, but the next one is 0.
            this.encodeSingleNumber(0, DataType.UINT8);
        }
    }

    decodeNumberArray(dataType?: DataType): number[] {
        let size;
        const numbers = [];
        do {
            size = this.decodeSingleNumber(DataType.UINT8);
            if (!size) {
                break;
            }

            const type: DataType = dataType ?? this.decodeDataType();
            for (let i = 0; i < size; i++) {
                numbers.push(this.decodeSingleNumber(type));
            }

        } while (size >= 255);
        return numbers;
    }

    encodeString(value: string, dataType?: DataType, multiInfo?: MultiInfo): void {
        const letterCodes = value.split("").map(l => l.charCodeAt(0));
        // const min = Math.min(...letterCodes);
        if (!multiInfo || multiInfo.lastStringLength !== value.length) {
            letterCodes.push(0);
        }
        // console.log(letterCodes, value, (letterCodes).map((value) => !value ? 0 : value - min + 1));
        const usedDataType = dataType ?? this.encodeDataType(this.dataTypeUtils.getStringDataType(value));
        const numberType = usedDataType === DataType.STRING ? DataType.UINT8 : DataType.UINT16;
        letterCodes.forEach(code => this.encodeSingleNumber(code, numberType));
        if (multiInfo) {
            multiInfo.lastStringLength = value.length;
        }
    }

    decodeString(dataType?: DataType, multiInfo?: MultiInfo): string {
        const usedDataType = dataType ?? this.decodeDataType();
        const charCodes = [];
        const numberType = usedDataType === DataType.STRING ? DataType.UINT8 : DataType.UINT16;
        do {
            const code = this.decodeSingleNumber(numberType);
            if (!code) {
                break;
            }
            charCodes.push(code);
            if (multiInfo?.lastStringLength && charCodes.length >= multiInfo?.lastStringLength) {
                break;
            }
        } while(true);
        const string = charCodes.map(code => String.fromCharCode(code)).join("");
        if (multiInfo) {
            multiInfo.lastStringLength = string.length;
        }
        return string;
    }

    static selfTest() {
        const testers: Tester[] = [
            //  0
            (tokenEncoder, tokenDecoder, reset) => {
                this.testAction(DataType.STRING,
                    dataType => tokenEncoder.encodeDataType(dataType),
                    reset,
                    () => tokenDecoder.decodeDataType(),
                );
            },
            (tokenEncoder, tokenDecoder, reset) => {
                this.testAction(DataType.UNDEFINED,
                    dataType => tokenEncoder.encodeDataType(dataType),
                    reset,
                    () => tokenDecoder.decodeDataType(),
                );
            },
            (tokenEncoder, tokenDecoder, reset) => {
                this.testAction(33,
                    number => tokenEncoder.encodeSingleNumber(number, DataType.INT8),
                    reset,
                    () => tokenDecoder.decodeSingleNumber(DataType.INT8));
            },
            (tokenEncoder, tokenDecoder, reset) => {
                this.testAction([
                        { type: "leaf", value: 123 },
                        { type: "leaf", value: 45 },
                        { type: "leaf", value: 67 },
                        { type: "leaf", value: 89 },
                    ],
                    header => tokenEncoder.encodeMulti(header, 0),
                    reset,
                    () => {
                        const result: ReducedToken[] = [];
                        tokenDecoder.decodeMulti(result);
                        return result;
                    });
            },
            (tokenEncoder, tokenDecoder, reset) => {
                this.testAction([
                        { type: "leaf", value: 1000001 },
                        { type: "leaf", value: 1002000 },
                        { type: "leaf", value: 1003001 },
                    ],
                    header => tokenEncoder.encodeMulti(header, 0),
                    reset,
                    () => {
                        const result: ReducedToken[] = [];
                        tokenDecoder.decodeMulti(result);
                        return result;
                    });                
            },
            //  5
            (tokenEncoder, tokenDecoder, reset) => {
                this.testAction([1, 2, 3, 4, 10, 20, 200],
                    array => tokenEncoder.encodeNumberArray(array),
                    reset,
                    () => tokenDecoder.decodeNumberArray());
            },
            (tokenEncoder, tokenDecoder, reset) => {
                this.testAction(new Array(2000).fill(null).map((_,index) => index),
                    array => tokenEncoder.encodeNumberArray(array),
                    reset,
                    () => tokenDecoder.decodeNumberArray());
            },
            (tokenEncoder, tokenDecoder, reset) => {
                this.testAction([10000, -202, 3, 4, 10, 20, 3200],
                    array => tokenEncoder.encodeNumberArray(array),
                    reset,
                    () => tokenDecoder.decodeNumberArray());
            },
            (tokenEncoder, tokenDecoder, reset) => {
                this.testAction("teststring",
                    string => tokenEncoder.encodeString(string),
                    reset,
                    () => tokenDecoder.decodeString());
            },
            (tokenEncoder, tokenDecoder, reset) => {
                this.testAction("teststring",
                    string => tokenEncoder.encodeString(string, DataType.STRING),
                    reset,
                    () => tokenDecoder.decodeString(DataType.STRING));
            },
            //  10
            (tokenEncoder, tokenDecoder, reset) => {
                this.testAction("test😀😃😄😁😆",
                    string => tokenEncoder.encodeString(string),
                    reset,
                    () => tokenDecoder.decodeString());
            },
            (tokenEncoder, tokenDecoder, reset) => {
                this.testAction({ type: "object", value: [200, 201] },
                    o => tokenEncoder.encodeObjectToken(o),
                    reset,
                    () => tokenDecoder.decodeObjectToken());
            },
            (tokenEncoder, tokenDecoder, reset) => {
                this.testAction({ type: "object", value: [2000, 2001] },
                    o => tokenEncoder.encodeObjectToken(o),
                    reset,
                    () => tokenDecoder.decodeObjectToken());
            },
            (tokenEncoder, tokenDecoder, reset) => {
                this.testAction({ type: "object", value: [2000, 2001] },
                    o => tokenEncoder.encodeObjectToken(o, DataType.OBJECT_32),
                    reset,
                    () => tokenDecoder.decodeObjectToken(DataType.OBJECT_32));
            },
            (tokenEncoder, tokenDecoder, reset) => {
                this.testAction({ type: "split", value: [200, 201] },
                    o => tokenEncoder.encodeSplitToken(o),
                    reset,
                    () => tokenDecoder.decodeSplitToken());
            },
            //  15
            (tokenEncoder, tokenDecoder, reset) => {
                this.testAction({ type: "split", value: [2000, 2001] },
                    o => tokenEncoder.encodeSplitToken(o),
                    reset,
                    () => tokenDecoder.decodeSplitToken());
            },
            (tokenEncoder, tokenDecoder, reset) => {
                this.testAction({ type: "split", value: [2000, 2001] },
                    o => tokenEncoder.encodeSplitToken(o, DataType.SPLIT_32),
                    reset,
                    () => tokenDecoder.decodeSplitToken(DataType.SPLIT_32));
            },
            (tokenEncoder, tokenDecoder, reset) => {
                this.testAction({ type: "leaf", value: "tokenstring" },
                    o => tokenEncoder.encodeToken(o),
                    reset,
                    () => tokenDecoder.decodeToken());
            },
            (tokenEncoder, tokenDecoder, reset) => {
                this.testAction({ type: "leaf", value: 123.5 },
                    o => tokenEncoder.encodeToken(o),
                    reset,
                    () => tokenDecoder.decodeToken());
            },
            (tokenEncoder, tokenDecoder, reset) => {
                this.testAction({ type: "leaf", value: "😁😆" },
                    o => tokenEncoder.encodeToken(o),
                    reset,
                    () => tokenDecoder.decodeToken());
            },
            //  20
            (tokenEncoder, tokenDecoder, reset) => {
                this.testAction({ type: "array", value: [1, 10, 20, 30, 200] },
                    o => tokenEncoder.encodeToken(o),
                    reset,
                    () => tokenDecoder.decodeToken());
            },
            (tokenEncoder, tokenDecoder, reset) => {
                this.testAction({ type: "array", value: [1001, 1010, 1020, 1030, 1200] },
                    o => tokenEncoder.encodeToken(o),
                    reset,
                    () => tokenDecoder.decodeToken());
            },
            (tokenEncoder, tokenDecoder, reset) => {
                this.testAction({ type: "array", value: [10010, 10100, 10300, 20000] },
                    o => tokenEncoder.encodeToken(o),
                    reset,
                    () => tokenDecoder.decodeToken());
            },
            (tokenEncoder, tokenDecoder, reset) => {
                this.testAction({ type: "array", value: [10010, 10100, 10000] },
                    o => tokenEncoder.encodeToken(o),
                    reset,
                    () => tokenDecoder.decodeToken());
            },
            (tokenEncoder, tokenDecoder, reset) => {
                this.testAction({ type: "array", value: new Array(260).fill(null).map((_,index) => index) },
                    o => tokenEncoder.encodeToken(o),
                    reset,
                    () => tokenDecoder.decodeToken());
            },
            //  25
            (tokenEncoder, tokenDecoder, reset) => {
                this.testAction(new Array(100).fill(null).map((_,index) => {
                    const token: ReducedToken = {
                        type: "array",
                        value: new Array(index).fill(null).map((_, index) => index),
                    };
                    return token;
                }),
                    o => tokenEncoder.encodeTokens(o),
                    reset,
                    () => tokenDecoder.decodeTokens());
            },
            (tokenEncoder, tokenDecoder, reset) => {
                this.testAction(new Array(260).fill(null).map((_,index) => {
                    const token: ReducedToken = {
                        type: "array",
                        value: new Array(index).fill(null).map((_, index) => index),
                    };
                    return token;
                }),
                    o => tokenEncoder.encodeTokens(o),
                    reset,
                    () => tokenDecoder.decodeTokens());
            },
            (tokenEncoder, tokenDecoder, reset) => {
                this.testAction(new Array(260).fill(null).map((_,index) => {
                    const token: ReducedToken = {
                        type: "array",
                        value: [1],
                    };
                    return token;
                }),
                    o => tokenEncoder.encodeTokens(o),
                    reset,
                    () => tokenDecoder.decodeTokens());
            },
        ];

        testers.forEach((tester, index) => {
            const streamDataView = new StreamDataView();
            const encoder = new TokenEncoder(streamDataView);
            const decoder = new TokenEncoder(streamDataView);
            const reset = () => streamDataView.resetOffset();
            tester(encoder, decoder, reset);
            console.info(`✅ Passed test ${index}.`);
        });
    }

    private static testAction<T>(
            value: T,
            encode: (value: T) => any,
            reset: () => void,
            decode: () => T,
            check: (result: T, value: T) => void = (result, value) => console.assert(JSON.stringify(result) === JSON.stringify(value), `Not equal: \n%s\n!==\n%s`, JSON.stringify(result), JSON.stringify(value))) {
        encode(value);
        reset();
        const decoded = decode();
        reset();
        check(decoded, value);
    }
}
