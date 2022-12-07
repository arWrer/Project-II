import { Request, Response } from "express"
import { UploadedFile } from "express-fileupload";
import Menu from "../../models/Menu";
import path from "path"
import mime from "mime-types"
import { v4 } from "uuid"

import { Model } from "sequelize/types"
import Store from "../../models/Store"

export async function createMenu(req: Request, res: Response) {
    const store_id = req.query.store_id

    const { label, price, description } = req.body

    //check all input fields have value
    if ((label && price && description) == undefined) {
        res.status(400).json({
            code: 400,
            message: "입력하지 않은 필드가 있습니다."
        })
        return
    }

    //check menu image submitted
    if (req.files == null) {
        res.status(400).json({
            code: 400,
            message: "상품의 이미자가 제출되지 않았습니다."
        })
        return
    }

    //type assertion as UploadFile
    //if image file exist, can be assert upload file 
    const image: UploadedFile = req.files.image as UploadedFile

    const extension = mime.extension(image.mimetype)
    const filename = image.md5 + "." + extension

    //serving path
    const servingPath = path.join("/images/menu", filename)
    //upload path
    const mediaPath = path.join(process.env.PWD, "media")

    //generate uuid for id of menu
    const id = v4()

    image.mv(path.join(mediaPath, servingPath))
        //image uploaded successfully
        .then(() => {
            //create menu
            return Menu.create({
                id,
                label,
                price,
                image: servingPath,
                store_id,
                description,
                buser_id: req.session.buser.id
            })
        })
        .then((menu) => {
            res.status(200).json({
                code: 200,
                messag: "상품이 정상적으로 등록되었습니다.",
                data: menu
            })
        })
        //image upload failed
        .catch(err => {
            res.status(500).json({
                code: 500,
                message: "상품을 등록하는 도중 문제가 발생했습니다."
            })
        })
}

//1. store id만 지정된 경우 => 해당 store의 모든 menu
//2. store_id, menu_id 가 지정된 경우 => 단일 menu
//3. 아무것도 지정되지 않은 경우 => buser의 모든 menu 
export async function getMenu(req: Request, res: Response) {
    const targetStoreId = req.query.store_id
    const targetMenuId = req.query.menu_id

    //1, store id만 지정된 경우
    //해당 store의 모든 menu전달
    if (targetStoreId && (targetMenuId == undefined)) {
        const store = await Store.findOne({
            where: {
                id: targetStoreId,
                buser_id: req.session.buser.id
            },
            include: Menu
        })

        if (store == null) {
            res.status(400).json({
                code: 404,
                message: "매장을 찾지 못했습니다."
            })

            return
        }

        res.status(200).json({
            code: 200,
            data: store.getDataValue("Menus")
        })

        //exit function
        return
    }
    //2. store_id, menu_id가 지정된 경우
    //해당 단일 menu만 전달
    else if (targetStoreId && targetMenuId) {
        const targetMenu = await Menu.findOne({
            where: {
                id: targetMenuId,
                store_id: targetStoreId,
                buser_id: req.session.buser.id
            }
        })

        if (targetMenu == null) {
            res.status(404).json({
                code: 404,
                message: "메뉴가 존재하지 않습니다."
            })

            return
        }

        res.status(200).json({
            code: 200,
            data: targetMenu
        })

        return
    }
    //3. 아무것도 지정되지 않은 경우
    //모든 menu를 전달
    else if ((targetStoreId || targetMenuId) == undefined) {
        const allMenu = await Menu.findAll({ where: { buser_id: req.session.buser.id } })

        res.status(200).json({
            code: 200,
            data: allMenu,
        })

        return
    }
}

export async function deleteMenu(req: Request, res: Response) {
    const targetMenuId = req.query.menu_id

    if (targetMenuId == undefined) {
        res.status(400).json({
            code: 400,
            message: "메뉴의 id가 전달되지 않았습니다."
        })

        return
    }
    //get target menu instance
    const targetMenu = await Menu.findOne({
        where: {
            id: targetMenuId,
            buser_id: req.session.buser.id
        }
    })

    //there is no menu registered with the ID
    if (targetMenu == null) {
        res.status(404).json({
            code: 404,
            message: "상품을 찾는데 실패했습니다."
        })

        return
    }

    //delete target menu
    targetMenu.destroy()
        .then(() => {
            res.status(200).json({
                code: 200,
                message: "정상적으로 삭제되었습니다."
            })
        })
        .catch(err => {
            res.status(500).json({
                code: 500,
                message: "Internel Server Error"
            })
        })
} 