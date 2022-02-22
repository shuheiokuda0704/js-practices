const sqlite3 = require("sqlite3")
const argv = require('minimist')(process.argv.slice(2))

const list_option = argv.l || false
const reference_option = argv.r || false
const delete_option = argv.d || false

class Memo {
  constructor() {
  }

  async open() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database("./test.db");
      this.db.serialize(() => {
        this.db.run("create table if not exists memos(id INTEGER PRIMARY KEY AUTOINCREMENT, title, content)");
      });
      resolve(true);
    });
  }

  async all() {
    return new Promise((resolve, reject) => {
      this.db.all("select * from memos", async (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  insert(title, content) {
    this.db.run("insert into memos(title, content) values(?, ?)", title, content);
  }

  delete(id) {
    this.db.run("delete from memos where id=?", id);
  }

  close() {
    this.db.close();
  }
}

(async() => { 
  memo = new Memo();
  await memo.open();

  if (list_option) {
    const memos = await memo.all();
    memos.forEach(memo => console.log(memo.title));
  } else if (reference_option) {
    console.log("Choose a note you want to see:");
  } else if (delete_option) {
    console.log("delete");
  } else {
    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    var lines = [];
    var reader = require("readline").createInterface({
      input: process.stdin
    });

    reader.on("line", (line) => {
      lines.push(line);
    });
    reader.on("close", () => {
      memo.insert(lines[0], lines);
    })
  }

  memo.close();
})();
