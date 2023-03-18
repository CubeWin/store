const path = require("path");
const fs = require("fs");
const { Cliente, Proveedor, Producto } = require("../models");
const { request, response } = require("express");
const { httpException, validarDatos } = require("../common");

const uploadImage = async (req = request, res = response) => {
    try {
        const { id, coleccion } = req.params;
        let result;

        switch (coleccion) {
            case "cliente":
                result = await Cliente.findById(id);
                if (!result) {
                    throw new httpException(
                        400,
                        `No existe el cliente con el ${id}`
                    );
                }
                break;

            case "proveedor":
                result = await Proveedor.findById(id);
                if (!result) {
                    throw new httpException(
                        400,
                        `No existe el proveedor con el ${id}`
                    );
                }
                break;

            case "producto":
                result = await Producto.findById(id);
                if (!result) {
                    throw new httpException(
                        400,
                        `No existe el producto con el ${id}`
                    );
                }
                break;
            default:
                throw new httpException(500, `Coleccíon invalida`);
        }

        if (result.imagen) {
            const pathImagen = path.join(
                __dirname,
                "../../public/uploads",
                coleccion,
                result.imagen
            );
            if (fs.existsSync(pathImagen)) {
                fs.unlinkSync(pathImagen);
            }
        }

        const imagen = await uploadImage(req.files, undefined, coleccion);
        result.imagen = imagen;
        const isSave = await result.save();
        if (!isSave) {
            throw new httpException(400, `No se registro la imagen`);
        }

        const data = {
            message: "Se actualizo correctamente.",
            result: {
                imagen: result.image,
                url: `http://localhost:${
                    process.env.PORT || 9090
                }/api/upload/${coleccion}/${id}`,
            },
        };
        res.status(200).json({ data });
    } catch (error) {
        const { status, data } = validarDatos(error);
        res.status(status).json({ data });
    }
};

module.exports = { uploadImage };
