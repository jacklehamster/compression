export declare type Type = "leaf" | "array" | "object" | "split";
export declare type Hash = string;
export default interface Token {
    type: Type;
    hash: Hash;
    value: any;
    files: Set<string>;
    order: number;
    reference?: Hash[];
}
