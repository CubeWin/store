const { request, response } = require("express");
const {
    encryptPassword,
    httpException,
    validarDatos,
    matchPassword,
} = require("../common");
const { Usuario } = require("../models");
const usuario = require("../models/usuario");
// const Usuario = require('../models/usuario')

const crearUsuario = async (req = request, res = response) => {
    try {
        const { username, password, name, email } = req.body;
        const { isEncrypt, pwdHash } = await encryptPassword(password);

        if (!isEncrypt) {
            throw new httpException(
                400,
                "la clave debe terner 4 digitos como minimo."
            );
        }

        const usuario = new Usuario({
            username,
            password: pwdHash,
            name,
            email,
        });

        const result = await usuario.save();

        if (!result) {
            throw new httpException(
                500,
                `no se pudo registro el usuario en la BD.`
            );
        }

        const data = {
            message: "Se registro correctamente.",
            result,
            request: {
                type: "GET",
                url: `http://localhost:${process.env.PORT || 9090}/usuario/${
                    result.id
                }`,
            },
        };

        res.status(200).json(data);
    } catch (error) {
        const { status, data } = validarDatos(error);
        res.status(status).json(data);
    }
};

const obtenerUnUsuario = async (req = request, res = response) => {
    try {
        const { id } = req.params;

        const result = await Usuario.findOne({ _id: id });

        if (!result) {
            throw new httpException(400, `no se encontro el usuario en la BD.`);
        }

        const data = {
            result,
            request: {
                type: "GET",
                url: `http://localhost:${process.env.PORT || 9090}/usuario/${
                    result.id
                }`,
            },
        };

        res.status(200).json(data);
    } catch (error) {
        const { status, data } = validarDatos(error);
        res.status(status).json(data);
    }
};

const obtenerUsuarios = async (req = request, res = response) => {
    try {
        const { skip = 0, limit = 5 } = req.query;
        const result = await Usuario.find({ role: "USER_ROLE" })
            .skip(skip)
            .limit(limit)
            .sort({ field: "desc" });
        const data = {
            count: result.length,
            results: result.map((r) => {
                return {
                    data: r,
                    request: {
                        type: "GET",
                        url: `http://localhost:${
                            process.env.PORT || 9090
                        }/usuario/${r.id}`,
                    },
                };
            }),
        };
        res.status(200).json(data);
    } catch (error) {
        const { status, data } = validarDatos(error);
        res.status(status).json(data);
    }
};

const cambiarPWD = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { password, npassword } = req.body;
        const isUser = await usuario.findById(id);
        if (!isUser) {
            throw new httpException(
                400,
                `El id ${id} no se encuentra en la BD`
            );
        }

        const isMatchPWD = await matchPassword(password, isUser.password);
        if (!isMatchPWD) {
            throw new httpException(400, "la clave no coincide.");
        }

        const { isEncrypt, pwdHash } = await encryptPassword(npassword);
        if (!isEncrypt) {
            throw new httpException(
                400,
                "la clave debe tener 4 digitos como minimo"
            );
        }

        const result = await Usuario.findOneAndUpdate(
            { _id: isUser._id },
            { $set: { password: pwdHash } }
        );
        if (!result) {
            throw new httpException(500, "No se puedo actualizar la clave.");
        }

        const data = {
            message: "Se cambio la clave correctamente.",
            result,
            request: {
                type: "GET",
                url: `http://localhost:${process.env.PORT || 9090}/usuario/${
                    result.id
                }`,
            },
        };
        res.status(200).json(data);
    } catch (error) {
        const { status, data } = validarDatos(error);
        res.status(status).json(data);
    }
};

const deshabilitarUsuario = async (req = request, res = response) => {
    try {
        const { id } = req.params;

        const result = await Usuario.findOneAndUpdate(
            { _id: id },
            { $set: { state: false } }
        );
        if (!result) {
            throw new httpException(400, `No se encontro el usuario.`);
        }

        const data = {
            message: "Se deshabilito correctamente.",
            result,
            request: {
                type: "GET",
                url: `http://localhost:${process.env.PORT || 9090}/usuario/${
                    result.id
                }`,
            },
        };

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
};

const eliminarUsuario = async (req = request, res = response) => {
    try {
        const { id } = req.params;

        const result = await Usuario.findByIdAndDelete({ _id: id });

        if (!result) {
            throw new httpException(400, `No se encontro el usuario.`);
        }

        const data = {
            message: "Se elimino correctamente.",
            result,
        };

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
};

module.exports = {
    crearUsuario,
    obtenerUnUsuario,
    obtenerUsuarios,
    deshabilitarUsuario,
    eliminarUsuario,
    cambiarPWD,
};
