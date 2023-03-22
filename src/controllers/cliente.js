const { request, response } = require("express");
const { Cliente } = require("../models");
const { validarDatos, httpException } = require("../common");

const crearCliente = async (req = request, res = response) => {
    try {
        const { dni, nombre, apaterno, amaterno, correo, telefono } = req.body;

        const cliente = new Cliente({
            dni,
            nombre,
            apaterno,
            amaterno,
            correo,
            telefono,
        });

        const result = await cliente.save();
        if (!result) {
            throw new httpException(
                500,
                `no se pudo registro el cliente en la BD.`
            );
        }

        const data = {
            message: "Se registro correctamente.",
            result,
            request: {
                type: "GET",
                url: `http://localhost:${process.env.PORT || 9090}/cliente/${
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

const ObtenerUnCliente = async (req = request, res = response) => {
    try {
        const { id } = req.params;

        const result = await Cliente.findById(id);
        if (!result) {
            throw new httpException(
                400,
                "El cliente no se encuentra en la BD."
            );
        }

        const data = {
            result,
            request: {
                type: "GET",
                url: `http://localhost:${process.env.PORT || 9090}/cliente/${
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

const ObtenerClientes = async (req = request, res = response) => {
    try {
        const { skip = 0, limit = 5 } = req.query;
        const result = await Cliente.find()
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
                        }/cliente/${r.id}`,
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

const actualizarCliente = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { dni, nombre, apaterno, amaterno, correo, telefono } = req.body;

        // const esCliente = await Cliente.findById(id);
        // if (!esCliente) {
        //     throw new httpException(400, "El cliente no se encuentra en la BD.")
        // }

        const result = await Cliente.findOneAndUpdate(
            { _id: id },
            {
                dni,
                nombre,
                apaterno,
                amaterno,
                correo,
                telefono,
            }
        );
        if (!result) {
            throw new httpException(
                400,
                "El cliente no se encuentra en la BD."
            );
        }

        const data = {
            message: "Se actualizo el cliente correctamente.",
            result,
            request: {
                type: "GET",
                url: `http://localhost:${process.env.PORT || 9090}/cliente/${
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

const deshabilitarCliente = async (req = request, res = response) => {
    try {
        const { id } = req.params;

        const result = await Cliente.findOneAndUpdate(
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
                "El cliente no se encuentra en la BD."
            );
        }

        const data = {
            message: "Se deshabilito el cliente correctamente.",
            result,
            request: {
                type: "GET",
                url: `http://localhost:${process.env.PORT || 9090}/cliente/${
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

const eliminarCliente = async (req = request, res = response) => {
    try {
        const { id } = req.params;

        const result = await Cliente.findByIdAndDelete({ _id: id });
        if (!result) {
            throw new httpException(400, `No se encontro el cliente.`);
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
    crearCliente,
    actualizarCliente,
    ObtenerUnCliente,
    ObtenerClientes,
    deshabilitarCliente,
    eliminarCliente,
};
