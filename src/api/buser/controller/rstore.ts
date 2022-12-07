import { Request, Response } from "express"
import { UploadedFile } from "express-fileupload";
import Menu from "../../models/Menu";
import path from "path"
import mime from "mime-types"
import { v4 } from "uuid"
import requestStore from "../../models/requestStore"
import { ValidationError, QueryError, where } from 'sequelize';
console.log("rstore.controller 진입")

export async function createRStore(req: Request, res: Response) {
    const id = req.session.buser.id
    requestStore.create({
        id
    })
    .then((menu) => {
        return
    })
    .catch(err => {
        console.log("PK 중복")
    })
}
    

