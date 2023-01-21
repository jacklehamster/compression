import Loader from "./io/Loader";
import Tokenizer from "./tokenizer/Tokenizer";
import Reducer from "./reducer/Reducer";
import { ExtractableData } from "./expander/Extractor";
declare const exports: {
    Loader: typeof Loader;
    Tokenizer: typeof Tokenizer;
    Reducer: typeof Reducer;
    ExtractableData: typeof ExtractableData;
};
export default exports;
