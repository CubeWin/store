const { request, response } = require("express");
const { Impuesto } = require("../models");
const { httpException, validarDatos } = require("../common");

const crearImpuesto = async (req = request, res = response) => {
    try {
        const { categoria, procentaje, multiplicador, descripcion } = req.body;

        const impuesto = new Impuesto({
            categoria,
            procentaje,
            multiplicador,
            descripcion,
        });

        const result = await impuesto.save();
        if (!result) {
            throw new httpException(
                500,
                `no se pudo registro el impuesto en la BD.`
            );
        }

        const data = {
            message: "Se registro correctamente.",
            result,
            request: {
                type: "GET",
                url: `http://localhost:${process.env.PORT || 9090}/impuesto/${
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

const obtenerUnImpuesto = async (req = request, res = response) => {
    try {
        const { id } = req.params;

        const result = await Impuesto.findById(id);
        if (!result) {
            throw new httpException(
                400,
                "El impuesto no se encuentra en la BD."
            );
        }

        const data = {
            result,
            request: {
                type: "GET",
                url: `http://localhost:${process.env.PORT || 9090}/impuesto/${
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

const obtenerImpuestos = async (req = request, res = response) => {
    try {
        const result = await Impuesto.find();
        const data = {
            count: result.length,
            results: result.map((r) => {
                return {
                    data: r,
                    request: {
                        type: "GET",
                        url: `http://localhost:${
                            process.env.PORT || 9090
                        }/impuesto/${r.id}`,
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

const actualizarImpuesto = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { categoria, procentaje, multiplicador, descripcion } = req.body;

        const result = await Impuesto.findOneAndUpdate(
            { _id: id },
            {
                categoria,
                procentaje,
                multiplicador,
                descripcion,
            }
        );
        if (!result) {
            throw new httpException(
                400,
                "La impuesto no se encuentra en la BD."
            );
        }

        const data = {
            message: "Se actualizo correctamente.",
            result,
            request: {
                type: "GET",
                url: `http://localhost:${process.env.PORT || 9090}/impuesto/${
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

const eliminarImpuesto = async (req = request, res = response) => {
    try {
        const { id } = req.params;

        const result = await Impuesto.findByIdAndDelete({ _id: id });
        if (!result) {
            throw new httpException(400, `No se encontro el impuesto.`);
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
    crearImpuesto,
    obtenerUnImpuesto,
    obtenerImpuestos,
    actualizarImpuesto,
    eliminarImpuesto,
};
