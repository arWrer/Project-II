import { Request, Response } from "express"
import Store from "../../models/Store"
import {sequelize} from "../../models/index"
import { ValidationError, QueryError, where , Op} from 'sequelize';

import requestStore from "../../models/requestStore"
import buser from "../../models/BUser"
console.log("store.controller 진입")
var express = require('express');
var app = express();
var dbConfig = require("../../../api/config/db")
var conn = dbConfig.init();
dbConfig.connect(conn);

export async function createStore(req: Request, res: Response) {
    //name, description, zip_code, detail_address
    const { code, name, description, zip_code, detail_address } = req.body
    
    // if ((code && name && description && zip_code && detail_address) == undefined) {
    //     res.status(400).json({
    //         code: 400,
    //         message: "입력 되지 않은 필드가 있습니다."
    //     })

    //     return
    // }

    const buser_id = req.session.buser.id
    
    const registered_store = await Store.findOne({ where: { code } })
    

    // // 등록된 code가 아닌 경우
    // if (registered_store == null) {
    //     res.status(400).json({
    //         code: 400,
    //         message: "등록된 매장이 아닙니다, Mufi에 문의해주세요."
    //     })

    //     return
    // }

    // if (registered_store.getDataValue("registered")) {
    //     res.status(400).json({
    //         code: 400,
    //         message: "이미 등록된 매장입니다.",
    //     })

    //     return
    // }

    Store.update({
        name,
        description,
        zip_code,
        detail_address,
        registered: true,
        buser_id
    },
        {
            where: { code },
        })
        // .then(() => {
        //     res.status(200).json({
        //         code: 200,
        //         message: "성공적으로 매장이 등록되었습니다.",
                
        //     })

        //     return
        // })
        
        // .catch(err => {
        //     if (err instanceof ValidationError) {
        //         res.status(400).json({
        //             code: 400,
        //             message: "입력 값이 유효하지 않습니다."
        //         })

        //         return
        //     }

        //     res.status(500).json({
        //         code: 500,
        //         message: "알 수 없는 에러가 발생했습니다."
        //     })

        //     return
        // })
   
}
export async function updateStore(req: Request, res: Response) {
    
    console.log("업데이트스토어 컨트롤로 들어옴")
    const { code, name, description, zip_code, detail_address } = req.body
    if ((code && name && description && detail_address) == undefined) {
        res.status(400).json({
            code: 400,
            message: "입력 되지 않은 필드가 있습니다."
        })

        return
    }

    Store.update({
        name,
        description,
        zip_code,
        detail_address
        
    },
        {
            where: { code },
        }).then(() => {
            console.log("update done")
        }).catch(err => {
            res.status(500).json({
                code: 500,
                message: "매장 정보를 업데이트하는 도중에 알 수 없는 문제가 발생했습니다."
            })
        })
    return

}
export async function getStore(req: Request, res: Response) {
    
    const storename = req.params.storename
    const page = req.params.p;
    let stores : any
    if (req.session.buser.id != '36f73c68-965c-4032-beff-0cf0b3117fbd'){
        stores = await Store.findAll({
        
            where: { buser_id: req.session.buser.id,name:{[Op.ne]:null}
                    
            }
        })
    }
    else if (req.session.buser.id == '36f73c68-965c-4032-beff-0cf0b3117fbd'){
        stores = await Store.findAll({
        
            where: { name:{[Op.ne]:null}
                    
            }
        })
    }
    

    if (stores == null) {
        res.status(404).json({
            code: 404,
            message: "매장이 존재하지 않습니다."
        })

        return
    }

    // const rstores = await requestStore.findAll({
        
    // })
    const [rstores,metadata] = await sequelize.query('select r.id,b.email,date_format(r.time,"%Y-%m-%d %H:%i:%s") as time from requeststores as r,busers as b where b.id=r.id');
    const buser_id = req.session.buser.id
    

    if ((storename != undefined) && (page != undefined)){

        
        const getrecord = "select s.name,s.code,date_format(o.requestedAt,'%Y-%m-%d %H:%i:%s') as time,o.user_id,o.method,o.totalAmount from stores as s ,orders as o where s.id = o.store_id and s.name = '"+storename+"' order by date_format(o.requestedAt,'%Y-%m-%d') desc ;"
        
        
        conn.query(getrecord,function(err:any,rows:any,fields:any){
            res.render("buser/store/store-paging",{store : stores,rstore : rstores,getrecords :rows,page : page,leng : Object.keys(rows).length-1,page_num : 10,pass : true});
            
        });
        return
    }
    else{
        console.log("else")
        res.render('buser/store/store',{store : stores , rstore : rstores})
        return
    }
}

export async function registerStore(req: Request, res: Response) {
    
    console.log("registerstore 입장")
    const id = req.session.buser.id
    
    const generateRandomString = (num : any) => {
        const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < num; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        
        return result;
    }
    let randomStr = generateRandomString(5);

    
    
        
    
    
    Store.create({
        id : randomStr,
        code : randomStr,
        buser_id : '67a786e0-f841-4f28-a97c-df3eb78dd24f',
        
        
    
        
    })
    
}
export async function denyStore(req: Request, res: Response) {
    
    console.log(req.params.rstoreid)
    requestStore.destroy({where:{id : req.params.rstoreid}})
    

    // res.render('buser/store/store')
    return
    
}

//delete store
export async function deleteStore(req: Request, res: Response) {
    const storename = req.params.store
    console.log("deletestore")
   
    const targetStore = await Store.findOne({
        where: {
            name: storename
        }
    })

    if (targetStore == null) {
        res.status(404).json({
            code: 404,
            message: "매장을 찾지 못했습니다."
        })

        return
    }

    targetStore.destroy()
    return
}