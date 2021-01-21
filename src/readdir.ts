import readdir from "directory-tree"
import { resolve as pathResolve } from "path"
import fs from "fs"

export function readTree(path: string)
{
	let p = pathResolve(path)
	let tree = readdir(p)
	let info = treeToObj(tree)
	let load = loadFilesToObj(info.obj)
	return {
		...info,
		...load,
	}
}

export function removePrefix(tree: readdir.DirectoryTree, prefix: string): readdir.DirectoryTree
{
	return {
		...tree,
		path: tree.path.substr(prefix.length),
		children: tree.children?.map(x => removePrefix(x, prefix))
	}
}

function loadFilesToObj(obj: Record<string, string | {}>)
{
	let fileErrors: string[] = []
	let res = _loadFilesToObj(obj, fileErrors)
	return {
		obj: res,
		fileErrors
	}
}

function _loadFilesToObj(obj: Record<string, string | {}>, fileErrors: string[]): Record<string, any>
{
	let copy = {} as Record<string, any>
	for (let s in obj)
	{
		let pathOrObj = obj[s]
		if (typeof pathOrObj === "string")
		{
			try
			{
				copy[s] = JSON.parse(fs.readFileSync(pathOrObj).toString('utf8'))
			}
			catch(e)
			{
				fileErrors.push(pathOrObj)
			}
		}
		else
		{
			copy[s] = _loadFilesToObj(pathOrObj, fileErrors)
		}
	}
	return copy
}

export function treeToObj(tree: readdir.DirectoryTree)
{
	let duplicates: string[] = []
	let nonJsons: string[] = []
	let emptyDirs: string[] = []
	let obj = _treeToObj(tree, duplicates, nonJsons, emptyDirs)
	return { obj, duplicates, nonJsons, emptyDirs }
}

function _treeToObj(tree: readdir.DirectoryTree, duplicates: string[] = [], nonJsons: string[] = [], emptyDirs: string[] = []): Record<string, string | {}>
{
	let json = {} as Record<string, string | {}>
	
	if (!tree.children)
		return json

	for (let c of tree.children)
	{
		switch (c.type)
		{
			case "file":
				if (c.extension != ".json")
				{
					nonJsons.push(c.path)
					break
				}
				let fileName = c.name.replace(/\.json$/, '')
				if (json[fileName])
				{
					duplicates.push(c.path)
					break
				}
				
				json[fileName] = c.path
				break
			
			case "directory":
				if (json[c.name])
				{
					duplicates.push(c.path)
					break
				}
				json[c.name] = _treeToObj(c, duplicates, nonJsons, emptyDirs)
				break
		}
	}
	return json
}
