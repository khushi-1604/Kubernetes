app.put('/todos/:id', async (req, res) => {
  const id = req.params.id;
  const { done } = req.body;

  try {
    const result = await pool.query(
      'UPDATE todos SET done=$1 WHERE id=$2 RETURNING *',
      [done, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database update failed' });
  }
});
