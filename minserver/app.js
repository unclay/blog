const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send(fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8'));
});

app.post('/', (req, res) => {
  res.end('123');
});

app.listen(2019);