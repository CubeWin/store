const { response, request } = require("express");

const validarRolAdmin = (req = request, res = response, next) => {
    try {
        const usuario = req.usuario;
        if (!usuario) {
            res.status(401).json({
                message: "Usuario no encontrado",
            });
        }

        const { role, username } = usuario;
        if (role !== "ADMIN_ROLE") {
            return res.status(401).json({
                message: `El usuario ${username} no es administrador`,
            });
        }

        next();
    } catch (error) {
        res.status(501).json({
            message: error,
        });
    }
};

const validarRoles = (...roles) => {
    return (req = request, res = response, next) => {
        try {
            const usuario = req.usuario;
            if (!usuario) {
                res.status(401).json({ message: "Falta validar Token." });
            }

            const { role } = usuario;
            if (!roles.includes(role)) {
                res.status(401).json({
                    message: `Se requiere uno de estos roles [${roles.join(
                        ", "
                    )}] \ ${role}`,
                });
            }

            next();
        } catch (error) {
            res.status(501).json({
                message: error,
            });
        }
    };
};

module.exports = { validarRolAdmin, validarRoles };
