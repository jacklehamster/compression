import Loader from "./io/Loader";
import TokenEncoder from "./compression/TokenEncoder";
import Compressor from "./compression/Compressor";

const exports = {
  Loader,
  Compressor,
  TokenEncoder,
}

export default exports;

globalThis.exports = exports;
