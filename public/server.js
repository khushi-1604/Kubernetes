const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

// Serve static files (including index.html)
app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});
