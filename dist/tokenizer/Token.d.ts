export declare type Type = "leaf" | "array" | "object" | "split";
export declare type Hash = string;
export declare const SPLIT_REGEX: RegExp;
export declare const TEST_REGEX: RegExp;
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
    cache?: any;
}
export declare function getType(item: any): Type;
