#!/usr/bin/env node

const sqlite3 = require("sqlite3")
const argv = require('minimist')(process.argv.slice(2))

const list_option = argv.l || false
const reference_option = argv.r || false
const delete_option = argv.d || false

class MemoDB {
  constructor() {
  }

  open() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database("./test.db");
      this.db.serialize(() => {
        this.db.run("create table if not exists memos(id INTEGER PRIMARY KEY AUTOINCREMENT, title, content)");
      });
      resolve(true);
    });
  }

  all() {
    return new Promise((resolve, reject) => {
      this.db.all("select * from memos", async (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  insert(title, content) {
    return new Promise((resolve, reject) => {
      this.db.run("insert into memos(title, content) values(?, ?)", title, content);
    });
  }

  delete(id) {
    return new Promise((resolve, reject) => {
      this.db.run("delete from memos where id=?", id);
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      this.db.close();
    });
  }
}

class Memo {
  constructor() {
    this.memoDb = new MemoDB();
  }

  async list() {
    await this.memoDb.open();
    const memos = await this.memoDb.all();
    this.memoDb.close();

    return memos;
  }

  async reference() {
    await this.memoDb.open();
    console.log("Choose a note you want to see:");
    this.memoDb.close();
  }

  async delete() {
    await this.memoDb.open();
    console.log("delete");
    this.memoDb.close();
  }

  async insert() {
    await this.memoDb.open();

    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    var lines = [];
    var reader = require("readline").createInterface({
      input: process.stdin
    });

    await reader.on("line", (line) => {
      lines.push(line);
    });
    await reader.on("close", async () => {
      await this.memoDb.insert(lines[0], lines);
      this.memoDb.close();
    })
  }
}

(async() => { 
  memo = new Memo();

  if (list_option) {
    const memos = await memo.list();
    memos.forEach(memo => console.log(memo.title));
  } else if (reference_option) {
    memo.reference();
  } else if (delete_option) {
    memo.delete();
  } else {
    memo.insert();
  }
})();
