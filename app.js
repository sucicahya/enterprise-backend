const sql = require('mssql');

// Connection configuration
const config = {
  user: '40005-MP1PWS22\\user',
  password: 'Suci1029', // Replace with your password
  server: '40005-MP1PWS22',
  database: 'enterprise',
  options: {
    encrypt: true, // Enable encryption
    trustServerCertificate: false // Set to true if you trust the server certificate
  }
};

// Connect to the database
sql.connect(config).then(pool => {
  // Use the pool to execute queries
  pool.request()
    .query('SELECT * FROM dob.accouny')
    .then(result => {
      console.log(result);
      pool.close();
    })
    .catch(err => {
      console.error(err);
      pool.close();
    });
}).catch(err => {
  console.error(err);
});
