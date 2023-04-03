require("dotenv").config();

const request = require("supertest");
const mongoose = require("mongoose");
const App = require("../server");
const { Producto } = require("../models");
const { genUsuario, genFamiliaProductoData } = require("../helpers/query.data");

const appServer = new App();

let tokenAutentication = "";
let idFamilia = "";
let idImpuesto = "";

beforeEach(async () => {
    await Producto.deleteMany();
    await genFamiliaProductoData();
    await genUsuario();
    const producto = await Producto.find();
    idFamilia = producto[1].fam_id;
    idImpuesto = producto[1].imp_id;

    const result = await request(appServer.app)
        .post("/")
        .send({ username: "manager", password: "manager" });
    tokenAutentication = result.body.token;
});

describe("GET API productos", () => {
    it("Retornar 5 productos", async () => {
        const producto = await request(appServer.app)
            .get("/producto")
            .set("auth-token", tokenAutentication)
            .expect(200)
            .expect("Content-Type", /application\/json/);
        expect(producto.body).toHaveProperty("results");
        expect(producto.body.results).toHaveLength(5);
    });
    it("Retornar 8 productos enviando query", async () => {
        const producto = await request(appServer.app)
            .get("/producto/?limit=8")
            .set("auth-token", tokenAutentication)
            .expect(200)
            .expect("Content-Type", /application\/json/);
        expect(producto.body).toHaveProperty("results");
        expect(producto.body.results).toHaveLength(8);
    });
    it("Conseguir datos de un producto", async () => {
        const producto = await request(appServer.app)
            .get("/producto/")
            .set("auth-token", tokenAutentication)
            .expect("Content-Type", /application\/json/);
        const idProducto = producto.body.results[0].data._id;

        const result = await request(appServer.app)
            .get(`/producto/${idProducto}`)
            .set("auth-token", tokenAutentication)
            .expect(200)
            .expect("Content-Type", /application\/json/);
        expect(result.body).toHaveProperty("result");
        expect(result.body.result).toHaveProperty("_id");
        expect(result.body.result._id).toBe(idProducto);
    });
    it("(Fallar) Buscar un producto que no existe.", async () => {
        const id = "642870af47fd929124fb01d0";
        const result = await request(appServer.app)
            .get(`/producto/${id}`)
            .set("auth-token", tokenAutentication)
            .expect(400)
            .expect("Content-Type", /application\/json/);
        expect(result.body).toHaveProperty("error");
        expect(result.body.error).toHaveProperty("message");
        expect(result.body.error.message).toBe(
            "El producto no se encuentra en la BD."
        );
    });
});

describe("POST API productos", () => {
    it("Registrar un producto correctamente.", async () => {
        const result = await request(appServer.app)
            .post(`/producto/`)
            .set("auth-token", tokenAutentication)
            .send({
                fam_id: idFamilia,
                marca: "AOC",
                color: "negro",
                unidad: "pulgadas",
                valor: "49",
                modelo: "AOC49PGM",
                precio: "1599",
                imp_id: idImpuesto,
            })
            .expect(200)
            .expect("Content-Type", /application\/json/);
        expect(result.body).toHaveProperty("message");
        expect(result.body.message).toBe("Se registro correctamente.");
    });
    it("(Fallar) Registrar un producto sin marca.", async () => {
        const result = await request(appServer.app)
            .post(`/producto/`)
            .set("auth-token", tokenAutentication)
            .send({
                fam_id: idFamilia,
                color: "negro",
                unidad: "pulgadas",
                valor: "49",
                modelo: "AOC49PGM",
                precio: "1599",
                imp_id: idImpuesto,
            })
            .expect(401)
            .expect("Content-Type", /application\/json/);
        expect(result.body).toHaveProperty("errors");
        expect(result.body.errors).toHaveLength(1);
        expect(result.body.errors[0]).toHaveProperty("message");
        expect(result.body.errors[0].message).toBe(
            "Especificar marca del producto."
        );
    });
    it("(Fallar) registrar un producto sin datos.", async () => {
        const result = await request(appServer.app)
            .post(`/producto/`)
            .set("auth-token", tokenAutentication)
            .send({})
            .expect(401)
            .expect("Content-Type", /application\/json/);
        expect(result.body).toHaveProperty("errors");
        expect(result.body.errors).toHaveLength(7);
    });
});

describe("PUT API productos", () => {
    it("Actualizar nombre de producto.", async () => {
        const producto = await request(appServer.app)
            .get("/producto/")
            .set("auth-token", tokenAutentication)
            .expect("Content-Type", /application\/json/);
        const idProducto = producto.body.results[0].data._id;

        const result = await request(appServer.app)
            .put(`/producto/${idProducto}`)
            .set("auth-token", tokenAutentication)
            .send({
                marca: "xiaomi",
            })
            .expect(200)
            .expect("Content-Type", /application\/json/);
        expect(result.body).toHaveProperty("message");
        expect(result.body.message).toBe(
            "Se actualizo correctamente."
        );

        const getProduct = await request(appServer.app)
            .get(`/producto/${idProducto}`)
            .set("auth-token", tokenAutentication)
            .expect("Content-Type", /application\/json/);
        expect(getProduct.body).toHaveProperty("result");
        expect(getProduct.body.result).toHaveProperty("_id");
        expect(getProduct.body.result._id).toBe(idProducto);
        expect(getProduct.body.result).toHaveProperty("marca");
        expect(getProduct.body.result.marca).toBe("xiaomi");
    });
    it("(Fallar) Actualizar un producto que no existe.", async () => {
        const id = "642870af47fd929124fb01d0";
        const result = await request(appServer.app)
            .put(`/producto/${id}`)
            .set("auth-token", tokenAutentication)
            .send({
                marca: "xiaomi",
            })
            .expect(400)
            .expect("Content-Type", /application\/json/);
        expect(result.body).toHaveProperty("error");
        expect(result.body.error).toHaveProperty("message");
        expect(result.body.error.message).toBe("El producto no se encuentra en la BD.");
    });
    it("Deshabilitar un producto.", async () => {
        const producto = await request(appServer.app)
            .get("/producto/")
            .set("auth-token", tokenAutentication)
            .expect("Content-Type", /application\/json/);
        const idProducto = producto.body.results[0].data._id;

        const result = await request(appServer.app)
            .put(`/producto/deshabilitar/${idProducto}`)
            .set("auth-token", tokenAutentication)
            .expect(200)
            .expect("Content-Type", /application\/json/);
        expect(result.body).toHaveProperty("message");
        expect(result.body.message).toBe(
            "Se deshabilito el producto correctamente."
        );
    });
    it("(Fallar) Deshabilitar un producto que no existe.", async () => {
        const id = "642870af47fd929124fb01d0";
        const result = await request(appServer.app)
            .put(`/producto/deshabilitar/${id}`)
            .set("auth-token", tokenAutentication)
            .expect(400)
            .expect("Content-Type", /application\/json/);
        expect(result.body).toHaveProperty("error");
        expect(result.body.error).toHaveProperty("message");
        expect(result.body.error.message).toBe("El producto no se encuentra en la BD.");
    });
});

describe("DELETE API producto", () => {
    it("Eliminar producto", async () => {
        const producto = await request(appServer.app)
            .get("/producto/")
            .set("auth-token", tokenAutentication)
            .expect("Content-Type", /application\/json/);
        const idProducto = producto.body.results[0].data._id;

        const result = await request(appServer.app)
            .delete(`/producto/${idProducto}`)
            .set("auth-token", tokenAutentication)
            .expect(200)
            .expect("Content-Type", /application\/json/);
        expect(result.body).toHaveProperty("message");
        expect(result.body.message).toBe(
            "Se elimino correctamente."
        );
    });
    it("(Fallar) Eliminar un producto que no existe", async () => {
        const id = "642870af47fd929124fb01d0";
        const result = await request(appServer.app)
            .delete(`/producto/${id}`)
            .set("auth-token", tokenAutentication)
            .expect(400)
            .expect("Content-Type", /application\/json/);
        expect(result.body).toHaveProperty("error");
        expect(result.body.error).toHaveProperty("message");
        expect(result.body.error.message).toBe("No se encontro el producto.");
    });
});

afterAll(() => {
    mongoose.connection.close();
    appServer.app.listen().close();
});
