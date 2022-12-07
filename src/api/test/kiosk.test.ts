import chaiHttp from "chai-http"
import chai from "chai"
const expect = chai.expect
import "mocha"
import * as dotenv from "dotenv"
dotenv.config()
import server from '../../server'

chai.use(chaiHttp)

import mysql from "mysql2"
import { step } from "mocha-steps"
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PW,
})

describe("kiosk api", () => {
    const kioskAgent = chai.request.agent(server)
    describe("unAuthorized agent", () => {
        step("acess home", (done) => {
            kioskAgent
                .get("/kiosk")
                .end((err, res) => {
                    expect(err).to.be.null
                    expect("Location", "/auth/kiosk/store")
                    done()
                })
        })
    })
})