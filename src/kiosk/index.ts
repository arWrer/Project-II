import { Request, Response } from "express"
import Store from "../api/models/Store"
import User from "../api/models/User"
import Menu from "../api/models/Menu"

export const renderHome = async (req: Request, res: Response) => {
    const store = await Store.findOne({
        where: {
            id: req.session.kiosk.store_id
        }
    })

    const user = await User.findOne({
        where: {
            id: req.session.kiosk.user_id,
        }
    })

    const menu = await Menu.findAll({
        where: {
            store_id: req.session.kiosk.store_id
        }
    })

    console.log(req.session.kiosk.store_id)

    res.render("kiosk/home", {
        store,
        user,
        menu
    })
}