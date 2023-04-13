require("dotenv").config();

const request = require("supertest");
const mongoose = require("mongoose");
const App = require("../server");
const { Venfacl, Venfach } = require("../models");
const {
    genUsuario,
    genProveedorData,
    genClientData,
    genFamiliaProductoData,
} = require("../helpers/query.data");

const appServer = new App();
let authToken = "";

beforeEach(async () => {
    await Venfacl.deleteMany();
    await Venfach.deleteMany();
    await genUsuario();
    await genProveedorData();
    await genClientData();
    await genFamiliaProductoData();

    const result = await request(appServer.app)
        .post("/")
        .send({ username: "manager", password: "manager" });
    authToken = result.body.token;
});

describe("API venta", () => {
    it("Realizar ciclo de venta", async () => {
        //Buscar un Cliente
        const cliente = await request(appServer.app)
            .get("/cliente")
            .set("auth-token", authToken)
            .expect(200)
            .expect("Content-Type", /application\/json/);
        const idCliente = cliente.body.results[0].data._id;
        //Registrar head
        const result = await request(appServer.app)
            .post("/venfac")
            .set("auth-token", authToken)
            .send({
                clie_id: idCliente,
                numdoc: "102394",
            })
            .expect(200)
            .expect("Content-Type", /application\/json/);
        expect(result.body).toHaveProperty("message");
        expect(result.body.message).toBe("Se registro correctamente.");
        idFacturaHead = result.body.result._id;

        //Verificar el registro
        const getVenfach = await request(appServer.app)
            .get(`/venfac/${idFacturaHead}`)
            .set("auth-token", authToken)
            .expect(200)
            .expect("Content-Type", /application\/json/);
        expect(getVenfach.body).toHaveProperty("result");
        expect(getVenfach.body.result).toHaveProperty("_id");
        expect(getVenfach.body.result._id).toBe(idFacturaHead);

        //buscar productos
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
        let idLineVenta = [];
        for (const idProd of idProductos) {
            const { _id: id, precio } = idProd;
            const resultLine = await request(appServer.app)
                .post("/venproduc")
                .set("auth-token", authToken)
                .send({
                    venfach: idFacturaHead,
                    prod_id: id,
                    cantidad: 5,
                    precioUnitario: precio,
                    subtotal: 5 * precio,
                    impuesto: precio * 0.18,
                    total: 5 * precio + precio * 0.18,
                })
                .expect("Content-Type", /application\/json/);
            idLineVenta.push(resultLine.body.result._id);
        }

        //actualizar una linea
        const updateLine = await request(appServer.app)
            .put(`/venproduc/${idLineVenta[0]}`)
            .set("auth-token", authToken)
            .send({
                prod_id: idProductos[2]._id,
                cantidad: 7,
                precioUnitario: idProductos[2].precio,
                subtotal: 5 * idProductos[2].precio,
                impuesto: idProductos[2].precio * 0.18,
                total: 5 * idProductos[2].precio + idProductos[2].precio * 0.18,
            })
            .expect(200)
            .expect("Content-Type", /application\/json/);
        expect(updateLine.body).toHaveProperty("result");
        expect(updateLine.body.result).toHaveProperty("_id");
        expect(updateLine.body.result._id).toBe(idLineVenta[0]);

        //eliminar una linea
        const deleteLine = await request(appServer.app)
            .delete(`/venproduc/${idLineVenta[0]}`)
            .set("auth-token", authToken)
            .send({
                prod_id: idProductos[2]._id,
                cantidad: 7,
                precioUnitario: idProductos[2].precio,
                subtotal: 5 * idProductos[2].precio,
                impuesto: idProductos[2].precio * 0.18,
                total: 5 * idProductos[2].precio + idProductos[2].precio * 0.18,
            })
            .expect(200)
            .expect("Content-Type", /application\/json/);
        expect(deleteLine.body).toHaveProperty("result");
        expect(deleteLine.body.result).toHaveProperty("_id");
        expect(deleteLine.body.result._id).toBe(idLineVenta[0]);

        //actualizar un head
        const updHead = await request(appServer.app)
            .put(`/venfac/${idFacturaHead}`)
            .set("auth-token", authToken)
            .send({ numdoc: "001234" })
            .expect(200)
            .expect("Content-Type", /application\/json/);
        expect(updHead.body).toHaveProperty("message");
        expect(updHead.body.message).toBe("Se actualizo correctamente.");

        //validara head
        const validarHead = await request(appServer.app)
            .put(`/venfac/validar/${idFacturaHead}`)
            .set("auth-token", authToken)
            .expect(200)
            .expect("Content-Type", /application\/json/);
        expect(validarHead.body).toHaveProperty("message");
        expect(validarHead.body.message).toBe("Se valido correctamente");

        //fallar actualizar head por estar validado
        const failUpdHead = await request(appServer.app)
            .put(`/venfac/${idFacturaHead}`)
            .set("auth-token", authToken)
            .send({ numdoc: "004321" })
            .expect(401)
            .expect("Content-Type", /application\/json/);
        expect(failUpdHead.body).toHaveProperty("error");
        expect(failUpdHead.body.error).toHaveProperty("message");
        expect(failUpdHead.body.error.message).toBe(
            "La factura no puede ser modificada."
        );

        //fallar al eliminar head por estar validado
        const failDelHead = await request(appServer.app)
            .delete(`/venfac/${idFacturaHead}`)
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
