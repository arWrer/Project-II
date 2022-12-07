import { Router } from "express"
import { renderHome } from "./index"

export const kioskRouter = Router()

kioskRouter.get("/", renderHome)

