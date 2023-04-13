const { Router } = require("express");
const {
    ListarVenfacl,
    crearVenfacl,
    actualizarVenfacl,
    eliminarVenfacl,
} = require("../controllers/venfacl");
const { validarToken, validarRoles } = require("../middlewares");

const venfaclRouter = Router();

venfaclRouter.get(
    "/",
    [validarToken, validarRoles("ADMIN_ROLE", "USER_ROLE")],
    ListarVenfacl
);

venfaclRouter.post(
    "/",
    [validarToken, validarRoles("ADMIN_ROLE", "USER_ROLE")],
    crearVenfacl
);

venfaclRouter.put(
    "/:id",
    [validarToken, validarRoles("ADMIN_ROLE", "USER_ROLE")],
    actualizarVenfacl
);

venfaclRouter.delete(
    "/:id",
    [validarToken, validarRoles("ADMIN_ROLE", "USER_ROLE")],
    eliminarVenfacl
);

module.exports = venfaclRouter;
