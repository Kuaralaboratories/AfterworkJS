"use strict";
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
exports.Response = exports.AFServer = void 0;
var http_1 = require("http");
Object.defineProperty(exports, "Response", { enumerable: true, get: function () { return http_1.ServerResponse; } });
var url_1 = require("url");
var AFServer = /** @class */ (function () {
    function AFServer() {
        this.routes = {};
        this.middlewares = [];
        this.createServer();
    }
    AFServer.prototype.use = function (middleware) {
        this.middlewares.push(middleware);
    };
    AFServer.prototype.listen = function (port, callback) {
        this.server.listen(port, callback);
    };
    AFServer.prototype.attachMiddleware = function (req, res, next) {
        req.db = this.dbAdapter;
        req.user = {};
        next();
    };
    AFServer.prototype.createServer = function () {
        var _this = this;
        this.server = (0, http_1.createServer)(function (req, res) {
            if (req.url) {
                var parsedUrl = (0, url_1.parse)(req.url, true);
                req.query = parsedUrl.query;
            }
            res.json = function (data) {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
            };
            _this.handleRequest(req, res);
        });
    };
    AFServer.prototype.matchRoute = function (pathname, method) {
        var routesForMethod = Object.keys(this.routes).filter(function (routePath) {
            var pathSegments = routePath.split('/');
            var urlSegments = pathname.split('/');
            if (pathSegments.length !== urlSegments.length)
                return false;
            return pathSegments.every(function (segment, i) { return segment === urlSegments[i] || segment.startsWith(':') || segment === '*'; });
        });
        if (routesForMethod.length > 0) {
            var matchedRoute = routesForMethod[0]; // In case of multiple matches, take the first
            var pathSegments = matchedRoute.split('/');
            var urlSegments_1 = pathname.split('/');
            var params_1 = {};
            pathSegments.forEach(function (segment, i) {
                if (segment.startsWith(':')) {
                    var paramName = segment.slice(1);
                    params_1[paramName] = urlSegments_1[i];
                }
            });
            return { handlers: this.routes[matchedRoute][method], params: params_1 };
        }
        return null;
    };
    AFServer.prototype.handleRequest = function (req, res) {
        var _a;
        var pathname = (0, url_1.parse)(req.url, true).pathname;
        var method = req.method.toLowerCase();
        var routeMatch = this.matchRoute(pathname, method);
        var routeHandlers = ((_a = this.routes[pathname]) === null || _a === void 0 ? void 0 : _a[method]) || [];
        var handlers = __spreadArray(__spreadArray([], this.middlewares, true), routeHandlers, true);
        if (routeMatch) {
            req.params = routeMatch.params;
            var handlers_1 = __spreadArray(__spreadArray([], this.middlewares, true), routeMatch.handlers, true);
            var index_1 = 0;
            var next_1 = function (err) {
                if (err) {
                    res.statusCode = 500;
                    res.end("Internal Server Error: ".concat(err.message));
                    return;
                }
                var handler = handlers_1[index_1++];
                if (handler) {
                    handler(req, res, next_1);
                }
                else {
                    res.statusCode = 404;
                    res.end('Not Found');
                }
            };
            next_1();
        }
        else {
            res.statusCode = 404;
            res.end('Not Found');
        }
    };
    AFServer.prototype.addRoute = function (method, path, handler) {
        if (!this.routes[path]) {
            this.routes[path] = {};
        }
        if (!this.routes[path][method]) {
            this.routes[path][method] = [];
        }
        this.routes[path][method].push(handler);
    };
    AFServer.prototype.get = function (path, handler) {
        this.addRoute('get', path, handler);
    };
    AFServer.prototype.post = function (path, handler) {
        this.addRoute('post', path, handler);
    };
    AFServer.prototype.put = function (path, handler) {
        this.addRoute('put', path, handler);
    };
    AFServer.prototype.delete = function (path, handler) {
        this.addRoute('delete', path, handler);
    };
    return AFServer;
}());
exports.AFServer = AFServer;
