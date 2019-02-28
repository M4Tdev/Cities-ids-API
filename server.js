const fs = require('fs');
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

let citiesList;

fs.readFile(path.join(__dirname, 'city.list.json'), (err, data) => {
  if (err) throw err;
  citiesList = data;
});

app.get('/', (req, res) => {
  if (req.query !== {} && req.query.q) {
    const jsonData = JSON.parse(citiesList);
    const results = jsonData.filter(obj => {
      // const regex = new RegExp(req.query.q, 'gi'); // will find users input if city or country name no matter where it is located in the name
      const regex = new RegExp(`^${req.query.q}`, 'gi'); // will find users input if city or country name starts with it
      return obj.name.match(regex) || obj.country.match(regex);
    });
    // filtering to not return duplicated values
    const filtered = results.filter(
      (location, i, arr) =>
        i ===
        arr.findIndex(
          item =>
            location.name === item.name && location.country === item.country
        )
    );
    res.json(filtered);
  } else {
    res.status(400).json({ msg: 'Url was not found on the server' });
  }
});

app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
