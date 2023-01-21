import { DataStore } from "../reducer/Reducer";
import { ReducedToken } from "../tokenizer/Token";

export interface ExtractionConfig {
    cacheable: boolean;
    allowMultipleReferences: boolean;
}

const DEFAULT_CONFIG: ExtractionConfig = {
    cacheable: true,
    allowMultipleReferences: false,
}

export class ExtractableData {
    extractor: Extractor = new Extractor();
    dataStore: DataStore;
    fileToSlot: Record<string, number>;
    config: ExtractionConfig;

    constructor(dataStore: DataStore, config: ExtractionConfig = { ...DEFAULT_CONFIG }) {
        this.dataStore = dataStore;
        const fileNames = this.extractor.extractFileNames(dataStore.files, dataStore.headerTokens, config);
        this.fileToSlot = Object.fromEntries(fileNames.map((file, index) => [file, index]));
        this.config = config;
    }

    extract(filename: string, allowMultipleReferences?: boolean) {
        const slot = this.fileToSlot[filename];
        const dataTokens = this.dataStore.getDataTokens(slot);
        if (dataTokens) {
            return this.extractor.extract(this.dataStore.headerTokens, dataTokens, {
                ...this.config,
                allowMultipleReferences : allowMultipleReferences ?? this.config.allowMultipleReferences,
            });
        }
    }
}

class Extractor {
    extractFileNames(files: number[], headerTokens: ReducedToken[], config: ExtractionConfig) {
        return files.map(index => this.extractToken(index, headerTokens, undefined, config));
    }

    extract(headerTokens: ReducedToken[], dataTokens: ReducedToken[], config: ExtractionConfig) {
        return this.extractToken(headerTokens.length + dataTokens.length - 1, headerTokens, dataTokens, config);
    }

    private extractToken(index: number, headerTokens: ReducedToken[], dataTokens: ReducedToken[] | undefined,
            config: ExtractionConfig, forceAllowUseCache?: boolean): any {
        const token = index < headerTokens.length ? headerTokens[index] : dataTokens?.[index - headerTokens.length];
        if (!token) {
            throw new Error("Invalid token at index: " + index);            
        }

        switch(token?.type) {
            case "leaf":
                return token.value;
            case "array":
                if (token?.cache !== undefined && (config.allowMultipleReferences || forceAllowUseCache)) {
                    return token?.cache;
                }
                if (!Array.isArray(token.value)) {
                    throw new Error("Invalid array token");
                }
                const arrayValue = token.value.map(index => this.extractToken(index, headerTokens, dataTokens, config));
                if (config.cacheable) {
                    token.cache = arrayValue;
                }
                return arrayValue;
            case "object":
                if (token?.cache !== undefined && (config.allowMultipleReferences || forceAllowUseCache)) {
                    return token?.cache;
                }
                const [keyIndex, valueIndex] = token.value;
                const keys: string[] = this.extractToken(keyIndex, headerTokens, dataTokens, config, true);
                const values = this.extractToken(valueIndex, headerTokens, dataTokens, config);
                const objValue = Object.fromEntries(keys.map((key, index) => [key, values[index]]));
                if (config.cacheable) {
                    token.cache = objValue;
                }
                return objValue;
            case "split":
                if (token?.cache !== undefined) {
                    return token?.cache;
                }        
                const [chunksIndex, separatorsIndex] = token.cache ?? token.value;
                const chunks: string[] = this.extractToken(chunksIndex, headerTokens, dataTokens, config, true);
                const separators: string[] = this.extractToken(separatorsIndex, headerTokens, dataTokens, config, true);
                const splitValue = chunks.map((chunk, index) => `${chunk}${separators[index] ?? ""}`).join("");
                if (config.cacheable) {
                    token.cache = splitValue;
                }
                return splitValue;
            default:
                throw new Error("Invalid token at index: " + index);
        }
    }

    private getArray(token: ReducedToken, headerTokens: ReducedToken[], dataTokens: ReducedToken[] | undefined, config: ExtractionConfig): any[] {
        if (!Array.isArray(token.value)) {
            throw new Error("Invalid array token");
        }
        return token.value.map(index => this.extractToken(index, headerTokens, dataTokens, config));
    }

    private getObject(token: ReducedToken, headerTokens: ReducedToken[], dataTokens: ReducedToken[] | undefined, config: ExtractionConfig): object {
        const [keyIndex, valueIndex] = token.value;
        const keys: string[] = this.extractToken(keyIndex, headerTokens, dataTokens, config, true);
        const values = this.extractToken(valueIndex, headerTokens, dataTokens, config);
        return Object.fromEntries(keys.map((key, index) => [key, values[index]]));
    }

    private getSplit(token: ReducedToken, headerTokens: ReducedToken[], dataTokens: ReducedToken[] | undefined, config: ExtractionConfig): string {
        const [chunksIndex, separatorsIndex] = token.cache ?? token.value;
        const chunks: string[] = this.extractToken(chunksIndex, headerTokens, dataTokens, config, true);
        const separators: string[] = this.extractToken(separatorsIndex, headerTokens, dataTokens, config, true);
        return chunks.map((chunk, index) => `${chunk}${separators[index] ?? ""}`).join("");
    }

    private extractValueOrCache<T>(
        token: ReducedToken,
        headerTokens: ReducedToken[],
        dataTokens: ReducedToken[] | undefined,
        config: ExtractionConfig,
        allowUseCache: boolean,
        getValue: (token: ReducedToken, headerTokens: ReducedToken[], dataTokens: ReducedToken[] | undefined, config: ExtractionConfig) => T): T {
        
        if (token.cache !== undefined && allowUseCache) {
            return token.cache;
        }

        const value = getValue(token, headerTokens, dataTokens, config);
        if (config.cacheable) {
            token.cache = value;
        }
        return value;
    }
}