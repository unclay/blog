const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyparser = require('body-parser');

const app = express();
app.use(bodyparser.urlencoded({ extende:true }));
app.use(bodyparser.json());

// app.use("*", function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
//   res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//   if (req.method === 'OPTIONS') {
//     res.send(200)
//   } else {
//     next()
//   }
// });

app.get('/dictadmin/', (req, res) => {
  res.send(fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8'));
});

app.get('/dictadmin/dict.json', (req, res) => {
  res.send(fs.readFileSync(path.resolve(__dirname, '../dict.json'), 'utf-8'));
});

app.get('/dictadmin/backup', (req, res) => {
  const text = fs.readFileSync(path.resolve(__dirname, '../dict.json'), 'utf-8');
  fs.writeFileSync(path.resolve(__dirname, `../dict-${new Date().getTime()}.json`), text, 'utf-8');
  res.send({
    code: 0,
    data: 'ok',
  });
});

app.post('/dictadmin', (req, res) => {
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