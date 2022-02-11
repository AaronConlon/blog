const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

const logError = (err) => {
  fs.appendFileSync("error.log", `${err}\n`, "utf-8");
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
      // test
      logError(`line is:\n${line}\n`);
      const relativePath = line.replace(/^.*\]\(/, "").replace(/\)$/, "");
      logError(`relative path is: \n${relativePath}\n`);
      const fileName = relativePath.replace(path.dirname(relativePath), "");
      logError(`fileName path is: \n${fileName}\n`);

      // copy file
      exec(
        `cp "${relativePath}" "${path.join(__dirname, "articleImgs")}"`,
        logError
      );
      // replace local relative path ro current repo relative path
      exec(
        `sed -i '' 's#${relativePath}#../articleImgs${fileName}#g'`,
        logError
      );
    });
  });
} catch (error) {
  logError(`${error}\n`);
  throw new Error(error);
}
