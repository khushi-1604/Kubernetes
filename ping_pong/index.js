const express = require("express");
const app = express();

app.get("/ping", (req, res) => {
  res.send("pong");
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server running on port ${port}`));
