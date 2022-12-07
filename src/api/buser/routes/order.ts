import { Router } from "express"
import Connection from "mysql2/typings/mysql/lib/Connection"
import dbConfig from "src/api/config/DBConfig"
import { app } from "src/app"

import { graphOrder,getHomeGraphww,getHomeGraphmm } from "../controller/order"

export const OrderRouter = Router()

OrderRouter.post("/:storename",graphOrder)
OrderRouter.get("/homegraphww",getHomeGraphww)
OrderRouter.get("/homegraphmm",getHomeGraphmm)