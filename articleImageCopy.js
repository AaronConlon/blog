const path = require("path");
const fs = require("fs");

const articleFilePathArr = [...process.argv.slice(2)];
try {
  articleFilePathArr.forEach((pathStr) => {
    fs.appendFileSync("aaa", pathStr, "utf-8");
  });
} catch (error) {
  console.log(error);
  throw new Error(error);
}
