import { Request, Response, NextFunction } from "express"
import { unless } from "express-unless"

export function bUserAuthenticated(req: Request, res: Response, next: NextFunction) {
    //authenticated
    //condition : client got session and user data
    if (req.session && req.session.buser) {
        return next()
    }
    //not authenticated redirect to signin page
    else {
        res.redirect("/auth/buser/signin")
        return
    }
}

//for except authentication router
bUserAuthenticated.unless = unless