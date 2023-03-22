const { Router } = require("express");
const {
    actualizarProducto,
    crearProducto,
    deshabilitarProducto,
    eliminarProducto,
    obtenerProductos,
    obtenerUnProducto,
} = require("../controllers/producto");
const { validarToken, validarRoles } = require("../middlewares");

const productoRouter = Router();

productoRouter.get(
    "/",
    [validarToken, validarRoles("ADMIN_ROLE", "USER_ROLE", "CLIENT_ROLE")],
    obtenerProductos
);

productoRouter.get(
    "/:id",
    [validarToken, validarRoles("ADMIN_ROLE", "USER_ROLE", "CLIENT_ROLE")],
    obtenerUnProducto
);

productoRouter.post(
    "/",
    [validarToken, validarRoles("ADMIN_ROLE", "USER_ROLE")],
    crearProducto
);

productoRouter.put(
    "/:id",
    [validarToken, validarRoles("ADMIN_ROLE", "USER_ROLE")],
    actualizarProducto
);

productoRouter.put(
    "/deshabilitar/:id",
    [validarToken, validarRoles("ADMIN_ROLE", "USER_ROLE")],
    deshabilitarProducto
);

productoRouter.delete(
    "/:id",
    [validarToken, validarRoles("ADMIN_ROLE", "USER_ROLE")],
    actualizarProducto
);

module.exports = productoRouter;
