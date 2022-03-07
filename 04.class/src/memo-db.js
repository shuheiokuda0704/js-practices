#!/usr/bin/env node

const Sqlite3 = require('sqlite3')

module.exports = class MemoDB {
  constructor (dbFile) {
    this.dbFile = dbFile
  }

  open () {
    return new Promise((resolve, reject) => {
      this.db = new Sqlite3.Database(this.dbFile)
      this.db.serialize(() => {
        this.db.run('create table if not exists memos(id INTEGER PRIMARY KEY AUTOINCREMENT, title, content)')
      })
      resolve(true)
    })
  }

  all () {
    return new Promise((resolve, reject) => {
      this.db.all('select * from memos', async (err, rows) => {
        if (err) reject(err)
        resolve(rows)
      })
    })
  }

  insert (title, content) {
    return new Promise((resolve, reject) => {
      this.db.run('insert into memos(title, content) values(?, ?)', title, content)
    })
  }

  delete (id) {
    return new Promise((resolve, reject) => {
      this.db.run('delete from memos where id=?', id)
    })
  }

  close () {
    return new Promise((resolve, reject) => {
      this.db.close()
    })
  }
}
