// const fs = require('fs');
// const express = require('express');
// const path = require('path');

// const app = express();
// const port = process.env.PORT || 3000;

// // let citiesList;

// // fs.readFile(path.join(__dirname, 'city.list.json'), (err, data) => {
// //   if (err) throw err;
// //   citiesList = data;
// // });

// const citiesList = fs.readFileSync('./city.list.json', 'utf8');

// app.get('/', (req, res) => {
//   if (req.query !== {} && req.query.q) {
//     const jsonData = JSON.parse(citiesList);
//     const results = jsonData.filter(obj => {
//       // const regex = new RegExp(req.query.q, 'gi'); // will find users input if city or country name no matter where it is located in the name
//       const regex = new RegExp(`^${req.query.q}`, 'gi'); // will find users input if city or country name starts with it
//       return obj.name.match(regex) || obj.country.match(regex);
//     });
//     // filtering to not return duplicated values
//     const filtered = results.filter(
//       (location, i, arr) =>
//         i ===
//         arr.findIndex(
//           item =>
//             location.name === item.name && location.country === item.country
//         )
//     );
//     res.json(filtered);
//   } else {
//     res.status(400).json({ msg: 'Url was not found on the server' });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is listening on ${port}`);
// });

const fs = require('fs');
const http = require('http');
const url = require('url');

// Using syncchronous here because this only gets read when the server stard
// read the json data
const json = fs.readFileSync(`./city.list.json`, 'utf-8');

// parse the json data into an array
const locationData = JSON.parse(json);

// Creating server with http package
const server = http.createServer((req, res) => {
  // get the path name using the url package
  const pathName = url.parse(req.url, true).pathname;
  // get what is sent on the url q parameter, for example www.url.com/?q=aveiro
  const name = url.parse(req.url, true).query.q;

  // --- ROUTES ---
  // if route equals root and there is data on the name variable
  if (pathName === '/' && name) {
    // filter the json file to save on the results variable what matches the query made
    const results = locationData.filter(item => {
      // regex to search for case insensitive data
      const regex = new RegExp(name, 'gi');
      return item.name.match(regex) || item.country.match(regex);
    });
    const filtered = results.filter(
      (location, i, self) =>
        i ===
        self.findIndex(
          t => t.name === location.name && t.country === location.country
        )
    );
    // if nothing matches
    if (results.length === 0) {
      res.writeHead(404, { 'Content-type': 'text/html' });
      res.end('Url was not found on the server!');
    }
    // if matches, return json data
    else {
      res.writeHead(200, { 'Content-type': 'application/json' });
      res.end(JSON.stringify(filtered));
    }
  } else {
    res.writeHead(404, { 'Content-type': 'text/html' });
    res.end('Url was not found on the server!');
  }
});

// Listen for server on URL and PORT
const PORT = process.env.PORT || 1337;
server.listen(PORT, () => {
  console.log('Listening for requests now.');
});
