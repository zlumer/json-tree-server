# JSON Tree Server

Serves JSON over HTTP similar to Firebase Realtime Database HTTP.

## Usage

`npx json-tree-server ./source`

Launches an HTTP server that serves nested JSON structures from the provided `./source` directory.

### Extra arguments:

- `-p {PORT}`: port to listen on (default: `3000`)

### Example directory structure:

```
source
|-- api.json
|-- configs
     |-- extra.json
     +-- main.json
```

```jsonc
// api.json:
{
	"v": "0.1",
	"nested": {
		"object": true
	}
}
// configs/extra.json
{
	"array": [
		{"name": "element"},
		false
	]
}
```

Now you can make HTTP requests to server:

```jsonc
// GET /api.json
{"v":"0.1","nested":{"object":true}}

// GET /api/nested.json
{"object":true}

// GET /api/nested/object.json
true

// To fetch all of the data, use
// GET /.json
// e.g. GET http://localhost:3000/.json (ugly but it works)
{"api":{"v":"0.1","nested":{"object":true}},"configs":{"extra":{"array":[{"name":"object"},false]}}}


// Use number indexes to fetch array elements:
// GET /configs/extra/array/0.json
{"name":"element"}

// GET /configs/extra/array/1.json
false
```
