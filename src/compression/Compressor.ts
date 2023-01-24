import Reducer, { DataStore } from "../reducer/Reducer";
import { StreamDataView } from "stream-data-view";
import Encoder from "./Encoder";
import TokenEncoder from "./TokenEncoder";
import FFlateEncoder from "./FFlateEncoder";
import {version} from '../../package.json';
import Tokenizer from "../tokenizer/Tokenizer";
import ExtractableData, { ExtractionConfig } from "../expander/Extractor";

enum EncoderEnum {
    NONE = 0,
    FFLATE = 1,
};

const ENCODERS: ((() => Encoder) | undefined)[] = [
    undefined,
    () => new FFlateEncoder(),
]

export default class Compressor {
    private applyEncoders(buffer: ArrayBuffer, encoders: Encoder[]): ArrayBuffer {
        let resultBuffer = buffer;
        encoders.forEach(encoder => {
            resultBuffer = encoder.encode(resultBuffer);
        });
        return resultBuffer;
    }

    private applyDecoders(buffer: ArrayBuffer, decoders: Encoder[]): ArrayBuffer {
        let resultBuffer = buffer;
        decoders.forEach(decoder => {
            resultBuffer = decoder.decode(resultBuffer);
        });
        return resultBuffer;
    }

    /**
     * Load json or text files and compress them into one big blob.
     * This uses the default encoders.
     * 
     * @param files files to load.
     */
    async loadAndCompress(files: string[]): Promise<ArrayBuffer> {
        const tokenizer = new Tokenizer();
        const header = await tokenizer.load(...files);

        const reducer = new Reducer();
        const dataStore = reducer.reduce(header);
        return this.compressDataStore(dataStore);
    }

    /**
     * Compress data into one big blob.
     * This uses the default encoders.
     * 
     * @param files files to load.
     */
     compress(data: Record<string, any>): ArrayBuffer {
        const tokenizer = new Tokenizer();
        const header = tokenizer.tokenize(data);

        const reducer = new Reducer();
        const dataStore = reducer.reduce(header);
        return this.compressDataStore(dataStore);
    }
    
    async loadAndExpand(file: string): Promise<ExtractableData> {
        const response = await fetch(file);
        const arrayBuffer = await response.arrayBuffer();
        return this.expand(arrayBuffer);
    }

    expand(arrayBuffer: ArrayBuffer, config?: ExtractionConfig): ExtractableData {
        return new ExtractableData(this.expandDataStore(arrayBuffer), config);
    }

    compressDataStore(dataStore: DataStore, encoderEnums: EncoderEnum[] = [EncoderEnum.FFLATE]): ArrayBuffer {
        const streamDataView = new StreamDataView();
        const tokenEncoder: TokenEncoder = new TokenEncoder(streamDataView);

        //  Write header tokens
        tokenEncoder.encodeTokens(dataStore.headerTokens);
        //  Write fileNames
        tokenEncoder.encodeNumberArray(dataStore.files);

        const finalStream = new StreamDataView();
        finalStream.setNextUint8(version.length);
        finalStream.setNextString(version);
        encoderEnums.forEach(encoderEnum => finalStream.setNextUint8(encoderEnum));
        finalStream.setNextUint8(0);

        const encoders: Encoder[] = encoderEnums
            .map(encoderEnum => ENCODERS[encoderEnum]?.())
            .filter((encoder): encoder is Encoder => !!encoder);

        //  Write header
        const headerBuffer = this.applyEncoders(streamDataView.getBuffer(), encoders);
        finalStream.setNextUint32(headerBuffer.byteLength);
        finalStream.setNextBytes(headerBuffer);

        //  Write each file's data tokens.
        for (let index = 0; index < dataStore.files.length; index++) {
            const subStream = new StreamDataView();
            const subEncoder = new TokenEncoder(subStream);
            subEncoder.encodeTokens(dataStore.getDataTokens(index)!);

            //  save and compress buffer
            const subBuffer = this.applyEncoders(subStream.getBuffer(), encoders);
            finalStream.setNextUint32(subBuffer.byteLength);
            finalStream.setNextBytes(subBuffer);
        }
        finalStream.setNextUint32(0);

        return finalStream.getBuffer();
    }

    expandDataStore(arrayBuffer: ArrayBuffer): DataStore {
        let input = arrayBuffer;
        const globalStream = new StreamDataView(input);
        const compressedVersion = globalStream.getNextString(globalStream.getNextUint8());
       if (compressedVersion != version) {
            console.warn(`Compressor is v.%s but the data was compressed with v.%s`, version, compressedVersion);
       }
        const decoders: Encoder[] = [];
        do {
            const encoderEnum = globalStream.getNextUint8();
            if (encoderEnum === EncoderEnum.NONE) {
                break;
            }
            const decoder = ENCODERS[encoderEnum]?.();
            if (decoder) {
                decoders.push(decoder);
            }
        } while(globalStream.getOffset() < globalStream.getLength());

        const headerByteLength = globalStream.getNextUint32();
        const headerBuffer = this.applyDecoders(globalStream.getNextBytes(headerByteLength).buffer, decoders);

        const headerTokenEncoder = new TokenEncoder(new StreamDataView(headerBuffer));
        const headerTokens = headerTokenEncoder.decodeTokens();
        const files = headerTokenEncoder.decodeNumberArray();

        const subBuffers: ArrayBuffer[] = [];
        do {
            const byteLength = globalStream.getNextUint32();
            if (!byteLength) {
                break;
            }
            subBuffers.push(globalStream.getNextBytes(byteLength));
        } while(globalStream.getOffset() < globalStream.getLength())

        const getDataTokens = (index: number) => {
            const subBuffer = this.applyDecoders(subBuffers[index], decoders);
            const streamDataView = new StreamDataView(subBuffer);
            const tokenDecoder = new TokenEncoder(streamDataView);
            return tokenDecoder.decodeTokens();
        }

        return {
            headerTokens,
            files,
            getDataTokens,
        }
    }
}
