import { Router } from "express"
import { storeAuthorization, userAuthorization, renderStoreAuthorization, renderUserAuthorization, userUnAuthorize, storeUnAuthorize } from "./controller"
export const kioskAuthRouter = Router()

kioskAuthRouter.get("/store", renderStoreAuthorization)
kioskAuthRouter.get("/user", renderUserAuthorization)

kioskAuthRouter.post("/store", storeAuthorization)
kioskAuthRouter.post("/user", userAuthorization)

kioskAuthRouter.post("/user/signout", userUnAuthorize)
kioskAuthRouter.post("/store/signout", storeUnAuthorize)


