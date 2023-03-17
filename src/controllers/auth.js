const { request, response } = require("express");
const { Usuario } = require("../models");

const {
    httpException,
    genJWT,
    validarDatos,
    matchPassword,
} = require("../common");

const logIn = async (req = request, res = response) => {
    try {
        const { username, password } = req.body;

        const result = await Usuario.findOne({ username, state: true });
        if (!result) {
            throw new httpException(
                400,
                `El usuario ${username} no se encuentra en la BD.`
            );
        }

        const isMatchPwd = await matchPassword(password, result.password);
        if (isMatchPwd) {
            throw new httpException(400, "La clave no coincide.");
        }

        const token = await genJWT(result._id);
        res.status(200).json({ result, token });
    } catch (error) {
        const { status, data } = validarDatos(error);
        res.status(status).json({ data });
    }
    return;
};

module.exports = { logIn };
