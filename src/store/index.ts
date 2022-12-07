import { Request, Response } from "express"

export async function renderStoreInfo(req: Request, res: Response) {
    res.render("buser/store/store-info")
}
export async function renderStoreWatch(req: Request, res: Response) {
    res.render("buser/store/store-watch")
}