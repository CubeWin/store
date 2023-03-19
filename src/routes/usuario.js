const { Router } = require("express");
const {
    cambiarPWD,
    crearUsuario,
    deshabilitarUsuario,
    eliminarUsuario,
    obtenerUnUsuario,
    obtenerUsuarios,
} = require("../controllers/usuario");
const {
    validarToken,
    validarRolAdmin,
    validarRoles,
} = require("../middlewares");

const usuarioRoute = Router();

usuarioRoute.get("/", [validarToken, validarRolAdmin], obtenerUsuarios);

usuarioRoute.get(
    "/:id",
    [validarToken, validarRoles("ADMIN_ROLE", "USER_ROLE")],
    obtenerUnUsuario
);

usuarioRoute.post("/", [validarToken, validarRolAdmin], crearUsuario);

usuarioRoute.put(
    "/:id",
    [validarToken, validarRoles("ADMIN_ROLE", "USER_ROLE", "CLIENT_ROLE")],
    cambiarPWD
);

usuarioRoute.put(
    "/disable/:id",
    [validarToken, validarRolAdmin],
    deshabilitarUsuario
);

usuarioRoute.delete(
    "/delete/:id",
    [validarToken, validarRolAdmin],
    eliminarUsuario
);

module.exports = usuarioRoute;
