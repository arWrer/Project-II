
import { Request, Response } from "express"

export const renderStoreInfo = async (req: Request, res: Response) => {
    res.render("buser/store/store-info")
}

export const renderStoreWatch = async (req: Request, res: Response) => {
    res.render("buser/store/store-watch")
}
