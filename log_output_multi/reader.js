const express = require("express");
const fs = require("fs");
const app = express();
const path = "/data/log.txt";

app.get("/status", (req, res) => {
  let content = "";
  try {
    content = fs.readFileSync(path, "utf8");
  } catch (err) {
    content = "No log yet";
  }
  res.type("text/plain").send(content);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Reader started on port ${PORT}`);
});
