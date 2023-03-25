require("dotenv").config();

const request = require("supertest");
const mongoose = require("mongoose");
const App = require("../server");
const { Cliente, Usuario } = require("../models");
const { LOGIN, CLIENTES, CLIENTE } = require("./helper");

const appServer = new App();

let token = "";
let id;

beforeEach(async () => {
    await Usuario.deleteMany();
    await Usuario.create(LOGIN);
    await Cliente.deleteMany();
    const cliente = await Cliente.create(CLIENTES);
    id = cliente[0]._id;
    const result = await request(appServer.app).post("/").send(LOGIN);
    token = result.body.token;
});

describe("GET API CLientes", () => {
    it("Retorna 5 productos cuando no se le especifica un query de skip y limit (>5)", async () => {
        const response = await request(appServer.app)
            .get("/cliente")
            .set("auth-token", token);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("results");
        expect(response.body.results).toHaveLength(5);
    });

    it("Buscar en la api un cliente", async () => {
        const response = await request(appServer.app)
            .get(`/cliente/${id}`)
            .set("auth-token", token)
            .expect(200)
            .expect("Content-Type", /application\/json/);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("result");
        const compareCliente = {
            type: "GET",
            url: `http://localhost:${process.env.PORT || 9090}/cliente/${id}`,
        };
        expect(response.body.request).toStrictEqual(compareCliente);
    });

    it("Buscar en la api un cliente que no existe", async () => {
        const response = await request(appServer.app)
            .get(`/cliente/641e6b51a3d9b7195176fd84`)
            .set("auth-token", token)
            .expect(400)
            .expect("Content-Type", /application\/json/);
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.error.message).toBe("El cliente no se encuentra en la BD.");
    });
});

describe("POST API Cliente", () => {
    it("Registrar cliente correctamente", async () => {
        const response = await request(appServer.app)
            .post("/cliente")
            .set("auth-token", token)
            .send(CLIENTE)
            .expect(200)
            .expect("Content-Type", /application\/json/);
        expect(response.body).toHaveProperty("message");
        expect(response.body.message).toBe("Se registro correctamente.");

        const clienID = response.body.result._id;
        const res = await request(appServer.app)
            .get(`/cliente/${clienID}`)
            .set("auth-token", token)
            .expect(200)
            .expect("Content-Type", /application\/json/);

        expect(res.body).toHaveProperty("result");
        expect(res.body.result.dni).toBe(19229923);
    });

    it("Fallo al registrar dni y correo", async () => {
        const clienteObj = {
            nombre: "Reimond",
            apaterno: "HUAMAN",
            amaterno: "NAVARRO",
            telefono: "955102047",
        };
        const response = await request(appServer.app)
            .post("/cliente")
            .set("auth-token", token)
            .send(clienteObj)
            .expect(401)
            .expect("Content-Type", /application\/json/);
        expect(response.body).toHaveProperty("errors");
        expect(response.body.errors.length).toBe(2);
        expect(response.body.errors[0].input).toBe('dni')
        expect(response.body.errors[1].input).toBe('correo')
    });

    it("Fallo al registrar todos los datos requeridos", async () => {
        const clienteObj = {};
        const response = await request(appServer.app)
            .post("/cliente")
            .set("auth-token", token)
            .send(clienteObj)
            .expect(401)
            .expect("Content-Type", /application\/json/);
        expect(response.body).toHaveProperty("errors");
        expect(response.body.errors.length).toBe(5);
        expect(response.body.errors[0].input).toBe('dni')
        expect(response.body.errors[1].input).toBe('nombre')
        expect(response.body.errors[2].input).toBe('apaterno')
        expect(response.body.errors[3].input).toBe('amaterno')
        expect(response.body.errors[4].input).toBe('correo')
    });
});

describe("PUT API Cliente", () => {
    it("Actualizar nombre de Cliente", async () => {
        const cliente = await request(appServer.app)
            .put(`/cliente/${id}`)
            .set("auth-token", token)
            .send({ nombre: "Rogelio" })
            .expect(200)
            .expect("Content-Type", /application\/json/);
        expect(cliente.body).toHaveProperty("message");
        expect(cliente.body.message).toBe(
            "Se actualizo el cliente correctamente."
        );

        const result = await request(appServer.app)
            .get(`/cliente/${id}`)
            .set("auth-token", token)
            .expect(200);
        expect(result.body).toHaveProperty("result");
        expect(result.body.result.nombre).toBe("Rogelio");
    });

    it("Actualizar un cliente que no existe", async () => {
        const response = await request(appServer.app)
            .put(`/cliente/641e6b51a3d9b7195176fd84`)
            .set("auth-token", token)
            .send({ nombre: "Rogelio" })
            .expect(400)
            .expect("Content-Type", /application\/json/);
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.error.message).toBe("El cliente no se encuentra en la BD.");
    });

    it("Deshabilitar un Cliente", async () => {
        const cliente = await request(appServer.app)
            .put(`/cliente/deshabilitar/${id}`)
            .set("auth-token", token)
            .expect(200)
            .expect("Content-Type", /application\/json/);
        expect(cliente.body).toHaveProperty("message");
        expect(cliente.body.message).toBe(
            "Se deshabilito el cliente correctamente."
        );

        const result = await request(appServer.app)
            .get(`/cliente/${id}`)
            .set("auth-token", token)
            .expect(200)
            .expect("Content-Type", /application\/json/);
        expect(result.body).toHaveProperty("result");
        expect(result.body.result).toHaveProperty("estado");
        expect(result.body.result.estado).toBe(false);
    });
    
    it("Deshabilitar un cliente que no existe", async () => {
        const response = await request(appServer.app)
            .put(`/cliente/deshabilitar/641e6b51a3d9b7195176fd84`)
            .set("auth-token", token)
            .expect(400)
            .expect("Content-Type", /application\/json/);
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.error.message).toBe("El cliente no se encuentra en la BD.");
    });
});

describe("DELETE API Cliente", () => {
    it("Eliminar cliente", async () => {
        const cliente = await request(appServer.app)
            .delete(`/cliente/${id}`)
            .set("auth-token", token)
            .expect(200)
            .expect("Content-Type", /application\/json/);
        expect(cliente.body).toHaveProperty("message");
        expect(cliente.body.message).toBe("Se elimino correctamente.");
    });

    it("Eliminar un cliente que no existe", async () => {
        const response = await request(appServer.app)
            .delete(`/cliente/641e6b51a3d9b7195176fd84`)
            .set("auth-token", token)
            .expect(400)
            .expect("Content-Type", /application\/json/);
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.error.message).toBe("No se encontro el cliente.");
    });
});

afterAll(() => {
    mongoose.connection.close();
    appServer.app.listen().close();
});
