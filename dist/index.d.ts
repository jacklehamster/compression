import Loader from "./io/Loader";
import Tokenizer from "./tokenizer/Tokenizer";
import Reducer from "./reducer/Reducer";
import Expander from "./expander/Expander";
declare const exports: {
    Loader: typeof Loader;
    Tokenizer: typeof Tokenizer;
    Reducer: typeof Reducer;
    Expander: typeof Expander;
};
export default exports;
