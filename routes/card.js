const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sql = require('msnodesqlv8');
const cors = require('cors');
const app = express.Router();
const port = 5000;
const md5 = require('md5');

const connectionString = `Driver={ODBC Driver 17 for SQL Server};Server=40005-MP1PWS22;Database=enterprise;Trusted_Connection=yes;`;

// Middleware
app.use(cors());
app.use(express.json());

const jwtkey = "secret";

const saltRounds = 12;

app.get('/penempatan-cloud', (req, res) => {
  sql.open(connectionString, (err, conn) => {
    if (err) {
      console.error('Error occurred:', err);
      res.status(500).send('Database connection error');
      return;
    }

    const query = `
    SELECT penempatan.NAMA_PENEMPATAN AS penempatan, 
    COUNT(produk.NAMA_PRODUK) AS total 
    FROM penempatan 
    LEFT JOIN produk_detail ON penempatan.ID_PENEMPATAN = produk_detail.PENEMPATAN 
    LEFT JOIN produk ON produk.ID_PRODUK = produk_detail.PRODUK_ID 
    WHERE penempatan.NAMA_PENEMPATAN = 'Cloud' 
    GROUP BY penempatan.NAMA_PENEMPATAN;`;

    conn.query(query, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Query execution error', err);
      } else {
        res.json(results);
      }

      conn.close();
    });
  });
});

app.get('/penempatan-onprem', (req, res) => {
  sql.open(connectionString, (err, conn) => {
    if (err) {
      console.error('Error occurred:', err);
      res.status(500).send('Database connection error');
      return;
    }

    const query = `
    SELECT penempatan.NAMA_PENEMPATAN AS penempatan, 
    COUNT(produk.NAMA_PRODUK) AS total 
    FROM penempatan 
    LEFT JOIN produk_detail ON penempatan.ID_PENEMPATAN = produk_detail.PENEMPATAN 
    LEFT JOIN produk ON produk.ID_PRODUK = produk_detail.PRODUK_ID 
    WHERE penempatan.NAMA_PENEMPATAN = 'On-Premise' 
    GROUP BY penempatan.NAMA_PENEMPATAN;`;

    conn.query(query, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Query execution error', err);
      } else {
        res.json(results);
      }

      conn.close();
    });
  });
});

app.get('/status-aktif', (req, res) => {
  sql.open(connectionString, (err, conn) => {
    if (err) {
      console.error('Error occurred:', err);
      res.status(500).send('Database connection error');
      return;
    }

    const query = `
    SELECT status.NAMA_STATUS AS status, 
    COUNT(produk.NAMA_PRODUK) AS total 
    FROM status 
    LEFT JOIN produk ON produk.FLAG_STATUS = status.ID_STATUS 
    WHERE status.NAMA_STATUS = 'Aktif' 
    GROUP BY status.NAMA_STATUS;`;

    conn.query(query, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Query execution error', err);
      } else {
        res.json(results);
      }

      conn.close();
    });
  });
});

app.get('/status-nonaktif', (req, res) => {
  sql.open(connectionString, (err, conn) => {
    if (err) {
      console.error('Error occurred:', err);
      res.status(500).send('Database connection error');
      return;
    }

    const query = `
    SELECT status.NAMA_STATUS AS status, 
    COUNT(produk.NAMA_PRODUK) AS total 
    FROM status 
    LEFT JOIN produk ON produk.FLAG_STATUS = status.ID_STATUS 
    WHERE status.NAMA_STATUS = 'Non-Aktif' 
    GROUP BY status.NAMA_STATUS;`;

    conn.query(query, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Query execution error', err);
      } else {
        res.json(results);
      }

      conn.close();
    });
  });
});

app.get('/akses-internet', (req, res) => {
  sql.open(connectionString, (err, conn) => {
    if (err) {
      console.error('Error occurred:', err);
      res.status(500).send('Database connection error');
      return;
    }

    const query = `
    SELECT akses.NAMA_AKSES AS akses, 
    COUNT(produk.NAMA_PRODUK) AS total 
    FROM akses
    LEFT JOIN produk_detail ON produk_detail.AKSES = akses.ID_AKSES 
    LEFT JOIN produk ON produk.ID_PRODUK = produk_detail.PRODUK_ID
    WHERE akses.NAMA_AKSES = 'Internet' 
    GROUP BY akses.NAMA_AKSES;`;

    conn.query(query, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Query execution error', err);
      } else {
        res.json(results);
      }

      conn.close();
    });
  });
});

app.get('/akses-intranet', (req, res) => {
  sql.open(connectionString, (err, conn) => {
    if (err) {
      console.error('Error occurred:', err);
      res.status(500).send('Database connection error');
      return;
    }

    const query = `
    SELECT akses.NAMA_AKSES AS akses, 
    COUNT(produk.NAMA_PRODUK) AS total 
    FROM akses
    LEFT JOIN produk_detail ON produk_detail.AKSES = akses.ID_AKSES 
    LEFT JOIN produk ON produk.ID_PRODUK = produk_detail.PRODUK_ID
    WHERE akses.NAMA_AKSES = 'Intranet' 
    GROUP BY akses.NAMA_AKSES;`;

    conn.query(query, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Query execution error', err);
      } else {
        res.json(results);
      }

      conn.close();
    });
  });
});

app.get('/total', (req, res) => {
  sql.open(connectionString, (err, conn) => {
    if (err) {
      console.error('Error occurred:', err);
      res.status(500).send('Database connection error');
      return;
    }

    const query = `SELECT COUNT(NAMA_PRODUK) AS total FROM produk;`;
    conn.query(query, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Query execution error', err);
      } else {
        res.json(results);
      }

      conn.close();
    });
  });
});

app.get('/produk-masuk', (req, res) => {
  sql.open(connectionString, (err, conn) => {
    if (err) {
      console.error('Error occurred:', err);
      res.status(500).send('Database connection error');
      return;
    }

    const query = `
    SELECT COUNT(produk.NAMA_PRODUK) AS total 
    FROM produk 
    LEFT JOIN produk_detail ON produk.ID_PRODUK = produk_detail.PRODUK_ID 
    WHERE DATEPART(MONTH, produk_detail.TANGGAL_DEPLOY) = DATEPART(MONTH, GETDATE()) 
    AND DATEPART(YEAR, produk_detail.TANGGAL_DEPLOY) = DATEPART(YEAR, GETDATE());`;

    conn.query(query, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Query execution error', err);
      } else {
        res.json(results);
      }

      conn.close();
    });
  });
});

app.get('/jenis-database', (req, res) => {
  sql.open(connectionString, (err, conn) => {
    if (err) {
      console.error('Error occurred:', err);
      res.status(500).send('Database connection error');
      return;
    }

    const query = `
    SELECT jenis_database.NAMA_DATABASE AS db, 
COUNT(produk.NAMA_PRODUK) AS total 
FROM produk_detail  
LEFT JOIN produk ON produk.ID_PRODUK = produk_detail.PRODUK_ID
LEFT JOIN jenis_database ON jenis_database.ID_DATABASE = produk_detail.JENIS_DB
GROUP BY jenis_database.NAMA_DATABASE;`;

    conn.query(query, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Query execution error', err);
      } else {
        res.json(results);
      }

      conn.close();
    });
  });
});

app.post('/pemberitahuan', (req, res) => {
  sql.open(connectionString, (err, conn) => {
    if (err) {
      console.error('Error occurred:', err);
      res.status(500).send('Database connection error');
      return;
    }

    const nippos = req.body.nippos;
    console.log('nippos', nippos);

    // Prevent SQL Injection by using parameterized queries
    const query = `
      SELECT 
        account.EXP_DATE_PASSWORD, 
        account.JENIS_AKUN, 
        spec_server.IP_SERVER,
        produk.NAMA_PRODUK,
        karyawan.NIPPOS
      FROM produk_detail
      INNER JOIN produk ON produk_detail.ID_PRODUK_DETAIL = produk.ID_PRODUK
      INNER JOIN spec_server ON produk_detail.ID_PRODUK_DETAIL = spec_server.PRODUK_DETAIL_ID
      INNER JOIN account ON spec_server.ID_SPEC_SERVER = account.SPEC_SERVER_ID
      INNER JOIN karyawan ON produk_detail.PIC_NIPPOS = karyawan.NIPPOS
      WHERE karyawan.NIPPOS = ? AND
      account.EXP_DATE_PASSWORD BETWEEN DATEADD(DAY, -7, CAST(GETDATE() AS DATE)) AND CAST(GETDATE() AS DATE);`; 

    conn.query(query, [nippos], (err, results) => {
      console.log("resss", results)
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Query execution error');
      } else {
        // console.log('Query Results:', results);
        res.json(results);
      }

      conn.close();
    });
  });
});


export default app;