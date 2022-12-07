import { Router } from "express"
import { getMenu, createMenu, deleteMenu } from "../controller/menu"
import { checkStoreAuthroize } from "../middlewares/store"
export const menuRouter = Router()

menuRouter.use(checkStoreAuthroize.unless({
    method: ["GET", "DELETE"]
}))

menuRouter.get("/", getMenu)

menuRouter.post("/", createMenu)

menuRouter.delete("/", deleteMenu)




