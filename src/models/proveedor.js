const { Schema, model } = require("mongoose");

const proveedorSchema = Schema(
    {
        id: {
            type: Schema.Types.ObjectId,
            require: [true, "No se genero el id correctamente."],
        },
        ruc: {
            type: Number,
            require: [true, "Ingresar el número de RUC."],
            unique: true,
        },
        nombre: {
            type: String,
            require: [true, "Ingresar el nombre."],
        },
        rubro: {
            type: String,
            require: [true, "Ingresar rubro."],
        },
        correo: {
            type: String,
            require: [true, "Ingresar correo valido."],
            unique: true,
        },
        telefono: {
            type: String,
        },
        logo: {
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
