const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyparser = require('body-parser');

const app = express();
app.use(bodyparser.urlencoded({ extende:true }));
app.use(bodyparser.json());

app.get('/', (req, res) => {
  res.send(fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8'));
});

app.get('/dict.json', (req, res) => {
  res.send(fs.readFileSync(path.resolve(__dirname, '../dict.json'), 'utf-8'));
});

app.post('/', (req, res) => {
  try {
    fs.writeFileSync(path.resolve(__dirname, '../dict.json'), req.body.json, 'utf-8');
    res.send({
      code: 0,
      data: 'ok',
    });
  } catch (err) {
    res.send({
      code: 1000,
      error: err,
    });
  }
  
});

app.listen(2019);