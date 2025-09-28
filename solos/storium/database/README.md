API reference
Class	Method	Description
TableParser	constructor(text)	Store the raw pipe‑delimited string.
parse()	Returns an object { tblGames:[…], tblPlayers:[…], … }.
DataModel	constructor(tables = {})	Initialise with an optional tables object.
get(tableName)	Returns the array of rows (or empty array).
add(tableName, row)	Push a new row.
update(tableName, id, patch)	Merge patch into the row whose id matches.
remove(tableName, id)	Delete the row with the given id.
nextId(tableName)	Generate the next integer primary key for the table.
ExportImport	constructor(model)	Bind to a DataModel instance.
toString()	Serialize the whole model to pipe‑delimited text (tables separated by blank lines).
fromStrings(sourceArrayOrString)	Load one or many pipe‑delimited strings into the bound model.
All methods are synchronous and operate on plain JavaScript objects – no promises, no async I/O.

Extending the library
Add new tables – just include them in the raw text; the parser automatically creates a new key in the returned object.
Relationships – the library does not enforce foreign keys; you can add helper functions that look up related rows (e.g., getCharactersForScene(sceneId)).
Persistence – because the model is pure data, you can JSON.stringify(model.tables) and store it in localStorage, IndexedDB, or send it to a server.
License
MIT – free to use, modify, and distribute.

Acknowledgements
MyHTML5 – the UI helper used in the demo (StyleRegistry & DOMHandler).
DuckDuckGo / Duck.ai – the platform where this demo was originally requested
