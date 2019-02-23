const fs = require('fs');
const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  fs.readFile(path.join(__dirname, 'test.json'), (err, data) => {
    if (err) throw err;
    const jsonData = JSON.parse(data);
    res.json(jsonData);
  });
});

app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
