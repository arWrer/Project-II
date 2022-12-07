import { Request, Response, NextFunction } from "express"
import { unless } from "express-unless"
import Store from "../../models/Store"

//store authrize check middleware
//1.store api에는 모두 store_id가 querystring으로 들어가야 함.
//2.해당 buser의 store여야 함.
export async function checkStoreAuthroize(req: Request, res: Response, nexst: NextFunction) {
    const targetId = req.query.store_id
    console.log("hi")
    if (targetId == undefined) {
        res.status(400).json({
            code: 400,
            message: "매장 id가 입력되지 않았습니다."
        })

        return
    }

    const targetStore = await Store.findOne({
        where: {
            id: targetId,
        }
    })

    //targetid로 등뢱된 store가 있는지 확인한다.
    if (targetStore == null) {
        res.status(404).json({
            code: 404,
            message: "매장을 찾지 못했습니다."
        })
        return
    }

    //request를 보내는 buser가 target store에 대한 권한이 있는지 확인한다.
    if (targetStore.getDataValue("buser_id") != req.session.buser.id) {
        res.status(401).json({
            code: 401,
            message: "해당 store에 대한 권한이 없습니다."
        })

        return
    }

    nexst()
}

checkStoreAuthroize.unless = unless