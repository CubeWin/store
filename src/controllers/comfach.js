const { request, response } = require("express");
const { Comfach, Proveedor, Comfacl, Producto } = require("../models");
const { httpException, validarDatos } = require("../common");

const crearComfach = async (req = request, res = response) => {
    try {
        const { prov_id, numdoc, fecha } = req.body;

        const comfach = new Comfach({
            prov_id,
            numdoc,
            fecha,
        });

        const isProveedor = await Proveedor.findById(prov_id);
        if (!isProveedor) {
            throw new httpException(
                400,
                "El proveedor no se encuentra en la BD."
            );
        }

        const result = await comfach.save();
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
                url: `http://localhost:${process.env.PORT || 9090}/comfach/${
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

const obtenerUnComfach = async (req = request, res = response) => {
    try {
        const { id } = req.params;

        const result = await Comfach.findById(id);
        if (!result) {
            throw new httpException(
                400,
                "La factura no se encuentra en la BD."
            );
        }

        const productos = await Comfacl.find({ comfach: id });
        if (!productos) {
            // verificar
            throw new httpException(400, "Los productos no se cargaron.");
        }

        const data = {
            result,
            productos,
            request: {
                type: "GET",
                url: `http://localhost:${process.env.PORT || 9090}/comfach/${
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

const obtenerComfachList = async (req = request, res = response) => {
    try {
        const result = await Comfach.find();
        const data = {
            count: result.length,
            results: result.map((r) => {
                return {
                    data: r,
                    request: {
                        type: "GET",
                        url: `http://localhost:${
                            process.env.PORT || 9090
                        }/comfach/${r.id}`,
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

const actualizarComfach = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { prov_id, numdoc, fecha } = req.body;

        const getComfach = await Comfach.findById(id);
        if (!getComfach) {
            throw new httpException(
                400,
                "La factura no se encuentra en la BD."
            );
        }

        if (getComfach.prov_id !== prov_id) {
            const isProveedor = await Proveedor.findById(prov_id);
            if (!isProveedor) {
                throw new httpException(
                    400,
                    "El proveedor no se encuentra en la BD."
                );
            }
        }

        const result = await Comfach.findOneAndUpdate(
            { _id: id },
            {
                prov_id,
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
                url: `http://localhost:${process.env.PORT || 9090}/comfach/${
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

const eliminarComfach = async (req = request, res = response) => {
    try {
        const { id } = req.params;

        const getComfach = await Comfach.findById(id);
        if (!getComfach) {
            throw new httpException(400, `No se encontro la factura.`);
        }

        const getComfacl = await Comfacl.find({ comfach: getComfach._id });
        if (getComfacl.length > 0) {
            throw new httpException(
                400,
                `Falta eliminar los productos de la factura.`
            );
        }

        const result = await Comfach.findByIdAndDelete(id);
        if (!result) {
            throw new httpException(400, `No se encontro la factura.`);
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

const validarComfach = async (req = request, res = response) => {
    // la validacion confirma la transaccion.
    try {
        let isOk = true;
        const { id } = req.params;

        const getComfach = await Comfach.findById(id);
        if (!getComfach) {
            throw new httpException(400, `No se encontro la factura.`);
        }

        const getComfacl = await Comfacl.find({ comfach: getComfach._id });
        if (!getComfacl) {
            throw new httpException(400, `No hay productos en la factura.`);
        }

        getComfacl.forEach(async (cfl) => {
            if (cfl.validar === true) {
                return;
            }

            const producto = await Producto.findById(cfl.prod_id);
            if (!producto) {
                await Comfacl.findByIdAndUpdate(cfl._id, {
                    err: `No se encontro el producto`,
                });
                isOk = false;
                return;
            }

            if (producto.stock - cfl.cantidad < 0) {
                await Comfacl.findByIdAndUpdate(cfl._id, {
                    err: `La cantidad supera al stock.`,
                    validar: false,
                });
                isOk = false;
                return;
            }

            // validar si hay algun error head error

            const calcStock = await Producto.findByIdAndUpdate(cfl.prod_id, {
                $inc: { stock: cfl.cantidad },
            });
            if (!calcStock) {
                await Comfacl.findByIdAndUpdate(cfl._id, {
                    err: `No se pudo registrar el stock`,
                });
                isOk = false;
                return;
            }

            await Comfacl.findByIdAndUpdate(cfl._id, {
                err: ``,
                validar: true,
            });
        });

        getComfach.validar = true;
        getComfach.err = ``;
        if (!isOk) {
            getComfach.validar = isOk;
            getComfach.err = `Fallo al validar los productos.`;
        }

        const result = await getComfach.save();
        if (!result) {
            throw new httpException(500, `No se pudo verificar correctamente`);
        }
        const data = {
            message: isOk
                ? "Se valido correctamente"
                : "Error en la validación",
            result,
        };
        res.status(200).json({ data });
    } catch (error) {
        const { status, data } = validarDatos(error);
        res.status(status).json({ data });
    }
};

module.exports = {
    crearComfach,
    obtenerUnComfach,
    obtenerComfachList,
    actualizarComfach,
    eliminarComfach,
    validarComfach,
};
