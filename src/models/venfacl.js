const { Schema, model } = require("mongoose");

const venfaclSchema = Schema(
    {
        venfach: {
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
        err: {
            type: String,
        },
        validar: {
            type: Boolean,
            default: false,
            required: [true, "El estado es obligatorio"],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = model("Venfacl", venfaclSchema);
