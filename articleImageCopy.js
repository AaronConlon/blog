const path = require("path");
const fs = require("fs");

fs.writeFileSync(
  path.join(__dirname, "aaaa"),
  process.argv.join("-"),
  "utf-8"
);
