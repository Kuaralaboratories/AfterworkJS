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
exports.MySQLAdapter = void 0;
var promise_1 = require("mysql2/promise");
var MySQLAdapter = /** @class */ (function () {
    function MySQLAdapter(config) {
        this.pool = (0, promise_1.createPool)(config);
    }
    MySQLAdapter.prototype.getConnection = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.pool.getConnection()];
            });
        });
    };
    MySQLAdapter.prototype.query = function (sql, values) {
        return __awaiter(this, void 0, void 0, function () {
            var connection, _a, results, fields;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getConnection()];
                    case 1:
                        connection = _b.sent();
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, , 4, 5]);
                        return [4 /*yield*/, connection.query(sql, values)];
                    case 3:
                        _a = _b.sent(), results = _a[0], fields = _a[1];
                        return [2 /*return*/, [results, fields]];
                    case 4:
                        connection.release();
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    MySQLAdapter.prototype.createDatabase = function (dbName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.query("CREATE DATABASE IF NOT EXISTS `".concat(dbName, "`;"))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MySQLAdapter.prototype.createTable = function (tableName, columns) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.query("CREATE TABLE IF NOT EXISTS `".concat(tableName, "` (").concat(columns, ");"))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MySQLAdapter.prototype.insert = function (tableName, data) {
        return __awaiter(this, void 0, void 0, function () {
            var keys, values, placeholders, sql, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        keys = Object.keys(data).map(function (key) { return "`".concat(key, "`"); }).join(', ');
                        values = Object.values(data);
                        placeholders = values.map(function () { return '?'; }).join(', ');
                        sql = "INSERT INTO `".concat(tableName, "` (").concat(keys, ") VALUES (").concat(placeholders, ")");
                        return [4 /*yield*/, this.query(sql, values)];
                    case 1:
                        result = (_a.sent())[0];
                        return [2 /*return*/, result];
                }
            });
        });
    };
    MySQLAdapter.prototype.update = function (tableName, data, whereClause, whereValues) {
        return __awaiter(this, void 0, void 0, function () {
            var updates, values, sql, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        updates = Object.keys(data).map(function (key) { return "`".concat(key, "` = ?"); }).join(', ');
                        values = __spreadArray(__spreadArray([], Object.values(data), true), whereValues, true);
                        sql = "UPDATE `".concat(tableName, "` SET ").concat(updates, " WHERE ").concat(whereClause);
                        return [4 /*yield*/, this.query(sql, values)];
                    case 1:
                        result = (_a.sent())[0];
                        return [2 /*return*/, result];
                }
            });
        });
    };
    MySQLAdapter.prototype.delete = function (tableName, whereClause, whereValues) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "DELETE FROM `".concat(tableName, "` WHERE ").concat(whereClause);
                        return [4 /*yield*/, this.query(sql, whereValues)];
                    case 1:
                        result = (_a.sent())[0];
                        return [2 /*return*/, result];
                }
            });
        });
    };
    MySQLAdapter.prototype.dropTable = function (tableName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.query("DROP TABLE IF EXISTS `".concat(tableName, "`;"))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MySQLAdapter.prototype.select = function (tableName_1) {
        return __awaiter(this, arguments, void 0, function (tableName, columns, whereClause, whereValues) {
            var sql, results;
            if (columns === void 0) { columns = '*'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "SELECT ".concat(columns, " FROM `").concat(tableName, "` ").concat(whereClause ? "WHERE ".concat(whereClause) : '');
                        return [4 /*yield*/, this.query(sql, whereValues)];
                    case 1:
                        results = (_a.sent())[0];
                        return [2 /*return*/, results];
                }
            });
        });
    };
    return MySQLAdapter;
}());
exports.MySQLAdapter = MySQLAdapter;
