const { Router } = require("express");
const {
    crearCliente,
    ObtenerClientes,
    ObtenerUnCliente,
    actualizarCliente,
    deshabilitarCliente,
    eliminarCliente,
} = require("../controllers/cliente");

const clienteRoute = Router();

clienteRoute.get("/", ObtenerClientes);

clienteRoute.get("/:id", ObtenerUnCliente);

clienteRoute.post("/", crearCliente);

clienteRoute.put("/:id", actualizarCliente);

clienteRoute.put("/deshabilitar/:id", deshabilitarCliente);

clienteRoute.delete("/:id", eliminarCliente);

module.exports = clienteRoute;
