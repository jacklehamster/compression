import { Header } from "../tokenizer/Header";
export default class Reducer {
    debug: boolean;
    constructor(debug?: boolean);
    reduce(header: Header): {
        headerTokens: {
            debug?: any;
            type: import("../tokenizer/Token").Type;
            value: any;
        }[];
        files: number[];
        dataTokens: {
            debug?: any;
            type: import("../tokenizer/Token").Type;
            value: any;
        }[][];
    };
    private createReducedTokens;
}
