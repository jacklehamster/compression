import { ReducedToken } from "../tokenizer/Token";
import { Header } from "../tokenizer/Header";
export interface DataStore {
    headerTokens: ReducedToken[];
    files: number[];
    getDataTokens(index: number): ReducedToken[] | undefined;
}
export default class Reducer {
    debug: boolean;
    constructor(debug?: boolean);
    reduce(header: Header): DataStore;
    private createReducedTokens;
}
