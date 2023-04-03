require("dotenv").config();

const request = require("supertest");
const mongoose = require("mongoose");
const App = require("../server");
const { Familia } = require("../models");
const { genUsuario, genFamiliaProductoData } = require("../helpers/query.data");

const appServer = new App();

let tokenAutentication = "";
let idCurrent = "";

beforeEach(async () => {
    await Familia.deleteMany();
    await genFamiliaProductoData();
    await genUsuario();
    const result = await request(appServer.app)
        .post("/")
        .send({ username: "manager", password: "manager" });
    tokenAutentication = result.body.token;
});

describe("GET API familia", () => {
    it("Retornar 5 familias", async () => {
        const familia = await request(appServer.app)
            .get("/familia")
            .set("auth-token", tokenAutentication)
            .expect(200)
            .expect("Content-Type", /application\/json/);
        expect(familia.body).toHaveProperty("results");
        expect(familia.body.results).toHaveLength(5);
    });
    it("Retornar 8 familias enviando query", async () => {
        const familia = await request(appServer.app)
            .get("/familia/?limit=8")
            .set("auth-token", tokenAutentication)
            .expect(200)
            .expect("Content-Type", /application\/json/);
        expect(familia.body).toHaveProperty("results");
        expect(familia.body.results).toHaveLength(8);
    });
    it("Conseguir datos de un familia", async () => {
        const familia = await request(appServer.app)
            .get("/familia")
            .set("auth-token", tokenAutentication)
            .expect("Content-Type", /application\/json/);
        const idFamilia = familia.body.results[0].data._id;

        const result = await request(appServer.app)
            .get(`/familia/${idFamilia}`)
            .set("auth-token", tokenAutentication)
            .expect("Content-Type", /application\/json/);
        expect(result.body).toHaveProperty("result");
        expect(result.body.result).toHaveProperty("_id");
        expect(result.body.result._id).toBe(idFamilia);
    });
    it("(Fallar) Buscar un familia que no existe.", async () => {
        const id = "642870af47fd929124fb01d0";
        const result = await request(appServer.app)
            .get(`/familia/${id}`)
            .set("auth-token", tokenAutentication)
            .expect(400)
            .expect("Content-Type", /application\/json/);
        expect(result.body).toHaveProperty("error");
        expect(result.body.error).toHaveProperty("message");
        expect(result.body.error.message).toBe(
            "La familia no se encuentra en la BD."
        );
    });
});

describe("POST API familia", () => {
    it("Registrar un familia correctamente.", async () => {
        const result = await request(appServer.app)
            .post(`/familia/`)
            .set("auth-token", tokenAutentication)
            .send({
                codigo: "024",
                categoria: "reposteria",
            })
            .expect(200)
            .expect("Content-Type", /application\/json/);
        expect(result.body).toHaveProperty("message");
        expect(result.body.message).toBe("Se registro correctamente.");
    });
    it("(Fallar) Registrar un familia sin categoria.", async () => {
        const result = await request(appServer.app)
            .post(`/familia/`)
            .set("auth-token", tokenAutentication)
            .send({
                codigo: "023",
            })
            .expect(401)
            .expect("Content-Type", /application\/json/);
        expect(result.body).toHaveProperty("errors");
        expect(result.body.errors).toHaveLength(1);
        expect(result.body.errors[0]).toHaveProperty("message");
        expect(result.body.errors[0].message).toBe("Especificar categoría.");
    });
    it("(Fallar) registrar un familia sin datos.", async () => {
        const result = await request(appServer.app)
            .post(`/familia/`)
            .set("auth-token", tokenAutentication)
            .send({})
            .expect(401)
            .expect("Content-Type", /application\/json/);
        expect(result.body).toHaveProperty("errors");
        expect(result.body.errors).toHaveLength(2);
    });
});

describe("PUT API familia", () => {
    it("Actualizar nombre de familia.", async () => {
        const familia = await request(appServer.app)
            .get("/familia/")
            .set("auth-token", tokenAutentication)
            .expect("Content-Type", /application\/json/);
        const idFamilia = familia.body.results[0].data._id;

        const result = await request(appServer.app)
            .put(`/familia/${idFamilia}`)
            .set("auth-token", tokenAutentication)
            .send({
                categoria: "Muebles",
            })
            .expect(200)
            .expect("Content-Type", /application\/json/);
        expect(result.body).toHaveProperty("message");
        expect(result.body.message).toBe("Se actualizo correctamente.");

        const getFamilia = await request(appServer.app)
            .get(`/familia/${idFamilia}`)
            .set("auth-token", tokenAutentication)
            .expect("Content-Type", /application\/json/);
        expect(getFamilia.body).toHaveProperty("result");
        expect(getFamilia.body.result).toHaveProperty("_id");
        expect(getFamilia.body.result._id).toBe(idFamilia);
        expect(getFamilia.body.result).toHaveProperty("categoria");
        expect(getFamilia.body.result.categoria).toBe("Muebles");
    });
    it("(Fallar) Actualizar un familia que no existe.", async () => {
        const id = "642870af47fd929124fb01d0";
        const result = await request(appServer.app)
            .put(`/familia/${id}`)
            .set("auth-token", tokenAutentication)
            .send({
                categoria: "Muebles",
            })
            .expect(400)
            .expect("Content-Type", /application\/json/);
        expect(result.body).toHaveProperty("error");
        expect(result.body.error).toHaveProperty("message");
        expect(result.body.error.message).toBe(
            "La familia no se encuentra en la BD."
        );
    });
    it("Deshabilitar una familia.", async () => {
        const familia = await request(appServer.app)
            .get("/familia/")
            .set("auth-token", tokenAutentication)
            .expect("Content-Type", /application\/json/);
        const idFamilia = familia.body.results[0].data._id;

        const result = await request(appServer.app)
            .put(`/familia/deshabilitar/${idFamilia}`)
            .set("auth-token", tokenAutentication)
            .expect(200)
            .expect("Content-Type", /application\/json/);
        expect(result.body).toHaveProperty("message");
        expect(result.body.message).toBe(
            "Se deshabilito la familia correctamente."
        );

        const getFamilia = await request(appServer.app)
            .get(`/familia/${idFamilia}`)
            .set("auth-token", tokenAutentication)
            .expect("Content-Type", /application\/json/);
        expect(getFamilia.body).toHaveProperty("result");
        expect(getFamilia.body.result).toHaveProperty("_id");
        expect(getFamilia.body.result._id).toBe(idFamilia);
        expect(getFamilia.body.result).toHaveProperty("estado");
        expect(getFamilia.body.result.estado).toBe(false);
    });
    it("(Fallar) Deshabilitar un familia que no existe.", async () => {
        const id = "642870af47fd929124fb01d0";
        const result = await request(appServer.app)
            .put(`/familia/deshabilitar/${id}`)
            .set("auth-token", tokenAutentication)
            .expect(400)
            .expect("Content-Type", /application\/json/);
        expect(result.body).toHaveProperty("error");
        expect(result.body.error).toHaveProperty("message");
        expect(result.body.error.message).toBe(
            "La familia no se encuentra en la BD."
        );
    });
});

describe("DELETE API familia", () => {
    it("Eliminar familia", async () => {
        const familia = await request(appServer.app)
            .get("/familia/")
            .set("auth-token", tokenAutentication)
            .expect("Content-Type", /application\/json/);
        const idFamilia = familia.body.results[0].data._id;

        const result = await request(appServer.app)
            .delete(`/familia/${idFamilia}`)
            .set("auth-token", tokenAutentication)
            .expect(200)
            .expect("Content-Type", /application\/json/);
        expect(result.body).toHaveProperty("message");
        expect(result.body.message).toBe("Se elimino correctamente.");

        const getFamilia = await request(appServer.app)
            .get(`/familia/${idFamilia}`)
            .set("auth-token", tokenAutentication)
            .expect("Content-Type", /application\/json/);
        expect(getFamilia.body).toHaveProperty("error");
        expect(getFamilia.body.error).toHaveProperty("message");
        expect(getFamilia.body.error.message).toBe(
            "La familia no se encuentra en la BD."
        );
    });
    it("(Fallar) Eliminar un familia que no existe", async () => {
        const id = "642870af47fd929124fb01d0";
        const result = await request(appServer.app)
            .delete(`/familia/${id}`)
            .set("auth-token", tokenAutentication)
            .expect(400)
            .expect("Content-Type", /application\/json/);
        expect(result.body).toHaveProperty("error");
        expect(result.body.error).toHaveProperty("message");
        expect(result.body.error.message).toBe("No se encontro la familia.");
    });
});

afterAll(() => {
    mongoose.connection.close();
    appServer.app.listen().close();
});
