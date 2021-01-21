"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.treeToObj = exports.removePrefix = exports.collectWarnings = exports.readTree = void 0;
const directory_tree_1 = __importDefault(require("directory-tree"));
const path_1 = require("path");
const fs_1 = __importDefault(require("fs"));
function readTree(path) {
    let p = path_1.resolve(path);
    let tree = directory_tree_1.default(p);
    let info = treeToObj(tree);
    let load = loadFilesToObj(info.tree);
    return Object.assign(Object.assign({}, info), load);
}
exports.readTree = readTree;
function collectWarnings(info) {
    return [
        ...info.duplicates.map(x => `duplicate path: ${x}`),
        ...info.emptyDirs.map(x => `empty dir: ${x}`),
        ...info.fileErrors.map(x => `error reading ${x}`),
        ...info.nonJsons.map(x => `non-json file: ${x}`),
    ];
}
exports.collectWarnings = collectWarnings;
function removePrefix(tree, prefix) {
    var _a;
    return Object.assign(Object.assign({}, tree), { path: tree.path.substr(prefix.length), children: (_a = tree.children) === null || _a === void 0 ? void 0 : _a.map(x => removePrefix(x, prefix)) });
}
exports.removePrefix = removePrefix;
function loadFilesToObj(obj) {
    let fileErrors = [];
    let json = _loadFilesToObj(obj, fileErrors);
    return {
        json,
        fileErrors
    };
}
function _loadFilesToObj(obj, fileErrors) {
    let copy = {};
    for (let s in obj) {
        let pathOrObj = obj[s];
        if (typeof pathOrObj === "string") {
            try {
                copy[s] = JSON.parse(fs_1.default.readFileSync(pathOrObj).toString('utf8'));
            }
            catch (e) {
                fileErrors.push(pathOrObj);
            }
        }
        else {
            copy[s] = _loadFilesToObj(pathOrObj, fileErrors);
        }
    }
    return copy;
}
function treeToObj(tree) {
    let duplicates = [];
    let nonJsons = [];
    let emptyDirs = [];
    let obj = _treeToObj(tree, duplicates, nonJsons, emptyDirs);
    return { tree: obj, duplicates, nonJsons, emptyDirs };
}
exports.treeToObj = treeToObj;
function _treeToObj(tree, duplicates = [], nonJsons = [], emptyDirs = []) {
    let json = {};
    if (!tree.children)
        return json;
    for (let c of tree.children) {
        switch (c.type) {
            case "file":
                if (c.extension != ".json") {
                    nonJsons.push(c.path);
                    break;
                }
                let fileName = c.name.replace(/\.json$/, '');
                if (json[fileName]) {
                    duplicates.push(c.path);
                    break;
                }
                json[fileName] = c.path;
                break;
            case "directory":
                if (json[c.name]) {
                    duplicates.push(c.path);
                    break;
                }
                json[c.name] = _treeToObj(c, duplicates, nonJsons, emptyDirs);
                break;
        }
    }
    return json;
}
