import Loader from "./io/Loader";
import Tokenizer from "./tokenizer/Tokenizer";
import Reducer from "./reducer/Reducer";
import ExtractableData from "./expander/Extractor";
import TokenEncoder from "./compression/TokenEncoder";
import Compressor from "./compression/Compressor";
declare const exports: {
    Loader: typeof Loader;
    Tokenizer: typeof Tokenizer;
    Reducer: typeof Reducer;
    ExtractableData: typeof ExtractableData;
    TokenEncoder: typeof TokenEncoder;
    Compressor: typeof Compressor;
};
export default exports;
