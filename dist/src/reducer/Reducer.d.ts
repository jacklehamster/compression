import Token, { Hash, ReducedToken } from "../tokenizer/Token";
import { Header } from "../tokenizer/Header";
import { DataTypeUtils } from "../compression/DataType";
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
    dataTypeUtils: DataTypeUtils;
    constructor(debug?: boolean);
    /**
     * Reduce header with smaller tokens for storage
     *
     * @param header Represents all data that we have.
     * @returns DataStorage object that's the minimum we can store.
     */
    reduce(header: Header): DataStore;
    /**
     * Sort tokens by frequency.
     */
    private sortTokens;
    /**
     * Organize tokens in groups of 255
     * @param tokens
     */
    private organizeTokens;
    private createReducedTokens;
    /**
     *  Traverse object to produce a set of tokens used to produce a complex object
     * @param token Root token
     * @param hashToIndex Hash to index mapping
     * @param result Resulting set of tokens
     */
    createComplexObject(token: Token, hashToIndex: Record<Hash, number>, registry: Record<Hash, Token>, result: ReducedToken[]): void;
}
