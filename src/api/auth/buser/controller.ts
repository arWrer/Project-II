import User from "../../models/User"
import Buser from "../../models/BUser"
import { v4 } from "uuid"
import md5 from "md5"
import {sequelize} from "../../models/index"
import { Request, Response } from "express"

export const renderSignin = async (req: Request, res: Response) => {
    res.render("buser/auth/signin")
    console.log("renderSignin 진입")
}

export const signin = async (req: Request, res: Response) => {
    const { email, password } = req.body
    if ((email && password) == undefined) {
        res.status(400).json({
            code: 400,
            message: "입력되지 않은 필드값이 존재합니다."
        })

        return
    }
    const encrypted_password = md5(password)

    let buser_email_matched = await Buser.findOne({ where: { email: email, encrypted_password } })

    console.log("Signin 진입")
    // user mismatched signin failed.
    if (buser_email_matched == null) {
        //sign in failed message have to does not include reason 
        res.status(401).render("buser/auth/signin", {
            error: "계정을 찾을 수 없습니다."
        })

        return
    }
    let buser = buser_email_matched

    //save session 
    req.session.buser = buser
    console.log("야호")
    res.redirect("/buser/home/1")
}

export const renderSignup = (req: Request, res: Response) => {
    res.render("buser/auth/signup", {
        error: undefined
    })
    console.log("rendersignup 진입")
}

export const signup = async (req: Request, res: Response) => {
    const { username, email, password1, password2 } = req.body

    //check empty value
    if (!(username && email && password1 && password2)) {
        res.status(400).json({
            code: 400,
            message: "입력되지 않은 정보가 있습니다."
        })

        return
    }
    console.log("Signup 진입")
    const usernameOverlabUser = await Buser.findOne({ where: { username } })

    //user already exist with username
    if (usernameOverlabUser) {
        res.status(400).render("buser/auth/signup", {
            error: "이미 등록된 사용자 이름 입니다."
        })
        return
    }

    const emailOberlabUser = await Buser.findOne({ where: { email } })

    //user already exist with email
    if (emailOberlabUser) {
        res.status(400).render("buser/auth/signup", {
            error: "해당 이메일로 등록된 사용자가 존재합니다"
        })
        return
    }

    //check password mismatch
    if (password1 != password2) {
        res.status(400).render("buser/auth/signup", {
            error: "비밀번호가 일치하지 않습니다."
        })
        return
    }


    //hash password
    const encrypted_password = md5(password1)

    //generate uuid for user id
    const id = v4()


    Buser.create({
        id,
        username,
        encrypted_password,
        email,
    })
        .then(buser => {
            req.session.buser = buser

            res.redirect("/auth/buser/signin")
        })
        .catch(err => {
            res.status(400).json({
                code: 400,
                message: err.message,
            })
        })
}

export const signout = (req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) {
            res.status(400).json({
                code: 400,
                message: "잘못된 요청입니다."
            })
        }
    })
    console.log("Signout 진입")
    res.clearCookie("connect.sid")

    res.redirect("/auth/buser/signin")
}
export async function getBUser(req: Request, res: Response) {
    const page = req.params.p;
    
    const [getbuser,metadata] = await sequelize.query('select s.name,b.email, b.username ,date_format(b.registeredAt,"%Y-%m-%d %H:%i:%s") as time from stores as s, busers as b where s.buser_id=b.id and name is not null order by s.buser_id');
    res.render('buser/user/buser',{buser : getbuser,page : page,leng : Object.keys(getbuser).length-1,page_num : 10,pass : true})
    return
}