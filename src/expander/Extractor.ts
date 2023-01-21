import { DataStore } from "../reducer/Reducer";
import { ReducedToken, Type } from "../tokenizer/Token";

/**
 * Configuration that can be passed.
 * - cacheable: We can use cache to boost extraction speed. This uses a bit more memory.
 * - allowReferences: within the extracted object, multiple nodes can reference the same object.
 * This helps performance and memory, but can lead to weird side effects if the extracted object
 * gets modified.
 */
export interface ExtractionConfig {
    cacheable: boolean;
    allowReferences: boolean;
}

const DEFAULT_CONFIG: ExtractionConfig = {
    cacheable: true,
    allowReferences: false,
}

/**
 * Class storing all data that can be extracted.
 */
export class ExtractableData {
    extractor: Extractor = new Extractor();
    dataStore: DataStore;
    fileToSlot: Record<string, number>;
    config: ExtractionConfig;

    constructor(dataStore: DataStore, config?: ExtractionConfig) {
        this.dataStore = dataStore;
        this.config = {
            ...DEFAULT_CONFIG,
            ...config,
        };
        const fileNames = this.extractor.extractFileNames(dataStore.files, dataStore.headerTokens, this.config);
        this.fileToSlot = Object.fromEntries(fileNames.map((file, index) => [file, index]));
    }

    /**
     * Extract data form a stored file.
     *
     * @param filename filename to be extracted.
     * @param allowReferences If true, within the extracted object, multiple nodes can reference the same object.
     *  This helps performance and memory, but can lead to weird side effects if the extracted object
     *  gets modified.
     * @returns extracted data.
     */
    extract(filename: string, allowReferences?: boolean) {
        const slot = this.fileToSlot[filename];
        const dataTokens = this.dataStore.getDataTokens(slot);
        if (dataTokens) {
            return this.extractor.extract(this.dataStore.headerTokens, dataTokens, {
                ...this.config,
                allowReferences : allowReferences ?? this.config.allowReferences,
            });
        }
    }
}

class Extractor {
    valueFetcher: Record<Type, undefined | ((token: ReducedToken, headerTokens: ReducedToken[], dataTokens: ReducedToken[] | undefined, config: ExtractionConfig) => any)>;

    constructor() {
        this.valueFetcher = {
            "array": this.getArray.bind(this),
            "leaf": undefined,
            "object": this.getObject.bind(this),
            "split": this.getSplit.bind(this),
        };
    }

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
        if (token.type === "leaf") {
            return token.value;
        }
        return this.extractValueOrCache(
                token,
                headerTokens,
                dataTokens,
                config,
                forceAllowUseCache || config.allowReferences,
                this.valueFetcher[token.type]
            );
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
        const [chunksIndex, separatorsIndex] = token.value;
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
        getValue?: (token: ReducedToken, headerTokens: ReducedToken[], dataTokens: ReducedToken[] | undefined, config: ExtractionConfig) => T): T {
        
        if (token.cache !== undefined && allowUseCache) {
            return token.cache;
        }
        if (!getValue) {
            throw new Error("getValue not provided.");
        }

        const value = getValue(token, headerTokens, dataTokens, config);
        if (config.cacheable) {
            token.cache = value;
        }
        return value;
    }
}