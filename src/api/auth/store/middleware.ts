import { Request, Response, NextFunction } from "express"
import { unless } from "express-unless"

export function storeInfoAuthenticated(req: Request, res: Response, next: NextFunction) {
    
}

//for except authentication router
storeInfoAuthenticated.unless = unless