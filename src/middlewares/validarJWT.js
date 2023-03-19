const { request, response } = require("express");
const { Usuario } = require("../models");
const jwt = require("jsonwebtoken");

const validarToken = async (req = request, res = response, next) => {
    try {
        const token = req.header("auth-token");
        const { uid } = await jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        const usuario = await Usuario.findById(uid);
        if (!usuario) {
            return res.status(401).json({
                message:
                    "El usuario no existe en la BD, validar token fallido.",
            });
        }

        if (!usuario.state) {
            return res.status(401).json({
                message: "El usuario se encuentra deshabilitado",
            });
        }

        req.usuario = usuario;

        next();
    } catch (error) {
        res.status(401).json({
            message: "Token no valido",
        });
    }
};

module.exports = { validarToken };
