const express = require("express");
const fs = require("fs");
const app = express();

const pingPath = "/data/counter.txt";
const random = require("crypto").randomUUID();

app.get("/status", (req, res) => {
  let count = 0;
  try {
    count = parseInt(fs.readFileSync(pingPath, "utf8")) || 0;
  } catch {}

  res.send(`${new Date().toISOString()}: ${random}\nPing / Pongs: ${count}`);
});

app.listen(3001, () => console.log("Reader running"));
