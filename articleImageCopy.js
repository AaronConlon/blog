const path = require("path");
const fs = require("fs");

const articleFilePath = process.argv[2];
try {
  fs.appendFileSync("aaa", process.argv.join("/n"), "utf-8");
} catch (error) {
  console.log(error);
  throw new Error(error);
}
