import { DataStore } from "../reducer/Reducer";
import { ReducedToken, Type } from "../tokenizer/Token";
export interface ExtractionConfig {
    cacheable: boolean;
    allowReferences: boolean;
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
    valueFetcher: Record<Type, undefined | ((token: ReducedToken, headerTokens: ReducedToken[], dataTokens: ReducedToken[] | undefined, config: ExtractionConfig) => any)>;
    constructor();
    extractFileNames(files: number[], headerTokens: ReducedToken[], config: ExtractionConfig): any[];
    extract(headerTokens: ReducedToken[], dataTokens: ReducedToken[], config: ExtractionConfig): any;
    private extractToken;
    private getArray;
    private getObject;
    private getSplit;
    private extractValueOrCache;
}
export {};
