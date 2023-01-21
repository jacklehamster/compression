import Loader from "./io/Loader";
import Tokenizer from "./tokenizer/Tokenizer";
import Reducer from "./reducer/Reducer";
import {ExtractableData} from "./expander/Extractor";

const exports = {
  Loader,
  Tokenizer,
  Reducer,
  ExtractableData,
}

export default exports;

globalThis.exports = exports;
