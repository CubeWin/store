const { request, response } = require("express");
const { Venfach, Cliente, Producto, Venfacl } = require("../models");
const { httpException, validarDatos } = require("../common");
const venfach = require("../models/venfach");

const crearVenfach = async (req = request, res = response) => {
    try {
        const { clie_id, numdoc, fecha } = req.body;

        const venfach = new Venfach({
            clie_id,
            numdoc,
            fecha,
        });

        const isCliente = await Cliente.findById(clie_id);
        if (!isCliente) {
            throw new httpException(
                400,
                "El cliente no se encuentra en la BD."
            );
        }

        const result = await venfach.save();
        if (!result) {
            throw new httpException(
                500,
                `no se pudo registrar la factura en la BD.`
            );
        }

        const data = {
            message: "Se registro correctamente.",
            result,
            request: {
                type: "GET",
                url: `http://localhost:${process.env.PORT || 9090}/venfach/${
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

const obtenerUnVenfach = async (req = request, res = response) => {
    try {
        const { id } = req.params;

        const result = await Venfach.findById(id);
        if (!result) {
            throw new httpException(
                400,
                "La factura no se encuentra en la BD."
            );
        }

        const productos = await Venfacl.find({ venfach: id });
        if (!productos) {
            throw new httpException(400, "Los productos no se cargaron.");
        }

        const data = {
            result,
            productos,
            request: {
                type: "GET",
                url: `http://localhost:${process.env.PORT || 9090}/venfach/${
                    result._id
                }`,
            },
        };
        res.status(200).json(data);
    } catch (error) {
        const { status, data } = validarDatos(error);
        res.status(status).json(data);
    }
};

const obtenerVenfachList = async (req = request, res = response) => {
    try {
        const { skip = 0, limit = 5 } = req.query;
        const result = await venfach
            .find()
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
                        }/venfach/${r.id}`,
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

const actualizarVenfach = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { clie_id, numdoc, fecha } = req.body;

        const getVenfach = await Venfach.findById(id);
        if (!getVenfach) {
            throw new httpException(
                400,
                "La factura no se encuentra en la BD."
            );
        }
        if (getVenfach.validar) {
            throw new httpException(401, `La factura no puede ser modificada.`);
        }

        if (clie_id && getVenfach.clie_id !== clie_id) {
            const esCliente = await Cliente.findById(clie_id);
            if (!esCliente) {
                throw new httpException(
                    400,
                    "El cliente no se encuentra en la BD."
                );
            }
        }

        const result = await Venfach.findOneAndUpdate(
            { _id: id },
            {
                clie_id,
                numdoc,
                fecha,
            }
        );
        if (!result) {
            throw new httpException(
                400,
                "La factura no se encuentra en la BD."
            );
        }

        const data = {
            message: "Se actualizo correctamente.",
            result,
            request: {
                type: "GET",
                url: `http://localhost:${process.env.PORT || 9090}/venfach/${
                    result._id
                }`,
            },
        };
        res.status(200).json(data);
    } catch (error) {
        const { status, data } = validarDatos(error);
        res.status(status).json(data);
    }
};

const eliminarVenfach = async (req = request, res = response) => {
    try {
        const { id } = req.params;

        const getVenfach = await Venfach.findById(id);
        if (!getVenfach) {
            throw new httpException(400, `No se encontro la factura.`);
        }
        if (getVenfach.validar) {
            throw new httpException(401, `La factura no puede ser modificada.`);
        }

        const getVenfacl = await Venfacl.find({ venfach: getVenfach._id });
        if (getVenfacl.length > 0) {
            throw new httpException(
                400,
                `Falta eliminar los productos de la factura.`
            );
        }

        const result = await Venfach.findByIdAndDelete(id);
        if (!result) {
            throw new httpException(400, `No se encontro la factura.`);
        }

        const data = {
            message: "Se elimino correctamente.",
            result,
        };
        res.status(200).json(data);
    } catch (error) {
        const { status, data } = validarDatos(error);
        res.status(status).json(data);
    }
};

const validarVenfach = async (req = request, res = response) => {
    // la validacion confirma la transaccion.
    try {
        let isOk = true;
        const { id } = req.params;

        const getVenfach = await Venfach.findById(id);
        if (!getVenfach) {
            throw new httpException(400, `No se encontro la factura.`);
        }

        const getVenfacl = await Venfacl.find({ venfach: getVenfach._id });
        if (!getVenfacl) {
            throw new httpException(400, `No hay productos en la factura.`);
        }

        getVenfacl.forEach(async (vfl) => {
            if (vfl.validar === true) {
                return;
            }

            const producto = await Producto.findById(vfl.prod_id);
            if (!producto) {
                await Venfacl.findByIdAndUpdate(vfl._id, {
                    err: `No se encontro el producto`,
                });
                isOk = false;
                return;
            }

            if (producto.stock - vfl.cantidad < 0) {
                await Venfacl.findByIdAndUpdate(vfl._id, {
                    err: `La cantidad supera al stock.`,
                    validar: false,
                });
                isOk = false;
                return;
            }

            // validar si hay algun error head error

            const calcStock = await Producto.findByIdAndUpdate(vfl.prod_id, {
                $inc: { stock: vfl.cantidad * -1 },
            });
            if (!calcStock) {
                await Venfacl.findByIdAndUpdate(vfl._id, {
                    err: `No se pudo registrar el stock`,
                });
                isOk = false;
                return;
            }

            await Venfacl.findByIdAndUpdate(vfl._id, {
                err: ``,
                validar: true,
            });
        });

        getVenfach.validar = true;
        getVenfach.err = ``;
        if (!isOk) {
            getVenfach.validar = isOk;
            getVenfach.err = `Fallo al validar los productos.`;
        }

        const result = await getVenfach.save();
        if (!result) {
            throw new httpException(500, `No se pudo verificar correctamente`);
        }
        const data = {
            message: isOk
                ? "Se valido correctamente"
                : "Error en la validación",
            result,
        };
        res.status(200).json(data);
    } catch (error) {
        const { status, data } = validarDatos(error);
        res.status(status).json(data);
    }
};

module.exports = {
    crearVenfach,
    obtenerUnVenfach,
    obtenerVenfachList,
    actualizarVenfach,
    eliminarVenfach,
    validarVenfach,
};
