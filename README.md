# JSON Tree Server

Serves JSON over HTTP similar to Firebase Realtime Database HTTP.

## Usage

[![NPM](https://img.shields.io/npm/v/json-tree-server)](https://www.npmjs.com/package/json-tree-server)

`npx json-tree-server ./source`

Launches an HTTP server that serves nested JSON structures from the provided `./source` directory.

### Extra arguments:

- `-p {PORT}`: port to listen on (default: `3000`)
- `--enable-json-postfix`: all queries must end with '.json' (for compatibility with Firebase RTDB)

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
// GET /api
{"v":"0.1","nested":{"object":true}}

// GET /api/nested
{"object":true}

// GET /api/nested/object
true

// GET /
{"api":{"v":"0.1","nested":{"object":true}},"configs":{"extra":{"array":[{"name":"object"},false]}}}


// Use number indexes to fetch array elements:
// GET /configs/extra/array/0
{"name":"element"}

// GET /configs/extra/array/1
false
```

## Why?

It's common to have multiple JSON files for different kinds of configuration.  
`json-tree-server` helps you maintain these files and query them similar to regular REST APIs.
