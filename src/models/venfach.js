const { Schema, model } = require("mongoose");

const venfachSchema = Schema(
    {
        clie_id: {
            type: Schema.Types.ObjectId,
            required: [true, "Especificar el cliente."],
            ref: "Cliente",
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

module.exports = model("Venfach", venfachSchema);
