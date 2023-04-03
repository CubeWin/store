const { request, response } = require("express");
const { Producto, Familia, Impuesto } = require("../models");
const { httpException, validarDatos } = require("../common");

const crearProducto = async (req = request, res = response) => {
    try {
        const { fam_id, marca, color, unidad, valor, modelo, precio, imp_id } =
            req.body;

        const esFamilia = Familia.findById(fam_id);
        if (!esFamilia) {
            throw new httpException(400, "La familia no existe en la BD");
        }

        const esImpuesto = Impuesto.findById(imp_id);
        if (!esImpuesto) {
            throw new httpException(400, "El impuesto no existe en la BD");
        }

        const producto = new Producto({
            fam_id,
            imp_id,
            marca,
            color,
            unidad,
            valor,
            modelo,
            precio,
        });

        const result = await producto.save();
        if (!result) {
            throw new httpException(
                500,
                `no se pudo registro el producto en la BD.`
            );
        }

        const data = {
            message: "Se registro correctamente.",
            result,
            request: {
                type: "GET",
                url: `http://localhost:${process.env.PORT || 9090}/producto/${
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

const obtenerUnProducto = async (req = request, res = response) => {
    try {
        const { id } = req.params;

        const result = await Producto.findById(id);
        if (!result) {
            throw new httpException(
                400,
                "El producto no se encuentra en la BD."
            );
        }

        const data = {
            result,
            request: {
                type: "GET",
                url: `http://localhost:${process.env.PORT || 9090}/producto/${
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

const obtenerProductos = async (req = request, res = response) => {
    try {
        const { skip = 0, limit = 5 } = req.query;
        const result = await Producto.find()
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
                        }/producto/${r.id}`,
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

const actualizarProducto = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { fam_id, imp_id, marca, color, unidad, valor, modelo, precio } =
            req.body;

        const esFamilia = Familia.findById(fam_id);
        if (!esFamilia) {
            throw new httpException(400, "La familia no existe en la BD");
        }

        const esImpuesto = Impuesto.findById(imp_id);
        if (!esImpuesto) {
            throw new httpException(400, "El impuesto no existe en la BD");
        }

        const result = await Producto.findOneAndUpdate(
            { _id: id },
            {
                fam_id,
                imp_id,
                marca,
                color,
                unidad,
                valor,
                modelo,
                precio,
            }
        );
        if (!result) {
            throw new httpException(
                400,
                "El producto no se encuentra en la BD."
            );
        }

        const data = {
            message: "Se actualizo correctamente.",
            result,
            request: {
                type: "GET",
                url: `http://localhost:${process.env.PORT || 9090}/producto/${
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

const deshabilitarProducto = async (req = request, res = response) => {
    try {
        const { id } = req.params;

        const result = await Producto.findOneAndUpdate(
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
                "El producto no se encuentra en la BD."
            );
        }

        const data = {
            message: "Se deshabilito el producto correctamente.",
            result,
            request: {
                type: "GET",
                url: `http://localhost:${process.env.PORT || 9090}/producto/${
                    result.id
                }`,
            },
        };
        res.status(200).json(data);
    } catch (error) {
        const { status, data } = validarDatos(error);
        res.status(status).json(data);
    }
}

const eliminarProducto = async (req = request, res = response) => {
    try {
        const { id } = req.params;

        const result = await Producto.findByIdAndDelete({ _id: id });
        if (!result) {
            throw new httpException(400, `No se encontro el producto.`);
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

module.exports = {
    crearProducto,
    obtenerUnProducto,
    obtenerProductos,
    actualizarProducto,
    deshabilitarProducto,
    eliminarProducto,
};
