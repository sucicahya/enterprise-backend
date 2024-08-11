// import express from "express";
// import bodyParser from "body-parser";
// import cors from "cors";
// const port = process.env.PORT || 3000;
// const app = express();
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cors());
// app.get("/*", (req, res) => {
//     res.status(200).json({ message: "Hello-world" });
// });
// app.listen(port, () => {
//     console.log('Server-running on port 3000');
// });

const sql = require('msnodesqlv8');

const connectionString = 'Driver={ODBC Driver 17 for SQL Server};Server=40005-MP1PWS22;Database=enterprise;Trusted_Connection=yes;';


sql.open(connectionString, (err, conn) => {
  if (err) {
    console.error('Error occurred:', err);
    return;
  }

  const query = 'SELECT * FROM produk'; // Replace with your table name

  conn.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
    } else {
      console.log(results);
    }

    conn.close();
  });
});