import { Router } from "express"
import { checkStoreAuthroize } from "../middlewares/store"
import { generateSin } from "../controller/sin"
export const sinRouter = Router()

sinRouter.use(checkStoreAuthroize)

sinRouter.get("/", generateSin)
