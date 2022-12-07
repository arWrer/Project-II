import express, { response } from "express"
//import routers

//user router
import { authUser } from "./api/auth/user/route"

//buser router
import { menuRouter } from "./api/buser/routes/menu"
import { authBUser } from "./api/auth/buser/route"
import { bUserRouter } from "./buser/router"
import { storeRouter } from "./api/buser/routes/store"
import { rstoreRouter } from "./api/buser/routes/rstore"
import { OrderRouter } from "./api/buser/routes/order"
import { storeInfoRouter } from "./store/router"      // view 파일 업로드

//import { storeWatchRouter } from "./api/store/routes/watch"

import { kioskRouter } from "./kiosk/router"
import { kioskAuthRouter } from "./api/auth/kiosk/route"
import { orderRouter } from "./api/kiosk/routes/order"
import { sinRouter } from "./api/buser/routes/sin"
import { userHomeRouter } from "./user/router"
import { uinRouter } from "./api/user/routes/uin"

//store router
import { authStoreInfo } from "./api/auth/store/route"

import path from "path"
import session from "express-session"
import dbConfig from "./api/config/DBConfig"
import createSessionConfig from "./api/config/SessionConfig"
const MySQLStore = require("express-mysql-session")(session)     // 로그인시 세션정보 db내 session에 저장 https://jamong-icetea.tistory.com/143
import { bUserAuthenticated } from "./api/auth/buser/middleware"
import { userAuthenticated } from "./api/auth/user/middleware"
import { storeInfoAuthenticated } from "./api/auth/store/middleware"




import fileupload from "express-fileupload"
import { checkGotStoreAuthorization, checkGotUserAuthorization } from "./api/auth/kiosk/middleware"

export const app = express()    // 미들웨어를 어플리케이션에 추가해 라우팅설정, 요청대기 상태

//set port number
app.set("port", process.env.PORT || 80)

//set view engine 'ejs'
app.set("view engine", "ejs");

//set views folder for view engine
app.set("views", path.join(__dirname, "../views", "templates"))

//static serving
app.use(express.static(path.join(__dirname, "../views", "statics")))
app.use(express.static(path.join(process.env.PWD, "media")))

//enable body parser
app.use(express.urlencoded({ extended: true }))

app.use(fileupload({}))
const sessionStore = new MySQLStore(dbConfig)

app.use(session(createSessionConfig(sessionStore)))

// const dataBase = dbConfig.init();
// dbConfig.open(dataBase);
// dbConfig.query(dataBase,'select username from busers');

//--------------------------------------
//user routing
app.use("/user/", userAuthenticated)
//for api
app.use("/api/user", userAuthenticated)

app.use
app.use("/auth/user", authUser)
app.use("/user", userHomeRouter)
app.use("/api/user/uin", uinRouter)


//--------------------------------------
//buser routing

//for home
app.use("/buser", bUserAuthenticated)        // ./api/auth/buser/middleware   -> 세션있으면 다음 / 없으면 로그인
//for api
app.use("/api/buser", bUserAuthenticated)   // !! 미구현 ??  {왜 굳이 동일한 코드를 경로 달리해서 미들웨어로 전송했을까}
app.use("/auth/buser", authBUser)
app.use("/buser", bUserRouter)              // "./buser/router"

app.use("/api/buser/menu", menuRouter)     //controller는 스크립트문 router는 통신경로 설정
app.use("/api/buser/store", storeRouter)   // ./api/buser/routes/store"
app.use("/api/buser/rstore",rstoreRouter)
app.use("/api/buser/order",OrderRouter)
app.use("/api/buser/sin", sinRouter)

// --------------------------------------
//app.use("/store",storeInfoAuthenticated)
app.use("/api/store",storeInfoAuthenticated) //".api/auth/store/middlewares"
app.use("/auth/store",authStoreInfo)            //"./api/auth/store/route"
app.use("/store",storeInfoRouter)   //"./store/router"    view/ ejs파일 가져옴

//app.use("/watch", storeWatchRouter )


//app.use("/api/store/info", storeInfoRouter2)   //"./api/store/routes/info"
//--------------------------------------
app.use("/api/kiosk", checkGotStoreAuthorization)  //"./api/auth/kiosk/middleware"
app.use("/api/kiosk", checkGotUserAuthorization)
app.use("/api/kiosk/order", orderRouter)

app.use("/kiosk", checkGotStoreAuthorization)
app.use("/kiosk", checkGotUserAuthorization)
app.use("/kiosk", kioskRouter)


app.use("/auth/kiosk", kioskAuthRouter)



