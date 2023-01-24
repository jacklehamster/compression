import Loader from "./io/Loader";
import TokenEncoder from "./compression/TokenEncoder";
import Compressor from "./compression/Compressor";

const exportedClasses = {
  Loader,
  Compressor,
  TokenEncoder,
}

export default exportedClasses;

globalThis.exports = exportedClasses;
