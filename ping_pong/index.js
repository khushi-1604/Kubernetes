const express = require("express");
const fs = require("fs");
const path = "/data/counter.txt";

let counter = 0;
try {
  counter = parseInt(fs.readFileSync(path, "utf8")) || 0;
} catch {}

const app = express();

app.get("/pingpong", (req, res) => {
  counter++;
  fs.writeFileSync(path, counter.toString());
  res.send(`pong ${counter}`);
});

app.listen(3000, () => console.log("Pingpong running"));
