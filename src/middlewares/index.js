const JWT = require("./validarJWT");
const ROLE = require("./validarRol");
const ARCHIVO = require("./validarArchivo");

module.exports = {
    ...JWT,
    ...ROLE,
    ...ARCHIVO,
};
