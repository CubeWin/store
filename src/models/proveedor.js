const { Schema, model } = require("mongoose");

const proveedorSchema = Schema(
    {
        id: {
            type: Schema.Types.ObjectId,
            required: [true, "No se genero el id correctamente."],
        },
        ruc: {
            type: Number,
            required: [true, "Ingresar el número de RUC."],
            unique: true,
        },
        nombre: {
            type: String,
            required: [true, "Ingresar el nombre."],
        },
        rubro: {
            type: String,
            required: [true, "Ingresar rubro."],
        },
        correo: {
            type: String,
            required: [true, "Ingresar correo valido."],
            unique: true,
        },
        telefono: {
            type: String,
        },
        imagen: {
            type: String,
            default: `no-image`,
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

module.exports = model("proveedor", proveedorSchema);
