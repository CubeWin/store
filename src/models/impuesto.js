const { Schema, model } = require("mongoose");

const impuestoSchema = Schema(
    {
        categoria: {
            type: String,
            required: [true, "Especificar categoría."],
        },
        porcentaje: {
            type: String,
            required: [true, "Especificar procentaje."],
        },
        multiplicador: {
            type: Number,
            required: [true, "Especificar multiplicador."],
        },
        descripcion: {
            type: String,
            required: [true, "Especificar descripción."],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = model("Impuesto", impuestoSchema);
