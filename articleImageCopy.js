const path = require("path");
const fs = require("fs");

const articleFilePathArr = [...process.argv.slice(2)];
try {
  articleFilePathArr.forEach((pathStr) => {
    // fs.appendFileSync("aaa", pathStr, "utf-8");
    const content = fs.readFileSync(path.resolve(pathStr), "utf-8");
    const targetLines = content
      .split("\n")
      .filter((line) => /^!\[.*?\]\(/.test(line));
    fs.appendFileSync("aaa", targetLines.join("\n"), "utf-8");
  });
} catch (error) {
  console.log(error);
  throw new Error(error);
}
