export type Type = "leaf" | "array" | "object" | "split";
export type Hash = string;

export const SPLIT_REGEX = /\W+/g;
export const TEST_REGEX = /(\w\W+|\W+\w)/

/**
 * Token represent each chunk of data within an object.
 */
export default interface Token {
    type: Type;
    hash: Hash;
    value: any;
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
export function getType(value: any): Type {
    if (Array.isArray(value)) {
        return "array";
    } else if (typeof value === "object" && value) {
        return "object";
    } else if (typeof value === "string" && TEST_REGEX.test(value)) {
        return "split";
    } else {
        return "leaf";
    }
}