const { request, response } = require("express");
const { Proveedor } = require("../models");
const { httpException, validarDatos } = require("../common");

const crearProveedor = async (req = request, res = response) => {
    try {
        const { ruc, nombre, rubro, correo, telefono } = req.body;

        const proveedor = new Proveedor({
            ruc,
            nombre,
            rubro,
            correo,
            telefono,
        });

        const result = await proveedor.save();
        if (!result) {
            throw new httpException(
                500,
                `no se pudo registro el proveedor en la BD.`
            );
        }

        const data = {
            message: "Se registro correctamente.",
            result,
            request: {
                type: "GET",
                url: `http://localhost:${process.env.PORT || 9090}/proveedor/${
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

const obtenerUnProveedor = async (req = request, res = response) => {
    try {
        const { id } = req.params;

        const result = await Proveedor.findById(id);
        if (!result) {
            throw new httpException(
                400,
                "El proveedor no se encuentra en la BD."
            );
        }

        const data = {
            result,
            request: {
                type: "GET",
                url: `http://localhost:${process.env.PORT || 9090}/proveedor/${
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

const obtenerProveedores = async (req = request, res = response) => {
    try {
        const result = await Proveedor.find();
        const data = {
            count: result.length,
            results: result.map((r) => {
                return {
                    data: r,
                    request: {
                        type: "GET",
                        url: `http://localhost:${
                            process.env.PORT || 9090
                        }/proveedor/${r.id}`,
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

const actualizarProveedor = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { ruc, nombre, rubro, correo, telefono } = req.body;

        const result = await Proveedor.findOneAndUpdate(
            { _id: id },
            {
                ruc,
                nombre,
                rubro,
                correo,
                telefono,
            }
        );
        if (!result) {
            throw new httpException(
                400,
                "El proveedor no se encuentra en la BD."
            );
        }

        const data = {
            message: "Se actualizo correctamente.",
            result,
            request: {
                type: "GET",
                url: `http://localhost:${process.env.PORT || 9090}/proveedor/${
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

const deshabilitarProveedor = async (req = request, res = response) => {
    try {
        const { id } = req.params;

        const result = await Proveedor.findOneAndUpdate(
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
                "El proveedor no se encuentra en la BD."
            );
        }

        const data = {
            message: "Se deshabilito el proveedor correctamente.",
            result,
            request: {
                type: "GET",
                url: `http://localhost:${process.env.PORT || 9090}/proveedor/${
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

const eliminarProveedor = async (req = request, res = response) => {
    try {
        const { id } = req.params;

        const result = await Proveedor.findByIdAndDelete({ _id: id });
        if (!result) {
            throw new httpException(400, `No se encontro el proveedor.`);
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
    crearProveedor,
    obtenerUnProveedor,
    obtenerProveedores,
    actualizarProveedor,
    deshabilitarProveedor,
    eliminarProveedor,
};
