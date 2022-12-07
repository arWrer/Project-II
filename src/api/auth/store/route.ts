import { Router } from "express"
import { renderStoreInfo , renderStoreWatch } from "./controller"

//"/auth/buser/"
export const authStoreInfo = Router()

authStoreInfo.get("/info", renderStoreInfo)

authStoreInfo.get("/watch",renderStoreWatch)