const { Schema, model } = require("mongoose");

const comfaclSchema = Schema(
    {
        venfacb: {
            type: Schema.Types.ObjectId,
            required: [true, "Especificar la factura."],
            ref: "Venfach",
        },
        prod_id: {
            type: Schema.Types.ObjectId,
            required: [true, "Especificar el producto."],
            ref: "Producto",
        },
        cantidad: {
            type: Number,
            required: [true, "Especificar la cantidad."],
        },
        precioUnitario: {
            type: Number,
            required: [true, "Especificar el precio."],
        },
        subtotal: {
            type: Number,
            required: [true, "Especificar Subtotal."],
        },
        impuesto: {
            type: Number,
            required: [true, "Especificar impuesto."],
        },
        total: {
            type: Number,
            required: [true, "Especificar el total."],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = model("Comfacl", comfaclSchema);