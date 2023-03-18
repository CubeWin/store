const { Router } = require("express");
const { uploadImage } = require("../controllers/upload");

const uploadRoute = Router();

uploadRoute.put("/:coleccion/:id", uploadImage);

module.exports = uploadRoute;
