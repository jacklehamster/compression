"use strict";
exports.__esModule = true;
var Loader_1 = require("./io/Loader");
var TokenEncoder_1 = require("./compression/TokenEncoder");
var Compressor_1 = require("./compression/Compressor");
var exportedClasses = {
    Loader: Loader_1["default"],
    Compressor: Compressor_1["default"],
    TokenEncoder: TokenEncoder_1["default"]
};
exports["default"] = exportedClasses;
globalThis.exports = exportedClasses;
