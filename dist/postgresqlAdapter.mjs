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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresAdapter = void 0;
var pg_1 = require("pg");
var PostgresAdapter = /** @class */ (function () {
    function PostgresAdapter(config) {
        this.pool = new pg_1.Pool(config);
    }
    PostgresAdapter.prototype.query = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pool.query(query)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.rows];
                }
            });
        });
    };
    PostgresAdapter.prototype.findOne = function (table, query) {
        return __awaiter(this, void 0, void 0, function () {
            var text, values, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        text = "SELECT * FROM ".concat(table, " WHERE ").concat(Object.keys(query).map(function (k, i) { return "".concat(k, " = $").concat(i + 1); }).join(' AND '), " LIMIT 1");
                        values = Object.values(query);
                        return [4 /*yield*/, this.query({ text: text, values: values })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result[0]];
                }
            });
        });
    };
    PostgresAdapter.prototype.insertOne = function (table, document) {
        return __awaiter(this, void 0, void 0, function () {
            var columns, values, placeholders, text, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        columns = Object.keys(document).join(', ');
                        values = Object.values(document);
                        placeholders = values.map(function (_, i) { return "$".concat(i + 1); }).join(', ');
                        text = "INSERT INTO ".concat(table, " (").concat(columns, ") VALUES (").concat(placeholders, ") RETURNING *");
                        return [4 /*yield*/, this.query({ text: text, values: values })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result[0]];
                }
            });
        });
    };
    PostgresAdapter.prototype.updateOne = function (table, query, update) {
        return __awaiter(this, void 0, void 0, function () {
            var queryKeys, updateKeys, text, values, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queryKeys = Object.keys(query).map(function (k, i) { return "".concat(k, " = $").concat(i + 1); }).join(' AND ');
                        updateKeys = Object.keys(update).map(function (k, i) { return "".concat(k, " = $").concat(i + 1 + Object.keys(query).length); }).join(', ');
                        text = "UPDATE ".concat(table, " SET ").concat(updateKeys, " WHERE ").concat(queryKeys, " RETURNING *");
                        values = __spreadArray(__spreadArray([], Object.values(query), true), Object.values(update), true);
                        return [4 /*yield*/, this.query({ text: text, values: values })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result[0]];
                }
            });
        });
    };
    PostgresAdapter.prototype.deleteOne = function (table, query) {
        return __awaiter(this, void 0, void 0, function () {
            var text, values, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        text = "DELETE FROM ".concat(table, " WHERE ").concat(Object.keys(query).map(function (k, i) { return "".concat(k, " = $").concat(i + 1); }).join(' AND '));
                        values = Object.values(query);
                        return [4 /*yield*/, this.pool.query({ text: text, values: values })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, (result.rowCount !== undefined && result.rowCount !== null && result.rowCount > 0)];
                }
            });
        });
    };
    PostgresAdapter.prototype.find = function (table, query) {
        return __awaiter(this, void 0, void 0, function () {
            var text, values;
            return __generator(this, function (_a) {
                text = "SELECT * FROM ".concat(table, " WHERE ").concat(Object.keys(query).map(function (k, i) { return "".concat(k, " = $").concat(i + 1); }).join(' AND '));
                values = Object.values(query);
                return [2 /*return*/, this.query({ text: text, values: values })];
            });
        });
    };
    return PostgresAdapter;
}());
exports.PostgresAdapter = PostgresAdapter;
