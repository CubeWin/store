const { Schema, model } = require("mongoose");

const productoSchema = Schema(
    {
        fam_id: {
            type: Schema.Types.ObjectId,
            required: [true, "Especificar grupo de familia."],
        },
        marca: {
            type: String,
            required: [true, "Especificar marca del producto."],
        },
        color: String,
        unidad: {
            type: String,
            required: [
                true,
                "Especifar unidad de medida (kg, m2, pulgadas, etc)",
            ],
        },
        valor: {
            type: Number,
            required: [true, "Especificar el valor númerico de la unidad."],
        },
        modelo: {
            type: String,
            required: [true, "Especifar Modelo."],
        },
        precio: {
            type: Number,
            required: [true, "Especifar precio."],
        },
        imp_id: {
            type: Schema.Types.ObjectId,
            required: [true, "Especificar el tipo de impuesto."],
            ref: "Impuesto",
        },
        stock: {
            type: Number,
            required: [true, "stock."],
        },
        imagen: {
            type: String,
            required: [true, "Especificar imágen."],
            default: `no-image`,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = model("Producto", productoSchema);
