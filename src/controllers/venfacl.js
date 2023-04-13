const { request, response } = require("express");
const { Venfach, Venfacl, Producto } = require("../models");
const { httpException, validarDatos } = require("../common");

const crearVenfacl = async (req = request, res = response) => {
    try {
        const {
            venfach,
            prod_id,
            cantidad,
            precioUnitario,
            subtotal,
            impuesto,
            total,
        } = req.body;
        console.log('controller line',venfach);
        const esVenfach = Venfach.findById(venfach);
        if (!esVenfach) {
            throw new httpException(
                400,
                "La factura no se encuentra en la BD."
            );
        }

        // verificar si el producto existe y tiene stock
        const esProducto = Producto.findById(prod_id);
        if (!esProducto) {
            throw new httpException(
                400,
                "El producto no se encuentra en la BD."
            );
        }

        const venfacl = new Venfacl({
            venfach,
            prod_id,
            cantidad,
            precioUnitario,
            subtotal,
            impuesto,
            total,
        });

        const result = await venfacl.save();
        if (!result) {
            throw new httpException(
                500,
                `No se pudo registro el producto a la factura en la BD.`
            );
        }

        const data = {
            message: "Se registro correctamente.",
            result,
            request: {
                type: "GET",
                url: `http://localhost:${process.env.PORT || 9090}/venfacl/${
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

const ListarVenfacl = async (req = request, res = response) => {
    try {
        const { id } = req.body;

        const result = await Venfacl.find({ venfach: id });
        if (!result) {
            throw new httpException(400, `No se encontro la factura en la BD.`);
        }

        const data = {
            result,
            request: {
                type: "GET",
                url: `http://localhost:${process.env.PORT || 9090}/venfach/${
                    result.venfach
                }`,
            },
        };
        res.status(200).json(data);
    } catch (error) {
        const { status, data } = validarDatos(error);
        res.status(status).json({ data });
    }
};

const actualizarVenfacl = async (req = request, res = response) => {
    try {
        // busco linea
        const { id } = req.params;
        const { prod_id, cantidad, precioUnitario, subtotal, impuesto, total } =
            req.body;

        const comfacl = await Venfacl.findById(id);
        if (!comfacl) {
            throw new httpException(
                400,
                `El registro no se encontro en la BD.`
            );
        }
        if (comfacl.validar) {
            throw new httpException(
                400,
                `No se puede actualizar porque ya esta validado.`
            );
        }

        if (comfacl.prod_id !== prod_id) {
            const producto = await Producto.findById(prod_id);
            if (!producto) {
                throw new httpException(
                    400,
                    `El producto no se encontro en la BD.`
                );
            }
        }

        const result = await Venfacl.findByIdAndUpdate(id, {
            $set: {
                prod_id,
                cantidad,
                precioUnitario,
                subtotal,
                impuesto,
                total,
            },
        });
        if (!result) {
            throw new httpException(400, "No se pudo actualizar el registro.");
        }

        const data = {
            result,
            request: {
                type: "GET",
                url: `http://localhost:${process.env.PORT || 9090}/venfach/${
                    result.venfach
                }`,
            },
        };
        res.status(200).json(data);
    } catch (error) {
        const { status, data } = validarDatos(error);
        res.status(status).json({ data });
    }
};

const eliminarVenfacl = async (req = request, res = response) => {
    try {
        const { id } = req.params;

        const comfacl = await Venfacl.findById(id);
        if (!comfacl) {
            throw new httpException(
                400,
                `El registro no se encontro en la BD.`
            );
        }
        if (comfacl.validar) {
            throw new httpException(
                400,
                `No se puede actualizar porque ya esta validado.`
            );
        }

        const result = await Venfacl.findByIdAndDelete(id);
        if (!result) {
            throw new httpException(400, `Registro no encontrado en la BD.`);
        }
        // stock
        const data = {
            message: "Se elimino correctamente.",
            result,
        };
        res.status(200).json(data);
    } catch (error) {
        const { status, data } = validarDatos(error);
        res.status(status).json({ data });
    }
};

module.exports = {
    crearVenfacl,
    ListarVenfacl,
    actualizarVenfacl,
    eliminarVenfacl,
};
