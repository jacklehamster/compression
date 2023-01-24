"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var Loader_1 = __importDefault(require("./io/Loader"));
var TokenEncoder_1 = __importDefault(require("./compression/TokenEncoder"));
var Compressor_1 = __importDefault(require("./compression/Compressor"));
var exportedClasses = {
    Loader: Loader_1["default"],
    Compressor: Compressor_1["default"],
    TokenEncoder: TokenEncoder_1["default"]
};
exports["default"] = exportedClasses;
globalThis.exports = exportedClasses;
