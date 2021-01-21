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
});
const PATH = args._[0];
if (!PATH) {
    console.error(`input directory should be provided!`);
    process.exit(1);
}
console.log(`loading json from ${PATH}`);
let info = readdir_1.readTree(PATH);
for (let x of readdir_1.collectWarnings(info))
    console.error(`error: ${x}`);
let app = server_1.createServer(info.json);
let PORT = args["--port"] || process.env.PORT || 3000;
console.log(`starting server on ${PORT}...`);
app.listen(PORT, () => {
    console.log(`server started on ${PORT}`);
});
