import { Router } from "express"
import Connection from "mysql2/typings/mysql/lib/Connection"
import dbConfig from "src/api/config/DBConfig"
import { app } from "src/app"
import { createRStore } from "../controller/rstore"
import { checkStoreAuthroize } from "../middlewares/store"
//"api/buser/store"    <<-- 이거 어딨음??
export const rstoreRouter = Router()
console.log("rstore.routes 진입")
//
rstoreRouter.use(checkStoreAuthroize.unless({
    method: ["GET", "POST"]
}))
rstoreRouter.get("/", createRStore)
// storeRouter.put("/", updateStore)
// storeRouter.delete("/", deleteStore)