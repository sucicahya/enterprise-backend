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
});

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

app.post('/new-database', (req, res) => {
    sql.open(connectionString, (err, conn) => {
        const { NEW_NAMA_DATABASE } = req.body;
        // console.log('Received NEW_NAMA_DATABASE:', NEW_NAMA_DATABASE);
        if (err) {
            console.error('Error occurred:', err);
            res.status(500).send('Database connection error');
            return;
        }

        const query = `
    INSERT INTO jenis_database(NAMA_DATABASE) VALUES ('${NEW_NAMA_DATABASE}');`;
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

                const query2 = `INSERT INTO produk_detail
            (PRODUK_ID, PIC_NIPPOS, PENEMPATAN, AKSES, DEVELOPER, BUSINESS_OWNER, 
              WAKTU_OPERASIONAL, URL, PORT, FRAMEWORK, VER_FRAMEWORK, JENIS_DB, 
              TANGGAL_LIVE, TANGGAL_AKHIR_UPDATE, TANGGAL_TUTUP, TANGGAL_DEPLOY)
            VALUES (${produkId},${PIC_NIPPOS},${PENEMPATAN},${AKSES},${DEVELOPER},${BUSINESS_OWNER},
            ${WAKTU_OPERASIONAL},${URL},${PORT},${FRAMEWORK},${VER_FRAMEWORK},${JENIS_DATABASE}, 
            ${TANGGAL_LIVE},${TANGGAL_AKHIR_UPDATE},${TANGGAL_TUTUP},${TANGGAL_DEPLOY});`

                console.log('Received ID2:', query2);
                conn.query(query2, (err, resultsq2) => {
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

app.post('/new-server', (req, res) => {
    sql.open(connectionString, (err, conn) => {
        console.log('pppp', req.body)
        // console.log('pppp', typeof (ID_PRODUK))
        // console.log('pppp', typeof (NAMA_PRODUK))
        // console.log('pppp', typeof (DESKRIPSI_PRODUK))

        // var ID_PRODUK = Number(req.body.ID_PRODUK); 
        // var NAMA_PRODUK = req.body.NAMA_PRODUK;
        // var DESKRIPSI_PRODUK = req.body.DESKRIPSI_PRODUK;
        // var URL = Array.isArray(req.body.URL) && req.body.URL.length === 0 ? null : JSON.stringify(req.body.URL).replace(/"/g, "'");
        var IP_SERVER = req.body.IP_SERVER;
        // var PENEMPATAN = Array.isArray(req.body.PENEMPATAN) && req.body.PENEMPATAN.length === 0 ? null : Number(req.body.PENEMPATAN);
        // var AKSES = Array.isArray(req.body.AKSES) && req.body.AKSES.length === 0 ? null : Number(req.body.AKSES);
        var CPU = req.body.CPU;
        var RAM = req.body.RAM;
        var STORAGE = req.body.STORAGE;
        var SERVER = req.body.SERVER;
        var PRODUK = req.body.PRODUK;
        // var JENIS_DATABASE = Array.isArray(req.body.JENIS_DATABASE) && req.body.JENIS_DATABASE.length === 0 ? null : JSON.stringify(req.body.JENIS_DATABASE).replace(/"/g, "'");
        // var FRAMEWORK = Array.isArray(req.body.FRAMEWORK) && req.body.FRAMEWORK.length === 0 ? null : JSON.stringify(req.body.FRAMEWORK).replace(/"/g, "'");
        // var VER_FRAMEWORK = Array.isArray(req.body.VER_FRAMEWORK) && req.body.VER_FRAMEWORK.length === 0 ? null : JSON.stringify(req.body.VER_FRAMEWORK).replace(/"/g, "'");
        // var WAKTU_OPERASIONAL = Array.isArray(req.body.WAKTU_OPERASIONAL) && req.body.WAKTU_OPERASIONAL.length === 0 ? null : JSON.stringify(req.body.WAKTU_OPERASIONAL).replace(/"/g, "'");
        // var DEVELOPER = Array.isArray(req.body.DEVELOPER) && req.body.DEVELOPER.length === 0 ? null : Number(req.body.DEVELOPER);
        // var BUSINESS_OWNER = Array.isArray(req.body.BUSINESS_OWNER) && req.body.BUSINESS_OWNER.length === 0 ? null : JSON.stringify(req.body.BUSINESS_OWNER).replace(/"/g, "'");
        // var PIC_NIPPOS = Array.isArray(req.body.PIC_NIPPOS) && req.body.PIC_NIPPOS.length === 0 ? null : JSON.stringify(req.body.PIC_NIPPOS).replace(/"/g, "'");
        // const { TELEPON } = req.body.TELEPON;
        // var PORT = Array.isArray(req.body.PORT) && req.body.PORT.length === 0 ? null : req.body.PORT;
        // var NAMA_STATUS = Number(req.body.NAMA_STATUS);
        // var FLAG_STATUS = Number(req.body.FLAG_STATUS);

        // var WEB_SERVER_ID = Number(req.body.WEB_SERVER_ID)
        // var TANGGAL_LIVE = Array.isArray(req.body.TANGGAL_LIVE) && req.body.TANGGAL_LIVE.length === 0 ? null : JSON.stringify(req.body.TANGGAL_LIVE).replace(/"/g, "'");
        // var TANGGAL_DEPLOY = Array.isArray(req.body.TANGGAL_DEPLOY) && req.body.TANGGAL_DEPLOY.length === 0 ? null : JSON.stringify(req.body.TANGGAL_DEPLOY).replace(/"/g, "'");
        // var TANGGAL_AKHIR_UPDATE = Array.isArray(req.body.TANGGAL_AKHIR_UPDATE) && req.body.TANGGAL_AKHIR_UPDATE.length === 0 ? null : JSON.stringify(req.body.TANGGAL_AKHIR_UPDATE).replace(/"/g, "'");
        // var TANGGAL_TUTUP = Array.isArray(req.body.TANGGAL_TUTUP) && req.body.TANGGAL_TUTUP.length === 0 ? null : JSON.stringify(req.body.TANGGAL_TUTUP).replace(/"/g, "'");

        // var ID_ACCOUNT = req.body.ID_ACCOUNT;
        // var JENIS_AKUN = req.body.JENIS_AKUN;
        // var USERNAME = req.body.USERNAME;
        // var USERNAMELength = req.body.USERNAME;
        // var PASS = req.body.PASS;
        // var EXP_DATE_PASSWORD = req.body.EXP_DATE_PASSWORD;
        // var LENGTH_ACCOUNT = Number(req.body.LENGTH_ACCOUNT);
        // var TANGGAL_CREATE = new Date().toISOString().split('T')[0];
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

            let queryCount = 0;  // Counter for successful queries
            let hasErrorOccurred = false;  // Flag to check if an error has occurred
            for (let i = 0; i < IP_SERVER.length; i++) {
                const query4 = `INSERT INTO spec_server(WEB_SERVER_ID, PRODUK_DETAIL_ID, IP_SERVER, CPU, RAM, STORAGE)
                                VALUES(${SERVER[i]}, ${PRODUK[i]}, '${IP_SERVER[i]}', '${CPU[i]}', '${RAM[i]}', '${STORAGE[i]}');`;
                console.log('Received ID4:', query4);

                conn.query(query4, (err, resultsq4) => {
                    if (err) {
                        console.error('Error executing insert query:', err);
                        if (!hasErrorOccurred) {  // Only send error response once
                            hasErrorOccurred = true;
                            conn.close();
                            res.status(500).send('Insert query execution error');
                        }
                        return;
                    }

                    queryCount++;

                    // Check if all queries have been executed
                    if (queryCount === IP_SERVER.length && !hasErrorOccurred) {
                        res.json({ success: true });
                        conn.close();
                    }
                });
            }
        });
    });
});

app.post('/new-account', (req, res) => {
    sql.open(connectionString, (err, conn) => {
        console.log('pppp', req.body)
        // console.log('pppp', typeof (ID_PRODUK))
        // console.log('pppp', typeof (NAMA_PRODUK))
        // console.log('pppp', typeof (DESKRIPSI_PRODUK))

        // var ID_PRODUK = Number(req.body.ID_PRODUK); 
        // var NAMA_PRODUK = req.body.NAMA_PRODUK;
        // var DESKRIPSI_PRODUK = req.body.DESKRIPSI_PRODUK;
        // var URL = Array.isArray(req.body.URL) && req.body.URL.length === 0 ? null : JSON.stringify(req.body.URL).replace(/"/g, "'");
        var JENIS_AKUN = req.body.JENIS_AKUN;
        // var PENEMPATAN = Array.isArray(req.body.PENEMPATAN) && req.body.PENEMPATAN.length === 0 ? null : Number(req.body.PENEMPATAN);
        // var AKSES = Array.isArray(req.body.AKSES) && req.body.AKSES.length === 0 ? null : Number(req.body.AKSES);
        var USERNAME = req.body.USERNAME;
        var PASS = req.body.PASS;
        var EXP_DATE_PASSWORD = req.body.EXP_DATE_PASSWORD;
        var ID_SPEC_SERVER = req.body.ID_SPEC_SERVER;
        // var PRODUK = req.body.PRODUK;
        // var JENIS_DATABASE = Array.isArray(req.body.JENIS_DATABASE) && req.body.JENIS_DATABASE.length === 0 ? null : JSON.stringify(req.body.JENIS_DATABASE).replace(/"/g, "'");
        // var FRAMEWORK = Array.isArray(req.body.FRAMEWORK) && req.body.FRAMEWORK.length === 0 ? null : JSON.stringify(req.body.FRAMEWORK).replace(/"/g, "'");
        // var VER_FRAMEWORK = Array.isArray(req.body.VER_FRAMEWORK) && req.body.VER_FRAMEWORK.length === 0 ? null : JSON.stringify(req.body.VER_FRAMEWORK).replace(/"/g, "'");
        // var WAKTU_OPERASIONAL = Array.isArray(req.body.WAKTU_OPERASIONAL) && req.body.WAKTU_OPERASIONAL.length === 0 ? null : JSON.stringify(req.body.WAKTU_OPERASIONAL).replace(/"/g, "'");
        // var DEVELOPER = Array.isArray(req.body.DEVELOPER) && req.body.DEVELOPER.length === 0 ? null : Number(req.body.DEVELOPER);
        // var BUSINESS_OWNER = Array.isArray(req.body.BUSINESS_OWNER) && req.body.BUSINESS_OWNER.length === 0 ? null : JSON.stringify(req.body.BUSINESS_OWNER).replace(/"/g, "'");
        // var PIC_NIPPOS = Array.isArray(req.body.PIC_NIPPOS) && req.body.PIC_NIPPOS.length === 0 ? null : JSON.stringify(req.body.PIC_NIPPOS).replace(/"/g, "'");
        // const { TELEPON } = req.body.TELEPON;
        // var PORT = Array.isArray(req.body.PORT) && req.body.PORT.length === 0 ? null : req.body.PORT;
        // var NAMA_STATUS = Number(req.body.NAMA_STATUS);
        // var FLAG_STATUS = Number(req.body.FLAG_STATUS);

        // var WEB_SERVER_ID = Number(req.body.WEB_SERVER_ID)
        // var TANGGAL_LIVE = Array.isArray(req.body.TANGGAL_LIVE) && req.body.TANGGAL_LIVE.length === 0 ? null : JSON.stringify(req.body.TANGGAL_LIVE).replace(/"/g, "'");
        // var TANGGAL_DEPLOY = Array.isArray(req.body.TANGGAL_DEPLOY) && req.body.TANGGAL_DEPLOY.length === 0 ? null : JSON.stringify(req.body.TANGGAL_DEPLOY).replace(/"/g, "'");
        // var TANGGAL_AKHIR_UPDATE = Array.isArray(req.body.TANGGAL_AKHIR_UPDATE) && req.body.TANGGAL_AKHIR_UPDATE.length === 0 ? null : JSON.stringify(req.body.TANGGAL_AKHIR_UPDATE).replace(/"/g, "'");
        // var TANGGAL_TUTUP = Array.isArray(req.body.TANGGAL_TUTUP) && req.body.TANGGAL_TUTUP.length === 0 ? null : JSON.stringify(req.body.TANGGAL_TUTUP).replace(/"/g, "'");

        // var ID_ACCOUNT = req.body.ID_ACCOUNT;
        // var JENIS_AKUN = req.body.JENIS_AKUN;
        // var USERNAME = req.body.USERNAME;
        // var USERNAMELength = req.body.USERNAME;
        // var PASS = req.body.PASS;
        // var EXP_DATE_PASSWORD = req.body.EXP_DATE_PASSWORD;
        // var LENGTH_ACCOUNT = Number(req.body.LENGTH_ACCOUNT);
        // var TANGGAL_CREATE = new Date().toISOString().split('T')[0];
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

            let queryCount = 0;  // Counter for successful queries
            let hasErrorOccurred = false;  // Flag to check if an error has occurred
            for (let i = 0; i < ID_SPEC_SERVER.length; i++) {
                const query4 = `INSERT INTO account(SPEC_SERVER_ID, USERNAME, PASS, EXP_DATE_PASSWORD, JENIS_AKUN)
                                VALUES(${ID_SPEC_SERVER[i]}, '${USERNAME[i]}', '${PASS[i]}', '${EXP_DATE_PASSWORD[i]}', '${JENIS_AKUN[i]}');`;
                console.log('Received ID4:', query4);

                conn.query(query4, (err, resultsq4) => {
                    if (err) {
                        console.error('Error executing insert query:', err);
                        if (!hasErrorOccurred) {  // Only send error response once
                            hasErrorOccurred = true;
                            conn.close();
                            res.status(500).send('Insert query execution error');
                        }
                        return;
                    }

                    queryCount++;

                    // Check if all queries have been executed
                    if (queryCount === ID_SPEC_SERVER.length && !hasErrorOccurred) {
                        res.json({ success: true });
                        conn.close();
                    }
                });
            }
        });
    });
});

app.post('/new-availability', (req, res) => {
    sql.open(connectionString, (err, conn) => {
        console.log('pppp', req.body)
        var SPEC_SERVER_ID = req.body.SPEC_SERVER_ID;
        var UP_TIME = req.body.UP_TIME;
        var DOWN_TIME = req.body.DOWN_TIME;
        var WAKTU_DOWN = req.body.WAKTU_DOWN;
        var WAKTU_SELESAI = req.body.WAKTU_SELESAI;
        var KEJADIAN = req.body.KEJADIAN;
        var PENYEBAB = req.body.PENYEBAB;
        var SOLUSI = req.body.SOLUSI;
        if (err) {
            console.error('Error occurred:', err);
            res.status(500).send('Database connection error');
            return;
        }

        const query1 = `INSERT INTO availability(SPEC_SERVER_ID, UP_TIME, DOWN_TIME, WAKTU_DOWN, WAKTU_SELESAI, KEJADIAN, PENYEBAB, SOLUSI)
    VALUES (${SPEC_SERVER_ID}, '${UP_TIME}','${DOWN_TIME}', '${WAKTU_DOWN}','${WAKTU_SELESAI}','${KEJADIAN}','${PENYEBAB}','${SOLUSI}');`


        console.log('Received ID:', query1);
        conn.query(query1, (err, resultsq1) => {
            if (err) {
                console.error('Error executing query1:', err);
                conn.close();
                res.status(500).send('Query1 execution error');
                return;
            }


            res.json({ success: true });
            conn.close();

        });
    });
});

export default app;