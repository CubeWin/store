const { Router } = require("express");
const {
    ListarComfacl,
    actualizarComfacl,
    crearComfacl,
    eliminarComfacl,
} = require("../controllers/comfacl");
const {
    validarToken,
    validarRoles,
} = require("../middlewares");

const comfaclRouter = Router();

comfaclRouter.get(
    "/",
    [validarToken, validarRoles("ADMIN_ROLE", "USER_ROLE")],
    ListarComfacl
);

comfaclRouter.post(
    "/",
    [validarToken, validarRoles("ADMIN_ROLE", "USER_ROLE")],
    crearComfacl
);

comfaclRouter.put(
    "/:id",
    [validarToken, validarRoles("ADMIN_ROLE", "USER_ROLE")],
    actualizarComfacl
);

comfaclRouter.delete(
    "/:id",
    [validarToken, validarRoles("ADMIN_ROLE", "USER_ROLE")],
    eliminarComfacl
);

module.exports = comfaclRouter ;
