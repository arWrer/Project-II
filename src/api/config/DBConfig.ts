import dotenv from "dotenv"
dotenv.config()

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT),
    
    
}

export default dbConfig


// import dotenv from "dotenv"    //https://junyharang.tistory.com/266 확인
// dotenv.config()

// const { error } = require("console");
// const mysql = require('mysql');

// const dbConfig ={
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PW,
//     database: process.env.DB_NAME,
//     port: parseInt(process.env.DB_PORT),
//     init : function(){
//         return mysql.createConnection({
//             host: process.env.DB_HOST,
//             user: process.env.DB_USER,
//             password: process.env.DB_PW,
//             database: process.env.DB_NAME,
//             port: parseInt(process.env.DB_PORT)
//         });
//     },
//     open : function(connection : any){
//         connection.connect ((error : any) => {
//             if(error){
//                 console.log("DataBase 연결에 실패 하였습니다 ERROR 내용 : ",error);
//             }
//             console.log("Data Base 연결에 성공했습니다");

//         });
//     },
//     close : function (connection : any){
//         connection.end((error:any)=> {
//             if(error){
//                 console.log("Database를 종료하는데 실패했습니다 Error 내용 : ",error);
//             }
//             console.log("Database와 연결이 정상적으로 종료되었습니다");
//         });
//     },
//     query : function (connection : any, queryInput : any){
//         connection.query(queryInput,function (err: any ,results: any, fields: any) {
//             if (err){
//                 console.log(err);
//             }
            
//             console.log(JSON.parse(JSON.stringify(results[1])));
//         });
//     } 
    
// };


// export default dbConfig;