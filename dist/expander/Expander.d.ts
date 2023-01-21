import { ReducedToken } from "../tokenizer/Token";
export default class Expander {
    expandFileNames(files: number[], headerTokens: ReducedToken[]): any[];
    expand(headerTokens: ReducedToken[], dataTokens: ReducedToken[]): any;
    private expandToken;
}
