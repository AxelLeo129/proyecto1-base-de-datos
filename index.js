const express = require("express");
const fs = require("fs");
const fastcsv = require("fast-csv");
const Pool = require("pg").Pool;

const PORT = 8000;
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API llenado tabla Postgres with CSV.");
});

app.post("/upload-file", (req, res) => {
  try {
    const { file, host, user, database, password, port, table, fields } =
      req.body;
    let stream = fs.createReadStream(file);
    let csvData = [];
    let csvStream = fastcsv
      .parse()
      .on("data", function (data) {
        csvData.push(data);
      })
      .on("end", function () {
        csvData.shift();
        const pool = new Pool({ host, user, database, password, port });
        let values = "";
        const values_string = fields.split(",");
        for (let i = 0; i < values_string.length; i++) {
          values += "$" + (i + 1) + ", ";
        }
        values = values.trim();
        values = values.slice(0, values.length - 1);
        const query =
          "INSERT INTO " + table + " (" + fields + ") VALUES (" + values + ")";
        pool.connect((err, client, done) => {
          if (err) throw err;
          try {
            if(csvData.length > 12225) {
              csvData.forEach((row) => {
                client.query(query, row, (err, res) => {
                  if (err) {
                    console.log(row, err.stack);
                  } else {
                    console.log("Inserted");
                  }
                });
              });
            } else {
              res.send("El archivo no debe de pasar las 12225 filas.");
            }
          } finally {
            done();
          }
        });
      });
    stream.pipe(csvStream);
    res.send("Verifique su consola.");
  } catch (err) {
    res.send("Error, intente de nuevo más tarde.");
  }
});

app.listen(PORT, () => {
  console.log("Connection successful");
});
