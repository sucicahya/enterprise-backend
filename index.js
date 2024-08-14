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

    const query = `
    SELECT produk.ID_PRODUK, 
    produk.NAMA_PRODUK, 
    produk_detail.URL, 
    spec_server.IP_SERVER, 
    karyawan.NAMA, 
    status.NAMA_STATUS 
    FROM produk 
    INNER JOIN produk_detail ON produk.ID_PRODUK = produk_detail.PRODUK_ID 
    INNER JOIN spec_server ON produk_detail.SERVER = spec_server.ID_SPEC_SERVER 
    INNER JOIN karyawan ON produk_detail.PIC_NIPPOS = karyawan.NIPPOS 
    INNER JOIN status ON produk.FLAG_STATUS = status.ID_STATUS`;

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

app.get('/pilih-penempatan', (req, res) => {
  sql.open(connectionString, (err, conn) => {
    if (err) {
      console.error('Error occurred:', err);
      res.status(500).send('Database connection error');
      return;
    }

    const query = `SELECT * FROM penempatan`;
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

app.get('/pilih-karyawan', (req, res) => {
  sql.open(connectionString, (err, conn) => {
    if (err) {
      console.error('Error occurred:', err);
      res.status(500).send('Database connection error');
      return;
    }

    const query = `SELECT * FROM karyawan`;
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

app.get('/pilih-akses', (req, res) => {
  sql.open(connectionString, (err, conn) => {
    if (err) {
      console.error('Error occurred:', err);
      res.status(500).send('Database connection error');
      return;
    }

    const query = `SELECT * FROM akses`;
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

app.get('/pilih-developer', (req, res) => {
  sql.open(connectionString, (err, conn) => {
    if (err) {
      console.error('Error occurred:', err);
      res.status(500).send('Database connection error');
      return;
    }

    const query = `SELECT * FROM developer`;
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

app.get('/pilih-status', (req, res) => {
  sql.open(connectionString, (err, conn) => {
    if (err) {
      console.error('Error occurred:', err);
      res.status(500).send('Database connection error');
      return;
    }

    const query = `SELECT * FROM status`;
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

app.get('/pilih-server', (req, res) => {
  sql.open(connectionString, (err, conn) => {
    if (err) {
      console.error('Error occurred:', err);
      res.status(500).send('Database connection error');
      return;
    }

    const query = `SELECT * FROM web_server`;
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
    // console.log('Received ID:', id);
    if (err) {
      console.error('Error occurred:', err);
      res.status(500).send('Database connection error');
      return;
    }

    const query = `
    SELECT produk.ID_PRODUK, 
    produk.NAMA_PRODUK, 
    produk.DESKRIPSI_PRODUK, 
    produk.FLAG_STATUS,

    akses.NAMA_AKSES, 
    akses.ID_AKSES,

    developer.ID_DEVELOPER,
    developer.NAMA_DEVELOPER, 
    
    karyawan.NAMA, 
    karyawan.TELEPON, 
    karyawan.NIPPOS,
    karyawan.USERNAME,
    karyawan.PASS,

    penempatan.NAMA_PENEMPATAN, 
    penempatan.ID_PENEMPATAN,

    status.NAMA_STATUS, 
    status.ID_STATUS,

    produk_detail.ID_PRODUK_DETAIL,
    produk_detail.PRODUK_ID,
    produk_detail.PENEMPATAN,
    produk_detail.PIC_NIPPOS, 
    produk_detail.AKSES,
    produk_detail.DEVELOPER,
    produk_detail.SERVER,
    produk_detail.BUSINESS_OWNER, 
    produk_detail.WAKTU_OPERASIONAL, 
    produk_detail.URL, 
    produk_detail.PORT, 
    produk_detail.FRAMEWORK, 
    produk_detail.VER_FRAMEWORK, 
    produk_detail.JENIS_DATABASE, 
    produk_detail.TANGGAL_LIVE, 
    produk_detail.TANGGAL_AKHIR_UPDATE, 
    produk_detail.TANGGAL_TUTUP, 
    produk_detail.TANGGAL_DEPLOY, 
    produk_detail.BA_DEPLOY, 
    produk_detail.REQ_DEPLOY, 

    spec_server.ID_SPEC_SERVER,
    spec_server.WEB_SERVER_ID,
    spec_server.IP_SERVER, 
    spec_server.CPU, 
    spec_server.RAM, 
    spec_server.STORAGE, 

    web_server.ID_WEB_SERVER,
    web_server.NAMA_WEB_SERVER 

    FROM produk_detail 
    INNER JOIN produk ON produk.ID_PRODUK = produk_detail.PRODUK_ID 
    INNER JOIN status ON produk.FLAG_STATUS = status.ID_STATUS 
    INNER JOIN akses ON produk_detail.AKSES = akses.ID_AKSES 
    INNER JOIN developer ON produk_detail.DEVELOPER = developer.ID_DEVELOPER 
    INNER JOIN karyawan ON karyawan.NIPPOS = produk_detail.PIC_NIPPOS 
    INNER JOIN penempatan ON produk_detail.PENEMPATAN = penempatan.ID_PENEMPATAN 
    INNER JOIN spec_server ON produk_detail.SERVER = spec_server.ID_SPEC_SERVER 
    INNER JOIN web_server ON spec_server.WEB_SERVER_ID = web_server.ID_WEB_SERVER 
    WHERE produk.ID_PRODUK = ${id};`;

    // console.log('Received ID:', query);
    conn.query(query, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Query execution error', err);
      } else {
        // console.log('Query Results:', results);
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
    // console.log('Received ID:', id);
    if (err) {
      console.error('Error occurred:', err);
      res.status(500).send('Database connection error');
      return;
    }

    const query = `
    SELECT account.ID_ACCOUNT, 
    account.USERNAME, 
    account.PASS, 
    account.EXP_DATE_PASSWORD, 
    account.JENIS_AKUN FROM account 
    WHERE account.PRODUK_ID = ${id};`;
    // console.log('Received ID:', query);
    conn.query(query, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Query execution error', err);
      } else {
        // console.log('Query Results:', results);
        res.json(results);
      }

      conn.close();
    });
  });
});

app.post('/update-all', (req, res) => {
  sql.open(connectionString, (err, conn) => {
    console.log('pppp', req.body)
    var ID_PRODUK = Number(req.body.ID_PRODUK); // Mengambil id dari objek req.body
    var NAMA_PRODUK = req.body.NAMA_PRODUK;
    var DESKRIPSI_PRODUK = req.body.DESKRIPSI_PRODUK;
    console.log('pppp', typeof (ID_PRODUK))
    console.log('pppp', typeof (NAMA_PRODUK))
    console.log('pppp', typeof (DESKRIPSI_PRODUK))
    var URL = req.body.URL;
    // const { IP_SERVER } = req.body.IP_SERVER;
    var PENEMPATAN = Number(req.body.PENEMPATAN);
    var AKSES =  Number(req.body.AKSES);
    // const { CPU } = req.body.CPU;
    // const { RAM } = req.body.RAM;
    // const { STORAGE } = req.body.STORAGE;
    var SERVER = Number(req.body.SERVER);
    var JENIS_DATABASE = req.body.JENIS_DATABASE;
    var FRAMEWORK = req.body.FRAMEWORK;
    var VER_FRAMEWORK = req.body.VER_FRAMEWORK;
    var WAKTU_OPERASIONAL = req.body.WAKTU_OPERASIONAL;
    var DEVELOPER = req.body.DEVELOPER;
    var BUSINESS_OWNER = req.body.BUSINESS_OWNER;
    var PIC_NIPPOS = req.body.PIC_NIPPOS;
    // const { TELEPON } = req.body.TELEPON;
    var PORT = req.body.PORT;
    var NAMA_STATUS =  Number(req.body.NAMA_STATUS);
    // const { TANGGAL_LIVE } = req.body.TANGGAL_LIVE;
    // const { TANGGAL_DEPLOY } = req.body.TANGGAL_DEPLOY;
    // const { TANGGAL_AKHIR_UPDATE } = req.body.TANGGAL_AKHIR_UPDATE;
    // const { TANGGAL_TUTUP } = req.body.TANGGAL_TUTUP;
    // const { ID_ACCOUNT } = req.body.ID_ACCOUNT;
    // const { JENIS_AKUN } = req.body.JENIS_AKUN;
    // const { USERNAME } = req.body.USERNAME;
    // const { PASS } = req.body.PASS;
    // const { EXP_DATE_PASSWORD } = req.body.EXP_DATE_PASSWORD;
    // console.log('Received ID:', id);
    if (err) {
      console.error('Error occurred:', err);
      res.status(500).send('Database connection error');
      return;
    }

    const query = `UPDATE produk_detail SET
    PIC_NIPPOS = '${PIC_NIPPOS}',
    PENEMPATAN = ${PENEMPATAN},
    AKSES = ${AKSES},
    DEVELOPER = ${DEVELOPER},
    SERVER = ${SERVER},
    BUSINESS_OWNER = '${BUSINESS_OWNER}',
    WAKTU_OPERASIONAL = '${WAKTU_OPERASIONAL}',
    URL = '${URL}',
    PORT = '${PORT}',
    FRAMEWORK = '${FRAMEWORK}',
    VER_FRAMEWORK = '${VER_FRAMEWORK}',
    JENIS_DATABASE = '${JENIS_DATABASE}'
    WHERE PRODUK_ID = ${ID_PRODUK}`

    // const query = `UPDATE produk SET 
    //     NAMA_PRODUK = '${NAMA_PRODUK}',
    //     DESKRIPSI_PRODUK = '${DESKRIPSI_PRODUK}' 
    //     WHERE ID_PRODUK = ${ID_PRODUK}`

    // TANGGAL_LIVE = '${TANGGAL_LIVE}',
    // TANGGAL_AKHIR_UPDATE = '${TANGGAL_AKHIR_UPDATE}',
    // TANGGAL_TUTUP = '${TANGGAL_TUTUP}',
    // TANGGAL_DEPLOY = '${TANGGAL_DEPLOY}',
    console.log('Received ID:', query);
    conn.query(query, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Query execution error', err);
      } else {
        // console.log('Query Results:', results);
        res.json(results);
      }

      conn.close();
    });

    // conn.query(query2, (err, results) => {
    //   if (err) {
    //     console.error('Error executing query:', err);
    //     res.status(500).send('Query execution error', err);
    //   } else {
    //     // console.log('Query Results:', results);
    //     res.json(results);
    //   }

    //   conn.close();
    // });
  });
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});