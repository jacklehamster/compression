import md5 from "md5";
import { Header } from "./Header";
import Token, { getType, Hash, SPLIT_REGEX } from "./Token";

export default class Tokenizer {
    tokenize(items: Record<string, any>) {
        const header: Header = {
            registry: {},
            files: {},
        };

        const counter = { next: 0 };

        Object.entries(items).forEach(([file, value]) => {
            header.files[file] = {
                nameToken: this.tokenizeHelper(file, header.registry, counter, "header"),
                token: this.tokenizeHelper(value, header.registry, counter, file),
            }
        });

        return header;
    }

    private registerToken(hash: Hash, value: any, registry: Record<Hash, Token>, counter: {next: number}, file: string, reference?: string[]) {
        const entry = registry[hash] ?? (registry[hash] = {
            type: getType(value),
            hash,
            value,
            reference,
            order: counter.next++,
            count: 0,
            files: new Set(),
        });
        entry.files.add(file);
        entry.count++;
        return entry;
    }

    private tokenizeHelper(item: any, registry: Record<Hash, Token>, counter: {next: number}, file: string): Token {
        const type = getType(item);
        if (type === "array") {
            if (!Array.isArray(item)) {
                throw new Error("item should be an array");
            }
            const hashes = item.map(item => this.tokenizeHelper(item, registry, counter, file)).map(({hash}) => hash);
            const hash = md5(hashes.join(","));
            return this.registerToken(hash, item, registry, counter, file, hashes);
        } else if (type === "object") {
            const entries = Object.entries(item);
            const keysToken = this.tokenizeHelper(entries.map(([key]) => key), registry, counter, file);
            const valuesToken = this.tokenizeHelper(entries.map(([,value]) => value), registry, counter, file);
            const hash = md5(`${keysToken.hash}|${valuesToken.hash}`);
            return this.registerToken(hash, item, registry, counter, file, [keysToken.hash, valuesToken.hash]);
        } else if (type === "split") {
            const chunks = item.split(SPLIT_REGEX);
            const separators = item.match(SPLIT_REGEX);
            const chunksToken = this.tokenizeHelper(chunks, registry, counter, file);
            const separatorsToken = this.tokenizeHelper(separators, registry, counter, file);
            const hash = md5(`${chunksToken.hash}-${separatorsToken.hash}`);
            return this.registerToken(hash, item, registry, counter, file, [chunksToken.hash, separatorsToken.hash]);
        } else {
            return this.registerToken(md5(JSON.stringify(item)), item, registry, counter, file);
        }
    }
}