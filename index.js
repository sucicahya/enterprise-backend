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
import add from "./routes/add.js"
import card from "./routes/card.js"
import detail from "./routes/detail.js"


const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sql = require('msnodesqlv8');
const cors = require('cors');
const app = express();
const port = 5000;
const md5 = require('md5');

const connectionString = `Driver={ODBC Driver 17 for SQL Server};Server=40005-MP1PWS22;Database=enterprise;Trusted_Connection=yes;`;

// sql.open(connectionString, (err, conn) => {
//   if (err) {
//     console.error('Error occurred:', err);
//     return;
//   }

//   const query = 'SELECT * FROM produk'; // Replace with your table name

//   conn.query(query, (err, results) => {
//     if (err) {
//       console.error('Error executing query:', err);
//     } else {
//       console.log(results);
//     }

//     conn.close();
//   });
// });

// Middleware
app.use("/add", add);
app.use("/card", card);
app.use("/detail", detail);
app.use(cors());
app.use(express.json());

const jwtkey= "secret";

const saltRounds = 12;

// Fungsi untuk meng-hash password
const hashPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw new Error('Error hashing password');
  }
};

const comparePassword = async (plainPassword, hashedPassword) => {
  try {
    const match = await bcrypt.compare(plainPassword, hashedPassword);
    return match;
  } catch (error) {
    console.error('Error comparing passwords:', error);
    throw new Error('Error comparing passwords');
  }
};


// API Endpoint
app.post('/login-sim',(req, res) => {
  const { USERNAME, PASS } = req.body;

  sql.open(connectionString, (err, conn) => {
    if (err) {
      console.error('Error occurred:', err);
      res.status(500).send('Database connection error');
      return;
    }

    const query = `SELECT * FROM karyawan WHERE USERNAME = '${USERNAME}';`;

    conn.query(query, async (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        conn.close();
        res.status(500).send('Query execution error');
        return;
      }

      if (results.length === 0) {
        conn.close();
        res.status(401).send('Invalid username or password');
        return;
      }

      const hashedPassword = results[0].PASS; // Password yang ter-hash dari database

      try {
        const match = await bcrypt.compare(PASS, hashedPassword);
        if (match) {
          const payload = {
            userId: results[0].ID,
            username: results[0].USERNAME
          };

          const options = {
            expiresIn: '1h' // Token berlaku selama 1 jam
          };

          const token = jwt.sign(payload, jwtkey, options);

          res.json({
            success: true,
            token: token
          });
        } else {
          res.status(401).send('Invalid username or password');
        }
      } catch (error) {
        console.error('Error comparing passwords:', error);
        res.status(500).send('Error comparing passwords');
      }

      conn.close();
    });
  });
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});