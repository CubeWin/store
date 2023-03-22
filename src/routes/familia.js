const { Router } = require("express");
const {
    crearFamilia,
    obtenerFamilias,
    obtenerUnaFamilia,
    actualizarFamilia,
    deshabilitarFamilia,
    eliminarFamilia,
} = require("../controllers/familia");
const {
    validarToken,
    validarRoles,
} = require("../middlewares");

const familiaRouter = Router();

familiaRouter.get(
    "/",
    [validarToken, validarRoles("ADMIN_ROLE", "USER_ROLE", "CLIENT_ROLE")],
    obtenerFamilias
);

familiaRouter.get(
    "/:id",
    [validarToken, validarRoles("ADMIN_ROLE", "USER_ROLE", "CLIENT_ROLE")],
    obtenerUnaFamilia
);

familiaRouter.post(
    "/",
    [validarToken, validarRoles("ADMIN_ROLE", "USER_ROLE")],
    crearFamilia
);

familiaRouter.put(
    "/:id",
    [validarToken, validarRoles("ADMIN_ROLE", "USER_ROLE")],
    actualizarFamilia
);

familiaRouter.put(
    "/deshabilitar/:id",
    [validarToken, validarRoles("ADMIN_ROLE", "USER_ROLE")],
    deshabilitarFamilia
);

familiaRouter.delete(
    "/:id",
    [validarToken, validarRoles("ADMIN_ROLE", "USER_ROLE")],
    eliminarFamilia
);

module.exports = familiaRouter ;
