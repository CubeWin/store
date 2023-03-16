const { Schema, model } = require("mongoose");

const impuestoSchema = Schema(
    {
        categoria: {
            type: String,
            required: [true, "Especificar categoría."],
        },
        procentaje: {
            type: String,
            required: [true, "Especificar procentaje."],
        },
        multiplicador: {
            type: String,
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
