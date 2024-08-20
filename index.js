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

app.get('/jenis-database', (req, res) => {
  sql.open(connectionString, (err, conn) => {
    if (err) {
      console.error('Error occurred:', err);
      res.status(500).send('Database connection error');
      return;
    }

    const query = `
    SELECT produk_detail.JENIS_DATABASE AS db, 
COUNT(produk.NAMA_PRODUK) AS total 
FROM produk_detail  
LEFT JOIN produk ON produk.ID_PRODUK = produk_detail.PRODUK_ID
GROUP BY produk_detail.JENIS_DATABASE;`;

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
    var IP_SERVER = req.body.IP_SERVER;
    var PENEMPATAN = Number(req.body.PENEMPATAN);
    var AKSES = Number(req.body.AKSES);
    var CPU = req.body.CPU;
    var RAM = req.body.RAM;
    var STORAGE = req.body.STORAGE;
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
    var NAMA_STATUS = Number(req.body.NAMA_STATUS);

    var WEB_SERVER_ID = Number(req.body.WEB_SERVER_ID)
    var TANGGAL_LIVE = req.body.TANGGAL_LIVE;
    var TANGGAL_DEPLOY = req.body.TANGGAL_DEPLOY;
    var TANGGAL_AKHIR_UPDATE = req.body.TANGGAL_AKHIR_UPDATE;
    var TANGGAL_TUTUP = req.body.TANGGAL_TUTUP;

    var ID_ACCOUNT = req.body.ID_ACCOUNT;
    var JENIS_AKUN = req.body.JENIS_AKUN;
    var USERNAME = req.body.USERNAME;
    var PASS = req.body.PASS;
    var EXP_DATE_PASSWORD = req.body.EXP_DATE_PASSWORD;
    var LENGTH_ACCOUNT = Number(req.body.LENGTH_ACCOUNT)
    var TANGGAL_UPDATE = new Date().toISOString().split('T')[0];
    console.log('Received ID:', ID_ACCOUNT);
    console.log('Received ID:', JENIS_AKUN);
    console.log('Received ID:', USERNAME);
    console.log('Received ID:', PASS);
    console.log('Received ID:', typeof (EXP_DATE_PASSWORD[0]));
    console.log('Received ID:', typeof (TANGGAL_LIVE));
    console.log('Received ID:', LENGTH_ACCOUNT);
    if (err) {
      console.error('Error occurred:', err);
      res.status(500).send('Database connection error');
      return;
    }

    const query1 = `UPDATE produk_detail SET
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
    JENIS_DATABASE = '${JENIS_DATABASE}',
    TANGGAL_LIVE = CAST(NULLIF('${TANGGAL_LIVE}', '') AS DATE),
    TANGGAL_AKHIR_UPDATE = CAST(NULLIF('${TANGGAL_AKHIR_UPDATE}', '') AS DATE),
    TANGGAL_TUTUP = CAST(NULLIF('${TANGGAL_TUTUP}', '') AS DATE),
    TANGGAL_DEPLOY = CAST(NULLIF('${TANGGAL_DEPLOY}', '') AS DATE)
    WHERE PRODUK_ID = ${ID_PRODUK};`

    const query2 = `UPDATE produk SET 
    NAMA_PRODUK = '${NAMA_PRODUK}',
    DESKRIPSI_PRODUK = '${DESKRIPSI_PRODUK}' 
    WHERE ID_PRODUK = ${ID_PRODUK};`

    const query3 = `UPDATE spec_server SET
    WEB_SERVER_ID = ${WEB_SERVER_ID},
    IP_SERVER = '${IP_SERVER}',
    CPU = '${CPU}',
    RAM = '${RAM}',
    STORAGE = '${STORAGE}'
    WHERE ID_SPEC_SERVER = ${SERVER};
    `

    let query4 = '';
    for (let i = 0; i < LENGTH_ACCOUNT; i++) {
      query4 += `UPDATE account SET
        JENIS_AKUN = '${JENIS_AKUN[i]}',
        USERNAME = '${USERNAME[i]}',
        PASS = '${PASS[i]}',
        EXP_DATE_PASSWORD = '${EXP_DATE_PASSWORD[i]}',
        TANGGAL_UPDATE = '${TANGGAL_UPDATE}'
        WHERE ID_ACCOUNT = ${ID_ACCOUNT[i]};\n`;
    }


    // console.log('Received ID:', query);
    conn.query(query1, (err, results) => {
      if (err) {
        console.error('Error executing query1:', err);
        conn.close();
        res.status(500).send('Query1 execution error');
        return;
      }

      conn.query(query2, (err, results) => {
        if (err) {
          console.error('Error executing query2:', err);
          conn.close();
          res.status(500).send('Query2 execution error');
          return;
        }

        conn.query(query3, (err, results) => {
          if (err) {
            console.error('Error executing query3:', err);
            conn.close();
            res.status(500).send('Query3 execution error');
            return;
          }

          conn.query(query4, (err, results) => {
            if (err) {
              console.error('Error executing query3:', err);
              conn.close();
              res.status(500).send('Query3 execution error');
              return;
            }

            res.json({ success: true });
            conn.close();
          });
        });
      });
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





app.post('/new-penempatan', (req, res) => {
  sql.open(connectionString, (err, conn) => {
    const { NEW_NAMA_PENEMPATAN } = req.body;
    // console.log('Received NEW_NAMA_PENEMPATAN:', NEW_NAMA_PENEMPATAN);
    if (err) {
      console.error('Error occurred:', err);
      res.status(500).send('Database connection error');
      return;
    }

    const query = `
    INSERT INTO penempatan(NAMA_PENEMPATAN) VALUES ('${NEW_NAMA_PENEMPATAN}');`;
    console.log("query", query)
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
}); `
`
app.post('/new-akses', (req, res) => {
  sql.open(connectionString, (err, conn) => {
    const { NEW_NAMA_AKSES } = req.body;
    // console.log('Received NEW_NAMA_AKSES:', NEW_NAMA_AKSES);
    if (err) {
      console.error('Error occurred:', err);
      res.status(500).send('Database connection error');
      return;
    }

    const query = `
    INSERT INTO akses(NAMA_AKSES) VALUES ('${NEW_NAMA_AKSES}');`;
    console.log("query", query)
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

app.post('/new-webserver', (req, res) => {
  sql.open(connectionString, (err, conn) => {
    const { NEW_NAMA_WEB_SERVER } = req.body;
    // console.log('Received NEW_NAMA_WEB_SERVER:', NEW_NAMA_WEB_SERVER);
    if (err) {
      console.error('Error occurred:', err);
      res.status(500).send('Database connection error');
      return;
    }

    const query = `
    INSERT INTO web_server(NAMA_WEB_SERVER) VALUES ('${NEW_NAMA_WEB_SERVER}');`;
    console.log("query", query)
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

app.post('/new-developer', (req, res) => {
  sql.open(connectionString, (err, conn) => {
    const { NEW_NAMA_DEVELOPER } = req.body;
    // console.log('Received NEW_NAMA_DEVELOPER:', NEW_NAMA_DEVELOPER);
    if (err) {
      console.error('Error occurred:', err);
      res.status(500).send('Database connection error');
      return;
    }

    const query = `
    INSERT INTO developer(NAMA_DEVELOPER) VALUES ('${NEW_NAMA_DEVELOPER}');`;
    console.log("query", query)
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

app.post('/new-pic', (req, res) => {
  sql.open(connectionString, (err, conn) => {
    var NEW_NIPPOS_PIC = req.body.NEW_NIPPOS_PIC;
    var NEW_NAMA_PIC = req.body.NEW_NAMA_PIC;
    var NEW_TELEPON_PIC = req.body.NEW_TELEPON_PIC;
    var NEW_USERNAME_PIC = req.body.NEW_USERNAME_PIC;
    var NEW_PASS_PIC = req.body.NEW_PASS_PIC;
    console.log('Received NEW_NAMA_PIC:', NEW_NAMA_PIC);
    if (err) {
      console.error('Error occurred:', err);
      res.status(500).send('Database connection error');
      return;
    }

    const query = `
    INSERT INTO karyawan(NIPPOS, NAMA, TELEPON, USERNAME, PASS) 
    VALUES ('${NEW_NIPPOS_PIC}', '${NEW_NAMA_PIC}', '${NEW_TELEPON_PIC}', '${NEW_USERNAME_PIC}', '${NEW_PASS_PIC}');`;
    console.log("query", query)
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

app.post('/new-status', (req, res) => {
  sql.open(connectionString, (err, conn) => {
    const { NEW_NAMA_STATUS } = req.body;
    // console.log('Received NEW_NAMA_STATUS:', NEW_NAMA_STATUS);
    if (err) {
      console.error('Error occurred:', err);
      res.status(500).send('Database connection error');
      return;
    }

    const query = `
    INSERT INTO status(NAMA_STATUS) VALUES ('${NEW_NAMA_STATUS}');`;
    console.log("query", query)
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

app.post('/new-produk', (req, res) => {
  sql.open(connectionString, (err, conn) => {
    console.log('pppp', req.body)
    // console.log('pppp', typeof (ID_PRODUK))
    // console.log('pppp', typeof (NAMA_PRODUK))
    // console.log('pppp', typeof (DESKRIPSI_PRODUK))

    // var ID_PRODUK = Number(req.body.ID_PRODUK); 
    var NAMA_PRODUK = req.body.NAMA_PRODUK;
    var DESKRIPSI_PRODUK = req.body.DESKRIPSI_PRODUK;
    var URL = Array.isArray(req.body.URL) && req.body.URL.length === 0 ? null : JSON.stringify(req.body.URL).replace(/"/g, "'");
    var IP_SERVER = Array.isArray(req.body.IP_SERVER) && req.body.IP_SERVER.length === 0 ? null : JSON.stringify(req.body.IP_SERVER).replace(/"/g, "'");
    var PENEMPATAN = Array.isArray(req.body.PENEMPATAN) && req.body.PENEMPATAN.length === 0 ? null : Number(req.body.PENEMPATAN);
    var AKSES = Array.isArray(req.body.AKSES) && req.body.AKSES.length === 0 ? null : Number(req.body.AKSES);
    var CPU = Array.isArray(req.body.CPU) && req.body.CPU.length === 0 ? null : JSON.stringify(req.body.CPU).replace(/"/g, "'");
    var RAM = Array.isArray(req.body.RAM) && req.body.RAM.length === 0 ? null : JSON.stringify(req.body.RAM).replace(/"/g, "'");
    var STORAGE = Array.isArray(req.body.STORAGE) && req.body.STORAGE.length === 0 ? null : JSON.stringify(req.body.STORAGE).replace(/"/g, "'");
    var SERVER = Array.isArray(req.body.SERVER) && req.body.SERVER.length === 0 ? null : Number(req.body.SERVER);
    var JENIS_DATABASE = Array.isArray(req.body.JENIS_DATABASE) && req.body.JENIS_DATABASE.length === 0 ? null : JSON.stringify(req.body.JENIS_DATABASE).replace(/"/g, "'");
    var FRAMEWORK = Array.isArray(req.body.FRAMEWORK) && req.body.FRAMEWORK.length === 0 ? null : JSON.stringify(req.body.FRAMEWORK).replace(/"/g, "'");
    var VER_FRAMEWORK = Array.isArray(req.body.VER_FRAMEWORK) && req.body.VER_FRAMEWORK.length === 0 ? null : JSON.stringify(req.body.VER_FRAMEWORK).replace(/"/g, "'");
    var WAKTU_OPERASIONAL = Array.isArray(req.body.WAKTU_OPERASIONAL) && req.body.WAKTU_OPERASIONAL.length === 0 ? null : JSON.stringify(req.body.WAKTU_OPERASIONAL).replace(/"/g, "'");
    var DEVELOPER = Array.isArray(req.body.DEVELOPER) && req.body.DEVELOPER.length === 0 ? null : Number(req.body.DEVELOPER);
    var BUSINESS_OWNER = Array.isArray(req.body.BUSINESS_OWNER) && req.body.BUSINESS_OWNER.length === 0 ? null : JSON.stringify(req.body.BUSINESS_OWNER).replace(/"/g, "'");
    var PIC_NIPPOS = Array.isArray(req.body.PIC_NIPPOS) && req.body.PIC_NIPPOS.length === 0 ? null : JSON.stringify(req.body.PIC_NIPPOS).replace(/"/g, "'");
    // const { TELEPON } = req.body.TELEPON;
    var PORT = Array.isArray(req.body.PORT) && req.body.PORT.length === 0 ? null : req.body.PORT;
    var NAMA_STATUS = Number(req.body.NAMA_STATUS);
    var FLAG_STATUS = Number(req.body.FLAG_STATUS);

    var WEB_SERVER_ID = Number(req.body.WEB_SERVER_ID)
    var TANGGAL_LIVE = Array.isArray(req.body.TANGGAL_LIVE) && req.body.TANGGAL_LIVE.length === 0 ? null : JSON.stringify(req.body.TANGGAL_LIVE).replace(/"/g, "'");
    var TANGGAL_DEPLOY = Array.isArray(req.body.TANGGAL_DEPLOY) && req.body.TANGGAL_DEPLOY.length === 0 ? null : JSON.stringify(req.body.TANGGAL_DEPLOY).replace(/"/g, "'");
    var TANGGAL_AKHIR_UPDATE = Array.isArray(req.body.TANGGAL_AKHIR_UPDATE) && req.body.TANGGAL_AKHIR_UPDATE.length === 0 ? null : JSON.stringify(req.body.TANGGAL_AKHIR_UPDATE).replace(/"/g, "'");
    var TANGGAL_TUTUP = Array.isArray(req.body.TANGGAL_TUTUP) && req.body.TANGGAL_TUTUP.length === 0 ? null : JSON.stringify(req.body.TANGGAL_TUTUP).replace(/"/g, "'");

    var ID_ACCOUNT = req.body.ID_ACCOUNT;
    var JENIS_AKUN = req.body.JENIS_AKUN;
    var USERNAME = req.body.USERNAME;
    var USERNAMELength = req.body.USERNAME;
    var PASS = req.body.PASS;
    var EXP_DATE_PASSWORD = req.body.EXP_DATE_PASSWORD;
    var LENGTH_ACCOUNT = Number(req.body.LENGTH_ACCOUNT);
    var TANGGAL_CREATE = new Date().toISOString().split('T')[0];
    // console.log('Received ID:', ID_ACCOUNT);
    // console.log('Received ID:', JENIS_AKUN);
    // console.log('Received ID:', USERNAME);
    // console.log('Received ID:', PASS);
    // console.log('Received ID:', typeof (EXP_DATE_PASSWORD[0]));
    // console.log('Received ID:', typeof (TANGGAL_LIVE));
    // console.log('Received ID:', LENGTH_ACCOUNT);
    if (err) {
      console.error('Error occurred:', err);
      res.status(500).send('Database connection error');
      return;
    }

    const query1 = `INSERT INTO produk(FLAG_STATUS, NAMA_PRODUK, DESKRIPSI_PRODUK)
    VALUES (1,'${NAMA_PRODUK}','${DESKRIPSI_PRODUK}');`


    console.log('Received ID:', query1);
    conn.query(query1, (err, resultsq1) => {
      if (err) {
        console.error('Error executing query1:', err);
        conn.close();
        res.status(500).send('Query1 execution error');
        return;
      }

      const query2 = `INSERT INTO spec_server (WEB_SERVER_ID, IP_SERVER, CPU, RAM, STORAGE)
        VALUES (${SERVER}, ${IP_SERVER}, ${CPU}, ${RAM}, ${STORAGE})`

      console.log('Received ID2:', query2);
      conn.query(query2, (err, resultsq2) => {
        if (err) {
          console.error('Error executing query2:', err);
          conn.close();
          res.status(500).send('Query2 execution error');
          return;
        }



        const produkId = `WITH LastProduct AS (
        SELECT TOP 1 ID_PRODUK
        FROM produk
        ORDER BY ID_PRODUK DESC
    ),
    LastSpecServer AS (
        SELECT TOP 1 ID_SPEC_SERVER
        FROM spec_server
        ORDER BY ID_SPEC_SERVER DESC
    )
    SELECT 
        (SELECT ID_PRODUK FROM LastProduct) AS ID_PRODUK,
        (SELECT ID_SPEC_SERVER FROM LastSpecServer) AS ID_SPEC_SERVER;
    ;
      `;

        conn.query(produkId, (err, resultsp1) => {
          if (err) {
            console.error('Error executing query2:', err);
            conn.close();
            res.status(500).send('Query2 execution error');
            return;
          }

          const produkId = resultsp1[0].ID_PRODUK;
          const specId = resultsp1[0].ID_SPEC_SERVER;





          const query3 = `INSERT INTO produk_detail
      (PRODUK_ID, PIC_NIPPOS, PENEMPATAN, AKSES, DEVELOPER, SERVER, BUSINESS_OWNER, 
        WAKTU_OPERASIONAL, URL, PORT, FRAMEWORK, VER_FRAMEWORK, JENIS_DATABASE, 
        TANGGAL_LIVE, TANGGAL_AKHIR_UPDATE, TANGGAL_TUTUP, TANGGAL_DEPLOY)
      VALUES (${produkId},${PIC_NIPPOS},${PENEMPATAN},${AKSES},${DEVELOPER},${specId},${BUSINESS_OWNER},
      ${WAKTU_OPERASIONAL},${URL},${PORT},${FRAMEWORK},${VER_FRAMEWORK},${JENIS_DATABASE}, 
      ${TANGGAL_LIVE},${TANGGAL_AKHIR_UPDATE},${TANGGAL_TUTUP},${TANGGAL_DEPLOY});`

          console.log('Received ID3:', query3);

          conn.query(query3, (err, resultsq3) => {
            if (err) {
              console.error('Error executing query2:', err);
              conn.close();
              res.status(500).send('Query2 execution error');
              return;
            }





            const produkIdd = `SELECT TOP 1 ID_PRODUK
          FROM produk
          ORDER BY ID_PRODUK DESC
      ;
        `;

            conn.query(produkIdd, (err, resultsp2) => {
              if (err) {
                console.error('Error executing query2:', err);
                conn.close();
                res.status(500).send('Query2 execution error');
                return;
              }

              const produkId = resultsp2[0].ID_PRODUK;

              let query4 = ''
              for (let i = 0; i < USERNAME.length; i++) {
                query4 += `INSERT INTO account(PRODUK_ID, USERNAME, PASS, EXP_DATE_PASSWORD, JENIS_AKUN, FLAG_STATUS, TANGGAL_CREATE)
              VALUES(${produkId}, '${USERNAME[i]}', '${PASS[i]}', '${EXP_DATE_PASSWORD[i]}', '${JENIS_AKUN[i]}', 1, '${TANGGAL_CREATE}')`
                console.log('Received ID4:', query4);
              }
              conn.query(query4, (err, resultsq4) => {
                if (err) {
                  console.error('Error executing query2:', err);
                  conn.close();
                  res.status(500).send('Query2 execution error');
                  return;
                }

                res.json({ success: true });
                conn.close();
              });
            });
          });
        });
      });
    });
  });
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});