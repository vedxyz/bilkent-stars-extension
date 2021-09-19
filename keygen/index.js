const { generateKeySync } = require("crypto");
const { writeFileSync } = require("fs");

writeFileSync("bstarsext.key", generateKeySync("aes", { length: 256 }).export().toString("hex"), "utf8");
