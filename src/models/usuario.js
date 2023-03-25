const { Schema, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const usuarioSchema = Schema(
    {
        username: {
            type: String,
            required: [true, "Ingresar nombre de usuario."],
            unique: true,
        },
        password: {
            type: String,
            required: [true, "Ingresar clave."],
        },
        email: {
            type: String,
            required: [true, "Ingresar Correo."],
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Ingresar correo valido.",
            ],
            unique: true,
        },
        description: {
            type: String,
        },
        role: {
            type: String,
            required: true,
            enum: ["ADMIN_ROLE", "USER_ROLE", "CLIENT_ROLE"],
            default: "USER_ROLE",
        },
        state: {
            type: Boolean,
            default: true,
            required: [true, "Ingresar el estado."],
        },
    },
    {
        timestamps: true,
    }
);

usuarioSchema.plugin(uniqueValidator, {
    message: "Error, el '{PATH}' con valor '{VALUE}' se encuentra registrado.",
});

usuarioSchema.methods.toJSON = function () {
    const { __v, password, _id, ...usuario } = this.toObject();
    usuario.id = _id;
    return usuario;
};

module.exports = model("usuario", usuarioSchema);
