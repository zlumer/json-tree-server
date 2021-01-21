"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recursiveGet = exports.createServer = void 0;
const express_1 = __importDefault(require("express"));
function createServer(json) {
    let app = express_1.default();
    app.get('*', (req, res) => {
        if (!req.path.endsWith('.json'))
            return res.status(404).json({
                error: "not found"
            });
        let path = req.path
            .replace(/\.json$/, '') // remove '.json'
            .substr(1) // remove leading slash
            .split('/')
            .map(decodeURIComponent);
        if (path.length == 1)
            if (!path[0])
                return res.json(json);
        res.json(recursiveGet(json, path));
    });
    return app;
}
exports.createServer = createServer;
function recursiveGet(json, path) {
    let cur = json;
    for (let i = 0; i < path.length; i++) {
        let fname = path[i];
        if (!(fname in cur))
            return null;
        cur = cur[fname];
    }
    return cur;
}
exports.recursiveGet = recursiveGet;
