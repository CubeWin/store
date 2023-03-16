const { Schema, model } = require("mongoose");

const clienteSchema = Schema(
    {
        id: {
            type: Schema.Types.ObjectId,
            require: [true, "No se genero el id correctamente."],
        },
        dni: {
            type: Number,
            require: [true, "Ingresar el número de DNI."],
            unique: true,
        },
        nombre: {
            type: String,
            require: [true, "Ingresar el nombre."],
        },
        apaterno: {
            type: String,
            require: [true, "Ingresar apellido paterno."],
        },
        amaterno: {
            type: String,
            require: [true, "Ingresar apellido materno."],
        },
        correo: {
            type: String,
            require: [true, "Ingresar correo valido."],
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

module.exports = model("Cliente", clienteSchema);
