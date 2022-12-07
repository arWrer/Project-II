import Connection from "mysql2/typings/mysql/lib/Connection";

const mysql = require('mysql');

const mydb = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT),
    multipleStatements: true,
    
};

module.exports = {
    init: function () {
        return mysql.createConnection(mydb);
    },
    connect: function(conn:any) {
        conn.connect(function(err:any) {
            if(err) console.error('mysql 연결 에러 : ' + err);
            else console.log('mysql 연결 성공');
        });
    }
};