import { Router } from "express"
import { oauthSignin, oauthSinginCallback, signout, renderSignin,getUser } from './controller';

//"api/auth/user/1"
export const authUser = Router()  //api/auth/user/route

authUser.get("/signin", renderSignin)
authUser.get("/signin/:provider", oauthSignin)
authUser.get("/signin/:provider/callback", oauthSinginCallback)
authUser.get("/:p",getUser)
authUser.get("signout", signout)







