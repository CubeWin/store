require("dotenv").config();

const request = require("supertest");
const mongoose = require("mongoose");
const App = require("../server");
const { Usuario } = require("../models");
const { LOGIN } = require("./helper");
const { genUsuario } = require("../helpers/query.data");

const appServer = new App();

let tokenAutentication = "";
let idCurrentUser = "";

beforeEach(async () => {
    await Usuario.deleteMany();
    await genUsuario();
    const result = await request(appServer.app)
        .post("/")
        .send({ username: "manager", password: "manager" });
    tokenAutentication = result.body.token;
});

describe("GET API usuarios", () => {
    it("Retornar usuarios que no sean manager", async () => {
        const response = await request(appServer.app)
            .get("/usuario")
            .set("auth-token", tokenAutentication)
            .expect("Content-Type", /application\/json/);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("results");
        expect(response.body.results).toHaveLength(0);
    });
});

afterAll(() => {
    mongoose.connection.close();
    appServer.app.listen().close();
});
