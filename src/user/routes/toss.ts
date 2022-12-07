import { Router } from "express"
import { SuccessGetAuthKey, FailGetgAuthKey } from "../controller/toss"

export const tossAPIRouter = Router()

// "/payments/toss/"
tossAPIRouter.get("/billing_auth/success", SuccessGetAuthKey)

tossAPIRouter.get("/billing_auth/fail", FailGetgAuthKey)