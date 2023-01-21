import { DataStore } from "../reducer/Reducer";
import { ReducedToken } from "../tokenizer/Token";
export interface ExtractionConfig {
    cacheable: boolean;
    allowMultipleReferences: boolean;
}
export declare class ExtractableData {
    extractor: Extractor;
    dataStore: DataStore;
    fileToSlot: Record<string, number>;
    config: ExtractionConfig;
    constructor(dataStore: DataStore, config?: ExtractionConfig);
    extract(filename: string, allowMultipleReferences?: boolean): any;
}
declare class Extractor {
    extractFileNames(files: number[], headerTokens: ReducedToken[], config: ExtractionConfig): any[];
    extract(headerTokens: ReducedToken[], dataTokens: ReducedToken[], config: ExtractionConfig): any;
    private extractToken;
    private getArray;
    private getObject;
    private getSplit;
    private extractValueOrCache;
}
export {};
