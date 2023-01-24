import Loader from "../io/Loader";
import { Header } from "./Header";
/**
 * Class for spitting objects into tokens.
 */
export default class Tokenizer {
    loader: Loader;
    /**
     * Load json or text files and turn them into tokens.
     *
     * @param files files to load and reduce.
     */
    load(...files: string[]): Promise<Header>;
    /**
     * Takes a mapping of filename and their corresponding data, and turn them into tokens.
     *
     * @param items Mapping from filename to data.
     * @returns All data stored as tokens.
     */
    tokenize(items: Record<string, any>): Header;
    private registerToken;
    private tokenizeHelper;
}
