const path = require("path");
const { v4: uuidv4 } = require("uuid");

const uploadFile = (
    files,
    extensions = ["png", "jpg", "jpeg"],
    folder = ""
) => {
    return new Promise((resolve, reject) => {
        const { Archivo } = files;

        const arrNombreArchivo = Archivo.name.split(".");
        const extensionArchivo = arrNombreArchivo[arrNombreArchivo.length - 1];
        if (!extensions.includes(extensionArchivo)) {
            return reject(
                `La extensión ${extensionArchivo} no es una valida de la lista ${extensions.join(
                    ", "
                )}`
            );
        }

        const nombreTemporal = uuidv4() + "." + extensionArchivo;

        const dirPath = path.join(
            __dirname,
            "../../public/uploads/",
            folder,
            nombreTemporal
        );

        Archivo.mv(dirPath, (err) => {
            if (err) {
                reject(err);
            }
            resolve(nombreTemporal);
        });
    });
};

module.exports = { uploadFile };
