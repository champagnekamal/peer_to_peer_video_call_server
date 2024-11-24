require('dotenv').config();
const {Pool} = require('pg');

    // const pool = new Pool ({
    //     user:'postgres',
    //     host:'localhost',
    //     database:'pernstack',
    //     password:"Akashkamal6230#",
    //     port:5432
    // })
// console.log(process.env.PG_NAME,process.env.PG_PASSWORD,process.env.PG_DATABASE);
    const pool = new Pool({
        connectionString: `postgresql://${process.env.PG_NAME}:${process.env.PG_PASSWORD}@dpg-ct15i6btq21c73elsf6g-a.frankfurt-postgres.render.com/${process.env.PG_DATABASE}`,
        ssl: {
          rejectUnauthorized: false,
        },
      });   

    module.exports = pool;  