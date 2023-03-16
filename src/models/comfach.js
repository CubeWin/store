const { Schema, model } = require("mongoose");

const comfachSchema = Schema(
    {
        prov_id: {
            type: Schema.Types.ObjectId,
            required: [true, "Especificar el proveedor."],
            ref: "Proveedor",
        },
        numdoc: {
            type: String,
            required: [true, "Ingresar número de factura."],
        },
        fecha: {
            type: Date,
            default: Date.now,
            required: [true, "Ingresar fecha de facturación."],
        },
        estado: {
            type: Boolean,
            default: true,
            required: [true, "El estado es obligatorio"],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = model("Comfach", comfachSchema);
