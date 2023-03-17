const { Router } = require("express");
const {
    cambiarPWD,
    crearUsuario,
    deshabilitarUsuario,
    eliminarUsuario,
    obtenerUnUsuario,
    obtenerUsuarios,
} = require("../controllers/usuario");

const usuarioRoute = Router();

usuarioRoute.get("/", obtenerUsuarios);
usuarioRoute.get("/:id", obtenerUnUsuario);
usuarioRoute.post("/", crearUsuario);
usuarioRoute.put("/:id", cambiarPWD);
usuarioRoute.put("/disable/:id", deshabilitarUsuario);
usuarioRoute.delete("/delete/:id", eliminarUsuario);

module.exports = usuarioRoute;
