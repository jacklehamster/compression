import { DataStore } from "../reducer/Reducer";
import Encoder from "./Encoder";
export default class Compressor {
    readonly encoders: Encoder[];
    constructor(encoders?: Encoder[]);
    compress(dataStore: DataStore): ArrayBuffer;
    expand(arrayBuffer: ArrayBuffer): DataStore | undefined;
}
