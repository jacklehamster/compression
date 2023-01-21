export type Type = "leaf" | "array" | "object" | "split";
export type Hash = string;

export const SPLIT_REGEX = /\W+/g;
export const TEST_REGEX = /(\w\W+|\W+\w)/

export default interface Token {
    type: Type;
    hash: Hash;
    value: any;
    files: Set<string>;
    order: number;
    count: number;
    reference?: Hash[];
}

export interface ReducedToken {
    type: Type;
    value: any;
    debug?: any;
}

export function getType(item: any): Type {
    if (Array.isArray(item)) {
        return "array";
    } else if (typeof item === "object" && item) {
        return "object";
    } else if (typeof item === "string" && TEST_REGEX.test(item)) {
        return "split";
    } else {
        return "leaf";
    }
}