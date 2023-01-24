"use strict";
exports.__esModule = true;
var fflate = require("fflate");
var FFlateEncoder = /** @class */ (function () {
    function FFlateEncoder() {
    }
    FFlateEncoder.prototype.encode = function (arrayBuffer) {
        return fflate.gzipSync(new Uint8Array(arrayBuffer)).buffer;
    };
    FFlateEncoder.prototype.decode = function (arrayBuffer) {
        return fflate.gunzipSync(new Uint8Array(arrayBuffer)).buffer;
    };
    return FFlateEncoder;
}());
exports["default"] = FFlateEncoder;
