import { SessionOptions, Store } from "express-session"

// https://fierycoding.tistory.com/36 설명

function createSessionConfig(sessionStore: Store): SessionOptions {
    return {
        secret: process.env.APP_SECRET,
        store: sessionStore,
        //false : prevent useless save operation excuting when db query request incoming
        //true : deprecated
        resave: false,
        //false : prevent stacking empty session objects
        //true : deprecated
        saveUninitialized: false,
    }
}

export default createSessionConfig