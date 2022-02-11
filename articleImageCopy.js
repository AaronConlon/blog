const path = require("path");
const fs = require("fs");

const articleFilePath = process.argv[1];
try {
  fs.appendFileSync(path.resolve(articleFilePath), articleFilePath, "utf-8");
} catch (error) {
  console.log(error);
  throw new Error(error);
}
