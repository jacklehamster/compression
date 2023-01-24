export default interface Encoder {
    encode(arrayBuffer: ArrayBuffer): ArrayBuffer;
    decode(arrayBuffer: ArrayBuffer): ArrayBuffer;
}