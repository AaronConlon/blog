const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

const logError = (err) => {
  fs.appendFileSync("error.log", `${err.message}\n`, "utf-8");
};
const articleFilePathArr = [...process.argv.slice(2)];
try {
  articleFilePathArr.forEach((pathStr) => {
    // fs.appendFileSync("aaa", pathStr, "utf-8");
    const content = fs.readFileSync(path.resolve(pathStr), "utf-8");
    const targetLines = content
      .split("\n")
      .filter((line) => /^!\[.*?\]\(/.test(line));
    targetLines.forEach((line) => {
      const relativePath = line.replace(/^.*\]\(/, "").replace(/\]$/, "");
      const fileName = relativePath.replace(path.dirname(relativePath), "");
      // copy file
      exec(
        `cp ${relativePath} ${path.join(__dirname, "articleImgs")}`,
        logError
      );
      // replace local relative path ro current repo relative path
      exec(`sed -i s/${relativePath}/../articleImgs${fileName}`, logError);
    });
    fs.appendFileSync("aaa", targetLines.join("\n"), "utf-8");
  });
} catch (error) {
  logError(`${error}\n`);
  throw new Error(error);
}
