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
    },
    {
        timestamps: true,
    }
);

module.exports = model("Familia", familiaSchema);
