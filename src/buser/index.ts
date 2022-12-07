import { Request, Response } from "express"
import { connect } from "http2"

import Order from "../api/models/Order"
import Mydb from "../api/config/dbConfig"
import {sequelize} from "../api/models/index"
var express = require('express');
var app = express();
var dbConfig = require("../api/config/db")
var conn = dbConfig.init();
dbConfig.connect(conn);



export async function renderHome(req: Request, res: Response) {
    const buser_id = req.session.buser.id
    const page = req.params.p;
    
    const getlast = "select s.name,date_format(o.requestedAt,'%Y-%m-%d %H:%i:%s') as time,o.method,o.totalAmount from stores as s ,orders as o where s.id = o.store_id and date_format(o.requestedAt,'%Y-%m-%d') <= now() order by time desc limit 30;"
    
    const ddgraph ="select sum(o.totalAmount) as sum,s.name from orders as o,stores as s where o.store_id=s.id and date_format(o.requestedAt,'%Y-%m-%d') = date_format(curdate(),'%Y-%m-%d') group by s.name;"
    const mmgraph="select sum(o.totalAmount) as sum,s.name from orders as o,stores as s where o.store_id=s.id and month(o.requestedAt) = month(now()) group by s.name;"
    const ordergraph="select order_name,count(order_name) as cnt from orders group by order_name;"
    
    conn.query(ddgraph+mmgraph+ordergraph+getlast,function(err:any,rows:any,fields:any){
        res.render("buser/main/home",{dd:rows[0],mm:rows[1],order:rows[2],last : rows[3],page : page,leng : Object.keys(rows[3]).length-1,page_num : 5,pass : true});
    });

}
export async function graphOrder(req: Request, res: Response) {
    const storename = req.params.storename
    console.log(storename)
    const getrecord = "select s.name,date_format(o.requestedAt,'%Y-%m-%d') as time,count(o.id) as count,o.totalAmount from stores as s ,orders as o where s.id = o.store_id and s.name = '"+storename+"' group by date_format(o.requestedAt,'%Y-%m-%d') order by date_format(o.requestedAt,'%Y-%m-%d') asc ;"

    
    conn.query(getrecord,function(err:any,rows:any,fields:any){
        console.log("order controller ")
        res.render("buser/graph",{getrecords :rows});
    });
    return
}

export async function renderMenu(req: Request, res: Response) {
    res.render("buser/menu/menu")
}

export async function renderStore(req: Request, res: Response) {
    res.render("buser/store/store")
}