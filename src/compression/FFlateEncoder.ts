import Encoder from "./Encoder";
import * as fflate from 'fflate';

export default class FFlateEncoder implements Encoder {
    encode(arrayBuffer: ArrayBuffer): ArrayBuffer {
        return fflate.gzipSync(new Uint8Array(arrayBuffer)).buffer;
    }
    decode(arrayBuffer: ArrayBuffer): ArrayBuffer {
        return fflate.gunzipSync(new Uint8Array(arrayBuffer)).buffer;
    }

}