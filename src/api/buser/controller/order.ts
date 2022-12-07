import { Request, Response } from "express"
import { connect } from "http2"
import Order from "../../models/Order"
import Mydb from "../../../api/config/dbConfig"

var express = require('express');
var app = express();
var dbConfig = require("../../../api/config/db")
var conn = dbConfig.init();
dbConfig.connect(conn);

function order(req: Request, res: Response) {

}
export async function returnStore(req: Request, res: Response) {
    const storname = req.params.storename
    console.log(storname)
    const getrecord = "select s.name,date_format(o.requestedAt,'%Y-%m-%d %H:%i:%s') as time,o.user_id,o.method,o.totalAmount from stores as s ,orders as o where s.id = o.store_id and s.name = '"+storname+"' order by date_format(o.requestedAt,'%Y-%m-%d') desc ;"


    conn.query(getrecord,function(err:any,rows:any,fields:any){
        console.log(rows)
        res.render("buser/store/store",{getrecords :rows});
    });
    return
    
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
export async function getHomeGraphww(req: Request, res: Response) {
    const getww = "select date_format(requestedAt,'%Y-%m-%d')m,count(id) as count, sum(totalAmount) as sum from orders where yearWeek(requestedAt) = yearWeek(now()) group by m order by requestedAt;"
    
    conn.query(getww,function(err:any,rows:any,fields:any){
        res.render("buser/main/homegraphww",{getww :rows});
    });
    return
}
export async function getHomeGraphmm(req: Request, res: Response) {
    const getmm = "select date_format(requestedAt,'%Y-%m-%d')m,count(id) as count, sum(totalAmount) as sum from orders where date_format(requestedAt,'%m') = date_format(curdate(),'%m') group by m order by requestedAt;"
        
    conn.query(getmm,function(err:any,rows:any,fields:any){
        res.render("buser/main/homegraphmm",{getmm :rows});
    });
    return
}