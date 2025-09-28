/*  storium-db.js
 *  Minimal relational‑style in‑memory DB for the Storium‑demo.
 *  It is deliberately tiny, has no external dependencies and can be
 *  published to npm or hosted raw on GitHub.
 *
 *  Exported symbols:
 *    - class TableParser   – parses pipe‑delimited text into tables
 *    - class DataModel    – CRUD container for the parsed tables
 *    - class ExportImport – serialize/deserialize the whole model
 *
 *  The library is written in plain ES‑module syntax so it works in the
 *  browser (`<script type="module">`) and in Node.js.
 */

export class TableParser {
  constructor(text) { this.text = text }

  /** Convert the whole text block into an object:
   *   { tblGames:[{id:0,…}], tblPlayers:[…], … }
   */
  parse () {
    const out = {}
    // split on the start of each table (tblX:)
    const blocks = this.text.split(/(?=tbl\w+:)/g)

    for (const block of blocks) {
      const nameMatch = block.match(/^(\w+):/)
      if (!nameMatch) continue
      const tableName = nameMatch[1]

      // remove the first line (the “tblX:” header)
      const lines = block.replace(/^.+?\n/, '').trim().split('\n')
      const header = lines.shift().split('|').map(s => s.trim())

      out[tableName] = lines.map(line => {
        const values = line.split('|').map(s => s.trim())
        const obj = {}
        header.forEach((col, i) => {
          let v = values[i] ?? ''
          // numeric conversion (but keep empty strings)
          if (v !== '' && !isNaN(v)) v = Number(v)
          obj[col] = v
        })
        return obj
      })
    }
    return out
  }
}

/* -------------------------------------------------------------
 *  DataModel – simple CRUD container
 * ---------------------------------------------------------- */
export class DataModel {
  constructor(tables = {}) { this.tables = tables }

  /** Get an array of rows for a table (or empty array) */
  get (tbl) { return this.tables[tbl] ?? [] }

  /** Insert a new row */
  add (tbl, row) { this.get(tbl).push(row) }

  /** Update a row by its primary‑key “id” */
  update (tbl, id, patch) {
    const rec = this.get(tbl).find(r => r.id === id)
    if (rec) Object.assign(rec, patch)
  }

  /** Delete a row by id */
  remove (tbl, id) {
    this.tables[tbl] = this.get(tbl).filter(r => r.id !== id)
  }

  /** Return the next free integer id for a table */
  nextId (tbl) {
    const ids = this.get(tbl).map(r => r.id)
    return ids.length ? Math.max(...ids) + 1 : 1
  }
}

/* -------------------------------------------------------------
 *  ExportImport – turn the whole model into pipe‑delimited text
 * ---------------------------------------------------------- */
export class ExportImport {
  constructor (model) { this.model = model }

  /** Serialize the entire model.
   *  Returns a single string that can be split into any number of
   *  parts (the demo splits it into three). */
  toString () {
    const sections = []
    for (const tbl of Object.keys(this.model.tables)) {
      const rows = this.model.tables[tbl]
      if (!rows.length) continue
      const header = Object.keys(rows[0]).join('|')
      const body = rows.map(r => Object.values(r).join('|')).join('\n')
      sections.push(`${tbl}:${header}\n${body}`)
    }
    return sections.join('\n\n')
  }

  /** Load data from one or more pipe‑delimited strings.
   *  `sources` can be an array of strings or a single string. */
  fromStrings (sources) {
    const combined = Array.isArray(sources) ? sources.join('\n\n') : sources
    const parser = new TableParser(combined)
    this.model.tables = parser.parse()
  }
}
