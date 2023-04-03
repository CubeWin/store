const { Router } = require("express");
const {
    actualizarProveedor,
    crearProveedor,
    deshabilitarProveedor,
    eliminarProveedor,
    obtenerProveedores,
    obtenerUnProveedor,
} = require("../controllers/proveedor");
const { validarToken, validarRoles } = require("../middlewares");

const proveedorRouter = Router();

proveedorRouter.get(
    "/",
    [validarToken, validarRoles("ADMIN_ROLE", "USER_ROLE")],
    obtenerProveedores
);

proveedorRouter.get(
    "/:id",
    [validarToken, validarRoles("ADMIN_ROLE", "USER_ROLE")],
    obtenerUnProveedor
);

proveedorRouter.post(
    "/",
    [validarToken, validarRoles("ADMIN_ROLE", "USER_ROLE")],
    crearProveedor
);

proveedorRouter.put(
    "/:id",
    [validarToken, validarRoles("ADMIN_ROLE", "USER_ROLE")],
    actualizarProveedor
);

proveedorRouter.put(
    "/deshabilitar/:id",
    [validarToken, validarRoles("ADMIN_ROLE", "USER_ROLE")],
    deshabilitarProveedor
);

proveedorRouter.delete(
    "/:id",
    [validarToken, validarRoles("ADMIN_ROLE", "USER_ROLE")],
    eliminarProveedor
);

module.exports = proveedorRouter ;
