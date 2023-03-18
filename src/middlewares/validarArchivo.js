const { request, response } = require("express");

const validarArchivo = (req = request, res = response, next) => {
    if (
        !req.files ||
        Object.keys(req.files).length === 0 ||
        !req.files.Archivo
    ) {
        return res.status(400).json({ message: `No hay archivos que subir.` });
    }
    next();
};

module.exports = { validarArchivo };
