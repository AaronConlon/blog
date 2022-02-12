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
    let content = fs.readFileSync(path.resolve(pathStr), "utf-8");
    const targetLines = content
      .split("\n")
      .filter(
        (line) => /^!\[.*?\]\(/.test(line) || /img src="\/User.*?"/.test(line)
      );
    const replaceKeywordMap = new Map();
    targetLines.forEach((line) => {
      // test
      // logError(`line is:\n${line}\n`);
      let relativePath;
      let fileName;
      if (line.includes("img src=")) {
        // 使用了 img 标签的本地截图
        // relativePath
        const matchArr = line.match(/src=".*?"/);
        if (matchArr) {
          [relativePath] = matchArr;
          fileName = `/${path.basename(relativePath)}`;
        } else {
          return;
        }
      } else {
        relativePath = line.replace(/^.*\]\(/, "").replace(/\)$/, "");
        // logError(`relative path is: \n${relativePath}\n`);
        fileName = relativePath.replace(path.dirname(relativePath), "");
        // logError(`fileName path is: \n${fileName}\n`);
      }
      logError(`${relativePath}\n${fileName}\n`);

      // copy file
      exec(`cp -n "${relativePath}" "${path.join(__dirname, "articleImgs")}"`);
      // replace local relative path ro current repo relative path
      // exec(`sed 's#${relativePath}#../articleImgs${fileName}#g'`, logError);
      const localPath = relativePath.replace(fileName, "");
      replaceKeywordMap.set(localPath, true);
    });
    [...replaceKeywordMap.keys()].forEach(([source, target]) => {
      content = content.replace(source, target);
    });
    // save content to file
    fs.writeFileSync(path.resolve(pathStr), content, "utf-8");
  });
} catch (error) {
  logError(`${error}\n`);
  // throw new Error(error);
}
