require("dotenv").config();

const request = require("supertest");
const mongoose = require("mongoose");
const App = require("../server");
const { Cliente } = require("../models");

const appServer = new App();

const CLIENT = [
    { dni: "99229901", nombre: "Angeles", apaterno: "PORTUGAL", amaterno: "ALTAMIRANO", telefono: "955102047", correo: "Ang_POR_ALT@mail.com", },
    { dni: "99229902", nombre: "Yamile", apaterno: "VILELA", amaterno: "BECERRA", telefono: "955102047", correo: "Yam_VIL_BEC@mail.com", },
    { dni: "99229903", nombre: "Ronald", apaterno: "CRISPIN", amaterno: "BENITO", telefono: "955102047", correo: "Ron_CRI_BEN@mail.com", },
    { dni: "99229904", nombre: "Fernando", apaterno: "CAVERO", amaterno: "BERNAL", telefono: "955102047", correo: "Fer_CAV_BER@mail.com", },
    { dni: "99229905", nombre: "Andrea", apaterno: "APOLAYA", amaterno: "BURGOS", telefono: "955102047", correo: "And_APO_BUR@mail.com", },
    { dni: "99229923", nombre: "Isabel", apaterno: "MALDONADO", amaterno: "NAVARRO", telefono: "955102047", correo: "Isa_MAL_NAV@mail.com", },
];

beforeEach(async () => {
    await Cliente.deleteMany();
    await Cliente.create(CLIENT);
});

describe("GET API CLientes", () => {
    it("Retorna 5 productos cuando no se le especifica un query de skip y limit (>5)", async () => {
        const response = await request(appServer.app).get("/cliente");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("results");
        expect(response.body.results).toHaveLength(5);
    });
});

describe('POST API Cliente', ()=>{
    it('Registrar cliente correctamente', async()=>{
        const newClient ={dni: "19229923", nombre: "Reimond", apaterno: "HUAMAN", amaterno: "NAVARRO", telefono: "955102047", correo: "Redu_NAV@mail.com",}

        const response = await request(appServer.app)
            .post("/cliente")
            .send(newClient)
            .expect(200)
            .expect("Content-Type", /application\/json/);
        expect(response.body).toHaveProperty("message");
        expect(response.body.message).toBe('Se registro correctamente.')

        const clienID = response.body.result._id;
        const res = await request(appServer.app).get(`/cliente/${clienID}`).expect(200).expect("Content-Type", /application\/json/);

        expect(res.body).toHaveProperty("result");
        expect(res.body.result.dni).toBe(19229923)
    })
})

afterAll(() => {
    mongoose.connection.close();
    appServer.app.listen().close();
});
