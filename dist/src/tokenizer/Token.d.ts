export declare type Type = "leaf" | "array" | "object" | "split" | "reference" | "complex";
export declare type Hash = string;
export declare const SPLIT_REGEX: RegExp;
export declare const TEST_REGEX: RegExp;
/**
 * Token represent each chunk of data within an object.
 */
export default interface Token extends StoredToken {
    hash: Hash;
    files: Set<string>;
    order: number;
    count: number;
    reference?: Hash[];
}
/**
 * A minimal version of a token, where we eliminate extra data like hash.
 */
export interface StoredToken {
    type: Type;
    value: any;
    bitLevel?: boolean;
}
/**
 * Stored token with added debug field for easier debugging, and cache for extraction optimization.
 */
export interface ReducedToken extends StoredToken {
    debug?: any;
    cache?: any;
}
/**
 * detect the type of a value
 *
 * @param value Value to analyze
 * @returns type of the value
 */
export declare function getType(value: any): Type;
