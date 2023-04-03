require("dotenv").config();

const request = require("supertest");
const mongoose = require("mongoose");
const App = require("../server");
const { Usuario } = require("../models");
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
    idCurrentUser = result.body.result.id;
});

describe("GET API usuario", () => {
    it("Retornar usuarios que no sean manager.", async () => {
        const response = await request(appServer.app)
            .get("/usuario")
            .set("auth-token", tokenAutentication)
            .expect("Content-Type", /application\/json/);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("results");
        expect(response.body.results).toHaveLength(0);
    });

    it("Conseguir datos del usuario manager.", async () => {
        const response = await request(appServer.app)
            .get(`/usuario/${idCurrentUser}`)
            .set("auth-token", tokenAutentication)
            .expect("Content-Type", /application\/json/);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("result");
        expect(response.body.result.id).toBe(idCurrentUser);
    });

    it("Igresar un id que no se encuentra en la BD.", async () => {
        const response = await request(appServer.app)
            .get(`/usuario/a${idCurrentUser.slice(1)}`)
            .set("auth-token", tokenAutentication)
            .expect("Content-Type", /application\/json/);
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.error.message).toBe(
            "no se encontro el usuario en la BD."
        );
    });
});

describe("POST API usuario", () => {
    it("Registrar un usuario.", async () => {
        const data = {
            username: "seller01",
            password: "1234",
            email: "seller01@ok.com",
        };
        const response = await request(appServer.app)
            .post("/usuario")
            .set("auth-token", tokenAutentication)
            .send(data)
            .expect(200)
            .expect("Content-Type", /application\/json/);
        expect(response.body).toHaveProperty("message");
        expect(response.body.message).toBe("Se registro correctamente.");
    });

    it("(Fallo) Registrar un usuario con una clave de 3 digitos.", async () => {
        const data = {
            username: "seller02",
            password: "123",
            email: "seller02@ok.com",
        };
        const response = await request(appServer.app)
            .post("/usuario")
            .set("auth-token", tokenAutentication)
            .send(data)
            .expect(400)
            .expect("Content-Type", /application\/json/);
        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toHaveProperty("message");
        expect(response.body.error.message).toBe(
            "la clave debe terner 4 digitos como minimo."
        );
    });

    it("(Fallo) Registrar un usuario sin correo.", async () => {
        const data = {
            username: "seller02",
            password: "1234",
        };
        const response = await request(appServer.app)
            .post("/usuario")
            .set("auth-token", tokenAutentication)
            .send(data)
            .expect(401)
            .expect("Content-Type", /application\/json/);
        expect(response.body).toHaveProperty("errors");
        expect(response.body.errors).toHaveLength(1);
        expect(response.body.errors[0].message).toBe("Ingresar Correo.");
    });

    it("(Fallo) Registrar un usuario sin datos.", async () => {
        const data = {};
        const response = await request(appServer.app)
            .post("/usuario")
            .set("auth-token", tokenAutentication)
            .send(data)
            .expect(500)
            .expect("Content-Type", /application\/json/);
        expect(response.body).toHaveProperty("error");
        expect(response.body.error.status).toBe(500);
    });
});

describe("PUT API usuario", () => {
    it("Deshabilitar un usuario.", async () => {
        const usuario = await Usuario.create({
            username: "seller05",
            password: "1234",
            email: "seller05@ok.com",
        });

        const response = await request(appServer.app)
            .put(`/usuario/disable/${usuario._id}`)
            .set("auth-token", tokenAutentication)
            .expect(200)
            .expect("Content-Type", /application\/json/);
        expect(response.body).toHaveProperty("message");
        expect(response.body.message).toBe("Se deshabilito correctamente.");

        const res = await request(appServer.app)
            .get(`/usuario/${usuario._id}`)
            .set("auth-token", tokenAutentication)
            .expect(200)
            .expect("Content-Type", /application\/json/);
        expect(res.body).toHaveProperty("result");
        expect(res.body.result).toHaveProperty("state");
        expect(res.body.result.state).toBe(false);
    });

    it("Deshabilitar un usuario que no existe.", async () => {
        const response = await request(appServer.app)
            .put(`/usuario/disable/a${idCurrentUser.slice(1)}`)
            .set("auth-token", tokenAutentication)
            .expect(500)
            .expect("Content-Type", /application\/json/);
        expect(response.body).toHaveProperty("error");
        expect(response.body.error.message).toBe("No se encontro el usuario.");
    });

    it("Cambiar password correctamente.", async () => {
        const response = await request(appServer.app)
            .put(`/usuario/${idCurrentUser}`)
            .set("auth-token", tokenAutentication)
            .send({ password: "admin", npassword: "4321" })
            .expect(200)
            .expect("Content-Type", /application\/json/);
        expect(response.body).toHaveProperty("message");
        expect(response.body.message).toBe("Se cambio la clave correctamente.");
    });

    it("Cambiar password de un usuario que no existe.", async () => {
        const response = await request(appServer.app)
            .put(`/usuario/a${idCurrentUser.slice(1)}`)
            .set("auth-token", tokenAutentication)
            .send({ password: "admin", npassword: "4321" })
            .expect("Content-Type", /application\/json/);
        expect(response.body).toHaveProperty("error");
        expect(response.body.error.message).toBe(
            `El id a${idCurrentUser.slice(1)} no se encuentra en la BD`
        );
    });

    it("Cambiar password pero la clave no coincide.", async () => {
        const response = await request(appServer.app)
            .put(`/usuario/${idCurrentUser}`)
            .set("auth-token", tokenAutentication)
            .send({ password: "admin2", npassword: "4321" })
            .expect("Content-Type", /application\/json/);
        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toHaveProperty("message");
        expect(response.body.error.message).toBe("la clave no coincide.");
    });
});

describe("DELETE API Usuario", () => {
    it("Eliminar usuario", async () => {
        const response = await request(appServer.app)
            .delete(`/usuario/delete/${idCurrentUser}`)
            .set("auth-token", tokenAutentication)
            .expect(200)
            .expect("Content-Type", /application\/json/);
        expect(response.body).toHaveProperty("message");
        expect(response.body.message).toBe("Se elimino correctamente.");
    });

    it("Eliminar un usuario que no existe", async () => {
        const response = await request(appServer.app)
            .delete(`/usuario/delete/a${idCurrentUser.slice(1)}`)
            .set("auth-token", tokenAutentication)
            .expect(500)
            .expect("Content-Type", /application\/json/);
        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toHaveProperty("message");
        expect(response.body.error.message).toBe("No se encontro el usuario.");
    });
});

afterAll(async () => {
    await mongoose.connection.close();
    appServer.app.listen().close();
});
