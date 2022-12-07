import { Router } from "express"
import { renderQRreader } from "../controller/QR"
export const QRrouter = Router()

// "/user/qr"
QRrouter.get("/", renderQRreader)