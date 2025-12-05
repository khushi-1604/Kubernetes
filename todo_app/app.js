const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

// New for 1.5: respond to GET /
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head><title>Todo App</title></head>
      <body style="font-family: Arial; margin: 40px;">
        <h1>Todo App is Running 🚀</h1>
        <p>This is the response from GET /</p>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});
app.post('/todos', (req, res) => {
    const { text } = req.body;

    // Logging the received todo
    console.log(`Received TODO: "${text}"`);

    // Validation: max 140 characters
    if (!text || text.length > 140) {
        console.log(`Rejected TODO (too long): length=${text.length}`);
        return res.status(400).json({ error: "Todo must be 1-140 characters long" });
    }

    // Save to in-memory DB
    todos.push({ id: Date.now(), text });

    console.log(`Saved TODO: "${text}"`);
    res.status(201).json({ message: "Todo saved" });
});
