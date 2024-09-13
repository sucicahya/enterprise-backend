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
    karyawan.NAMA, 
    status.NAMA_STATUS 
    FROM produk 
    INNER JOIN produk_detail ON produk.ID_PRODUK = produk_detail.PRODUK_ID 
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

app.get('/pilih-database', (req, res) => {
    sql.open(connectionString, (err, conn) => {
        if (err) {
            console.error('Error occurred:', err);
            res.status(500).send('Database connection error');
            return;
        }

        const query = `SELECT * FROM jenis_database`;
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

app.get('/pilih-produk', (req, res) => {
    sql.open(connectionString, (err, conn) => {
        if (err) {
            console.error('Error occurred:', err);
            res.status(500).send('Database connection error');
            return;
        }

        const query = `SELECT * FROM produk`;
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

app.get('/pilih-ip-produk', (req, res) => {
    sql.open(connectionString, (err, conn) => {
        if (err) {
            console.error('Error occurred:', err);
            res.status(500).send('Database connection error');
            return;
        }

        const query = `SELECT * FROM spec_server INNER JOIN produk ON spec_server.PRODUK_DETAIL_ID = produk.ID_PRODUK;`;
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
    produk_detail.BUSINESS_OWNER, 
    produk_detail.WAKTU_OPERASIONAL, 
    produk_detail.URL, 
    produk_detail.PORT, 
    produk_detail.FRAMEWORK, 
    produk_detail.VER_FRAMEWORK, 
    produk_detail.JENIS_DB, 
    produk_detail.TANGGAL_LIVE, 
    produk_detail.TANGGAL_AKHIR_UPDATE, 
    produk_detail.TANGGAL_TUTUP, 
    produk_detail.TANGGAL_DEPLOY, 

    jenis_database.ID_DATABASE,
    jenis_database.NAMA_DATABASE

    FROM produk_detail 
    INNER JOIN produk ON produk.ID_PRODUK = produk_detail.PRODUK_ID 
    INNER JOIN status ON produk.FLAG_STATUS = status.ID_STATUS 
    INNER JOIN akses ON produk_detail.AKSES = akses.ID_AKSES 
    INNER JOIN developer ON produk_detail.DEVELOPER = developer.ID_DEVELOPER 
    INNER JOIN karyawan ON karyawan.NIPPOS = produk_detail.PIC_NIPPOS 
    INNER JOIN penempatan ON produk_detail.PENEMPATAN = penempatan.ID_PENEMPATAN 
    INNER JOIN jenis_database ON produk_detail.JENIS_DB = jenis_database.ID_DATABASE
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
    account.SPEC_SERVER_ID, 
    account.USERNAME, 
    account.PASS, 
    account.TANGGAL_CREATE,
    account.TANGGAL_UPDATE,
    account.EXP_DATE_PASSWORD, 
    account.JENIS_AKUN 
    FROM account
    INNER JOIN spec_server ON spec_server.ID_SPEC_SERVER = account.SPEC_SERVER_ID
    INNER JOIN produk_detail ON produk_detail.ID_PRODUK_DETAIL = spec_server.PRODUK_DETAIL_ID 
    WHERE produk_detail.PRODUK_ID = ${id};`;
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

app.post('/full-server', (req, res) => {
    sql.open(connectionString, (err, conn) => {
        const { id } = req.body; // Mengambil id dari objek req.body
        // console.log('Received ID:', id);
        if (err) {
            console.error('Error occurred:', err);
            res.status(500).send('Database connection error');
            return;
        }

        const query = `
        SELECT 
        spec_server.ID_SPEC_SERVER, 
        spec_server.WEB_SERVER_ID, 
        spec_server.PRODUK_DETAIL_ID, 
        spec_server.IP_SERVER,
        spec_server.CPU,
        spec_server.RAM,
        spec_server.STORAGE,
        web_server.NAMA_WEB_SERVER
        FROM spec_server
        INNER JOIN web_server ON spec_server.WEB_SERVER_ID = web_server.ID_WEB_SERVER
        INNER JOIN produk_detail ON spec_server.PRODUK_DETAIL_ID = produk_detail.ID_PRODUK_DETAIL
        WHERE produk_detail.PRODUK_ID = ${id};`;
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
        var FLAG_STATUS = Number(req.body.FLAG_STATUS);

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
    BUSINESS_OWNER = '${BUSINESS_OWNER}',
    WAKTU_OPERASIONAL = '${WAKTU_OPERASIONAL}',
    URL = '${URL}',
    PORT = '${PORT}',
    FRAMEWORK = '${FRAMEWORK}',
    VER_FRAMEWORK = '${VER_FRAMEWORK}',
    JENIS_DB = '${JENIS_DATABASE}',
    TANGGAL_LIVE = CAST(NULLIF('${TANGGAL_LIVE}', '') AS DATE),
    TANGGAL_AKHIR_UPDATE = CAST(NULLIF('${TANGGAL_AKHIR_UPDATE}', '') AS DATE),
    TANGGAL_TUTUP = CAST(NULLIF('${TANGGAL_TUTUP}', '') AS DATE),
    TANGGAL_DEPLOY = CAST(NULLIF('${TANGGAL_DEPLOY}', '') AS DATE)
    WHERE PRODUK_ID = ${ID_PRODUK};`

        const query2 = `UPDATE produk SET 
    NAMA_PRODUK = '${NAMA_PRODUK}',
    DESKRIPSI_PRODUK = '${DESKRIPSI_PRODUK}' ,
    FLAG_STATUS = ${FLAG_STATUS}
    WHERE ID_PRODUK = ${ID_PRODUK};`

        const query3 = `UPDATE spec_server SET
    WEB_SERVER_ID = ${WEB_SERVER_ID},
    PRODUK_DETAIL_ID
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

                // conn.query(query3, (err, results) => {
                //     if (err) {
                //         console.error('Error executing query3:', err);
                //         conn.close();
                //         res.status(500).send('Query3 execution error');
                //         return;
                //     }

                //     conn.query(query4, (err, results) => {
                //         if (err) {
                //             console.error('Error executing query3:', err);
                //             conn.close();
                //             res.status(500).send('Query3 execution error');
                //             return;
                //         }

                res.json({ success: true });
                conn.close();
                //     });
                // });
            });
        });
    });
});

app.post('/update-server', (req, res) => {
    sql.open(connectionString, (err, conn) => {
        console.log('pppp', req.body)
        // var ID_PRODUK = Number(req.body.ID_PRODUK); // Mengambil id dari objek req.body
        var NAMA_PRODUK = req.body.NAMA_PRODUK;
        var DESKRIPSI_PRODUK = req.body.DESKRIPSI_PRODUK;
        // console.log('pppp', typeof (ID_PRODUK))
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
        var FLAG_STATUS = Number(req.body.FLAG_STATUS);
        var NAMA_WEB_SERVER = req.body.NAMA_WEB_SERVER;

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
        var ID_SPEC_SERVER = req.body.ID_SPEC_SERVER;
        var LENGTH_SERVER = Number(req.body.LENGTH_SERVER)
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

        let query4 = '';
        for (let i = 0; i < LENGTH_SERVER; i++) {
            query4 += `UPDATE spec_server SET
        WEB_SERVER_ID = ${NAMA_WEB_SERVER[i]},
        IP_SERVER = '${IP_SERVER[i]}',
        CPU = '${CPU[i]}',
        RAM = '${RAM[i]}',
        STORAGE = '${STORAGE[i]}'
        WHERE ID_SPEC_SERVER = ${ID_SPEC_SERVER[i]};\n`;
        }


        console.log('Received ID:', query4);
        // conn.query(query1, (err, results) => {
        //     if (err) {
        //         console.error('Error executing query1:', err);
        //         conn.close();
        //         res.status(500).send('Query1 execution error');
        //         return;
        //     }

        // conn.query(query2, (err, results) => {
        //     if (err) {
        //         console.error('Error executing query2:', err);
        //         conn.close();
        //         res.status(500).send('Query2 execution error');
        //         return;
        //     }

        // conn.query(query3, (err, results) => {
        //     if (err) {
        //         console.error('Error executing query3:', err);
        //         conn.close();
        //         res.status(500).send('Query3 execution error');
        //         return;
        //     }

        conn.query(query4, (err, results) => {
            if (err) {
                console.error('Error executing query3:', err);
                conn.close();
                res.status(500).send('Query3 execution error');
                return;
            }
        });

        res.json({ success: true });
        conn.close();
        //         });
        //     });
        // });
    });
});

app.post('/update-account', (req, res) => {
    sql.open(connectionString, (err, conn) => {
        console.log('pppp', req.body)
        // var ID_PRODUK = Number(req.body.ID_PRODUK); // Mengambil id dari objek req.body
        var NAMA_PRODUK = req.body.NAMA_PRODUK;
        var DESKRIPSI_PRODUK = req.body.DESKRIPSI_PRODUK;
        // console.log('pppp', typeof (ID_PRODUK))
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
        var FLAG_STATUS = Number(req.body.FLAG_STATUS);

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
        // conn.query(query1, (err, results) => {
        //     if (err) {
        //         console.error('Error executing query1:', err);
        //         conn.close();
        //         res.status(500).send('Query1 execution error');
        //         return;
        //     }

        // conn.query(query2, (err, results) => {
        //     if (err) {
        //         console.error('Error executing query2:', err);
        //         conn.close();
        //         res.status(500).send('Query2 execution error');
        //         return;
        //     }

        // conn.query(query3, (err, results) => {
        //     if (err) {
        //         console.error('Error executing query3:', err);
        //         conn.close();
        //         res.status(500).send('Query3 execution error');
        //         return;
        //     }

        conn.query(query4, (err, results) => {
            if (err) {
                console.error('Error executing query3:', err);
                conn.close();
                res.status(500).send('Query3 execution error');
                return;
            }
        });

        res.json({ success: true });
        conn.close();
        //         });
        //     });
        // });
    });
});

app.get('/availibility', (req, res) => {
    sql.open(connectionString, (err, conn) => {
        if (err) {
            console.error('Error occurred:', err);
            res.status(500).send('Database connection error');
            return;
        }

        const query = `
        SELECT availability.ID_AVAILABILITY, availability.UP_TIME, availability.DOWN_TIME, produk.NAMA_PRODUK
FROM availability
INNER JOIN produk ON availability.PRODUK_ID = produk.ID_PRODUK`;

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

app.post('/full-availability', (req, res) => {
    sql.open(connectionString, (err, conn) => {
        const { id } = req.body; // Mengambil id dari objek req.body
        // console.log('Received ID:', id);
        if (err) {
            console.error('Error occurred:', err);
            res.status(500).send('Database connection error');
            return;
        }

        const query = `
     SELECT availability.ID_AVAILABILITY, availability.UP_TIME, availability.DOWN_TIME, availability.WAKTU_DOWN, availability.WAKTU_SELESAI, availability.KEJADIAN, availability.PENYEBAB, availability.SOLUSI, produk.NAMA_PRODUK
FROM availability
INNER JOIN produk ON availability.PRODUK_ID = produk.ID_PRODUK
INNER JOIN produk_detail ON produk.ID_PRODUK = produk_detail.PRODUK_ID
    WHERE availability.ID_AVAILABILITY = ${id};`;

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

export default app;