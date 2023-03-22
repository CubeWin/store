const { Router } = require("express");
const {
    obtenerUnComfach,
    obtenerComfachList,
    actualizarComfach,
    crearComfach,
    eliminarComfach,
    validarComfach,
} = require("../controllers/comfach");
const {
    validarToken,
    validarRoles,
} = require("../middlewares");

const comfachRouter = Router();

comfachRouter.get(
    "/",
    [validarToken, validarRoles("ADMIN_ROLE", "USER_ROLE")],
    obtenerComfachList
);

comfachRouter.get(
    "/:id",
    [validarToken, validarRoles("ADMIN_ROLE", "USER_ROLE")],
    obtenerUnComfach
);

comfachRouter.post(
    "/",
    [validarToken, validarRoles("ADMIN_ROLE", "USER_ROLE")],
    crearComfach
);

comfachRouter.put(
    "/:id",
    [validarToken, validarRoles("ADMIN_ROLE", "USER_ROLE")],
    actualizarComfach
);

comfachRouter.put(
    "/validar/:id",
    [validarToken, validarRoles("ADMIN_ROLE", "USER_ROLE")],
    validarComfach
);

comfachRouter.delete(
    "/:id",
    [validarToken, validarRoles("ADMIN_ROLE", "USER_ROLE")],
    eliminarComfach
);



module.exports = comfachRouter;
