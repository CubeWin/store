const { Router } = require("express");
const {
    actualizarVenfach,
    crearVenfach,
    eliminarVenfach,
    obtenerUnVenfach,
    obtenerVenfachList,
    validarVenfach,
} = require("../controllers/venfach");
const {
    validarToken,
    validarRoles,
} = require("../middlewares");

const venfachRouter = Router();

venfachRouter.get(
    "/",
    [validarToken, validarRoles("ADMIN_ROLE", "USER_ROLE")],
    obtenerVenfachList
);

venfachRouter.get(
    "/:id",
    [validarToken, validarRoles("ADMIN_ROLE", "USER_ROLE")],
    obtenerUnVenfach
);

venfachRouter.post(
    "/",
    [validarToken, validarRoles("ADMIN_ROLE", "USER_ROLE")],
    crearVenfach
);

venfachRouter.put(
    "/:id",
    [validarToken, validarRoles("ADMIN_ROLE", "USER_ROLE")],
    actualizarVenfach
);

venfachRouter.put(
    "/validar/:id",
    [validarToken, validarRoles("ADMIN_ROLE", "USER_ROLE")],
    validarVenfach
);

venfachRouter.delete(
    "/:id",
    [validarToken, validarRoles("ADMIN_ROLE", "USER_ROLE")],
    eliminarVenfach
);

module.exports = venfachRouter;
