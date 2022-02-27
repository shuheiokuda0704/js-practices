#!/usr/bin/env node

const Sqlite3 = require("sqlite3");
const { prompt } = require("enquirer");

const argv = require('minimist')(process.argv.slice(2));
const list_option = argv.l || false;
const reference_option = argv.r || false;
const delete_option = argv.d || false;


class MemoDB {
  constructor() {
  }

  open() {
    return new Promise((resolve, reject) => {
      this.db = new Sqlite3.Database("./test.db");
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
    memos.forEach(memo => console.log(memo.title));
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
    const memos = await this.memoDb.all();

    if (memos.length === 0) return;

    const question = [{
      type: 'select',
      name: 'memo',
      message: 'Choose a note you want to delete:',
      choices: memos.map(function(memo) {
        return {id: memo.id, title: memo.title}
      }),
      result() {
        return {id: this.focused.id, title: this.focused.name};
      }
    }];

    let answer = await prompt(question);
    await this.memoDb.delete(answer.memo.id);
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

(() => { 
  memo = new Memo();

  if (list_option) {
    memo.list();
  } else if (reference_option) {
    memo.reference();
  } else if (delete_option) {
   memo.delete();
  } else {
    memo.insert();
  }
})();
