import { ReducedToken } from "../tokenizer/Token";
import { Header } from "../tokenizer/Header";
/**
 * Stores all information needed to extract data.
 *
 * headerTokens: Common tokens used by all files.
 * files: array of indices that should match to string tokens within headerTokens.
 * getDataTokens: function to retrieve the tokens for each file. Pass the index that corresponds with files.
 */
export interface DataStore {
    headerTokens: ReducedToken[];
    files: number[];
    getDataTokens(index: number): ReducedToken[] | undefined;
}
/**
 * Reduce header from using large tokens to reduce tokens.
 */
export default class Reducer {
    debug: boolean;
    constructor(debug?: boolean);
    /**
     * Reduce header with smaller tokens for storage
     *
     * @param header Represents all data that we have.
     * @returns DataStorage object that's the minimum we can store.
     */
    reduce(header: Header): DataStore;
    private createReducedTokens;
}
