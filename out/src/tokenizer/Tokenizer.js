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
var Loader_1 = __importDefault(require("../io/Loader"));
var Token_1 = require("./Token");
var blueimp_md5_1 = __importDefault(require("blueimp-md5"));
/**
 * Class for spitting objects into tokens.
 */
var Tokenizer = /** @class */ (function () {
    function Tokenizer() {
        this.loader = new Loader_1["default"]();
    }
    /**
     * Load json or text files and turn them into tokens.
     *
     * @param files files to load and reduce.
     */
    Tokenizer.prototype.load = function () {
        var files = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            files[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var sortedFiles, allData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (files.some(function (file) { return typeof file !== "string"; })) {
                            throw new Error("Each argument passed to load must be a string.");
                        }
                        sortedFiles = files.sort();
                        return [4 /*yield*/, Promise.all(sortedFiles.map(this.loader.load))];
                    case 1:
                        allData = _a.sent();
                        return [2 /*return*/, this.tokenize(Object.fromEntries(allData.map(function (data, index) { return [sortedFiles[index], data]; })))];
                }
            });
        });
    };
    /**
     * Takes a mapping of filename and their corresponding data, and turn them into tokens.
     *
     * @param items Mapping from filename to data.
     * @returns All data stored as tokens.
     */
    Tokenizer.prototype.tokenize = function (items) {
        var _this = this;
        var header = {
            registry: {},
            files: {}
        };
        var counter = { next: 0 };
        Object.entries(items).forEach(function (_a) {
            var file = _a[0], value = _a[1];
            header.files[file] = {
                nameToken: _this.tokenizeHelper(file, header.registry, counter, "header"),
                token: _this.tokenizeHelper(value, header.registry, counter, file)
            };
        });
        return header;
    };
    Tokenizer.prototype.registerToken = function (hash, value, registry, counter, file, reference) {
        var _a;
        var entry = (_a = registry[hash]) !== null && _a !== void 0 ? _a : (registry[hash] = {
            type: (0, Token_1.getType)(value),
            hash: hash,
            value: value,
            reference: reference,
            order: counter.next++,
            count: 0,
            files: new Set()
        });
        entry.files.add(file);
        entry.count++;
        return entry;
    };
    Tokenizer.prototype.tokenizeHelper = function (item, registry, counter, file) {
        var _this = this;
        var type = (0, Token_1.getType)(item);
        if (type === "array") {
            if (!Array.isArray(item)) {
                throw new Error("item should be an array");
            }
            var hashes = item.map(function (item) { return _this.tokenizeHelper(item, registry, counter, file); }).map(function (_a) {
                var hash = _a.hash;
                return hash;
            });
            var hash = (0, blueimp_md5_1["default"])(hashes.join(","));
            return this.registerToken(hash, item, registry, counter, file, hashes);
        }
        else if (type === "object") {
            var entries = Object.entries(item);
            var keysToken = this.tokenizeHelper(entries.map(function (_a) {
                var key = _a[0];
                return key;
            }), registry, counter, file);
            var valuesToken = this.tokenizeHelper(entries.map(function (_a) {
                var value = _a[1];
                return value;
            }), registry, counter, file);
            var hash = (0, blueimp_md5_1["default"])("".concat(keysToken.hash, "|").concat(valuesToken.hash));
            return this.registerToken(hash, item, registry, counter, file, [keysToken.hash, valuesToken.hash]);
        }
        else if (type === "split") {
            var chunks = item.split(Token_1.SPLIT_REGEX);
            var separators = item.match(Token_1.SPLIT_REGEX);
            var chunksToken = this.tokenizeHelper(chunks, registry, counter, file);
            var separatorsToken = this.tokenizeHelper(separators, registry, counter, file);
            var hash = (0, blueimp_md5_1["default"])("".concat(chunksToken.hash, "-").concat(separatorsToken.hash));
            return this.registerToken(hash, item, registry, counter, file, [chunksToken.hash, separatorsToken.hash]);
        }
        else {
            var m = (0, blueimp_md5_1["default"])(JSON.stringify(item));
            return this.registerToken(m, item, registry, counter, file);
        }
    };
    return Tokenizer;
}());
exports["default"] = Tokenizer;
