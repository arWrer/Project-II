import { Router } from "express"
import { renderSignin, renderSignup, signin, signup, signout,getBUser } from "./controller"

//"/auth/buser/"
export const authBUser = Router()

authBUser.get("/signin", renderSignin)

authBUser.post("/signin", signin)

authBUser.get("/signup", renderSignup)

authBUser.post("/signup", signup)

authBUser.get('/signout', signout)

authBUser.get("/:p",getBUser)