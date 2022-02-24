const express = require("express");
const fs = require("fs");
const fastcsv = require("fast-csv");
const Pool = require("pg").Pool;

const PORT = 8000;
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("adsfadsf");
});

app.post("/upload-file", (req, res) => {
  const { file, host, user, database, password, port, table, fields } = req.body;
  let stream = fs.createReadStream(file);
  let csvData = [];
  let csvStream = fastcsv.parse().on("data", function (data) { csvData.push(data); }).on("end", function () {
      csvData.shift();
      const pool = new Pool({ host, user, database, password, port });
      let values = '';
      const values_string = fields.split(',');
      for(let i = 0; i < values_string.length; i++) {
          values += '$' + i + 1 + ', ';
      }
      const query = "INSERT INTO " + table + " (" + fields +") VALUES (" + values +")";
      pool.connect((err, client, done) => {
        if (err) throw err;
        try {
          csvData.forEach((row) => {
            client.query(query, row, (err, res) => {
              if (err) {
                console.log(err.stack);
              } else {
                console.log("inserted " + res.rowCount + " row:", row);
              }
            });
          });
        } finally {
          done();
        }
      });
    });
  stream.pipe(csvStream);
  res.send("Usuario alamacenado correctamente.");
});

app.listen(PORT, () => {
  console.log("Connection successful");
});
