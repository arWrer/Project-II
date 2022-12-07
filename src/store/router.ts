import { Router } from "express"
import { renderStoreInfo , renderStoreWatch} from "."

export const storeInfoRouter = Router()

storeInfoRouter.get("/info", renderStoreInfo)

storeInfoRouter.get("/watch", renderStoreWatch)
