import { Router } from "express"
import { renderHome, renderMenu, renderStore } from "."

export const bUserRouter = Router()

bUserRouter.get("/home/:p", renderHome)

bUserRouter.get("/menu", renderMenu)

bUserRouter.get("/store", renderStore)

