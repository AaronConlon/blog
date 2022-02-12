const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

const logError = (error, stdout, stderr) => {
  if (error) {
    fs.appendFileSync("error.log", `error 7: ${error}\n`, "utf-8");
    return;
  }
  if (stderr) {
    fs.appendFileSync("error.log", `error 11:${stderr}\n`, "utf-8");
    return;
  }
  fs.appendFileSync("error.log", `error 14: ${error || stdout}\n`, "utf-8");
};

const articleFilePathArr = [...process.argv.slice(2)];
try {
  articleFilePathArr.forEach((pathStr) => {
    // fs.appendFileSync("aaa", pathStr, "utf-8");
    let content = fs.readFileSync(path.resolve(pathStr), "utf-8");
    const targetLines = content
      .split("\n")
      .filter((line) => /^!\[.*?\]\(/.test(line));
    const replaceKeywordMapArr = [];
    targetLines.forEach((line) => {
      // test
      // logError(`line is:\n${line}\n`);
      const relativePath = line.replace(/^.*\]\(/, "").replace(/\)$/, "");
      // logError(`relative path is: \n${relativePath}\n`);
      const fileName = relativePath.replace(path.dirname(relativePath), "");
      // logError(`fileName path is: \n${fileName}\n`);

      // copy file
      exec(`cp -n "${relativePath}" "${path.join(__dirname, "articleImgs")}"`);
      // replace local relative path ro current repo relative path
      // exec(`sed 's#${relativePath}#../articleImgs${fileName}#g'`, logError);
      replaceKeywordMapArr.push([relativePath, `../articcleImgs${fileName}`]);
    });
    replaceKeywordMapArr.forEach(([source, target]) => {
      content = content.replace(source, target);
    });
    // save content to file
    fs.writeFileSync(path.resolve(pathStr), content, "utf-8");
  });
} catch (error) {
  logError(`${error}\n`);
  // throw new Error(error);
}
