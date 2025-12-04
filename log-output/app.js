const express = require("express");
const app = express();
const { v4: uuidv4 } = require("uuid");

const randomString = uuidv4();

app.get("/status", (req, res) => {
  res.json({
    timestamp: new Date().toISOString(),
    randomString: randomString
  });
});

// Keep previous logging every 5 seconds (if still needed)
setInterval(() => {
  console.log(`${new Date().toISOString()}: ${randomString}`);
}, 5000);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});
