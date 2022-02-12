const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

const articleImgDir = "mdImgs";
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

if (!fs.existsSync(path.join(__dirname, "public", articleImgDir))) {
  fs.mkdirSync(articleImgDir);
}
if (!fs.existsSync(path.join(__dirname, "posts", articleImgDir))) {
  fs.mkdirSync(articleImgDir);
}

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
      let relativePath;
      if (line.includes("img src=")) {
        // 使用了 img 标签的本地截图
        // relativePath
        const matchArr = line.match(/src=".*?"/);
        if (matchArr) {
          [relativePath] = matchArr;
          relativePath = relativePath.replace(/(src=|")/g, "");
        } else {
          return;
        }
      } else {
        relativePath = line.replace(/^.*\]\(/, "").replace(/\)$/, "");
      }
      // copy file
      exec(
        `cp -n "${relativePath}" "${path.join(
          __dirname,
          "public",
          articleImgDir
        )}"`
      );
      exec(
        `cp -n "${relativePath}" "${path.join(
          __dirname,
          "posts",
          articleImgDir
        )}"`
      );
      // replace local relative path ro current repo relative path
      const localPath = path.dirname(relativePath);
      replaceKeywordMap.set(localPath, true);
    });
    [...replaceKeywordMap.keys()].forEach((localPath) => {
      content = content.replaceAll(localPath, articleImgDir);
    });
    // save content to file
    fs.writeFileSync(path.resolve(pathStr), content, "utf-8");
  });
} catch (error) {
  logError(`66: ${error}\n`);
  throw new Error(error);
}
