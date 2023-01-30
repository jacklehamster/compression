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
/**
 * Class storing all data that can be extracted.
 */
export default class ExtractableData {
    readonly extractor: Extractor;
    readonly dataStore: DataStore;
    readonly fileToSlot: Record<string, number>;
    readonly config: ExtractionConfig;
    readonly fileNames: string[];
    readonly version?: string;
    readonly originalDataSize?: number;
    readonly compressedSize?: number;
    constructor(dataStore: DataStore, config?: ExtractionConfig);
    /**
     * Extract data form a stored file.
     *
     * @param filename filename to be extracted.
     * @returns extracted data.
     */
    extract(filename: string): any;
    getHeaderTokens(): ReducedToken[];
}
declare class Extractor {
    valueFetcher: Record<Type, undefined | ((token: ReducedToken, headerTokens: ReducedToken[], dataTokens: ReducedToken[] | undefined, config: ExtractionConfig) => any)>;
    constructor();
    extractFileNames(files: number[], headerTokens: ReducedToken[], config: ExtractionConfig): any[];
    extract(headerTokens: ReducedToken[], dataTokens: ReducedToken[], config: ExtractionConfig): any;
    private extractComplex;
    private extractToken;
    private getLeaf;
    private getReference;
    private getArray;
    private getObject;
    private getSplit;
    private extractValueOrCache;
}
export {};
