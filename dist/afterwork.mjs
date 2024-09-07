"use strict";
/**                           Afterwork.js
 *  Afterwork.js is a backend framework for your needs without harming your pocket in all meanings.
 */
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Response = exports.AfterworkJS = void 0;
var afserver_mjs_1 = require("../server/afserver.mjs");
var jwt = require("jsonwebtoken");
var mongodbAdapter_mjs_1 = require("../adapters/mongodbAdapter.mjs");
var postgresqlAdapter_mjs_1 = require("../adapters/postgresqlAdapter.mjs");
var mysqlAdapter_mjs_1 = require("../adapters/mysqlAdapter.mjs");
var AfterworkJS = /** @class */ (function () {
    function AfterworkJS(config) {
        var _this = this;
        this.server = new afserver_mjs_1.AFServer();
        this.secret = config.secret;
        this.dbAdapter = this.initializeDbAdapter(config.dbType, config.dbConfig);
        this.server.use(function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                req.db = this.dbAdapter;
                next();
                return [2 /*return*/];
            });
        }); });
    }
    AfterworkJS.prototype.initializeDbAdapter = function (dbType, dbConfig) {
        switch (dbType) {
            case 'mongo':
                return new mongodbAdapter_mjs_1.MongoDBAdapter(dbConfig);
            case 'postgres':
                return new postgresqlAdapter_mjs_1.PostgresAdapter(dbConfig);
            case 'mysql':
                return new mysqlAdapter_mjs_1.MySQLAdapter(dbConfig);
            default:
                throw new Error("Unsupported database type: ".concat(dbType));
        }
    };
    AfterworkJS.prototype.start = function (port) {
        this.server.listen(port, function () { return console.log("AfterworkJS server running on port ".concat(port)); });
    };
    AfterworkJS.prototype.addRoute = function (method, path, handler) {
        this.server.addRoute(method, path, handler);
    };
    AfterworkJS.prototype.authenticateToken = function (req, res, next) {
        var authHeader = req.headers['authorization'];
        if (typeof authHeader !== 'string') {
            res.statusCode = 401;
            res.end('Unauthorized');
            return;
        }
        var token = authHeader.split(' ')[1];
        if (!token) {
            res.statusCode = 401;
            res.end('Unauthorized');
            return;
        }
        jwt.verify(token, this.secret, function (err, user) {
            if (err) {
                res.statusCode = 403;
                res.end('Forbidden');
                return;
            }
            req.user = user;
            next();
        });
    };
    AfterworkJS.prototype.generateToken = function (user) {
        return jwt.sign(user, this.secret, { expiresIn: '1h' });
    };
    AfterworkJS.prototype.setRoutes = function (routes) {
        var _this = this;
        routes.forEach(function (_a) {
            var method = _a.method, path = _a.path, handler = _a.handler;
            return _this.addRoute(method, path, handler);
        });
    };
    return AfterworkJS;
}());
exports.AfterworkJS = AfterworkJS;
var afserver_mjs_2 = require("../server/afserver.mjs");
Object.defineProperty(exports, "Response", { enumerable: true, get: function () { return afserver_mjs_2.Response; } });
