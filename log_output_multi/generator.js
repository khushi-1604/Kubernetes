const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const path = "/data/log.txt";

const randomString = uuidv4();

setInterval(() => {
  const line = `${new Date().toISOString()}: ${randomString}\n`;
  fs.appendFileSync(path, line, "utf8");
  console.log(line.trim());
}, 5000);
