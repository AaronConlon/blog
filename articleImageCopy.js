const path = require("path");
const fs = require("fs");
console.log("get a file");

fs.writeFileSync(path.join(__dirname, "aaaa"), "adasdad", "utf-8");
