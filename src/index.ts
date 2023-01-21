import Loader from "./io/Loader";
import Tokenizer from "./tokenizer/Tokenizer";
import Reducer from "./reducer/Reducer";
import Expander from "./expander/Expander";

const exports = {
  Loader,
  Tokenizer,
  Reducer,
  Expander,
}

export default exports;

globalThis.exports = exports;
