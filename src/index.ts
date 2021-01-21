import express from "express"

let app = express()

let PORT = process.env.PORT || 3006

console.log(`starting server on ${PORT}...`)
app.listen(PORT, () =>
{
	console.log(`server started on ${PORT}`)
})
