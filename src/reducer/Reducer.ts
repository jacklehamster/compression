import Token, { Hash, ReducedToken } from "../tokenizer/Token";
import { Header } from "../tokenizer/Header";

export default class Reducer {
    debug: boolean;

    constructor(debug?: boolean) {
        this.debug = debug ?? false;
    }

    reduce(header: Header) {
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
            headerTokens,
            files,
            dataTokens,
        };
    }

    private createReducedTokens(tokens: Token[], hashToIndex : Record<Hash, number>, offset: number = 0) {
        const sortedTokens = tokens.sort((t1, t2) => t2.count - t1.count);

        sortedTokens.forEach(({hash}, index) => {
            hashToIndex[hash] = index + offset;
        });

        return sortedTokens.map(token => ({
            type: token.type,
            value: token.reference?.map(hash => hashToIndex[hash]) ?? token.value,
            ...this.debug ? { debug: token.value } : {},
        }));
    }
}