import { Router, Request, Response } from "express"
import Sin from "../../models/Sin"
import Uin from "../../models/Uin"
import QRCode from "qrcode"

import md5 from "md5"

export const storeAuthorization = async (req: Request, res: Response) => {
    const inputedSin = req.body.sin
    console.log(inputedSin)

    //sin value is empty
    if (inputedSin == undefined) {
        res.status(400).json({
            code: 400,
            message: "sin이 입력되지 않았습니다."
        })

        return
    }

    const encrypted_sin = md5(inputedSin)

    Sin.findOne({
        where: {
            encrypted_sin,
        }
    })
        .then((matched_sin) => {
            if (matched_sin == null) {
                res.status(400).json({
                    code: 400,
                    message: "유효하지 않은 sin입니다."
                })
            }
            if (req.session.kiosk == undefined) {
                req.session.kiosk = {
                    store_id: undefined,
                    user_id: undefined
                }
            }

            req.session.kiosk.store_id = matched_sin.getDataValue("store_id")

            res.redirect("/auth/kiosk/user")
        })
        .catch((err) => {
            throw err
            if (err) {
                res.status(500).json({
                    code: 500,
                    message: "sin을 확인하는 도중에 알 수 없는 문제가 발생했습니다."
                })
            }
        })
}

export const renderStoreAuthorization = async (req: Request, res: Response) => {
    res.render("kiosk/wait-store")
}

export const renderUserAuthorization = async (req: Request, res: Response) => {
    console.log(req.session)
    if (req.session && req.session.kiosk && req.session.kiosk.store_id) {
        QRCode.toDataURL(`${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}/auth/kiosk/user/qr`)
            .then((qrDataURL) => {
                res.render("kiosk/wait-user", { qrDataURL })
            })
            .catch(err => {
                res.status(500).json({
                    code: 500,
                    message: "qrcode를 생성하는 도중 문제가 발생했습니다."
                })
            })
    } else {
        res.redirect("/auth/kiosk/store")
    }
}

export const userAuthorization = async (req: Request, res: Response) => {
    const inputedUin = req.body.uin

    //uin value is empty
    if (inputedUin == undefined) {
        res.status(400).json({
            code: 400,
            message: "uin이 입력되지 않았습니다."
        })

        return
    }

    const encrypted_uin = md5(inputedUin)

    Uin.findOne({
        where: {
            encrypted_uin,
        }
    })
        .then((matched_uin) => {
            if (matched_uin == null) {
                res.status(400).json({
                    code: 400,
                    message: "유효하지 않은 uin입니다."
                })
            }
            req.session.kiosk.user_id = matched_uin.getDataValue("user_id")

            res.redirect("/kiosk")
        })
        .catch(err => {
            throw err
        })
}

export const userUnAuthorize = async (req: Request, res: Response) => {
    req.session.kiosk.user_id = null

    res.redirect("/auth/kiosk/user")
}

export const storeUnAuthorize = async (req: Request, res: Response) => {
    req.session.kiosk.user_id = null
    req.session.kiosk.store_id = null

    res.redirect("/auth/kiosk/store")
}