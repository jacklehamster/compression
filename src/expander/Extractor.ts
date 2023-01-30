import { StructureType } from "../compression/DataType";
import { DataStore } from "../reducer/Reducer";
import { ReducedToken, Type } from "../tokenizer/Token";

/**
 * Configuration that can be passed.
 * - cacheable: We can use cache to boost extraction speed. This uses a bit more memory.
 * This helps performance and memory, but can lead to weird side effects if the extracted object
 * gets modified.
 */
export interface ExtractionConfig {
    cacheable: boolean;
}

const DEFAULT_CONFIG: ExtractionConfig = {
    cacheable: true,
}

/**
 * Class storing all data that can be extracted.
 */
export default class ExtractableData {
    readonly extractor: Extractor = new Extractor();
    readonly dataStore: DataStore;
    readonly fileToSlot: Record<string, number>;
    readonly config: ExtractionConfig;
    readonly fileNames: string[];
    readonly version?: string;
    readonly originalDataSize?: number;
    readonly compressedSize?: number;

    constructor(dataStore: DataStore, config?: ExtractionConfig) {
        this.dataStore = dataStore;
        this.config = {
            ...DEFAULT_CONFIG,
            ...config,
        };
        this.fileNames = this.extractor.extractFileNames(dataStore.files, dataStore.headerTokens, this.config);
        this.fileToSlot = Object.fromEntries(this.fileNames.map((file, index) => [file, index]));
        this.version = dataStore.version;
        this.originalDataSize = dataStore.originalDataSize;
        this.compressedSize = dataStore.compressedSize;
    }

    /**
     * Extract data form a stored file.
     *
     * @param filename filename to be extracted.
     * @returns extracted data.
     */
    extract(filename: string) {
        const slot = this.fileToSlot[filename];
        const dataTokens = this.dataStore.getDataTokens(slot);
        if (dataTokens) {
            return this.extractor.extract(this.dataStore.headerTokens, dataTokens, this.config);
        }
    }

    getHeaderTokens() {
        return this.dataStore.headerTokens;
    }
}

class Extractor {
    valueFetcher: Record<Type, undefined | ((token: ReducedToken, headerTokens: ReducedToken[], dataTokens: ReducedToken[] | undefined, config: ExtractionConfig) => any)>;

    constructor() {
        this.valueFetcher = {
            "array": this.getArray.bind(this),
            "leaf": this.getLeaf.bind(this),
            "object": this.getObject.bind(this),
            "split": this.getSplit.bind(this),
            "reference": this.getReference.bind(this),
            "complex": undefined,
        };
    }

    extractFileNames(files: number[], headerTokens: ReducedToken[], config: ExtractionConfig) {
        return files.map(index => this.extractToken(index, headerTokens, undefined, config));
    }

    extract(headerTokens: ReducedToken[], dataTokens: ReducedToken[], config: ExtractionConfig) {
        const tokenStream = dataTokens.entries();
        const [,complexToken] = tokenStream.next().value;
        const structure: StructureType[] = complexToken.value;
        const token = this.extractComplex(structure.entries(), tokenStream, headerTokens, [...dataTokens], config);
        return token;
    }

    private extractComplex(structure: Iterator<[number, StructureType]>, tokenStream: Iterator<[number, ReducedToken]>, headerTokens: ReducedToken[], dataTokens: ReducedToken[] | undefined, config: ExtractionConfig): any {
        const [, structureType] = structure.next().value;
        switch (structureType) {
            case StructureType.LEAF:
                const [,leafToken]: [number, ReducedToken] = tokenStream.next().value;
                const value = this.extractValueOrCache(leafToken, headerTokens, dataTokens, config, true, this.valueFetcher[leafToken.type]);
                return value;
            case StructureType.ARRAY:
                const [,numToken]: [number, ReducedToken] = tokenStream.next().value;
                const array = new Array(numToken.value).fill(null)
                    .map(_ => this.extractComplex(structure, tokenStream, headerTokens, dataTokens, config));
                return array;
            case StructureType.OBJECT:
                const keys: string[] = this.extractComplex(structure, tokenStream, headerTokens, dataTokens, config);
                const values: any[] = this.extractComplex(structure, tokenStream, headerTokens, dataTokens, config);
                const object = Object.fromEntries(keys.map((key, index) => [key, values[index]]));
                return object;
            case StructureType.SPLIT:
                const chunks: string[] = this.extractComplex(structure, tokenStream, headerTokens, dataTokens, config);
                const separators: string[] = this.extractComplex(structure, tokenStream, headerTokens, dataTokens, config);
                const split = chunks.map((chunk, index) => `${chunk}${separators[index] ?? ""}`).join("");
                return split;

        }
    }

    private extractToken(index: number, headerTokens: ReducedToken[], dataTokens: ReducedToken[] | undefined,
            config: ExtractionConfig, allowUseCache?: boolean): any {
        const token = index < headerTokens.length ? headerTokens[index] : dataTokens?.[index - headerTokens.length];
        if (!token) {
            throw new Error("Invalid token at index: " + index);            
        }
        return this.extractValueOrCache(
                token,
                headerTokens,
                dataTokens,
                config,
                allowUseCache,
                this.valueFetcher[token.type]
            );
    }

    private getLeaf(token: ReducedToken) {
        return token.value;
    }

    private getReference(token: ReducedToken, headerTokens: ReducedToken[], dataTokens: ReducedToken[] | undefined, config: ExtractionConfig): any {
        const index = token.value;
        return this.extractToken(index, headerTokens, dataTokens, config);
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
        allowUseCache?: boolean,
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