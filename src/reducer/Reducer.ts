import Token, { Hash, ReducedToken, StoredToken } from "../tokenizer/Token";
import { Header } from "../tokenizer/Header";
import { DataType, DataTypeUtils } from "../compression/DataType";

/**
 * Stores all information needed to extract data.
 * 
 * headerTokens: Common tokens used by all files.
 * files: array of indices that should match to string tokens within headerTokens.
 * getDataTokens: function to retrieve the tokens for each file. Pass the index that corresponds with files.
 */
export interface DataStore {
    version?: string;
    compressedSize?: number;
    originalDataSize?: number;
    headerTokens: ReducedToken[];
    files: number[];
    getDataTokens(index: number): ReducedToken[] | undefined;
}

/**
 * Reduce header from using large tokens to reduce tokens.
 */
export default class Reducer {
    debug: boolean;
    dataTypeUtils: DataTypeUtils = new DataTypeUtils();

    constructor(debug?: boolean) {
        this.debug = debug ?? false;
    }

    /**
     * Reduce header with smaller tokens for storage
     * 
     * @param header Represents all data that we have.
     * @returns DataStorage object that's the minimum we can store.
     */
    reduce(header: Header): DataStore {
        const hashToIndex : Record<Hash, number>  = {};
        //  start with header tokens
        const headerTokens = this.createReducedTokens(
            Object.values(header.registry)
                .filter(token => token.files.size > 1 || token.files.has("header")),
            hashToIndex);

        //  save files
        const fileEntries = Object.entries(header.files).sort(([name1], [name2]) => name1.localeCompare(name2));
        const files = fileEntries.map(([,token]) => hashToIndex[token.nameToken.hash]);

        //  save all files separately
        const dataTokens = fileEntries.map(([file, {token: root}]) => {
            const subHashToIndex = {...hashToIndex};
            const tokens = Object.values(header.registry).filter(token => token.files.has(file) && token !== root);
            return this.createReducedTokens(tokens, subHashToIndex, headerTokens.length).concat(this.createReducedTokens([root], subHashToIndex, headerTokens.length));
        });

        return {
            originalDataSize: header.originalDataSize,
            headerTokens,
            files,
            getDataTokens: (index: number) => dataTokens[index],
        };
    }

    /**
     * Sort tokens by frequency.
     */
    private sortTokens(tokens: Token[]): void {
        tokens.sort((t1, t2) => t2.count - t1.count);
    }

    /**
     * Organize tokens in groups of 255
     * @param tokens 
     */
    private organizeTokens(tokens: Token[]): Token[] {
        if (!tokens.length) {
            return tokens;
        }
        const buckets: Token[][] = [];
        tokens.forEach(token => {
            const dataType = this.dataTypeUtils.getFullTokenDataType(token);
            let bucket: Token[] | undefined = undefined;
            for (let b of buckets) {
                if (b.length < 255 && this.dataTypeUtils.getFullTokenDataType(b[0]) === dataType) {
                    bucket = b;
                    break;
                }
            }
            if (!bucket) {
                bucket = [];
                buckets.push(bucket);
            }
            bucket.push(token);
        });

        buckets.forEach(bucket => {
            const dataType = this.dataTypeUtils.getFullTokenDataType(bucket[0]);
            switch (dataType) {
                case DataType.UINT8:
                case DataType.UINT16:
                case DataType.UINT32:
                case DataType.INT8:
                case DataType.INT16:
                case DataType.INT32:
                case DataType.FLOAT32:
                case DataType.FLOAT64:
                    bucket.sort((a, b) => b.value - a.value);
                    break;
                case DataType.STRING:
                case DataType.UNICODE:
                    bucket.sort((a, b) => b.value.length - a.value.length);
                    break;
                case DataType.ARRAY_8:
                case DataType.ARRAY_16:
                case DataType.ARRAY_32:
                    bucket.sort((a, b) => b.value.length - a.value.length)
                    break;
            }
        });
        const resultTokens: Token[] = [];
        buckets.forEach(bucket => bucket.forEach(token => resultTokens.push(token)));
        return resultTokens;
    }

    private createReducedTokens(tokens: Token[], hashToIndex : Record<Hash, number>, offset: number = 0) {
        this.sortTokens(tokens);
        const organizedTokens = this.organizeTokens(tokens);

        organizedTokens.forEach(({hash}, index) => hashToIndex[hash] = index + offset);

        return organizedTokens.map(token => ({
            type: token.type,
            value: token.reference?.map(hash => hashToIndex[hash]) ?? token.value,
            ...this.debug ? { debug: token.value } : {},
        }));
    }

    /**
     *  Traverse object to produce a set of tokens used to produce a complex object
     * @param token Root token
     * @param hashToIndex Hash to index mapping
     * @param result Resulting set of tokens
     */
    createComplexObject(token: Token, hashToIndex: Record<Hash, number>, registry: Record<Hash, Token>, result: ReducedToken[]): void {
        if (hashToIndex[token.hash] >= 0) {
            result.push({ type: "reference", value: hashToIndex[token.hash] });
        } else if (token.type === "leaf") {
            if (token.count > 1) {
                const index = result.length;
                hashToIndex[token.hash] = index;
            }
            result.push({ type: token.type, value: token.value });
        } else if (token.type === "split" || token.type === "object" || token.type === "array") {
            if (token.count > 1) {
                const index = result.length;
                hashToIndex[token.hash] = index;
            }
            result.push({ type: token.type, value: undefined });
            const subTokens = token.reference?.map((hash) => registry[hash]);
            subTokens?.forEach(token => {
                this.createComplexObject(token, hashToIndex, registry, result);
            });
        } else {
            throw new Error("Invalid token type");
        }
    }
}