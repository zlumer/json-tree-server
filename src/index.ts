import { collectWarnings as collectErrors, readTree } from "./readdir"
import { createServer } from "./server"
import arg from "arg"

const args = arg({
	"--port": Number,
	"-p": "--port",
})

const PATH = args._[0]
if (!PATH)
{
	console.error(`input directory should be provided!`)
	process.exit(1)
}

console.log(`loading json from ${PATH}`)

let info = readTree(PATH)

for (let x of collectErrors(info))
	console.error(`error: ${x}`)

let app = createServer(info.json)

let PORT = args["--port"] || process.env.PORT || 3000

console.log(`starting server on ${PORT}...`)
app.listen(PORT, () =>
{
	console.log(`server started on ${PORT}`)
})
