import chaiHttp from "chai-http"
import chai from "chai"
const expect = chai.expect
import "mocha"
import * as dotenv from "dotenv"
dotenv.config()
import server from '../../server'
import fs from "fs"
import { RowDataPacket } from "mysql2/typings/mysql"

chai.use(chaiHttp)

import mysql from "mysql2"
import { step } from "mocha-steps"
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PW,
})

const testRawData = fs.readFileSync(`src/api/test/data.json`)

const { testUser, testStore, updateStore, testMenu } = JSON.parse(testRawData.toString())

const agent = chai.request.agent(server)

if (server.listening) {
    describe("Buser", () => {
        after(() => {
            describe("end test : signout, delete data", () => {
                step("signout:test_user", (done) => {
                    agent
                        .get("/auth/buser/signout")
                        .end((err, res) => {
                            expect(err).to.be.null
                            expect(res).to.have.status(200)

                            done()
                        })
                })

                step("delete store", (done) => {
                    agent
                        .delete("/api/buser/store")
                        .query({
                            store_id: testStore.id,
                        })
                        .end((err, res) => {
                            expect(err).to.be.null
                            expect("Location", "/api/buser/store")
                            expect(res).to.have.status(200)
                            done()
                        })
                })
            })
        })

        describe('buser authentication', () => {
            before(() => {
                //delete exist user
                //before에서 삭제하는 이유는 test후 데이터 상태 확인하기 위함.
                connection.query(`delete from busers where username="${testUser.username}"`, (err) => {
                    if (err) {
                        throw err
                    }
                })
            })

            step("signup:test_user", (done) => {
                agent
                    .post("/auth/buser/signup")
                    .type("form")
                    .send({
                        username: testUser.username,
                        email: testUser.email,
                        password1: testUser.password,
                        password2: testUser.password
                    })
                    .end((err, res) => {
                        expect(err).to.be.null
                        expect(res).to.have.status(200)
                        done()
                    })

            })

            step("signin:test_user", (done) => {
                agent
                    .post("/auth/buser/signin")
                    .type("form")
                    .send({
                        email: testUser.email,
                        password: testUser.password
                    })
                    .end((err, res) => {
                        expect(err).to.be.null
                        //buser home으로 redirect돼서 200
                        expect(res).to.have.status(200)
                        expect("Location", "/buser")
                        done()
                    })
            })

            step("signin:email_does not exist", (done) => {
                agent
                    .post("/auth/buser/signin")
                    .type("form")
                    .send({
                        email: "wrong_email@gmail.com",
                        password: testUser.password
                    })
                    .end((err, res) => {
                        expect(err).to.be.null
                        //buser home으로 redirect돼서 200
                        expect(res).to.have.status(401)
                        done()
                    })
            })

            step("signin:password_does not exist", (done) => {
                agent
                    .post("/auth/buser/signin")
                    .type("form")
                    .send({
                        email: testUser.email,
                        password: "wrong_password"
                    })
                    .end((err, res) => {
                        expect(err).to.be.null
                        //buser home으로 redirect돼서 200
                        expect(res).to.have.status(401)
                        done()
                    })
            })

            //signin된 상태에서 home에 접근했을때 
            step("home:test_user", (done) => {
                agent
                    .get("/buser/home")
                    .end((err, res) => {
                        expect(err).to.be.null
                        //authenticationn에 성공해 redirect되지 않음
                        expect(res).not.to.redirect
                        expect(res).to.have.status(200)

                        done()
                    })
            })

        });

        describe("store api", () => {
            //매장 생성은 mufi측에서 store row를 생성하고 code를 넘겨줘야 생성이 가능하기 때문에 그 과정을 전처리 해준다.
            before((done) => {
                const findUserQ = `SELECT id FROM busers WHERE username="${testUser.username}"`

                connection.query(findUserQ, (err, results: RowDataPacket[]) => {
                    if (err) {
                        throw err
                    }

                    const buser_id = results[0].id
                    const registerStoreQ = `INSERT INTO stores(id, code, buser_id) VALUES('${testStore.id}', '${testStore.code}', '${buser_id}')`

                    connection.query(registerStoreQ, (err, results) => {
                        if (err) {
                            throw err
                        }
                        done()
                        return
                    })
                })
            })


            //매장 생성
            //매장 생성은 사전에 mufi에 문의해서 등록한 store code를 입력해야 가능함.
            step("create store", (done) => {
                agent
                    .post("/api/buser/store")
                    .type("form")
                    .send({
                        code: testStore.code,
                        name: testStore.name,
                        description: testStore.description,
                        zip_code: testStore.zip_code,
                        detail_address: testStore.detail_address,
                    })
                    .end((err, res) => {
                        if (err) {
                            throw err
                        }

                        //requestr중 error가 없고
                        expect(err).to.be.null
                        //middleware에 걸려 redirect되지 않았으며
                        expect("Location", "/api/buser/store")
                        //200의 status code를 받아 성공적으로 매장 생성을 확인
                        expect(res).to.have.status(200)

                        done()
                    })
            })

            //매장 생성 예외1.
            //=> 이미 code를 사용하여 update된 store는 다시 생성할 수 없다.
            step("create same store", (done) => {
                agent
                    .post("/api/buser/store")
                    .type("form")
                    .send({
                        code: testStore.code,
                        name: testStore.name,
                        description: testStore.description,
                        zip_code: testStore.zip_code,
                        detail_address: testStore.detail_address,
                    })
                    .end((err, res) => {
                        if (err) {
                            throw err
                        }

                        //requestr중 error가 없고
                        expect(err).to.be.null
                        //middleware에 걸려 redirect되지 않았으며
                        expect("Location", "/api/buser/store")
                        //200의 status code를 받아 성공적으로 매장 생성을 확인
                        expect(res).to.have.status(400)

                        done()
                    })
            })

            //buser의 store_id로 지정한 매장 정보 가져오기
            step("get store", (done) => {
                agent
                    .get("/api/buser/store")
                    .query({
                        store_id: testStore.id
                    })
                    .end((err, res) => {
                        expect(err).to.be.null
                        expect("Location", "/api/buser/store")
                        expect(res).to.have.status(200)

                        done()
                    })
            })

            //buser의 모든 매장 정보 가져오기
            step("get all stores", (done) => {
                agent
                    .get("/api/buser/store")
                    .end((err, res) => {
                        expect(err).to.be.null
                        expect("Location", "/api/buser/store")
                        expect(res).to.have.status(200)

                        done()
                    })
            })

            step("update store", (done) => {
                agent
                    .put("/api/buser/store")
                    .query({
                        store_id: testStore.id,
                    })
                    .type("form")
                    .send({
                        name: updateStore.name,
                        description: updateStore.description,
                        zip_code: updateStore.zip_code,
                        detail_address: updateStore.detail_address
                    })
                    .end((err, res) => {
                        expect(err).to.be.null
                        expect("Location", "/api/buser/store")
                        expect(res).to.have.status(200)
                        done()
                    })

            })
        })

        describe("menu api", () => {
            after(() => {
                step("delete menu", (done) => {
                    agent
                        .delete("/api/buser/menu")
                        .query({
                            menu_id: testMenu.id
                        })
                        .end((err, res) => {
                            console.log("done delete!")
                            expect(err).to.be.null
                            expect("Location", "api/buser/store")
                            expect(res).to.have.status(200)

                            done()
                        })
                })
            })
            step("create menu", (done) => {
                console.log(testMenu.image)
                const image = fs.readFileSync(testMenu.image)

                agent
                    .post("/api/buser/menu")
                    .query({
                        store_id: testStore.id
                    })
                    .type("form")
                    .field({
                        label: testMenu.label,
                        price: testMenu.price,
                        description: testMenu.description,
                    })
                    .attach("image", image, "image.png")
                    .end((err, res) => {                 
                        expect(err).to.be.null
                        expect("Location", "/api/buser/store")
                        expect(res).to.have.status(200)
                        testMenu.id = res.body.data.id

                        done()
                    })
            })

            describe("get menu", () => {
                step("all menu of store's", (done) => {
                    agent
                        .get("/api/buser/menu")
                        .query({
                            store_id: testStore.id
                        })
                        .end((err, res) => {
                            expect(err).to.be.null
                            expect("Location", "/api/buser/store")
                            expect(res).to.have.status(200)

                            done()
                        })
                })

                step("all menus of buser's", (done) => {
                    agent
                        .get("/api/buser/menu")
                        .end((err, res) => {
                            expect(err).to.be.null
                            expect("Location", "/api/buser/store")
                            expect(res).to.have.status(200)

                            done()
                        })
                })

                step("single menu", (done) => {
                    agent
                        .get("/api/buser/menu")
                        .query({
                            store_id: testStore.id,
                            menu_id: testMenu.id
                        })
                        .end((err, res) => {
                            expect(err).to.be.null
                            expect("Location", "/api/buser/store")
                            expect(res).to.have.status(200)

                            done()
                        })
                })
            })
        })
    })
}





