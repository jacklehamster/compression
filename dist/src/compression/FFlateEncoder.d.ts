import Encoder from "./Encoder";
export default class FFlateEncoder implements Encoder {
    encode(arrayBuffer: ArrayBuffer): ArrayBuffer;
    decode(arrayBuffer: ArrayBuffer): ArrayBuffer;
}
