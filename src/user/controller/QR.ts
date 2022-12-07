import { Request, Response } from "express";

export const renderQRreader = (req: Request, res: Response) => {
    res.render("user/main/QRreader")
}

console.log("hello world!")