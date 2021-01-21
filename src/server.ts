import express from "express"

export function createServer(json: Record<string, any>)
{
	let app = express()

	app.get('*', (req, res) =>
	{
		if (!req.path.endsWith('.json'))
			return res.status(404).json({
				error: "not found"
			})

		let path = req.path
			.replace(/\.json$/, '') // remove '.json'
			.substr(1) // remove leading slash
			.split('/')
			.map(decodeURIComponent)
		
		if (path.length == 1)
			if (!path[0])
				return res.json(json)
		
		res.json(recursiveGet(json, path))
	})

	return app
}

export function recursiveGet(json: Record<string, any>, path: string[])
{
	let cur = json
	for (let i = 0; i < path.length; i++)
	{
		let fname = path[i]
		if (!(fname in cur))
			return null

		cur = cur[fname]
	}
	return cur
}
