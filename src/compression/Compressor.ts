import { DataStore } from "../reducer/Reducer";
import { StreamDataView } from "stream-data-view";

export default class Compressor {
    compress(dataStore: DataStore): ArrayBuffer {
        const streamDataView = new StreamDataView();
        //  WORK TO BE DONE HERE
        //  Write header tokens
        //  Write fileNames
        //  Write each file's data tokens.
        return streamDataView.getBuffer();
    }
}
