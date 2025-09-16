const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send({ message: 'Hello from the backend!' });
});

app.post('/api/data', (req, res) => {
  console.log('Received data:', req.body);
  res.json({ received: req.body });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
