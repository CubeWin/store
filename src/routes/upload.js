const { Router } = require("express");
const { uploadImage, showImage } = require("../controllers/upload");
const { validarArchivo, validarToken, validarRoles } = require("../middlewares");

const uploadRoute = Router();

uploadRoute.put(
    "/:coleccion/:id",
    [validarToken, validarRoles("ADMIN_ROLE", "USER_ROLE"), validarArchivo],
    uploadImage
);

uploadRoute.get("/:coleccion/:id", [validarToken], showImage);

module.exports = uploadRoute;
