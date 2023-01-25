import { StreamDataView } from "stream-data-view";
import { ReducedToken, Type } from "../tokenizer/Token";

enum DataType {
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
}

enum Tag {
    DONE = 100,
    MULTI = 101,
};

const NUMBER_DATA_TYPES = [
    DataType.UINT8,
    DataType.INT8,
    DataType.UINT16,
    DataType.INT16,
    DataType.UINT32,
    DataType.INT32,
    DataType.FLOAT32,
    DataType.FLOAT64,
];

type Tester = (encoder: TokenEncoder, decoder: TokenEncoder, reset: () => void) => void;

export default class TokenEncoder {
    streamDataView: StreamDataView;

    constructor(streamDataView: StreamDataView) {
        this.streamDataView = streamDataView;
    }

    encodeTokens(tokens: ReducedToken[]) {
        let pos = 0;
        while (pos < tokens.length) {
            const count = this.encodeMulti(tokens, pos);
            if (count) {
                pos += count;
            } else {
                this.encodeToken(tokens[pos]);
                pos++;
            }
        }
        this.encodeTag(Tag.DONE);
    }

    decodeTokens() {
        const tokens:  ReducedToken[] = [];
        while(this.streamDataView.getOffset() < this.streamDataView.getLength()) {
            const tagOrDataType: Tag | DataType = this.decodeTagOrDataType();
            if (tagOrDataType === Tag.DONE) {
                break;
            }
            if (tagOrDataType === Tag.MULTI) {
               this.decodeMulti(tagOrDataType, tokens);
            } else {
                const token = this.decodeToken(tagOrDataType);
                tokens.push(token);
            }
        }
        return tokens;
    }

    encodeToken(token: ReducedToken, dataType?: DataType): void {
        const usedDataType: DataType = dataType ?? this.encodeDataType(this.getDataType(token));
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
    }

    decodeToken(dataType?: DataType): ReducedToken {
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
    }

    isOffsetDataType(dataType: DataType) {
        return dataType === DataType.OFFSET_ARRAY_8 || dataType === DataType.OFFSET_ARRAY_16 || dataType === DataType.OFFSET_ARRAY_32;
    }

    encodeArrayToken(arrayToken: ReducedToken, dataType?: DataType) {
        const usedDataType = dataType ?? this.encodeDataType(this.getDataType(arrayToken));
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
        const usedDataType = dataType ?? this.encodeDataType(this.getDataType(objectToken));
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
        const usedDataType = dataType ?? this.encodeDataType(this.getDataType(splitToken));
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

    encodeTag(tag: Tag) {
        this.streamDataView.setNextUint8(tag);
    }

    decodeTag(): Tag {
        return this.streamDataView.getNextUint8();
    }

    decodeTagOrDataType(): Tag | DataType {
        const dataType = this.streamDataView.getNextUint8();
        return dataType;
    }

    encodeDataType(dataType: DataType): DataType {
        this.streamDataView.setNextUint8(dataType);
        return dataType;
    }

    decodeDataType(): DataType {
        return this.streamDataView.getNextUint8();
    }

    encodeMulti(tokens: ReducedToken[], pos: number): number {
        const firstType = this.getDataType(tokens[pos]);
        let multiCount;
        const maxCount = Math.min(tokens.length - pos, 256);
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
            for (let i = 0; i < multiCount; i++) {
                this.encodeToken(tokens[pos + i], firstType);
            }
            return multiCount;
        }
        return 0;
    }

    decodeMulti(tag: Tag, tokens: ReducedToken[]): number {
        if (tag === Tag.MULTI) {
            const count = this.streamDataView.getNextUint8() || 256;
            const dataType = this.decodeDataType();
            for (let i = 0; i < count; i++) {
                const token = this.decodeToken(dataType);
                tokens.push(token);
            }
            return count;
        }
        return 0;
    }

    encodeSingleNumber(value: number, dataType?: DataType) {
        const usedDataType = dataType ?? this.encodeDataType(this.getNumberDataType(value));

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

    encodeNumberArray(array: number[], dataType?: DataType) {
        let pos;
        for (pos = 0; pos < array.length;) {
            const size = Math.min(255, array.length - pos);
            this.encodeSingleNumber(size, DataType.UINT8);
            if (!size) {
                break;
            }

            const bestType: DataType = dataType ?? this.encodeDataType(this.getBestType(array));
    
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

    getDataType(token: ReducedToken): DataType {
        switch (token.type) {
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
        }
        throw new Error(`Unrecognized type for ${token.type} value: ${token.value}`);
    }

    dataTypeToType(dataType: DataType): Type {
        switch(dataType) {
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
    }

    encodeString(value: string, dataType?: DataType): void {
        const letterCodes = value.split("").map(l => l.charCodeAt(0));
        letterCodes.push(0);
        const usedDataType = dataType ?? this.encodeDataType(this.getStringDataType(value));
        const numberType = usedDataType === DataType.STRING ? DataType.UINT8 : DataType.UINT16;
        letterCodes.forEach(code => this.encodeSingleNumber(code, numberType));
    }

    decodeString(dataType?: DataType): string {
        const usedDataType = dataType ?? this.decodeDataType();
        const charCodes = [];
        const numberType = usedDataType === DataType.STRING ? DataType.UINT8 : DataType.UINT16;
        do {
            const code = this.decodeSingleNumber(numberType);
            if (!code) {
                break;
            }
            charCodes.push(code);
        } while(true);
        return charCodes.map(code => String.fromCharCode(code)).join("");
    }

    static selfTest() {
        const testers: Tester[] = [
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
                this.testAction("test-string",
                    string => tokenEncoder.encodeString(string),
                    reset,
                    () => tokenDecoder.decodeString());
            },
            (tokenEncoder, tokenDecoder, reset) => {
                this.testAction("test-string",
                    string => tokenEncoder.encodeString(string, DataType.STRING),
                    reset,
                    () => tokenDecoder.decodeString(DataType.STRING));
            },
            (tokenEncoder, tokenDecoder, reset) => {
                this.testAction("test-😀😃😄😁😆",
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
                this.testAction({ type: "leaf", value: "token-string" },
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
