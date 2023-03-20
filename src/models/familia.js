const { Schema, model } = require("mongoose");

const familiaSchema = Schema(
    {
        codigo: {
            type: String,
            required: [true, "Especificar código."],
            unique: true,
        },
        categoria: {
            type: String,
            required: [true, "Especificar categoría."],
        },
        descripcion: {
            type: String,
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

module.exports = model("Familia", familiaSchema);
