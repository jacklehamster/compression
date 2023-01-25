"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var Reducer_1 = __importDefault(require("../reducer/Reducer"));
var stream_data_view_1 = require("stream-data-view");
var TokenEncoder_1 = __importDefault(require("./TokenEncoder"));
var FFlateEncoder_1 = __importDefault(require("./FFlateEncoder"));
var package_json_1 = require("../../package.json");
var Tokenizer_1 = __importDefault(require("../tokenizer/Tokenizer"));
var Extractor_1 = __importDefault(require("../expander/Extractor"));
var EncoderEnum;
(function (EncoderEnum) {
    EncoderEnum[EncoderEnum["NONE"] = 0] = "NONE";
    EncoderEnum[EncoderEnum["FFLATE"] = 1] = "FFLATE";
})(EncoderEnum || (EncoderEnum = {}));
;
var ENCODERS = [
    function () { return undefined; },
    function () { return new FFlateEncoder_1["default"](); },
];
var Compressor = /** @class */ (function () {
    function Compressor() {
    }
    Compressor.prototype.applyEncoders = function (buffer, encoders) {
        var resultBuffer = buffer;
        encoders.forEach(function (encoder) {
            resultBuffer = encoder.encode(resultBuffer);
        });
        return resultBuffer;
    };
    Compressor.prototype.applyDecoders = function (buffer, decoders) {
        var resultBuffer = buffer;
        decoders.forEach(function (decoder) {
            resultBuffer = decoder.decode(resultBuffer);
        });
        return resultBuffer;
    };
    /**
     * Load json or text files and compress them into one big blob.
     * This uses the default encoders.
     *
     * @param files files to load.
     */
    Compressor.prototype.loadAndCompress = function (files) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenizer, header, reducer, dataStore;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenizer = new Tokenizer_1["default"]();
                        return [4 /*yield*/, tokenizer.load.apply(tokenizer, files)];
                    case 1:
                        header = _a.sent();
                        reducer = new Reducer_1["default"]();
                        dataStore = reducer.reduce(header);
                        return [2 /*return*/, this.compressDataStore(dataStore)];
                }
            });
        });
    };
    /**
     * Compress data into one big blob.
     * This uses the default encoders.
     *
     * @param files files to load.
     */
    Compressor.prototype.compress = function (data) {
        var tokenizer = new Tokenizer_1["default"]();
        var header = tokenizer.tokenize(data);
        var reducer = new Reducer_1["default"]();
        var dataStore = reducer.reduce(header);
        return this.compressDataStore(dataStore);
    };
    Compressor.prototype.loadAndExpand = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var response, arrayBuffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(file)];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.arrayBuffer()];
                    case 2:
                        arrayBuffer = _a.sent();
                        return [2 /*return*/, this.expand(arrayBuffer)];
                }
            });
        });
    };
    Compressor.prototype.expand = function (arrayBuffer, config) {
        return new Extractor_1["default"](this.expandDataStore(arrayBuffer), config);
    };
    Compressor.prototype.compressDataStore = function (dataStore, encoderEnums) {
        if (encoderEnums === void 0) { encoderEnums = [EncoderEnum.FFLATE]; }
        var streamDataView = new stream_data_view_1.StreamDataView();
        var tokenEncoder = new TokenEncoder_1["default"](streamDataView);
        //  Write header tokens
        tokenEncoder.encodeTokens(dataStore.headerTokens);
        //  Write fileNames
        tokenEncoder.encodeNumberArray(dataStore.files);
        var finalStream = new stream_data_view_1.StreamDataView();
        finalStream.setNextUint8(package_json_1.version.length);
        finalStream.setNextString(package_json_1.version);
        encoderEnums.forEach(function (encoderEnum) { return finalStream.setNextUint8(encoderEnum); });
        finalStream.setNextUint8(0);
        var encoders = encoderEnums
            .map(function (encoderEnum) { return ENCODERS[encoderEnum](); })
            .filter(function (encoder) { return !!encoder; });
        //  Write header
        var headerBuffer = this.applyEncoders(streamDataView.getBuffer(), encoders);
        finalStream.setNextUint32(headerBuffer.byteLength);
        finalStream.setNextBytes(headerBuffer);
        //  Write each file's data tokens.
        for (var index = 0; index < dataStore.files.length; index++) {
            var subStream = new stream_data_view_1.StreamDataView();
            var subEncoder = new TokenEncoder_1["default"](subStream);
            subEncoder.encodeTokens(dataStore.getDataTokens(index));
            //  save and compress buffer
            var subBuffer = this.applyEncoders(subStream.getBuffer(), encoders);
            finalStream.setNextUint32(subBuffer.byteLength);
            finalStream.setNextBytes(subBuffer);
        }
        finalStream.setNextUint32(0);
        return finalStream.getBuffer();
    };
    Compressor.prototype.expandDataStore = function (arrayBuffer) {
        var _this = this;
        var input = arrayBuffer;
        var globalStream = new stream_data_view_1.StreamDataView(input);
        var compressedVersion = globalStream.getNextString(globalStream.getNextUint8());
        if (compressedVersion != package_json_1.version) {
            console.warn("Compressor is v.%s but the data was compressed with v.%s", package_json_1.version, compressedVersion);
        }
        var decoders = [];
        do {
            var encoderEnum = globalStream.getNextUint8();
            if (encoderEnum === EncoderEnum.NONE) {
                break;
            }
            var decoder = ENCODERS[encoderEnum]();
            if (decoder) {
                decoders.push(decoder);
            }
        } while (globalStream.getOffset() < globalStream.getLength());
        console.log(decoders);
        var headerByteLength = globalStream.getNextUint32();
        console.log(headerByteLength);
        var headerBuffer = this.applyDecoders(globalStream.getNextBytes(headerByteLength).buffer, decoders);
        var headerTokenEncoder = new TokenEncoder_1["default"](new stream_data_view_1.StreamDataView(headerBuffer));
        var headerTokens = headerTokenEncoder.decodeTokens();
        var files = headerTokenEncoder.decodeNumberArray();
        var subBuffers = [];
        do {
            var byteLength = globalStream.getNextUint32();
            if (!byteLength) {
                break;
            }
            subBuffers.push(globalStream.getNextBytes(byteLength));
        } while (globalStream.getOffset() < globalStream.getLength());
        var getDataTokens = function (index) {
            var subBuffer = _this.applyDecoders(subBuffers[index], decoders);
            var streamDataView = new stream_data_view_1.StreamDataView(subBuffer);
            var tokenDecoder = new TokenEncoder_1["default"](streamDataView);
            return tokenDecoder.decodeTokens();
        };
        return {
            headerTokens: headerTokens,
            files: files,
            getDataTokens: getDataTokens
        };
    };
    return Compressor;
}());
exports["default"] = Compressor;
