require("dotenv").config();

const request = require("supertest");
const mongoose = require("mongoose");
const App = require("../server");
const { Proveedor } = require("../models");
const { genUsuario, genProveedorData } = require("../helpers/query.data");

describe("API proveedor", () => {
    const appServer = new App();
    let tokenAutentication = "";

    beforeEach(async () => {
        await Proveedor.deleteMany();
        await genProveedorData();
        await genUsuario();
        const result = await request(appServer.app)
            .post("/")
            .send({ username: "manager", password: "manager" });
        tokenAutentication = result.body.token;
    });
    describe("GET API proveedores", () => {
        it("Retornar 5 proveedores", async () => {
            const proveedor = await request(appServer.app)
                .get("/proveedor")
                .set("auth-token", tokenAutentication)
                .expect(200)
                .expect("Content-Type", /application\/json/);
            expect(proveedor.body).toHaveProperty("results");
            expect(proveedor.body.results).toHaveLength(5);
        });
        it("Conseguir datos de un proveedor", async () => {
            const proveedor = await request(appServer.app)
                .get("/proveedor/?limit=8")
                .set("auth-token", tokenAutentication)
                .expect(200)
                .expect("Content-Type", /application\/json/);
            expect(proveedor.body).toHaveProperty("results");
            expect(proveedor.body.results).toHaveLength(8);
        });
        it("Buscar un proveedor", async () => {
            const proveedor = await request(appServer.app)
                .get("/proveedor")
                .set("auth-token", tokenAutentication)
                .expect("Content-Type", /application\/json/);
            const idProveedor = proveedor.body.results[0].data._id;

            const result = await request(appServer.app)
                .get(`/proveedor/${idProveedor}`)
                .set("auth-token", tokenAutentication)
                .expect("Content-Type", /application\/json/);
            expect(result.body).toHaveProperty("result");
            expect(result.body.result).toHaveProperty("_id");
            expect(result.body.result._id).toBe(idProveedor);
        });
        it("(Fallar) Buscar un proveedor que no existe.", async () => {
            const id = "642870af47fd929124fb01d0";
            const result = await request(appServer.app)
                .get(`/proveedor/${id}`)
                .set("auth-token", tokenAutentication)
                .expect(400)
                .expect("Content-Type", /application\/json/);
            expect(result.body).toHaveProperty("error");
            expect(result.body.error).toHaveProperty("message");
            expect(result.body.error.message).toBe(
                "El proveedor no se encuentra en la BD."
            );
        });
    });

    describe("POST API proveedores", () => {
        it("Registrar un proveedor correctamente.", async () => {
            const result = await request(appServer.app)
                .post(`/proveedor/`)
                .set("auth-token", tokenAutentication)
                .send({
                    ruc: "20429454659",
                    nombre: "Riptal",
                    rubro: "Riptal SAC",
                    correo: "r23iptal@gmail.com",
                    telefono: "998899999",
                })
                .expect(200)
                .expect("Content-Type", /application\/json/);
            expect(result.body).toHaveProperty("message");
            expect(result.body.message).toBe("Se registro correctamente.");
        });
        it("(Fallar) Registrar un proveedor sin nombre.", async () => {
            const result = await request(appServer.app)
                .post(`/proveedor/`)
                .set("auth-token", tokenAutentication)
                .send({
                    ruc: "20429454659",
                    rubro: "Riptal SAC",
                    correo: "r23iptal@gmail.com",
                    telefono: "998899999",
                })
                .expect(401)
                .expect("Content-Type", /application\/json/);
            expect(result.body).toHaveProperty("errors");
            expect(result.body.errors).toHaveLength(1);
            expect(result.body.errors[0]).toHaveProperty("message");
            expect(result.body.errors[0].message).toBe("Ingresar el nombre.");
        });
        it("(Fallar) registrar un proveedor sin datos.", async () => {
            const result = await request(appServer.app)
                .post(`/proveedor/`)
                .set("auth-token", tokenAutentication)
                .send({})
                .expect(401)
                .expect("Content-Type", /application\/json/);
            expect(result.body).toHaveProperty("errors");
            expect(result.body.errors).toHaveLength(4);
        });
    });

    describe("PUT API proveedores", () => {
        it("Actualizar nombre de proveedor.", async () => {
            const proveedor = await request(appServer.app)
                .get("/proveedor")
                .set("auth-token", tokenAutentication)
                .expect("Content-Type", /application\/json/);
            const idProveedor = proveedor.body.results[0].data._id;

            const result = await request(appServer.app)
                .put(`/proveedor/${idProveedor}`)
                .set("auth-token", tokenAutentication)
                .send({
                    nombre: "Soluciones All",
                })
                .expect(200)
                .expect("Content-Type", /application\/json/);
            expect(result.body).toHaveProperty("message");
            expect(result.body.message).toBe("Se actualizo correctamente.");

            const getProveedor = await request(appServer.app)
                .get(`/proveedor/${idProveedor}`)
                .set("auth-token", tokenAutentication)
                .expect("Content-Type", /application\/json/);
            expect(getProveedor.body).toHaveProperty("result");
            expect(getProveedor.body.result).toHaveProperty("_id");
            expect(getProveedor.body.result._id).toBe(idProveedor);
            expect(getProveedor.body.result).toHaveProperty("nombre");
            expect(getProveedor.body.result.nombre).toBe("Soluciones All");
        });
        it("(Fallar) Actualizar un proveedor que no existe.", async () => {
            const id = "642870af47fd929124fb01d0";
            const result = await request(appServer.app)
                .put(`/proveedor/${id}`)
                .set("auth-token", tokenAutentication)
                .send({
                    nombre: "Soluciones All",
                })
                .expect(400)
                .expect("Content-Type", /application\/json/);
            expect(result.body).toHaveProperty("error");
            expect(result.body.error).toHaveProperty("message");
            expect(result.body.error.message).toBe(
                "El proveedor no se encuentra en la BD."
            );
        });
        it("Deshabilitar un proveedor.", async () => {
            const proveedor = await request(appServer.app)
                .get("/proveedor")
                .set("auth-token", tokenAutentication)
                .expect("Content-Type", /application\/json/);
            const idProveedor = proveedor.body.results[0].data._id;

            const result = await request(appServer.app)
                .put(`/proveedor/deshabilitar/${idProveedor}`)
                .set("auth-token", tokenAutentication)
                .expect(200)
                .expect("Content-Type", /application\/json/);
            expect(result.body).toHaveProperty("message");
            expect(result.body.message).toBe(
                "Se deshabilito el proveedor correctamente."
            );

            const getProveedor = await request(appServer.app)
                .get(`/proveedor/${idProveedor}`)
                .set("auth-token", tokenAutentication)
                .expect("Content-Type", /application\/json/);
            expect(getProveedor.body).toHaveProperty("result");
            expect(getProveedor.body.result).toHaveProperty("_id");
            expect(getProveedor.body.result._id).toBe(idProveedor);
            expect(getProveedor.body.result).toHaveProperty("estado");
            expect(getProveedor.body.result.estado).toBe(false);
        });
        it("(Fallar) Deshabilitar un proveedor que no existe.", async () => {
            const id = "642870af47fd929124fb01d0";
            const result = await request(appServer.app)
                .put(`/proveedor/deshabilitar/${id}`)
                .set("auth-token", tokenAutentication)
                .expect(400)
                .expect("Content-Type", /application\/json/);
            expect(result.body).toHaveProperty("error");
            expect(result.body.error).toHaveProperty("message");
            expect(result.body.error.message).toBe(
                "El proveedor no se encuentra en la BD."
            );
        });
    });

    describe("DELETE API proveedor", () => {
        it("Eliminar proveedor", async () => {
            const proveedor = await request(appServer.app)
                .get("/proveedor")
                .set("auth-token", tokenAutentication)
                .expect("Content-Type", /application\/json/);
            const idProveedor = proveedor.body.results[0].data._id;

            const result = await request(appServer.app)
                .delete(`/proveedor/${idProveedor}`)
                .set("auth-token", tokenAutentication)
                .expect(200)
                .expect("Content-Type", /application\/json/);
            expect(result.body).toHaveProperty("message");
            expect(result.body.message).toBe("Se elimino correctamente.");

            const getProveedor = await request(appServer.app)
                .get(`/proveedor/${idProveedor}`)
                .set("auth-token", tokenAutentication)
                .expect("Content-Type", /application\/json/);
            expect(getProveedor.body).toHaveProperty("error");
            expect(getProveedor.body.error).toHaveProperty("message");
            expect(getProveedor.body.error.message).toBe(
                "El proveedor no se encuentra en la BD."
            );
        });
        it("(Fallar) Eliminar un proveedor que no existe", async () => {
            const id = "642870af47fd929124fb01d0";
            const result = await request(appServer.app)
                .delete(`/proveedor/${id}`)
                .set("auth-token", tokenAutentication)
                .expect(400)
                .expect("Content-Type", /application\/json/);
            expect(result.body).toHaveProperty("error");
            expect(result.body.error).toHaveProperty("message");
            expect(result.body.error.message).toBe(
                "No se encontro el proveedor."
            );
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
        appServer.app.listen().close();
    });
});
