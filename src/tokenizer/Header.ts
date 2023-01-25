import Token, { Hash } from "./Token";

export interface Header {
    originalDataSize?: number;
    registry: Record<Hash, Token>;
    files: Record<string, {
        nameToken: Token;
        token: Token;
    }>;
}
