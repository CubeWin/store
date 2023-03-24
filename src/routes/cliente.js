const { Router } = require("express");
const {
    crearCliente,
    ObtenerClientes,
    ObtenerUnCliente,
    actualizarCliente,
    deshabilitarCliente,
    eliminarCliente,
} = require("../controllers/cliente");
const {
    validarToken,
    validarRolAdmin,
    validarRoles,
} = require("../middlewares");

const clienteRoute = Router();

clienteRoute.get("/", ObtenerClientes);

clienteRoute.get("/:id", ObtenerUnCliente);

clienteRoute.post(
    "/",
    
    crearCliente
);

clienteRoute.put("/:id", [validarToken], actualizarCliente);

clienteRoute.put("/deshabilitar/:id", [validarToken], deshabilitarCliente);

clienteRoute.delete("/:id", [validarToken, validarRolAdmin], eliminarCliente);

module.exports = clienteRoute;
