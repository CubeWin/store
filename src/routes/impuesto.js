const { Router } = require("express");
const {
    obtenerImpuestos,
    obtenerUnImpuesto,
    crearImpuesto,
    actualizarImpuesto,
    eliminarImpuesto,
} = require("../controllers/impuesto");
const {
    validarToken,
    validarRoles,
} = require("../middlewares");

const impuestoRouter = Router();

impuestoRouter.get(
    "/",
    [validarToken, validarRoles("ADMIN_ROLE", "USER_ROLE")],
    obtenerImpuestos
);

impuestoRouter.get(
    "/:id",
    [validarToken, validarRoles("ADMIN_ROLE", "USER_ROLE")],
    obtenerUnImpuesto
);

impuestoRouter.post(
    "/",
    [validarToken, validarRoles("ADMIN_ROLE", "USER_ROLE")],
    crearImpuesto
);

impuestoRouter.put(
    "/:id",
    [validarToken, validarRoles("ADMIN_ROLE", "USER_ROLE")],
    actualizarImpuesto
);

impuestoRouter.delete(
    "/:id",
    [validarToken, validarRoles("ADMIN_ROLE", "USER_ROLE")],
    eliminarImpuesto
);

module.exports = impuestoRouter;
