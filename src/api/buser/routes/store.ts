import { Router } from "express"
import Connection from "mysql2/typings/mysql/lib/Connection"
import dbConfig from "src/api/config/DBConfig"
import { app } from "src/app"
import { createStore, getStore, deleteStore, updateStore, registerStore, denyStore } from "../controller/store"

import { checkStoreAuthroize } from "../middlewares/store"


//"api/buser/store"    <<-- 이거 어딨음??
export const storeRouter = Router()
export const rstoreRouter = Router()
console.log("store.routes 진입")
//
storeRouter.use(checkStoreAuthroize.unless({
    method: ["GET", "POST"]
}))
rstoreRouter.use(checkStoreAuthroize.unless({
    method: ["GET", "POST"]
}))
storeRouter.get("/", getStore)
storeRouter.post("/", createStore)
storeRouter.post("/accept/hi",registerStore)
storeRouter.post("/deny/:rstoreid",denyStore)
storeRouter.get("/select/:storename/:p",getStore)
storeRouter.get("/page/:p",getStore)

storeRouter.get("/delete/:store",deleteStore)
storeRouter.post("/update/store",updateStore)


