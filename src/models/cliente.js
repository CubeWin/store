const { Schema, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const clienteSchema = Schema(
    {
        dni: {
            type: Number,
            required: [true, "Ingresar el número de DNI."],
            unique: true,
        },
        nombre: {
            type: String,
            required: [true, "Ingresar el nombre."],
        },
        apaterno: {
            type: String,
            required: [true, "Ingresar apellido paterno."],
        },
        amaterno: {
            type: String,
            required: [true, "Ingresar apellido materno."],
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

clienteSchema.plugin(uniqueValidator, {
    message: "Error, el '{PATH}' con valor '{VALUE}' se encuentra en uso.",
});

module.exports = model("Cliente", clienteSchema);
