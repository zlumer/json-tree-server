#!/usr/bin/env node
import { collectWarnings as collectErrors, readTree } from "./readdir"
import { createServer } from "./server"
import arg from "arg"

const args = arg({
	"--port": Number,
	"-p": "--port",
	"--enable-json-postfix": Boolean,
})

function printUsage()
{
	console.log(
		`Usage:`
		+ `\nnpx json-tree-server [PATH]`
		+ `\n\t[PATH] \t\t\t directory with JSON files`
		+ `\n\t--port, -p \t\t port to listen on (default 3000)`
		+ `\n\t--enable-json-postfix \t all queries must end with '.json' (for compatibility with Firebase RTDB)`
	)
}

const PATH = args._[0]
if (!PATH)
{
	console.error(`input directory should be provided!`)
	printUsage()
	process.exit(1)
}

console.log(`loading json from ${PATH}`)

let info = readTree(PATH)

for (let x of collectErrors(info))
	console.error(`error: ${x}`)

let app = createServer(info.json, !!args["--enable-json-postfix"])

let PORT = args["--port"] || process.env.PORT || 3000

console.log(`starting server on ${PORT}...`)
app.listen(PORT, () =>
{
	console.log(`server started on ${PORT}`)
})
