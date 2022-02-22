const { listeners } = require("process");

const argv = require('minimist')(process.argv.slice(2))
console.log(argv)
const list_option = argv.l || false
const reference_option = argv.r || false
const delete_option = argv.d || false

if (list_option) {
  console.log("list");
} else if (reference_option) {
  console.log("reference");
} else if (delete_option) {
  console.log("delete");
} else {
  process.stdin.resume();
  process.stdin.setEncoding('utf8');

  var reader = require("readline").createInterface({
  input: process.stdin
  });

  reader.on("line", (line) => {
    console.log(line);
  });
}
