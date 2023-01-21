import { ReducedToken } from "../tokenizer/Token";

export default class Expander {
    expandFileNames(files: number[], headerTokens: ReducedToken[]) {
        return files.map(index => this.expandToken(index, headerTokens));
    }

    expand(headerTokens: ReducedToken[], dataTokens: ReducedToken[]) {
        return this.expandToken(headerTokens.length + dataTokens.length - 1, headerTokens, dataTokens);
    }

    private expandToken(index: number, headerTokens: ReducedToken[], dataTokens?: ReducedToken[]): any {
        const token = index < headerTokens.length ? headerTokens[index] : dataTokens?.[index - headerTokens.length];
        switch(token?.type) {
            case "leaf":
                return token.value;
            case "array":
                if (!Array.isArray(token.value)) {
                    throw new Error("Invalid array token");
                }
                return token.value.map(index => this.expandToken(index, headerTokens, dataTokens));
            case "object":
                const [keyIndex, valueIndex] = token.value;
                const keys: string[] = this.expandToken(keyIndex, headerTokens, dataTokens);
                const values = this.expandToken(valueIndex, headerTokens, dataTokens);
                return Object.fromEntries(keys.map((key, index) => [key, values[index]]));
            case "split":
                const [chunksIndex, separatorsIndex] = token.value;
                const chunks: string[] = this.expandToken(chunksIndex, headerTokens, dataTokens);
                const separators: string[] = this.expandToken(separatorsIndex, headerTokens, dataTokens);
                return chunks.map((chunk, index) => `${chunk}${separators[index] ?? ""}`).join("");
            default:
                throw new Error("Invalid token at index: " + index);
        }
    }
}