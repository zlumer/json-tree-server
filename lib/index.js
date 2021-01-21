#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readdir_1 = require("./readdir");
const server_1 = require("./server");
const arg_1 = __importDefault(require("arg"));
const args = arg_1.default({
    "--port": Number,
    "-p": "--port",
    "--enable-json-postfix": Boolean,
});
function printUsage() {
    console.log(`Usage:`
        + `\nnpx json-tree-server [PATH]`
        + `\n\t[PATH] \t\t\t directory with JSON files`
        + `\n\t--port, -p \t\t port to listen on (default 3000)`
        + `\n\t--enable-json-postfix \t all queries must end with '.json' (for compatibility with Firebase RTDB)`);
}
const PATH = args._[0];
if (!PATH) {
    console.error(`input directory should be provided!`);
    printUsage();
    process.exit(1);
}
console.log(`loading json from ${PATH}`);
let info = readdir_1.readTree(PATH);
for (let x of readdir_1.collectWarnings(info))
    console.error(`error: ${x}`);
let app = server_1.createServer(info.json, !!args["--enable-json-postfix"]);
let PORT = args["--port"] || process.env.PORT || 3000;
console.log(`starting server on ${PORT}...`);
app.listen(PORT, () => {
    console.log(`server started on ${PORT}`);
});
