require("dotenv").config();

const request = require("supertest");
const mongoose = require("mongoose");
const App = require("../server");
const { Comfach, Comfacl, Usuario } = require("../models");
const {
    genUsuario,
    genProveedorData,
    genClientData,
    genFamiliaProductoData,
} = require("../helpers/query.data");

const appServer = new App();
let authToken = "";

beforeEach(async () => {
    await Comfacl.deleteMany();
    await Comfach.deleteMany();
    await genUsuario();
    await genProveedorData();
    await genClientData();
    await genFamiliaProductoData();

    const result = await request(appServer.app)
        .post("/")
        .send({ username: "manager", password: "manager" });
    authToken = result.body.token;
});

describe("API compra", () => {
    describe("GET API compra", () => {
        it("Obtener registros", async () => {
            const result = await request(appServer.app)
                .get("/comfac")
                .set("auth-token", authToken)
                .expect(200)
                .expect("Content-Type", /application\/json/);
            expect(result.body).toHaveProperty("results");
            expect(result.body.results).toHaveLength(0);
        });
    });

    describe("Realizar una compra", () => {
        let control = "";

        it("Realizar un ciclo de compra", async () => {
            // Buscar un proveedor
            const proveedor = await request(appServer.app)
                .get("/proveedor")
                .set("auth-token", authToken)
                .expect(200)
                .expect("Content-Type", /application\/json/);
            const idProveedor = proveedor.body.results[0].data._id;

            // registrar head
            const result = await request(appServer.app)
                .post("/comfac")
                .set("auth-token", authToken)
                .send({
                    prov_id: idProveedor,
                    numdoc: "102394",
                })
                .expect(200)
                .expect("Content-Type", /application\/json/);
            expect(result.body).toHaveProperty("message");
            expect(result.body.message).toBe("Se registro correctamente.");
            idFacturaHead = result.body.result._id;

            // verificar registro
            const getComfach = await request(appServer.app)
                .get(`/comfac/${idFacturaHead}`)
                .set("auth-token", authToken)
                .expect(200)
                .expect("Content-Type", /application\/json/);
            expect(getComfach.body).toHaveProperty("result");
            expect(getComfach.body.result).toHaveProperty("_id");
            expect(getComfach.body.result._id).toBe(idFacturaHead);

            // buscar productos
            const producto = await request(appServer.app)
                .get("/producto")
                .set("auth-token", authToken)
                .expect(200)
                .expect("Content-Type", /application\/json/);
            const idProductos = [
                producto.body.results[0].data,
                producto.body.results[1].data,
                producto.body.results[2].data,
            ];

            //crear lineas
            let idLineCompra = [];
            for (const idProd of idProductos) {
                const { _id: id, precio } = idProd;
                const resultLine = await request(appServer.app)
                    .post("/comproduc")
                    .set("auth-token", authToken)
                    .send({
                        comfach: idFacturaHead,
                        prod_id: id,
                        cantidad: 5,
                        precioUnitario: precio,
                        subtotal: 5 * precio,
                        impuesto: precio * 0.18,
                        total: 5 * precio + precio * 0.18,
                    })
                    .expect("Content-Type", /application\/json/);
                idLineCompra.push(resultLine.body.result._id);
            }

            //actualizar una linea
            const updateLine = await request(appServer.app)
                .put(`/comproduc/${idLineCompra[0]}`)
                .set("auth-token", authToken)
                .send({
                    prod_id: idProductos[2]._id,
                    cantidad: 7,
                    precioUnitario: idProductos[2].precio,
                    subtotal: 5 * idProductos[2].precio,
                    impuesto: idProductos[2].precio * 0.18,
                    total:
                        5 * idProductos[2].precio +
                        idProductos[2].precio * 0.18,
                })
                .expect(200)
                .expect("Content-Type", /application\/json/);
            expect(updateLine.body).toHaveProperty("result");
            expect(updateLine.body.result).toHaveProperty("_id");
            expect(updateLine.body.result._id).toBe(idLineCompra[0]);

            //eliminar una linea
            const deleteLine = await request(appServer.app)
                .delete(`/comproduc/${idLineCompra[0]}`)
                .set("auth-token", authToken)
                .send({
                    prod_id: idProductos[2]._id,
                    cantidad: 7,
                    precioUnitario: idProductos[2].precio,
                    subtotal: 5 * idProductos[2].precio,
                    impuesto: idProductos[2].precio * 0.18,
                    total:
                        5 * idProductos[2].precio +
                        idProductos[2].precio * 0.18,
                })
                .expect(200)
                .expect("Content-Type", /application\/json/);
            expect(deleteLine.body).toHaveProperty("result");
            expect(deleteLine.body.result).toHaveProperty("_id");
            expect(deleteLine.body.result._id).toBe(idLineCompra[0]);

            //actualizar un head
            const updHead = await request(appServer.app)
                .put(`/comfac/${idFacturaHead}`)
                .set("auth-token", authToken)
                .send({ numdoc: "001234" })
                .expect(200)
                .expect("Content-Type", /application\/json/);
            console.log(updHead.body);
            expect(updHead.body).toHaveProperty("message");
            expect(updHead.body.message).toBe("Se actualizo correctamente.");

            //validar head
            const validarHead = await request(appServer.app)
                .put(`/comfac/validar/${idFacturaHead}`)
                .set("auth-token", authToken)
                .expect(200)
                .expect("Content-Type", /application\/json/);
            expect(validarHead.body).toHaveProperty("message");
            expect(validarHead.body.message).toBe("Se valido correctamente");

            //FALLAR actualizar head
            const failUpdHead = await request(appServer.app)
                .put(`/comfac/${idFacturaHead}`)
                .set("auth-token", authToken)
                .send({ numdoc: "004321" })
                .expect(401)
                .expect("Content-Type", /application\/json/);
            expect(failUpdHead.body).toHaveProperty("error");
            expect(failUpdHead.body.error).toHaveProperty("message");
            expect(failUpdHead.body.error.message).toBe(
                "La factura no puede ser modificada."
            );
            //Fallar eliminar head
            const failDelHead = await request(appServer.app)
                .delete(`/comfac/${idFacturaHead}`)
                .set("auth-token", authToken)
                .expect(401)
                .expect("Content-Type", /application\/json/);
            expect(failDelHead.body).toHaveProperty("error");
            expect(failDelHead.body.error).toHaveProperty("message");
            expect(failDelHead.body.error.message).toBe(
                "La factura no puede ser modificada."
            );
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
        appServer.app.listen().close();
    });
});
