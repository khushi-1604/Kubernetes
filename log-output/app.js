const axios = require('axios');
const express = require('express');
const app = express();

const randomString = Math.random().toString(36).substr(2, 10);

app.get('/status', async (req, res) => {
  const timestamp = new Date().toISOString();

  let pingCount = "unknown";

  try {
    const resp = await axios.get('http://pingpong-svc:3001/pingpong');
    pingCount = resp.data;
  } catch (err) {
    pingCount = "error connecting to ping-pong";
  }

  res.send(`${timestamp}: ${randomString}<br>Ping/Pong: ${pingCount}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Log-output running on port ${PORT}`);
});
