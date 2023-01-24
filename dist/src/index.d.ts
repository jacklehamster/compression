import Loader from "./io/Loader";
import TokenEncoder from "./compression/TokenEncoder";
import Compressor from "./compression/Compressor";
declare const exports: {
    Loader: typeof Loader;
    Compressor: typeof Compressor;
    TokenEncoder: typeof TokenEncoder;
};
export default exports;
