const express = require('express');
const bodyParser = require('body-parser');
const app = express();

let todos = [
  { id: 1, text: "Sample todo 1" },
  { id: 2, text: "Sample todo 2" }
];

app.use(bodyParser.json());

app.get('/todos', (req, res) => {
  res.json(todos);
});

app.post('/todos', (req, res) => {
  const text = req.body.text;

  if (!text || text.length > 140) {
    return res.status(400).json({ error: "Todo must be 1–140 characters" });
  }

  const todo = {
    id: todos.length + 1,
    text
  };

  todos.push(todo);

  res.json(todo);
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Todo backend running on port ${PORT}`);
});
