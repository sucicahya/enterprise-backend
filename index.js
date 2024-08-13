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


const express = require('express');
const sql = require('msnodesqlv8');
const cors = require('cors');
const app = express();
const port = 5000;

const connectionString = 'Driver={ODBC Driver 17 for SQL Server};Server=40005-MP1PWS22;Database=enterprise;Trusted_Connection=yes;';

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
app.use(cors());
app.use(express.json());

// API Endpoint
app.get('/main-table', (req, res) => {
  sql.open(connectionString, (err, conn) => {
    if (err) {
      console.error('Error occurred:', err);
      res.status(500).send('Database connection error');
      return;
    }

    const query = 'SELECT produk.ID_PRODUK, produk.NAMA_PRODUK, produk_detail.URL, spec_server.IP_SERVER, karyawan.NAMA, status.NAMA_STATUS FROM produk INNER JOIN produk_detail ON produk.ID_PRODUK = produk_detail.PRODUK_ID INNER JOIN spec_server ON produk_detail.SERVER = spec_server.ID_SPEC_SERVER INNER JOIN karyawan ON produk_detail.PIC_NIPPOS = karyawan.NIPPOS INNER JOIN status ON produk.FLAG_STATUS = status.ID_STATUS';
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

app.get('/penempatan-cloud', (req, res) => {
  sql.open(connectionString, (err, conn) => {
    if (err) {
      console.error('Error occurred:', err);
      res.status(500).send('Database connection error');
      return;
    }

    const query = "SELECT penempatan.NAMA_PENEMPATAN AS penempatan, COUNT(produk.NAMA_PRODUK) AS total FROM penempatan LEFT JOIN produk_detail ON penempatan.ID_PENEMPATAN = produk_detail.PENEMPATAN LEFT JOIN produk ON produk.ID_PRODUK = produk_detail.PRODUK_ID WHERE penempatan.NAMA_PENEMPATAN = 'Cloud' GROUP BY penempatan.NAMA_PENEMPATAN;";
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

    const query = "SELECT penempatan.NAMA_PENEMPATAN AS penempatan, COUNT(produk.NAMA_PRODUK) AS total FROM penempatan LEFT JOIN produk_detail ON penempatan.ID_PENEMPATAN = produk_detail.PENEMPATAN LEFT JOIN produk ON produk.ID_PRODUK = produk_detail.PRODUK_ID WHERE penempatan.NAMA_PENEMPATAN = 'On-Premise' GROUP BY penempatan.NAMA_PENEMPATAN;";
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

    const query = "SELECT status.NAMA_STATUS AS status, COUNT(produk.NAMA_PRODUK) AS total FROM status LEFT JOIN produk ON produk.FLAG_STATUS = status.ID_STATUS WHERE status.NAMA_STATUS = 'Aktif' GROUP BY status.NAMA_STATUS;";
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

    const query = "SELECT status.NAMA_STATUS AS status, COUNT(produk.NAMA_PRODUK) AS total FROM status LEFT JOIN produk ON produk.FLAG_STATUS = status.ID_STATUS WHERE status.NAMA_STATUS = 'Non-Aktif' GROUP BY status.NAMA_STATUS;";
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

    const query = "SELECT COUNT(NAMA_PRODUK) AS total FROM produk;";
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

    const query = "SELECT COUNT(produk.NAMA_PRODUK) AS total FROM produk LEFT JOIN produk_detail ON produk.ID_PRODUK = produk_detail.PRODUK_ID WHERE DATEPART(MONTH, produk_detail.TANGGAL_DEPLOY) = DATEPART(MONTH, GETDATE()) AND DATEPART(YEAR, produk_detail.TANGGAL_DEPLOY) = DATEPART(YEAR, GETDATE());";
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

app.post('/full-detail', (req, res) => {
  sql.open(connectionString, (err, conn) => {
    const { id } = req.body; // Mengambil id dari objek req.body
    console.log('Received ID:', id);
    if (err) {
      console.error('Error occurred:', err);
      res.status(500).send('Database connection error');
      return;
    }

    const query = `SELECT produk.ID_PRODUK, produk.NAMA_PRODUK, produk.DESKRIPSI_PRODUK, akses.NAMA_AKSES, developer.NAMA_DEVELOPER, karyawan.NAMA, karyawan.TELEPON, penempatan.NAMA_PENEMPATAN, status.NAMA_STATUS, produk_detail.PIC_NIPPOS, produk_detail.BUSINESS_OWNER, produk_detail.WAKTU_OPERASIONAL, produk_detail.URL, produk_detail.PORT, produk_detail.FRAMEWORK, produk_detail.VER_FRAMEWORK, produk_detail.JENIS_DATABASE, produk_detail.TANGGAL_LIVE, produk_detail.TANGGAL_AKHIR_UPDATE, produk_detail.TANGGAL_TUTUP, produk_detail.TANGGAL_DEPLOY, produk_detail.BA_DEPLOY, produk_detail.REQ_DEPLOY, spec_server.IP_SERVER, spec_server.CPU, spec_server.RAM, spec_server.STORAGE, web_server.NAMA_WEB_SERVER FROM produk_detail INNER JOIN produk ON produk.ID_PRODUK = produk_detail.PRODUK_ID INNER JOIN status ON produk.FLAG_STATUS = status.ID_STATUS INNER JOIN akses ON produk_detail.AKSES = akses.ID_AKSES INNER JOIN developer ON produk_detail.DEVELOPER = developer.ID_DEVELOPER INNER JOIN karyawan ON karyawan.NIPPOS = produk_detail.PIC_NIPPOS INNER JOIN penempatan ON produk_detail.PENEMPATAN = penempatan.ID_PENEMPATAN INNER JOIN spec_server ON produk_detail.SERVER = spec_server.ID_SPEC_SERVER INNER JOIN web_server ON spec_server.WEB_SERVER_ID = web_server.ID_WEB_SERVER WHERE produk.ID_PRODUK = ${id};`;
    console.log('Received ID:', query);
    conn.query(query, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Query execution error', err);
      } else {
        console.log('Query Results:', results);
        res.json(results);
      }

      conn.close();
    });
  });





  // const { id } = req.body; // Mengambil id dari objek req.body
  // console.log('Received ID:', id);
  // if (!id) {
  //   return res.status(400).send('ID is required');
  // }

  // sql.open(connectionString, (err, conn) => {
  //   if (err) {
  //     console.error('Error occurred:', err);
  //     res.status(500).send('Database connection error');
  //     return;
  //   }

  //   const query = `SELECT produk.NAMA_PRODUK, produk.DESKRIPSI_PRODUK, account.USERNAME, account.PASS, account.TANGGAL_CREATE, account.TANGGAL_UPDATE, account.EXP_DATE_PASSWORD, account.JENIS_AKUN, akses.NAMA_AKSES, developer.NAMA_DEVELOPER, karyawan.NAMA, karyawan.TELEPON, penempatan.NAMA_PENEMPATAN, status.NAMA_STATUS, produk_detail.PIC_NIPPOS, produk_detail.BUSINESS_OWNER, produk_detail.WAKTU_OPERASIONAL, produk_detail.URL, produk_detail.PORT, produk_detail.FRAMEWORK, produk_detail.VER_FRAMEWORK, produk_detail.JENIS_DATABASE, produk_detail.TANGGAL_LIVE, produk_detail.TANGGAL_AKHIR_UPDATE, produk_detail.TANGGAL_TUTUP, produk_detail.TANGGAL_DEPLOY, produk_detail.BA_DEPLOY, produk_detail.REQ_DEPLOY, spec_server.IP_SERVER, spec_server.CPU, spec_server.RAM, spec_server.STORAGE, web_server.NAMA_WEB_SERVER FROM produk_detail INNER JOIN produk ON produk.ID_PRODUK = produk_detail.PRODUK_ID INNER JOIN status ON produk.FLAG_STATUS = status.ID_STATUS INNER JOIN account ON produk.ID_PRODUK = account.PRODUK_ID INNER JOIN akses ON produk_detail.AKSES = akses.ID_AKSES INNER JOIN developer ON produk_detail.DEVELOPER = developer.ID_DEVELOPER INNER JOIN karyawan ON karyawan.NIPPOS = produk_detail.PIC_NIPPOS INNER JOIN penempatan ON produk_detail.PENEMPATAN = penempatan.ID_PENEMPATAN INNER JOIN spec_server ON produk_detail.SERVER = spec_server.ID_SPEC_SERVER INNER JOIN web_server ON spec_server.WEB_SERVER_ID = web_server.ID_WEB_SERVER WHERE produk_detail.ID_PRODUK_DETAIL = ${id};`;
  //   console.log('Received ID:', query);
  //   conn.query(query, [id], (err, results) => {
  //     if (err) {
  //       console.error('Error executing query:', err);
  //       res.status(500).send('Query execution error', err);
  //     } else {
  //       res.json(results);
  //     }

  //     conn.close();
    // });
  // });
});

app.post('/full-account', (req, res) => {
  sql.open(connectionString, (err, conn) => {
    const { id } = req.body; // Mengambil id dari objek req.body
    console.log('Received ID:', id);
    if (err) {
      console.error('Error occurred:', err);
      res.status(500).send('Database connection error');
      return;
    }

    const query = `SELECT account.ID_ACCOUNT, account.USERNAME, account.PASS, account.EXP_DATE_PASSWORD, account.JENIS_AKUN FROM account WHERE account.PRODUK_ID = ${id};`;
    console.log('Received ID:', query);
    conn.query(query, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Query execution error', err);
      } else {
        console.log('Query Results:', results);
        res.json(results);
      }

      conn.close();
    });
  });
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});