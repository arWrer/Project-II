import { Router } from "express"
import { renderHome } from "./home"
import { tossAPIRouter } from "./routes/toss"

import { QRrouter } from "./routes/QR"
export const userHomeRouter = Router()

userHomeRouter.get("/", renderHome)

userHomeRouter.use("/payments/toss/", tossAPIRouter)
userHomeRouter.use("/qr", QRrouter)