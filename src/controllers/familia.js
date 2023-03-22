const { request, response } = require("express");
const { Familia } = require("../models");
const { httpException, validarDatos } = require("../common");

const crearFamilia = async (req = request, res = response) => {
    try {
        const { codigo, categoria, descripcion } = req.body;

        const familia = new Familia({
            codigo,
            categoria,
            descripcion,
        });

        const result = await familia.save();
        if (!result) {
            throw new httpException(
                500,
                `No se pudo registro la familia en la BD.`
            );
        }

        const data = {
            message: "Se registro correctamente.",
            result,
            request: {
                type: "GET",
                url: `http://localhost:${process.env.PORT || 9090}/familia/${
                    result.id
                }`,
            },
        };

        res.status(200).json(data);
    } catch (error) {
        const { status, data } = validarDatos(error);
        res.status(status).json({ data });
    }
};

const obtenerUnaFamilia = async (req = request, res = response) => {
    try {
        const { id } = req.params;

        const result = await Familia.findById(id);
        if (!result) {
            throw new httpException(
                400,
                "La familia no se encuentra en la BD."
            );
        }

        const data = {
            result,
            request: {
                type: "GET",
                url: `http://localhost:${process.env.PORT || 9090}/familia/${
                    result._id
                }`,
            },
        };
        res.status(200).json(data);
    } catch (error) {
        const { status, data } = validarDatos(error);
        res.status(status).json({ data });
    }
};

const obtenerFamilias = async (req = request, res = response) => {
    try {
        const { skip = 0, limit = 5 } = req.query;
        const result = await Familia.find()
        .skip(skip)
        .limit(limit)
        .sort({ field: "desc" });;
        const data = {
            count: result.length,
            results: result.map((r) => {
                return {
                    data: r,
                    request: {
                        type: "GET",
                        url: `http://localhost:${
                            process.env.PORT || 9090
                        }/familia/${r.id}`,
                    },
                };
            }),
        };
        res.status(200).json(data);
    } catch (error) {
        const { status, data } = validarDatos(error);
        res.status(status).json({ data });
    }
};

const actualizarFamilia = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { codigo, categoria, descripcion } = req.body;

        const result = await Familia.findOneAndUpdate(
            { _id: id },
            {
                codigo,
                categoria,
                descripcion,
            }
        );
        if (!result) {
            throw new httpException(
                400,
                "La familia no se encuentra en la BD."
            );
        }

        const data = {
            message: "Se actualizo correctamente.",
            result,
            request: {
                type: "GET",
                url: `http://localhost:${process.env.PORT || 9090}/familia/${
                    result._id
                }`,
            },
        };
        res.status(200).json(data);
    } catch (error) {
        const { status, data } = validarDatos(error);
        res.status(status).json({ data });
    }
};

const deshabilitarFamilia = async (req = request, res = response) => {
    try {
        const { id } = req.params;

        const result = await Familia.findOneAndUpdate(
            { _id: id },
            {
                $set: {
                    estado: false,
                },
            }
        );
        if (!result) {
            throw new httpException(
                400,
                "La familia no se encuentra en la BD."
            );
        }

        const data = {
            message: "Se deshabilito la familia correctamente.",
            result,
            request: {
                type: "GET",
                url: `http://localhost:${process.env.PORT || 9090}/familia/${
                    result.id
                }`,
            },
        };
        res.status(200).json({ data });
    } catch (error) {
        const { status, data } = validarDatos(error);
        res.status(status).json({ data });
    }
};

const eliminarFamilia = async (req = request, res = response) => {
    try {
        const { id } = req.params;

        const result = await Familia.findByIdAndDelete({ _id: id });
        if (!result) {
            throw new httpException(400, `No se encontro la familia.`);
        }

        const data = {
            message: "Se elimino correctamente.",
            result,
        };
        res.status(200).json({ data });
    } catch (error) {
        const { status, data } = validarDatos(error);
        res.status(status).json({ data });
    }
};

module.exports = {
    crearFamilia,
    obtenerFamilias,
    obtenerUnaFamilia,
    actualizarFamilia,
    deshabilitarFamilia,
    eliminarFamilia,
};
